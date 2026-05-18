import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectLaunchCandidates } from '../../../skills/vercel-optimize/lib/gates/select-candidates.mjs';

const candidate = (kind, route, priority) => ({ kind, route, priority });

test('selectLaunchCandidates: default diversity preserves one candidate per failure mode first', () => {
  const pool = [
    candidate('slow_route', '/slow-a', 1000),
    candidate('slow_route', '/slow-b', 990),
    candidate('slow_route', '/slow-c', 980),
    candidate('uncached_route', '/cache-a', 400),
    { ...candidate('route_errors', '/error-a', 300), evidence: { count: 1200 } },
    candidate('isr_overrevalidation', '/docs/[slug]', 200),
  ];

  const out = selectLaunchCandidates(pool, 4, { diversify: true });

  assert.equal(out.selectionMode, 'diverse-default');
  assert.deepEqual(out.selected.map((c) => c.kind), [
    'slow_route',
    'uncached_route',
    'route_errors',
    'isr_overrevalidation',
  ]);
  assert.deepEqual(out.skipped.map((c) => c.route), ['/slow-b', '/slow-c']);
});

test('selectLaunchCandidates: default diversity does not let low-impact kinds displace larger signals', () => {
  const pool = [
    candidate('slow_route', '/event', 8_000_000),
    candidate('slow_route', '/event/[code]', 300_000),
    candidate('slow_route', '/event/[code]/login', 120_000),
    candidate('slow_route', '/event/[code]/[location]', 80_000),
    candidate('uncached_route', '/event/[code]/[location]/register', 120_000),
    candidate('isr_overrevalidation', '/event/london', 32_000),
    { ...candidate('route_errors', '/event', 146), evidence: { count: 146 } },
    { ...candidate('cache_header_gap', '/event/admin/api/[...slug]', 41), o11ySignal: 'inv=6725,p95=1803ms' },
  ];

  const out = selectLaunchCandidates(pool, 6, { diversify: true });

  assert.deepEqual(out.selected.map((c) => c.route), [
    '/event',
    '/event/[code]/[location]/register',
    '/event/london',
    '/event/[code]',
    '/event/[code]/login',
    '/event/[code]/[location]',
  ]);
  assert.ok(out.skipped.some((c) => c.kind === 'route_errors' && c.route === '/event'));
});

test('selectLaunchCandidates: high-volume route errors and cache gaps remain default-diversity eligible', () => {
  const pool = [
    candidate('slow_route', '/slow-a', 1000),
    { ...candidate('route_errors', '/errors', 900), evidence: { count: 5000 } },
    { ...candidate('cache_header_gap', '/api/cacheable', 41), o11ySignal: 'inv=50000,p95=90ms' },
    candidate('slow_route', '/slow-b', 990),
  ];

  const out = selectLaunchCandidates(pool, 3, { diversify: true });

  assert.deepEqual(out.selected.map((c) => c.kind), [
    'slow_route',
    'route_errors',
    'cache_header_gap',
  ]);
});

test('selectLaunchCandidates: priority mode preserves raw priority order for explicit budgets', () => {
  const pool = [
    candidate('slow_route', '/slow-a', 1000),
    candidate('slow_route', '/slow-b', 990),
    candidate('uncached_route', '/cache-a', 400),
  ];

  const out = selectLaunchCandidates(pool, 2, { diversify: false });

  assert.equal(out.selectionMode, 'priority');
  assert.deepEqual(out.selected.map((c) => c.route), ['/slow-a', '/slow-b']);
  assert.deepEqual(out.skipped.map((c) => c.route), ['/cache-a']);
});

test('selectLaunchCandidates: all keeps every candidate', () => {
  const pool = [
    candidate('slow_route', '/slow-a', 1000),
    candidate('uncached_route', '/cache-a', 400),
  ];

  const out = selectLaunchCandidates(pool, Infinity, { diversify: true });

  assert.equal(out.selectionMode, 'all');
  assert.deepEqual(out.selected, pool);
  assert.deepEqual(out.skipped, []);
});
