// Regression: May 2026 fixture-app surfaced a POST-heavy route (Server Actions)
// as uncached_route. Sub-agent correctly abstained, but the gate should skip.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/uncached-route.mjs';

const cacheRows = (route, hits, miss) => [
  { route, cache_result: 'HIT', value: hits },
  { route, cache_result: 'MISS', value: miss },
];
const methodRows = (route, get, post) => [
  { route, request_method: 'GET', value: get },
  { route, request_method: 'POST', value: post },
];

test('uncached_route: still fires on GET-heavy routes with low cache hit (the happy path)', () => {
  const signals = {
    metrics: {
      requestsByRouteCache: { rows: cacheRows('/api/products', 100, 4900) },
      requestsByRouteMethod: { rows: methodRows('/api/products', 4800, 200) },
    },
  };
  const cands = gate(signals);
  assert.equal(cands.length, 1);
  assert.equal(cands[0].route, '/api/products');
  assert.equal(cands[0].evidence.getShare, 0.96);
  assert.match(cands[0].o11ySignal, /get=96%/);
});

test('uncached_route: SILENT on mostly-POST routes (Server Actions) — the fixture-app regression', () => {
  // /dashboard/[sessionId]: 4902 POSTs / 21 GETs = 99.6% POST.
  const signals = {
    metrics: {
      requestsByRouteCache: { rows: cacheRows('/dashboard/[sessionId]', 0, 4923) },
      requestsByRouteMethod: { rows: methodRows('/dashboard/[sessionId]', 21, 4902) },
    },
  };
  const cands = gate(signals);
  assert.deepEqual(cands, [], 'POST-heavy route correctly skipped');
});

test('uncached_route: fires on borderline GET share (just above 20%)', () => {
  // 25% GET = 1250 cacheable requests, enough to justify the rec.
  const signals = {
    metrics: {
      requestsByRouteCache: { rows: cacheRows('/api/mixed', 10, 4990) },
      requestsByRouteMethod: { rows: methodRows('/api/mixed', 1250, 3750) },
    },
  };
  const cands = gate(signals);
  assert.equal(cands.length, 1);
});

test('uncached_route: SILENT at exactly 20% GET share (strict >)', () => {
  const signals = {
    metrics: {
      requestsByRouteCache: { rows: cacheRows('/api/edge', 10, 4990) },
      requestsByRouteMethod: { rows: methodRows('/api/edge', 1000, 4000) },
    },
  };
  const cands = gate(signals);
  assert.deepEqual(cands, []);
});

test('uncached_route: gates with warning when method data is unavailable', () => {
  const signals = {
    metrics: {
      requestsByRouteCache: { rows: cacheRows('/api/products', 100, 4900) },
    },
  };
  const cands = gate(signals);
  assert.equal(cands.length, 1);
  assert.equal(cands[0].disqualified, true);
  assert.match(cands[0].disqualifyReason, /missing GET-share data/);
  assert.deepEqual(cands[0].warnings, ['method-share:missing']);
  assert.equal(cands[0].evidence.getShare, null);
});

test('uncached_route: metadata describes the new threshold', () => {
  assert.match(metadata.threshold, /getShare > 0\.2/);
  assert.match(metadata.threshold, /missing getShare is gated/);
  assert.match(metadata.description, /20% GET/);
  assert.match(metadata.description, /missing method-share data/);
});
