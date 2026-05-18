// Fixtures in test/fixtures/real-cli-output/ captured 2026-05-12 from
// fixture-app on CLI v53.4.0 (full untruncated summary+data+statistics).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { QUERIES, TIME_WINDOW, normalizerFor } from '../../../skills/vercel-optimize/lib/queries.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FX = join(HERE, 'fixtures', 'real-cli-output');

// Ordered to match QUERIES so the test list reads top-to-bottom alongside it.
const FIXTURES = {
  requestsByRouteCache: 'metrics-request-count-group-by-route-cache.json',
  fnDurationP95ByRoute: 'metrics-fn-duration-p95-by-route.json',
  requestsByRouteStatus: 'metrics-request-count-group-by-http-status.json',
  fnStatusByRoute: 'metrics-fn-count-by-route-http-status.json',
  requestsByRouteMethod: 'metrics-request-count-by-route-method.json',
  externalApiP75: 'metrics-ext-api-p75.json',
  fnStartTypeByRoute: 'metrics-fn-start-type-by-route.json',
  fnGbHrByRoute: 'metrics-fn-gbhr-by-route.json',
  fnCpuMsByRoute: 'metrics-fn-cpu-by-route.json',
  fnPeakMemoryByRoute: 'metrics-fn-peak-memory-by-route.json',
  fnProvisionedMemoryByRoute: 'metrics-fn-provisioned-memory-by-route.json',
  fnTtfbP95ByRoute: 'metrics-fn-ttfb-p95-by-route.json',
  fdtByRoute: 'metrics-fdt-by-route.json',
  fdtByBot: 'metrics-fdt-by-bot.json',
  fdtByCache: 'metrics-fdt-by-cache.json',
  middlewareCount: 'metrics-middleware-count.json',
  middlewareDurationP95: 'metrics-middleware-duration-p95.json',
  isrReadsByRoute: 'metrics-isr-reads-by-route.json',
  isrWritesByRoute: 'metrics-isr-writes-by-route.json',
  imageCount: 'metrics-image-count.json',
  imageByHost: 'metrics-image-by-host.json',
  imageSourceBytes: 'metrics-image-source-bytes.json',
  cwvLcpByRoute: 'metrics-cwv-lcp-by-route.json',
  cwvInpByRoute: 'metrics-cwv-inp-by-route.json',
  cwvClsByRoute: 'metrics-cwv-cls-by-route.json',
  cwvTtfbByRoute: 'metrics-cwv-ttfb-by-route.json',
  cwvCount: 'metrics-cwv-count.json',
  cwvCountByRoute: 'metrics-cwv-count-by-route.json',
  firewallByAction: 'metrics-firewall-by-action.json',
  botIdChecks: 'metrics-bot-id-checks.json',
  externalApiCount: 'metrics-external-api-count.json',
  externalApiBytes: 'metrics-external-api-bytes.json',
};

async function loadFixture(id) {
  const fname = FIXTURES[id];
  if (!fname) throw new Error(`no fixture mapped for query id ${id}`);
  return JSON.parse(await readFile(join(FX, fname), 'utf-8'));
}

test('QUERIES: every id has a fixture mapped', () => {
  for (const q of QUERIES) {
    assert.ok(FIXTURES[q.id], `missing fixture for query ${q.id}`);
  }
});

test('QUERIES: every entry has a non-empty metricId, aggregation, description', () => {
  for (const q of QUERIES) {
    assert.ok(q.metricId && q.metricId.startsWith('vercel.'), `${q.id} metricId`);
    assert.ok(q.aggregation, `${q.id} aggregation`);
    assert.ok(q.description, `${q.id} description`);
    assert.ok(Array.isArray(q.groupBy), `${q.id} groupBy is array`);
  }
});

test('QUERIES: ids are unique', () => {
  const ids = QUERIES.map((q) => q.id);
  const set = new Set(ids);
  assert.equal(set.size, ids.length, `duplicate ids: ${ids.length - set.size}`);
});

test('queries.normalizerFor: default normalizer extracts value + group-by dims', async () => {
  const q = QUERIES.find((x) => x.id === 'fnDurationP95ByRoute');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  assert.ok(Array.isArray(rows), 'rows is array');
  assert.ok(rows.length > 0, 'rows is non-empty');
  for (const r of rows) {
    assert.ok('route' in r, 'each row has route');
    assert.ok('value' in r, 'each row has value');
    assert.equal(typeof r.value, 'number');
  }
});

test('queries.normalizerFor: requestsByRouteCache carries both group-by dims', async () => {
  const q = QUERIES.find((x) => x.id === 'requestsByRouteCache');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  assert.ok(rows.length > 0);
  for (const r of rows) {
    assert.ok('route' in r);
    assert.ok('cache_result' in r);
    assert.equal(typeof r.value, 'number');
  }
});

test('queries.normalizerFor: fnStartTypeByRoute collapses to per-route with coldPct', async () => {
  const q = QUERIES.find((x) => x.id === 'fnStartTypeByRoute');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  assert.ok(rows.length > 0, 'has rows');
  for (const r of rows) {
    assert.ok('route' in r);
    assert.ok('total' in r);
    assert.ok('coldCount' in r);
    assert.ok('warmCount' in r);
    assert.ok('coldPct' in r);
    assert.ok(r.coldPct >= 0 && r.coldPct <= 1, `coldPct in [0,1]: ${r.coldPct}`);
  }
});

test('queries.normalizerFor: fnStatusByRoute carries route and http_status dimensions', async () => {
  const q = QUERIES.find((x) => x.id === 'fnStatusByRoute');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  assert.ok(rows.length > 0);
  for (const r of rows) {
    assert.ok('route' in r);
    assert.ok('http_status' in r);
    assert.equal(typeof r.value, 'number');
  }
  assert.ok(rows.some((r) => r.route === '/api/orders' && r.http_status === '500' && r.value === 100));
});

test('queries.normalizerFor: fnStartTypeByRoute fixture-app sanity — /dashboard has overwhelmingly hot starts', async () => {
  // Regression anchor: fixture-app on CLI v53.4.0 / 2026-05-12 has
  // /dashboard/[sessionId] hot=4893, cold=19, prewarmed=11 → coldPct ~0.004.
  const q = QUERIES.find((x) => x.id === 'fnStartTypeByRoute');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  const dashboard = rows.find((r) => r.route === '/dashboard/[sessionId]');
  assert.ok(dashboard, 'dashboard route present');
  assert.ok(dashboard.total > 4000, `total > 4000, got ${dashboard.total}`);
  assert.ok(dashboard.coldPct < 0.1, `coldPct < 0.1, got ${dashboard.coldPct}`);
});

test('queries.normalizerFor: fdtByBot preserves empty bot_category for human bucket', async () => {
  const q = QUERIES.find((x) => x.id === 'fdtByBot');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  assert.ok(rows.length > 0);
  const human = rows.find((r) => r.bot_category === '');
  assert.ok(human, 'human row (empty bot_category) preserved');
  assert.ok(human.value > 0);
});

test('queries.normalizerFor: empty-summary fixtures (CWV not enabled, no ISR) yield empty rows', async () => {
  for (const id of ['cwvLcpByRoute', 'cwvInpByRoute', 'cwvCount', 'cwvCountByRoute', 'imageCount', 'middlewareCount']) {
    const q = QUERIES.find((x) => x.id === id);
    const fx = await loadFixture(q.id);
    const { rows } = normalizerFor(q)(fx);
    assert.deepEqual(rows, [], `${id} rows should be []`);
  }
});

test('queries: cwvCountByRoute requests per-route Speed Insights sample counts', () => {
  const q = QUERIES.find((x) => x.id === 'cwvCountByRoute');
  assert.equal(q.metricId, 'vercel.speed_insights_metric.count');
  assert.equal(q.aggregation, 'sum');
  assert.deepEqual(q.groupBy, ['route']);
});

test('queries.normalizerFor: peak vs provisioned memory shapes line up', async () => {
  const peak = await loadFixture('fnPeakMemoryByRoute');
  const prov = await loadFixture('fnProvisionedMemoryByRoute');
  const peakN = normalizerFor(QUERIES.find((x) => x.id === 'fnPeakMemoryByRoute'))(peak);
  const provN = normalizerFor(QUERIES.find((x) => x.id === 'fnProvisionedMemoryByRoute'))(prov);
  assert.ok(peakN.rows.length > 0);
  assert.ok(provN.rows.length > 0);
  // Fixture App: every route's provisioned dwarfs peak.
  const dashboardPeak = peakN.rows.find((r) => r.route === '/dashboard/[sessionId]');
  const dashboardProv = provN.rows.find((r) => r.route === '/dashboard/[sessionId]');
  assert.ok(dashboardPeak.value < dashboardProv.value * 0.4,
    `peak ${dashboardPeak.value} should be < 40% of provisioned ${dashboardProv.value}`);
});

test('queries.normalizerFor: firewall summary surfaces both allow + challenge', async () => {
  const q = QUERIES.find((x) => x.id === 'firewallByAction');
  const fx = await loadFixture(q.id);
  const { rows } = normalizerFor(q)(fx);
  const actions = rows.map((r) => r.waf_action);
  assert.ok(actions.includes('allow'), 'allow surfaced');
  assert.ok(actions.includes('challenge'), 'challenge surfaced');
});

test('TIME_WINDOW is "14d"', () => {
  assert.equal(TIME_WINDOW, '14d');
});
