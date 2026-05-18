// cold_start gate was dormant until CLI v53.4.0 exposed function_start_type on
// vercel.function_invocation.count.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/cold-start.mjs';

test('cold-start: metadata is consistent and avoids private source details', () => {
  assert.equal(metadata.id, 'cold_start');
  assert.match(metadata.threshold, /coldPct/);
  assert.equal(metadata.billingDimension, 'function-duration');
  assert.equal(metadata.sourceCitation, 'vercel-optimize gate threshold');
});

test('cold-start: emits when coldPct > 0.4 and total >= 1000 (14d-rescaled threshold)', () => {
  const signals = {
    metrics: {
      fnStartTypeByRoute: {
        rows: [
          { route: '/api/expensive', total: 1500, coldCount: 750, warmCount: 750, prewarmedCount: 0, coldPct: 0.50 },
          { route: '/api/dashboard', total: 20000, coldCount: 9000, warmCount: 10000, prewarmedCount: 1000, coldPct: 0.45 },
          { route: '/api/medium', total: 20000, coldCount: 7000, warmCount: 12500, prewarmedCount: 500, coldPct: 0.35 },
          { route: '/api/hot', total: 50000, coldCount: 500, warmCount: 49000, prewarmedCount: 500, coldPct: 0.01 },
          // 60% cold but below traffic floor (1000).
          { route: '/api/quiet', total: 500, coldCount: 300, warmCount: 200, prewarmedCount: 0, coldPct: 0.60 },
        ],
      },
    },
  };
  const out = gate(signals);
  const routes = out.map((c) => c.route).sort();
  assert.deepEqual(routes, ['/api/dashboard', '/api/expensive']);
  for (const c of out) {
    assert.equal(c.kind, 'cold_start');
    assert.equal(c.scope, 'route');
    assert.match(c.o11ySignal, /^cold=\d+%,inv=\d+$/);
    assert.equal(c.evidence.metric, 'fnStartTypeByRoute');
  }
});

test('cold-start: no fnStartTypeByRoute → no candidates (graceful when CWV-only fixture)', () => {
  const signals = { metrics: {} };
  assert.deepEqual(gate(signals), []);
});

test('cold-start: backward-compat with pre-derived coldStartByRoute fixture shape', () => {
  const signals = {
    metrics: {
      coldStartByRoute: {
        rows: [
          { route: '/api/x', total: 1500, coldPct: 0.50 },  // both pass
          { route: '/api/y', total: 800, coldPct: 0.90 },   // below traffic floor 1000
        ],
      },
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].route, '/api/x');
});

test('cold-start: boundary — coldPct exactly 0.40 OR total < 1000 do NOT fire (strict)', () => {
  const signals = {
    metrics: {
      fnStartTypeByRoute: {
        rows: [
          { route: '/api/edge1', total: 999, coldCount: 500, coldPct: 0.50 },
          { route: '/api/edge2', total: 5000, coldCount: 2000, coldPct: 0.40 },
          { route: '/api/edge3', total: 1000, coldCount: 405, coldPct: 0.405 },
        ],
      },
    },
  };
  const out = gate(signals);
  const routes = out.map((c) => c.route);
  assert.deepEqual(routes, ['/api/edge3']);
});

test('cold-start: fixture-app ground truth — dashboard route does NOT fire (coldPct < 0.3)', () => {
  // Regression anchor: sanitized fixture-app numbers from CLI v53.4.0 on 2026-05-12
  // (/dashboard: hot=4893, cold=19, prewarmed=11 → coldPct ~0.004). Must not FP.
  const signals = {
    metrics: {
      fnStartTypeByRoute: {
        rows: [
          { route: '/dashboard/[sessionId]', total: 4923, coldCount: 19, warmCount: 4893, prewarmedCount: 11, coldPct: 19 / 4923 },
          { route: '/admin', total: 22, coldCount: 12, warmCount: 4, prewarmedCount: 6, coldPct: 12 / 22 },
        ],
      },
    },
  };
  const out = gate(signals);
  assert.deepEqual(out.map((c) => c.route), []);
});
