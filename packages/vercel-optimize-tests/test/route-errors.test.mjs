import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/route-errors.mjs';

function signals({ route = '/api/orders', errors, total }) {
  return {
    metrics: {
      requestsByRouteStatus: { rows: [{ route, http_status: '500', value: errors }] },
      requestsByRouteCache: { rows: [{ route, cache_result: 'MISS', value: total }] },
    },
  };
}

test('route_errors: high rate below volume floor stays silent', () => {
  assert.deepEqual(gate(signals({ errors: 20, total: 200 })), []);
});

test('route_errors: high rate emits after volume floor', () => {
  const out = gate(signals({ errors: 20, total: 1000 }));
  assert.equal(out.length, 1);
  assert.equal(out[0].route, '/api/orders');
  assert.equal(out[0].evidence.metric, 'requestsByRouteStatus');
  assert.equal(out[0].evidence.totalRequests, 1000);
  assert.equal(out[0].evidence.errorRate, 0.02);
  assert.match(out[0].o11ySignal, /rate=2\.0%/);
});

test('route_errors: prefers function-level status for error counts and rates', () => {
  const out = gate({
    metrics: {
      fnStatusByRoute: { rows: [
        { route: '/api/orders', http_status: '200', value: 900 },
        { route: '/api/orders', http_status: '500', value: 100 },
      ] },
      requestsByRouteStatus: { rows: [
        { route: '/api/orders', http_status: '200', value: 990 },
        { route: '/api/orders', http_status: '500', value: 10 },
      ] },
      requestsByRouteCache: { rows: [{ route: '/api/orders', cache_result: 'MISS', value: 1000 }] },
    },
  });
  assert.equal(out.length, 1);
  assert.equal(out[0].evidence.metric, 'fnStatusByRoute');
  assert.equal(out[0].evidence.count, 100);
  assert.equal(out[0].evidence.totalRequests, 1000);
  assert.equal(out[0].evidence.errorRate, 0.1);
  assert.match(out[0].o11ySignal, /rate=10\.0%/);
});

test('route_errors: absolute count floor still emits without rate support', () => {
  const out = gate({
    metrics: {
      requestsByRouteStatus: { rows: [{ route: '/api/orders', http_status: '500', value: 251 }] },
      requestsByRouteCache: { rows: [] },
    },
  });
  assert.equal(out.length, 1);
  assert.equal(out[0].evidence.totalRequests, 0);
  assert.equal(out[0].evidence.errorRate, null);
});

test('route_errors: metadata states the rate volume floor', () => {
  assert.match(metadata.threshold, /totalRequests >= 1000/);
  assert.match(metadata.description, /at least 1,000 total requests/);
});
