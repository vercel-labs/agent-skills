// Regression: fixture-site /event/[code] fired slow_route at 96.5% 5xx — that's
// a reliability issue, and the sub-agent (correctly) abstained.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/slow-route.mjs';

const baseSignals = (durRows, reqRows, fnStatusRows, requestStatusRows = []) => ({
  metrics: {
    fnDurationP95ByRoute: { ok: true, rows: durRows },
    requestsByRouteCache: { ok: true, rows: reqRows },
    fnStatusByRoute: { ok: true, rows: fnStatusRows ?? [] },
    requestsByRouteStatus: { ok: true, rows: requestStatusRows },
  },
});

test('slow_route: fires on slow high-traffic route with low 5xx rate', () => {
  const sig = baseSignals(
    [{ route: '/a', value: 1200 }],
    [{ route: '/a', cache_result: 'MISS', value: 5000 }],
    [
      { route: '/a', http_status: '200', value: 4950 },
      { route: '/a', http_status: '500', value: 50 },
    ],
  );
  const cands = gate(sig);
  assert.equal(cands.length, 1);
  assert.ok(!cands[0].disqualified);
  assert.match(cands[0].o11ySignal, /5xx=1%/);
});

test('slow_route: disqualifies when 5xx rate exceeds 50% (fixture-site /event/[code] case)', () => {
  const sig = baseSignals(
    [{ route: '/event/[code]', value: 1200 }],
    [{ route: '/event/[code]', cache_result: 'MISS', value: 5000 }],
    [
      { route: '/event/[code]', http_status: '200', value: 175 },
      { route: '/event/[code]', http_status: '500', value: 4825 },
    ],
  );
  const cands = gate(sig);
  assert.equal(cands.length, 1);
  assert.equal(cands[0].disqualified, true);
  assert.match(cands[0].disqualifyReason, /high error rate.*97%.*route_errors/i);
  assert.match(cands[0].o11ySignal, /5xx=97%/);
});

test('slow_route: request-level 5xx does not disqualify when function status is clean', () => {
  const sig = baseSignals(
    [{ route: '/edge-proxy', value: 1200 }],
    [{ route: '/edge-proxy', cache_result: 'MISS', value: 5000 }],
    [
      { route: '/edge-proxy', http_status: '200', value: 5000 },
    ],
    [
      { route: '/edge-proxy', http_status: '200', value: 100 },
      { route: '/edge-proxy', http_status: '500', value: 4900 },
    ],
  );
  const cands = gate(sig);
  assert.equal(cands.length, 1);
  assert.ok(!cands[0].disqualified);
  assert.match(cands[0].o11ySignal, /5xx=0%/);
});

test('slow_route: does NOT disqualify at exactly 50% (threshold is strict gt)', () => {
  const sig = baseSignals(
    [{ route: '/x', value: 1200 }],
    [{ route: '/x', cache_result: 'MISS', value: 5000 }],
    [
      { route: '/x', http_status: '200', value: 2500 },
      { route: '/x', http_status: '500', value: 2500 },
    ],
  );
  const cands = gate(sig);
  assert.ok(!cands[0].disqualified);
});

test('slow_route: gracefully handles missing fnStatusByRoute signal', () => {
  // Older signals.json lacks function-level status rows.
  const sig = {
    metrics: {
      fnDurationP95ByRoute: { ok: true, rows: [{ route: '/x', value: 1200 }] },
      requestsByRouteCache: { ok: true, rows: [{ route: '/x', cache_result: 'MISS', value: 5000 }] },
    },
  };
  const cands = gate(sig);
  assert.equal(cands.length, 1);
  assert.ok(!cands[0].disqualified);
  assert.equal(cands[0].o11ySignal, 'inv=5000,p95=1200ms');
});

test('slow_route metadata: threshold description mentions the 5xx disqualifier', () => {
  assert.match(metadata.threshold, /5xx.*50%/i);
  assert.match(metadata.description, /5xx.*reliability|route_errors/i);
});
