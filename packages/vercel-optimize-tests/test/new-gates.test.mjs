// oversized_memory removed May 2026 — Fluid Compute only offers Standard 2GB /
// Performance 4GB tiers, so per-route memory right-sizing is not actionable.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { gate as isrGate, metadata as isrMeta } from '../../../skills/vercel-optimize/lib/gates/isr-overrevalidation.mjs';
import { gate as middlewareGate, metadata as middlewareMeta } from '../../../skills/vercel-optimize/lib/gates/middleware-heavy.mjs';
import { gate as cwvGate, metadata as cwvMeta } from '../../../skills/vercel-optimize/lib/gates/cwv-poor.mjs';
import { gate as botGate } from '../../../skills/vercel-optimize/lib/gates/platform-bot-protection.mjs';

test('isr_overrevalidation: metadata sane', () => {
  assert.equal(isrMeta.id, 'isr_overrevalidation');
  assert.equal(isrMeta.scope, 'route');
});

test('isr_overrevalidation: fires when writes/reads > 0.5 with > 100 writes', () => {
  const signals = {
    metrics: {
      isrWritesByRoute: { rows: [{ route: '/blog/[slug]', value: 600 }] },
      isrReadsByRoute: { rows: [{ route: '/blog/[slug]', value: 1000 }] },
    },
  };
  const out = isrGate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'isr_overrevalidation');
  assert.equal(out[0].evidence.writes, 600);
  assert.equal(out[0].evidence.reads, 1000);
  assert.ok(out[0].evidence.ratio > 0.5);
});

test('isr_overrevalidation: does NOT fire when ratio is below high-signal threshold (writes/reads <= 0.5)', () => {
  const signals = {
    metrics: {
      isrWritesByRoute: { rows: [{ route: '/x', value: 500 }] },
      isrReadsByRoute: { rows: [{ route: '/x', value: 1000 }] },
    },
  };
  assert.deepEqual(isrGate(signals), []);
});

test('isr_overrevalidation: does NOT fire below writes floor (<=100)', () => {
  const signals = {
    metrics: {
      isrWritesByRoute: { rows: [{ route: '/x', value: 100 }] },
      isrReadsByRoute: { rows: [{ route: '/x', value: 200 }] },
    },
  };
  assert.deepEqual(isrGate(signals), []);
});

test('isr_overrevalidation: no rows at all (free-tier / no ISR) → no candidates', () => {
  assert.deepEqual(isrGate({ metrics: {} }), []);
});

test('middleware_heavy: metadata sane', () => {
  assert.equal(middlewareMeta.id, 'middleware_heavy');
  assert.equal(middlewareMeta.scope, 'account');
});

test('middleware_heavy: fires when middleware count > 50% of total requests and > 1000', () => {
  const signals = {
    metrics: {
      middlewareCount: {
        rows: [
          { request_path: '/', value: 8000 },
          { request_path: '/products/[id]', value: 4000 },
        ],
      },
      requestsByRouteCache: {
        rows: [
          { route: '/', cache_result: 'MISS', value: 12000 },
          { route: '/products/[id]', cache_result: 'MISS', value: 8000 },
        ],
      },
    },
  };
  const out = middlewareGate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'middleware_heavy');
  assert.equal(out[0].scope, 'account');
  assert.equal(out[0].evidence.middlewareInv, 12000);
  assert.equal(out[0].evidence.totalInv, 20000);
  assert.ok(out[0].evidence.ratio > 0.5);
  assert.ok(Array.isArray(out[0].evidence.topPaths));
});

test('middleware_heavy: does NOT fire when middleware traffic is below 50%', () => {
  const signals = {
    metrics: {
      middlewareCount: { rows: [{ request_path: '/auth', value: 2000 }] },
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 50000 }] },
    },
  };
  assert.deepEqual(middlewareGate(signals), []);
});

test('middleware_heavy: fixture-app ground truth — no middleware → no candidate', () => {
  // Fixture App has no middleware.ts.
  const signals = {
    metrics: {
      middlewareCount: { rows: [] },
      requestsByRouteCache: { rows: [{ route: '/dashboard/[sessionId]', cache_result: 'MISS', value: 4923 }] },
    },
  };
  assert.deepEqual(middlewareGate(signals), []);
});

test('middleware_heavy: boundary — exactly 50% ratio does NOT fire', () => {
  const signals = {
    metrics: {
      middlewareCount: { rows: [{ request_path: '/x', value: 5000 }] },
      requestsByRouteCache: { rows: [{ route: '/x', cache_result: 'MISS', value: 10000 }] },
    },
  };
  assert.deepEqual(middlewareGate(signals), []);
});

test('cwv_poor: metadata sane', () => {
  assert.equal(cwvMeta.id, 'cwv_poor');
  assert.equal(cwvMeta.scope, 'route');
});

test('cwv_poor: emits one candidate per route in poor band', () => {
  const signals = {
    metrics: {
      cwvCount: { rows: [{ value: 5000 }] },
      cwvCountByRoute: { rows: [
        { route: '/dashboard', value: 500 },
        { route: '/landing', value: 120 },
      ] },
      cwvLcpByRoute: {
        rows: [
          { route: '/dashboard', value: 3200 },
          { route: '/landing', value: 1800 },
        ],
      },
      cwvInpByRoute: {
        rows: [
          { route: '/dashboard', value: 250 },
        ],
      },
      cwvClsByRoute: {
        rows: [
          { route: '/landing', value: 0.18 },
        ],
      },
    },
  };
  const out = cwvGate(signals);
  const byRoute = Object.fromEntries(out.map((c) => [c.route, c]));
  assert.ok(byRoute['/dashboard'], 'dashboard fires');
  assert.ok(byRoute['/landing'], 'landing fires (CLS)');
  // dashboard has LCP+INP, landing only CLS.
  assert.equal(byRoute['/dashboard'].evidence.issues.length, 2);
  assert.equal(byRoute['/landing'].evidence.issues.length, 1);
  assert.equal(byRoute['/dashboard'].evidence.routeSpeedInsightsSamples, 500);
});

test('cwv_poor: does NOT fire when all routes in good band', () => {
  const signals = {
    metrics: {
      cwvCount: { rows: [{ value: 5000 }] },
      cwvCountByRoute: { rows: [{ route: '/x', value: 500 }] },
      cwvLcpByRoute: { rows: [{ route: '/x', value: 1200 }] },
      cwvInpByRoute: { rows: [{ route: '/x', value: 80 }] },
      cwvClsByRoute: { rows: [{ route: '/x', value: 0.04 }] },
    },
  };
  assert.deepEqual(cwvGate(signals), []);
});

test('cwv_poor: fixture-app ground truth — Speed Insights inactive → no candidates', () => {
  const signals = { metrics: { cwvCount: { rows: [] }, cwvLcpByRoute: { rows: [] } } };
  assert.deepEqual(cwvGate(signals), []);
});

test('cwv_poor: boundary — LCP exactly 2500 does NOT fire (strict >)', () => {
  const signals = {
    metrics: {
      cwvCount: { rows: [{ value: 5000 }] },
      cwvCountByRoute: { rows: [{ route: '/x', value: 500 }] },
      cwvLcpByRoute: { rows: [{ route: '/x', value: 2500 }] },
    },
  };
  assert.deepEqual(cwvGate(signals), []);
});

test('cwv_poor: refuses emission when per-route sample count is below 50', () => {
  const signals = {
    metrics: {
      cwvCount: { rows: [{ value: 5000 }] },
      cwvCountByRoute: { rows: [
        { route: '/thin', value: 49 },
        { route: '/ready', value: 50 },
      ] },
      cwvLcpByRoute: { rows: [
        { route: '/thin', value: 3200 },
        { route: '/ready', value: 3200 },
      ] },
    },
  };
  const out = cwvGate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].route, '/ready');
});

test('platform_bot_protection: emits with bot-share evidence when fdtByBot present', () => {
  const signals = {
    project: { security: { botIdEnabled: false, managedRules: {} } },
    metrics: {
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 20000 }] },
      fdtByBot: {
        rows: [
          { bot_category: '', value: 20000000 },
          { bot_category: 'automated_browser', value: 9000000 },
          { bot_category: 'http_client', value: 1000000 },
        ],
      },
    },
  };
  const out = botGate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'platform_bot_protection');
  assert.ok(out[0].evidence.botShare);
  assert.ok(out[0].evidence.botShare.botPct > 0.2);
  assert.equal(out[0].evidence.botShare.topCategory, 'automated_browser');
  assert.match(out[0].reason, /bot bandwidth share/);
  assert.match(out[0].o11ySignal, /bot_fdt_pct=\d+%/);
});

test('platform_bot_protection: ignores bot share below FDT byte floor', () => {
  const signals = {
    project: { security: { botIdEnabled: false, managedRules: {} } },
    metrics: {
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 10000 }] },
      fdtByBot: {
        rows: [
          { bot_category: '', value: 99_999 },
          { bot_category: 'automated_browser', value: 900_000 },
        ],
      },
    },
  };
  assert.deepEqual(botGate(signals), []);
});

test('platform_bot_protection: low bot share at scale still fires with generic framing', () => {
  // May 2026 audit: gate requires bot share >= 5%, edge cost >= $25, OR
  // requests >= 14k. This case proves low bot share does not distort framing: the
  // scale floor fires the gate and botShare is still computed.
  const signals = {
    project: { security: { botIdEnabled: false, managedRules: {} } },
    metrics: {
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 200000 }] },
      fdtByBot: {
        rows: [{ bot_category: '', value: 20000000 }],
      },
    },
  };
  const out = botGate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].reason, 'BotID disabled with observable traffic');
  assert.ok(out[0].evidence.botShare);
  assert.equal(out[0].evidence.botShare.botPct, 0);
});

test('platform_bot_protection: silent when traffic is low and no bot evidence (post-May-2026 audit)', () => {
  // Post-May-2026: requires bot share, edge cost, or 14k+/14d. 10k requests
  // at 0% bot share is noise.
  const signals = {
    project: { security: { botIdEnabled: false, managedRules: {} } },
    metrics: {
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 10000 }] },
      fdtByBot: { rows: [{ bot_category: '', value: 20000000 }] },
    },
  };
  assert.deepEqual(botGate(signals), []);
});

test('platform_bot_protection: silent when fdtByBot missing AND traffic below the scale floor', () => {
  // No bot evidence + below 14k/14d scale floor → silent even though BotID is off.
  const signals = {
    project: { security: { botIdEnabled: false, managedRules: {} } },
    metrics: { requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 10000 }] } },
  };
  assert.deepEqual(botGate(signals), []);
});

test('platform_bot_protection: when BotID is enabled, no candidate regardless of bot share', () => {
  const signals = {
    project: { security: { botIdEnabled: true, managedRules: {} } },
    metrics: {
      requestsByRouteCache: { rows: [{ route: '/', cache_result: 'MISS', value: 100000 }] },
      fdtByBot: { rows: [{ bot_category: 'automated_browser', value: 999999999 }] },
    },
  };
  assert.deepEqual(botGate(signals), []);
});
