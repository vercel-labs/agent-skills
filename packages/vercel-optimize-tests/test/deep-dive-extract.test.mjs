// broadPassEquivalent lets the deep-dive runner reuse broad-pass data instead
// of re-issuing CLI queries — the main rate-limit-budget lever for
// --max-candidates all.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { specsForCandidate } from '../../../skills/vercel-optimize/lib/deep-dive.mjs';

test('slow_route spec: startTypeSplit declares broadPassEquivalent on fnStartTypeByRoute', () => {
  const specs = specsForCandidate({ kind: 'slow_route', route: '/x' });
  const startType = specs.find((s) => s.id === 'startTypeSplit');
  assert.ok(startType, 'startTypeSplit spec should be present');
  assert.ok(startType.broadPassEquivalent, 'should declare broad-pass equivalent');
  assert.equal(startType.broadPassEquivalent.key, 'fnStartTypeByRoute');
  assert.equal(startType.broadPassEquivalent.routeFilter, '/x');
  assert.deepEqual(startType.broadPassEquivalent.projectDims, ['function_start_type']);
});

test('slow_route spec: cacheBreakdown declares broadPassEquivalent on requestsByRouteCache', () => {
  const specs = specsForCandidate({ kind: 'slow_route', route: '/x' });
  const cache = specs.find((s) => s.id === 'cacheBreakdown');
  assert.ok(cache.broadPassEquivalent, 'should declare broad-pass equivalent');
  assert.equal(cache.broadPassEquivalent.key, 'requestsByRouteCache');
});

test('slow_route spec: statusDistribution does NOT declare broadPassEquivalent (different metric)', () => {
  // function_invocation.count vs broad-pass request.count — different signals.
  const specs = specsForCandidate({ kind: 'slow_route', route: '/x' });
  const status = specs.find((s) => s.id === 'statusDistribution');
  assert.equal(status.broadPassEquivalent, undefined);
});

test('slow_route spec: bandwidthByCache does NOT declare broadPassEquivalent (broad pass is account-wide)', () => {
  const specs = specsForCandidate({ kind: 'slow_route', route: '/x' });
  const bandwidth = specs.find((s) => s.id === 'bandwidthByCache');
  assert.equal(bandwidth.broadPassEquivalent, undefined);
});

test('uncached_route spec: cacheBreakdown + methodDistribution declare broadPassEquivalent', () => {
  const specs = specsForCandidate({ kind: 'uncached_route', route: '/x' });
  const cache = specs.find((s) => s.id === 'cacheBreakdown');
  const method = specs.find((s) => s.id === 'methodDistribution');
  assert.equal(cache.broadPassEquivalent.key, 'requestsByRouteCache');
  assert.equal(method.broadPassEquivalent.key, 'requestsByRouteMethod');
});

test('uncached_route spec: botShare + bandwidthByCache do NOT declare broadPassEquivalent', () => {
  // Broad-pass equivalents are account-wide; per-route filtering would need new queries.
  const specs = specsForCandidate({ kind: 'uncached_route', route: '/x' });
  const bot = specs.find((s) => s.id === 'botShare');
  const bandwidth = specs.find((s) => s.id === 'bandwidthByCache');
  assert.equal(bot.broadPassEquivalent, undefined);
  assert.equal(bandwidth.broadPassEquivalent, undefined);
});
