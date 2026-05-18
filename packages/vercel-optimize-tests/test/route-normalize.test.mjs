import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  canonicalizeRoute,
  isLikelyNextRouteShape,
  isSegmentTreePath,
  candidateKey,
  mergeCandidates,
  dedupeCandidates,
  routeShapeWarning,
  routeShapeWarnings,
} from '../../../skills/vercel-optimize/lib/route-normalize.mjs';

test('canonicalizeRoute: plain user-facing path passes through', () => {
  assert.equal(canonicalizeRoute('/api/healthcheck'), '/api/healthcheck');
  assert.equal(canonicalizeRoute('/event/[code]/[location]/register'), '/event/[code]/[location]/register');
  assert.equal(canonicalizeRoute('/'), '/');
});

test('canonicalizeRoute: segment-tree __PAGE__ leaf with route group', () => {
  const raw = '/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/london.segments/event/$d$code/$d$location/!KGRlZmF1bHQp/__PAGE__.segment';
  // Drop `(default)` route group to match scan-codebase's routePath form
  // (Next.js doesn't include groups in URLs).
  assert.equal(canonicalizeRoute(raw), '/event/[code]/[location]');
});

test('canonicalizeRoute: all 4 cities collapse to one canonical', () => {
  const variants = ['london', 'nyc', 'sf', 'berlin'].map(
    (city) => `/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/${city}.segments/event/$d$code/$d$location/!KGRlZmF1bHQp/__PAGE__.segment`
  );
  const canonical = variants.map(canonicalizeRoute);
  assert.ok(canonical.every((c) => c === '/event/[code]/[location]'),
    `expected all canonicalized variants equal; got ${JSON.stringify(canonical)}`);
});

test('canonicalizeRoute: _tree.segment / _index.segment fall back to branch prefix', () => {
  const tree = '/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/london.segments/_tree.segment';
  const idx = '/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/london.segments/_index.segment';
  assert.equal(canonicalizeRoute(tree), '/event');
  assert.equal(canonicalizeRoute(idx), '/event');
});

test('canonicalizeRoute: nested route with intermediate $d$code.segment', () => {
  const raw = '/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/sf.segments/event/$d$code.segment';
  assert.equal(canonicalizeRoute(raw), '/event/[code]');
});

test('canonicalizeRoute: nested speakers page', () => {
  const raw = '/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/london/speakers.segments/event/$d$code/$d$location/!KGRlZmF1bHQp/speakers/__PAGE__.segment';
  assert.equal(canonicalizeRoute(raw), '/event/[code]/[location]/speakers');
});

test('canonicalizeRoute: replaces base64 flag-state with [*] placeholder on plain paths', () => {
  // Old behavior stripped segments and corrupted the count. [*] keeps the
  // segment-wise match against scan-codebase routePath intact.
  assert.equal(
    canonicalizeRoute('/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/teaser'),
    '/event/[*]/teaser'
  );
});

test('canonicalizeRoute: leaves legitimate route slugs alone', () => {
  assert.equal(canonicalizeRoute('/blog/my-post-title'), '/blog/my-post-title');
  assert.equal(canonicalizeRoute('/users/abc123'), '/users/abc123');
  assert.equal(canonicalizeRoute('/items/UPPERCASE'), '/items/UPPERCASE');
  // 15-char mixed-case is below the 16-char base64-detection floor.
  assert.equal(canonicalizeRoute('/x/AbCdEfGhIjKlMno'), '/x/AbCdEfGhIjKlMno');
});

test('canonicalizeRoute: optional-catch-all and catch-all placeholders', () => {
  const oc = '/x/eyJhYmM6dHJ1ZX0/y.segments/admin/$oc$segments/__PAGE__.segment';
  const c = '/x/eyJhYmM6dHJ1ZX0/y.segments/admin/$c$slug/__PAGE__.segment';
  assert.equal(canonicalizeRoute(oc), '/admin/[[...segments]]');
  assert.equal(canonicalizeRoute(c), '/admin/[...slug]');
});

test('isSegmentTreePath: detects .segments marker', () => {
  assert.ok(isSegmentTreePath('/x.segments/_tree.segment'));
  assert.ok(isSegmentTreePath('/x.segments'));
  assert.ok(!isSegmentTreePath('/api/foo'));
  assert.ok(!isSegmentTreePath('/x.segmentary/bar'));
});

test('candidateKey: groups same logical target across city variants', () => {
  const make = (city) => ({
    kind: 'slow_route',
    route: `/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/${city}.segments/event/$d$code/$d$location/!KGRlZmF1bHQp/__PAGE__.segment`,
  });
  const a = candidateKey(make('london'));
  const b = candidateKey(make('nyc'));
  const c = candidateKey(make('sf'));
  assert.equal(a, b);
  assert.equal(b, c);
  assert.equal(a, 'slow_route::/event/[code]/[location]');
});

test('mergeCandidates: keeps higher-priority + records alias routes', () => {
  const a = { kind: 'slow_route', route: '/a', priority: 100 };
  const b = { kind: 'slow_route', route: '/b', priority: 200 };
  const merged = mergeCandidates(a, b);
  assert.equal(merged.priority, 200);
  assert.deepEqual(merged.aliasRoutes, ['/a']);
  assert.equal(merged.mergedCount, 2);
});

test('dedupeCandidates: collapses 4 city variants into 1, surfaces real signals', () => {
  const cities = ['london', 'nyc', 'sf', 'berlin'].map((city) => ({
    kind: 'slow_route',
    route: `/event/eyJoYXNTZXNzaW9uIjpmYWxzZX0/${city}.segments/event/$d$code/$d$location/!KGRlZmF1bHQp/__PAGE__.segment`,
    priority: 400000 - (['london', 'nyc', 'sf', 'berlin'].indexOf(city) * 1000),
  }));
  const otherSignals = [
    { kind: 'uncached_route', route: '/event/[code]/[location]/register', priority: 118000 },
    { kind: 'cold_start', route: '/.well-known/vercel/flags', priority: 5000 },
  ];
  const { deduped, dropped } = dedupeCandidates([...cities, ...otherSignals]);
  assert.equal(deduped.length, 3, 'expected 3 unique candidates after dedup');
  assert.equal(dropped.length, 3, 'expected 3 dupes dropped');
  assert.ok(deduped.some((c) => c.route === '/event/[code]/[location]'));
  assert.ok(deduped.some((c) => c.route === '/event/[code]/[location]/register'));
  assert.ok(deduped.some((c) => c.route === '/.well-known/vercel/flags'));
});

// routePathsMatch bridges canonicalizer output to scan-codebase routePaths.
import { routePathMatchScore, routePathsMatch } from '../../../skills/vercel-optimize/lib/investigation-brief.mjs';

test('routePathsMatch: exact match', () => {
  assert.ok(routePathsMatch('/event/[code]', '/event/[code]'));
  assert.ok(routePathsMatch('/', '/'));
});

test('routePathsMatch: dynamic placeholder matches concrete value', () => {
  assert.ok(routePathsMatch('/event/[code]', '/event/london'));
});

test('routePathsMatch: dynamic placeholder matches [*]', () => {
  // [*] is the canonicalizer's stand-in for base64-shaped segments.
  assert.ok(routePathsMatch('/event/[code]/teaser', '/event/[*]/teaser'));
});

test('routePathsMatch: catch-all in routePath absorbs trailing segments', () => {
  assert.ok(routePathsMatch('/event/[code]/schedule/[[...tab]]', '/event/[code]/schedule/2024/keynote'));
  assert.ok(routePathsMatch('/admin/[...slug]', '/admin/users/123'));
});

test('routePathsMatch: optional catch-all absorbs empty tail', () => {
  // /admin/[[...segments]]/page.tsx → URL `/admin`.
  assert.ok(routePathsMatch('/admin/[[...segments]]', '/admin'));
});

test('routePathsMatch: trailing single dynamic allows one-segment partial match', () => {
  assert.ok(routePathsMatch('/event/[code]/[location]/register', '/event/[code]/[location]'));
  assert.ok(routePathsMatch('/event/[code]', '/event/london/teaser'));
  assert.ok(!routePathsMatch('/event/[code]', '/event/london/teaser/details'));
});

test('routePathMatchScore: partial dynamic match ranks below exact match', () => {
  const partial = routePathMatchScore('/event/[code]/[location]/register', '/event/[code]/[location]');
  const exact = routePathMatchScore('/event/[code]/[location]', '/event/[code]/[location]');
  assert.ok(partial > 0);
  assert.ok(partial < exact);
});

test('routePathsMatch: segment count must match (otherwise)', () => {
  assert.ok(!routePathsMatch('/event/[code]/login', '/event/[code]/settings'));
  assert.ok(!routePathsMatch('/event/[code]/login/details', '/event/[code]'));
});

test('routePathsMatch: metric-side dynamic placeholders do not match static scanner routes', () => {
  assert.ok(!routePathsMatch('/docs/[version]/llms.txt', '/docs/llm-digest/[...slug]'));
  assert.ok(!routePathsMatch('/docs/[version]/llms.txt', '/docs/[[...slug]]'));
  assert.ok(!routePathsMatch('/docs/llms.txt', '/docs/[[...slug]]'));
  assert.ok(!routePathsMatch('/api/docs-og', '/api/[...slug]'));
});

test('routePathsMatch: returns false on null/undefined inputs', () => {
  assert.ok(!routePathsMatch(null, '/event'));
  assert.ok(!routePathsMatch('/event', null));
});

test('dedupeCandidates: account-scope candidates pass through unchanged', () => {
  const account = { kind: 'platform_bot_protection', scope: 'account', priority: 10 };
  const route = { kind: 'slow_route', route: '/x', priority: 100 };
  const { deduped } = dedupeCandidates([account, route]);
  assert.equal(deduped.length, 2);
  assert.deepEqual(deduped[0], account);
});

test('route shape regex: allows dynamic brackets in normal app routes', () => {
  assert.equal(isLikelyNextRouteShape('/api/[id]'), true);
  assert.equal(routeShapeWarning('/api/[id]'), null);
});

test('route shape regex: warns on URL-shaped and encoded metric labels', () => {
  assert.equal(isLikelyNextRouteShape('https://example.com/api'), false);
  assert.match(routeShapeWarning('https://example.com/api'), /suspicious-metric-label/);
  assert.match(routeShapeWarning('/api/%5Bsecret%5D'), /suspicious-metric-label/);
});

test('route shape first segment warning: warns when segment is absent from codebase routes', () => {
  const signals = { codebase: { routes: [{ routePath: '/shop/[id]' }, { routePath: '/blog' }] } };
  assert.deepEqual(routeShapeWarnings('/marketing/page', signals), ['route-shape:unknown-first-segment:marketing']);
});

test('route shape first segment warning: exempts platform and dynamic first segments', () => {
  const concreteSignals = { codebase: { routes: [{ routePath: '/shop/[id]' }] } };
  assert.equal(routeShapeWarning('/.well-known/vercel/flags', concreteSignals), null);
  assert.equal(routeShapeWarning('/_next/static/chunk.js', concreteSignals), null);
  assert.equal(routeShapeWarning('/api/orders', concreteSignals), null);
  const dynamicSignals = { codebase: { routes: [{ routePath: '/[locale]/pricing' }] } };
  assert.equal(routeShapeWarning('/en/pricing', dynamicSignals), null);
});
