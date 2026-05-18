// Math must be exact: too aggressive bursts past the 100/min API cap, too
// conservative serializes the runner into uselessness.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Semaphore,
  SlidingWindowRateLimiter,
  getMetricThrottle,
  retryOnRateLimit,
  isRateLimited,
  isDailyQuotaExceeded,
  setDailyQuotaBlocked,
  getDailyQuotaBlock,
  utcMidnightAfter,
  resolveConcurrency,
  resolveRateLimit,
  _resetMetricSemaphoreForTests,
} from '../../../skills/vercel-optimize/lib/throttle.mjs';

test('Semaphore: caps in-flight count at max', async () => {
  const sem = new Semaphore(3);
  let peak = 0;
  let inFlight = 0;
  const tasks = Array.from({ length: 10 }, () => sem.run(async () => {
    inFlight++;
    peak = Math.max(peak, inFlight);
    await new Promise((r) => setTimeout(r, 5));
    inFlight--;
  }));
  await Promise.all(tasks);
  assert.equal(peak, 3, `expected peak of 3 in-flight, got ${peak}`);
});

test('Semaphore: releases slot even when task throws', async () => {
  const sem = new Semaphore(1);
  await assert.rejects(sem.run(async () => { throw new Error('boom'); }), /boom/);
  // Hangs if release was missed.
  let acquired = false;
  await Promise.race([
    sem.run(async () => { acquired = true; }),
    new Promise((_, rej) => setTimeout(() => rej(new Error('hung')), 100)),
  ]);
  assert.equal(acquired, true);
});

test('Semaphore: FIFO order for queued waiters', async () => {
  const sem = new Semaphore(1);
  const order = [];
  const start = (id, ms) => sem.run(async () => {
    order.push(id);
    await new Promise((r) => setTimeout(r, ms));
  });
  const a = start('a', 20);
  const b = start('b', 5);
  const c = start('c', 5);
  await Promise.all([a, b, c]);
  assert.deepEqual(order, ['a', 'b', 'c'], 'should resolve waiters in arrival order');
});

test('Semaphore: rejects bad max', () => {
  assert.throws(() => new Semaphore(0), /positive integer/);
  assert.throws(() => new Semaphore(-1), /positive integer/);
  assert.throws(() => new Semaphore(1.5), /positive integer/);
});

test('SlidingWindowRateLimiter: allows up to maxCalls in window', async () => {
  let now = 0;
  const limiter = new SlidingWindowRateLimiter(3, 1000, {
    now: () => now,
    sleep: async (ms) => { now += ms; },
  });
  for (let i = 0; i < 3; i++) await limiter.acquire();
  assert.equal(limiter.timestamps.length, 3);
});

test('SlidingWindowRateLimiter: blocks the Nth+1 call until oldest expires', async () => {
  let now = 0;
  let totalSleep = 0;
  const limiter = new SlidingWindowRateLimiter(2, 1000, {
    now: () => now,
    sleep: async (ms) => { totalSleep += ms; now += ms; },
  });
  await limiter.acquire();
  now = 200;
  await limiter.acquire();
  // Third call sleeps until t~1100 (oldest at t=0 expires at t=1000 + 100 buffer).
  now = 300;
  await limiter.acquire();
  assert.ok(totalSleep >= 700, `expected sleep >= 700ms, got ${totalSleep}`);
  assert.equal(limiter.timestamps.length, 2, 'oldest pruned; current window holds 2 entries');
});

test('SlidingWindowRateLimiter: prune drops expired timestamps', async () => {
  let now = 1000;
  const limiter = new SlidingWindowRateLimiter(10, 1000, {
    now: () => now,
    sleep: async (ms) => { now += ms; },
  });
  limiter.timestamps = [0, 100, 500, 800];
  now = 2000;
  limiter.prune();
  // All entries < cutoff (2000 - 1000) so all pruned.
  assert.equal(limiter.timestamps.length, 0);
});

test('isRateLimited: detects canonical RATE_LIMITED code', () => {
  assert.equal(isRateLimited({ ok: false, code: 'RATE_LIMITED' }), true);
  assert.equal(isRateLimited({ ok: false, code: 'rate_limited' }), true);
  assert.equal(isRateLimited({ ok: false, code: '429' }), true);
});

test('isRateLimited: detects via stderr substring fallback', () => {
  assert.equal(isRateLimited({ ok: false, code: 'EXIT_1', stderr: 'rate limit exceeded' }), true);
  assert.equal(isRateLimited({ ok: false, code: 'EXIT_1', stderr: 'too many requests' }), true);
});

test('isRateLimited: rejects ok results and other errors', () => {
  assert.equal(isRateLimited({ ok: true, data: {} }), false);
  assert.equal(isRateLimited({ ok: false, code: 'PAYMENT_REQUIRED' }), false);
  assert.equal(isRateLimited({ ok: false, code: 'FORBIDDEN' }), false);
});

test('isDailyQuotaExceeded: detects only the daily Observability query limit', () => {
  assert.equal(isDailyQuotaExceeded({
    ok: false,
    code: 'payment_required',
    message: 'You have reached the daily Observability query limit for this team.',
  }), true);
  assert.equal(isDailyQuotaExceeded({
    ok: false,
    code: 'payment_required',
    message: 'Payment required for Observability Plus.',
  }), false);
  assert.equal(isDailyQuotaExceeded({
    ok: false,
    code: 'FORBIDDEN',
    stderr: 'Permission denied by firewall policy.',
  }), false);
});

test('daily quota cache expires at the next UTC midnight', () => {
  _resetMetricSemaphoreForTests();
  const now = Date.parse('2026-05-13T20:30:00Z');
  const block = setDailyQuotaBlocked({
    ok: false,
    code: 'payment_required',
    message: 'daily Observability query limit reached',
  }, now);
  assert.equal(block.untilMs, Date.parse('2026-05-14T00:00:00Z'));
  assert.equal(utcMidnightAfter(now), Date.parse('2026-05-14T00:00:00Z'));
  assert.ok(getDailyQuotaBlock(Date.parse('2026-05-13T23:59:59Z')));
  assert.equal(getDailyQuotaBlock(Date.parse('2026-05-14T00:00:00Z')), null);
});

test('MetricThrottle: queued waiters abort after daily quota is discovered', async () => {
  const origConcurrency = process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY;
  const origRate = process.env.VERCEL_OPTIMIZE_METRIC_RATE;
  process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY = '1';
  process.env.VERCEL_OPTIMIZE_METRIC_RATE = '1000/1s';
  _resetMetricSemaphoreForTests();
  try {
    const throttle = getMetricThrottle();
    let releaseFirst;
    let first;
    const firstStarted = new Promise((resolve) => {
      first = throttle.run(async () => {
        resolve();
        await new Promise((r) => { releaseFirst = r; });
        return {
          ok: false,
          code: 'payment_required',
          message: 'daily Observability query limit reached',
        };
      });
    });
    await firstStarted;

    let secondCalled = false;
    const second = throttle.run(async () => {
      secondCalled = true;
      return { ok: true, data: [] };
    });
    releaseFirst();
    const [firstResult, secondResult] = await Promise.all([
      first,
      second,
    ]);

    assert.equal(firstResult.code, 'DAILY_QUOTA_EXCEEDED');
    assert.equal(firstResult.originalCode, 'payment_required');
    assert.equal(secondResult.code, 'DAILY_QUOTA_EXCEEDED');
    assert.equal(secondCalled, false, 'queued metric should not call vercel after quota is cached');
    assert.ok(secondResult.cachedUntil);
  } finally {
    if (origConcurrency === undefined) delete process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY;
    else process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY = origConcurrency;
    if (origRate === undefined) delete process.env.VERCEL_OPTIMIZE_METRIC_RATE;
    else process.env.VERCEL_OPTIMIZE_METRIC_RATE = origRate;
    _resetMetricSemaphoreForTests();
  }
});

test('retryOnRateLimit: retries on RATE_LIMITED and succeeds on second attempt', async () => {
  let attempt = 0;
  const slept = [];
  const fn = async () => {
    attempt++;
    if (attempt === 1) return { ok: false, code: 'RATE_LIMITED' };
    return { ok: true, value: 42 };
  };
  const result = await retryOnRateLimit(fn, {
    maxRetries: 3,
    baseBackoffMs: 100,
    jitterMs: 0,
    sleep: async (ms) => { slept.push(ms); },
  });
  assert.equal(result.ok, true);
  assert.equal(result.value, 42);
  assert.equal(attempt, 2);
  assert.deepEqual(slept, [100]);
});

test('retryOnRateLimit: stops after maxRetries even if still rate-limited', async () => {
  let attempt = 0;
  const fn = async () => { attempt++; return { ok: false, code: 'RATE_LIMITED' }; };
  const result = await retryOnRateLimit(fn, {
    maxRetries: 2,
    baseBackoffMs: 10,
    jitterMs: 0,
    sleep: async () => {},
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'RATE_LIMITED');
  assert.equal(attempt, 3, 'first attempt + 2 retries = 3');
});

test('retryOnRateLimit: does NOT retry on payment_required (terminal)', async () => {
  let attempt = 0;
  const fn = async () => { attempt++; return { ok: false, code: 'PAYMENT_REQUIRED' }; };
  const result = await retryOnRateLimit(fn, { maxRetries: 3, baseBackoffMs: 10, jitterMs: 0, sleep: async () => {} });
  assert.equal(attempt, 1);
  assert.equal(result.code, 'PAYMENT_REQUIRED');
});

test('retryOnRateLimit: exponential backoff factor grows with attempts', async () => {
  let attempt = 0;
  const slept = [];
  const fn = async () => {
    attempt++;
    if (attempt < 4) return { ok: false, code: 'RATE_LIMITED' };
    return { ok: true };
  };
  await retryOnRateLimit(fn, {
    maxRetries: 3,
    baseBackoffMs: 100,
    jitterMs: 0,
    sleep: async (ms) => { slept.push(ms); },
  });
  // factors: 1.0, 1.5, 2.0.
  assert.deepEqual(slept, [100, 150, 200]);
});

test('resolveConcurrency: env override + default', () => {
  const orig = process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY;
  delete process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY;
  assert.equal(resolveConcurrency(), 8);
  process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY = '4';
  assert.equal(resolveConcurrency(), 4);
  process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY = 'bogus';
  assert.equal(resolveConcurrency(), 8, 'bogus values fall back to default');
  if (orig === undefined) delete process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY;
  else process.env.VERCEL_OPTIMIZE_METRIC_CONCURRENCY = orig;
});

test('resolveRateLimit: parses N and N/Ws formats', () => {
  const orig = process.env.VERCEL_OPTIMIZE_METRIC_RATE;
  delete process.env.VERCEL_OPTIMIZE_METRIC_RATE;
  assert.deepEqual(resolveRateLimit(), { maxCalls: 80, windowMs: 60_000 });
  process.env.VERCEL_OPTIMIZE_METRIC_RATE = '50';
  assert.deepEqual(resolveRateLimit(), { maxCalls: 50, windowMs: 60_000 });
  process.env.VERCEL_OPTIMIZE_METRIC_RATE = '20/30s';
  assert.deepEqual(resolveRateLimit(), { maxCalls: 20, windowMs: 30_000 });
  process.env.VERCEL_OPTIMIZE_METRIC_RATE = '10/5m';
  assert.deepEqual(resolveRateLimit(), { maxCalls: 10, windowMs: 300_000 });
  process.env.VERCEL_OPTIMIZE_METRIC_RATE = 'bogus';
  assert.deepEqual(resolveRateLimit(), { maxCalls: 80, windowMs: 60_000 });
  if (orig === undefined) delete process.env.VERCEL_OPTIMIZE_METRIC_RATE;
  else process.env.VERCEL_OPTIMIZE_METRIC_RATE = orig;
});
