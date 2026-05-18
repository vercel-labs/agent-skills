import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate as slowRouteGate } from '../../../skills/vercel-optimize/lib/gates/slow-route.mjs';
import { gate as uncachedRouteGate } from '../../../skills/vercel-optimize/lib/gates/uncached-route.mjs';
import { gate as routeErrorsGate } from '../../../skills/vercel-optimize/lib/gates/route-errors.mjs';
import { gate as cwvPoorGate } from '../../../skills/vercel-optimize/lib/gates/cwv-poor.mjs';

const codebase = { routes: [{ routePath: '/known' }] };

test('slow_route: attaches route-shape warnings without rejecting the candidate', () => {
  const out = slowRouteGate({
    codebase,
    metrics: {
      fnDurationP95ByRoute: { ok: true, rows: [{ route: '/unknown/path', value: 900 }] },
      requestsByRouteCache: { ok: true, rows: [{ route: '/unknown/path', value: 2000 }] },
      requestsByRouteStatus: { ok: true, rows: [] },
    },
  });
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].warnings, ['route-shape:unknown-first-segment:unknown']);
});

test('uncached_route: attaches suspicious-label warnings without rejecting the candidate', () => {
  const out = uncachedRouteGate({
    codebase,
    metrics: {
      requestsByRouteCache: { ok: true, rows: [{ route: 'https://example.com/api', cache_result: 'MISS', value: 1000 }] },
      requestsByRouteMethod: { ok: true, rows: [{ route: 'https://example.com/api', request_method: 'GET', value: 1000 }] },
    },
  });
  assert.equal(out.length, 1);
  assert.ok(out[0].warnings.includes('route-shape:suspicious-metric-label'));
});

test('route_errors: attaches route-shape warnings without rejecting the candidate', () => {
  const out = routeErrorsGate({
    codebase,
    metrics: {
      requestsByRouteStatus: { ok: true, rows: [{ route: '/missing', http_status: '500', value: 400 }] },
      requestsByRouteCache: { ok: true, rows: [{ route: '/missing', cache_result: 'MISS', value: 1000 }] },
    },
  });
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].warnings, ['route-shape:unknown-first-segment:missing']);
});

test('cwv_poor: attaches route-shape warnings without rejecting the candidate', () => {
  const out = cwvPoorGate({
    codebase,
    metrics: {
      cwvCount: { rows: [{ value: 100 }] },
      cwvCountByRoute: { rows: [{ route: '/missing', value: 100 }] },
      cwvLcpByRoute: { rows: [{ route: '/missing', value: 3200 }] },
      cwvInpByRoute: { rows: [] },
      cwvClsByRoute: { rows: [] },
    },
  });
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].warnings, ['route-shape:unknown-first-segment:missing']);
});
