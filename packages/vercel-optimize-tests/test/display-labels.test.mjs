import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatCandidateLine, formatKind, formatPublicText, formatRoute, formatSignal } from '../../../skills/vercel-optimize/lib/display-labels.mjs';

test('formatKind: expands known gate kind names', () => {
  assert.equal(formatKind('slow_route'), 'Slow route');
  assert.equal(formatKind('uncached_route'), 'Low cache-hit route');
  assert.equal(formatKind('route_errors'), 'Route errors');
});

test('formatKind: humanizes unknown kind names', () => {
  assert.equal(formatKind('custom_cost_signal'), 'Custom Cost Signal');
});

test('formatRoute: uses route, hostname, or account-wide fallback', () => {
  assert.equal(formatRoute({ route: '/api/items' }), '/api/items');
  assert.equal(formatRoute({ route: '/event/[*]/london', displayRoute: '/event/[code]/[location]' }), '/event/[code]/[location]');
  assert.equal(formatRoute({ hostname: 'api.example.com' }), 'api.example.com');
  assert.equal(formatRoute({}), 'account-wide');
});

test('formatSignal: expands common gate shorthand', () => {
  const out = formatSignal('inv=10000,p95=900ms,5xx=2%');
  assert.equal(out, 'function invocations: 10,000; 95th percentile duration: 900ms; 5xx error rate: 2%');
});

test('formatSignal: maps runs to function invocations', () => {
  assert.equal(formatSignal('runs=124525,p95=92ms'), 'function invocations: 124,525; 95th percentile duration: 92ms');
});

test('formatSignal: expands cache and ISR labels', () => {
  assert.equal(formatSignal('requests=5000,cache=0%,get=96%'), 'requests: 5,000; cache hit rate: 0%; GET request share: 96%');
  assert.equal(formatSignal('inv=5000,cache=0%,get=96%', { kind: 'uncached_route' }), 'requests: 5,000; cache hit rate: 0%; GET request share: 96%');
  assert.equal(formatSignal('writes=120,reads=240,w/r=0.50'), 'ISR write units: 120; ISR read units: 240; ISR writes per read: 0.50');
  assert.equal(formatSignal('LCP=4200ms,INP=280ms,CLS=0.20'), 'Largest Contentful Paint (LCP): 4200ms; Interaction to Next Paint (INP): 280ms; Cumulative Layout Shift (CLS): 0.20');
});

test('formatCandidateLine: keeps display friendly and avoids raw shorthand', () => {
  const out = formatCandidateLine({
    kind: 'slow_route',
    route: '/event/[code]/[location]/register',
    o11ySignal: 'inv=118267,p95=735ms',
  });
  assert.equal(out, 'Slow route on /event/[code]/[location]/register - function invocations: 118,267; 95th percentile duration: 735ms');
  assert.doesNotMatch(out, /(?:^|[,\s])inv=/);
  assert.doesNotMatch(out, /(?:^|[,\s])p95=/);
});

test('formatCandidateLine: labels uncached-route volume as requests', () => {
  const out = formatCandidateLine({
    kind: 'uncached_route',
    route: '/docs/llm-digest/[...slug]',
    o11ySignal: 'inv=10792158,cache=44%,get=100%',
  });
  assert.equal(out, 'Low cache-hit route on /docs/llm-digest/[...slug] - requests: 10,792,158; cache hit rate: 44%; GET request share: 100%');
  assert.doesNotMatch(out, /function invocations/);
});

test('formatPublicText: expands raw metric assignments inside prose', () => {
  const out = formatPublicText('inv=4923,p95=1067ms,5xx=0%; deepDive.latency.p95=220ms; cache_result=""');
  assert.equal(out, 'function invocations: 4,923; 95th percentile duration: 1067ms; 5xx error rate: 0%; deepDive latency p95: 220ms; cache result: ""');
  assert.doesNotMatch(out, /(?:^|[,\s])inv=/);
  assert.doesNotMatch(out, /(?:^|[,\s])p95=/);
});

test('formatPublicText: preserves Cache-Control directive syntax', () => {
  const text = "The source sets `Cache-Control: 'public, max-age=3600, s-maxage=3600'` today.";
  assert.equal(formatPublicText(text), text);
});

test('formatPublicText: replaces internal shorthand in customer prose', () => {
  const out = formatPublicText('o11y cache-components gotcha with http_status and error_code');
  assert.equal(out, 'observability Cache Components edge case with HTTP status and error code');
});

test('formatPublicText: normalizes observed monthly-looking units to the metrics window', () => {
  const out = formatPublicText('6.28M/mo invocations; 668,627 monthly requests; 232113 GETs/mo; 44 errors per month');
  assert.equal(out, '6.28M invocations in this window; 668,627 requests in this window; 232113 GETs in this window; 44 errors in this window');
});

test('formatPublicText: labels cache-result counts as requests', () => {
  assert.equal(
    formatPublicText('cache breakdown shows 237,718 invocations at empty cache result.'),
    'cache breakdown shows 237,718 requests at empty cache result.'
  );
  assert.equal(
    formatPublicText('evidence shows function invocations: 226,600 with cache result: ""'),
    'evidence shows requests: 226,600 with cache result: ""'
  );
  assert.equal(
    formatPublicText('confirm cache breakdown shifts from 100% MISS toward HIT, with invocations (currently 1,774,668/window) dropping.'),
    'confirm cache breakdown shifts from 100% MISS toward HIT, with requests (currently 1,774,668 in this window) dropping.'
  );
  assert.equal(
    formatPublicText('cache breakdown shows HIT and status distribution only sums to 28,331 actual invocations.'),
    'cache breakdown shows HIT and status distribution only sums to 28,331 actual invocations.'
  );
  assert.equal(
    formatPublicText('cache breakdown shows 1,391,498 HITs and the function ran only ~2,224 times (status distribution 200=2223) out of 1,677,313 invocations.'),
    'cache breakdown shows 1,391,498 HITs and the function ran only ~2,224 times (status distribution 200=2223) out of 1,677,313 requests.'
  );
  assert.equal(
    formatPublicText('cache breakdown[HIT]=2718693 confirms 100% CDN cache hits over 2.7M invocations.'),
    'cache breakdown[HIT]=2718693 confirms 100% CDN cache hits over 2.7M requests.'
  );
});

test('formatPublicText: does not rewrite dollar-per-month framing', () => {
  assert.equal(formatPublicText('$340/mo at current traffic'), '$340/mo at current traffic');
});
