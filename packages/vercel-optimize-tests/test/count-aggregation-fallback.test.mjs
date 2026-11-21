// Queries were written against CLI v53.4.0. Current CLIs (seen on 62.5.0 and 65.2.0) renamed some metrics,
// use camelCase dimensions, and allow only count/unique on *.count metrics. queryMetric retries a rejected
// query in the current form and maps the response back. These cases come from `vercel metrics schema`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modernizeMetricQuery, restoreLegacyMetricShape, normalizeSummary } from '../../../skills/vercel-optimize/lib/vercel.mjs';
import { QUERIES } from '../../../skills/vercel-optimize/lib/queries.mjs';

// Current catalog (CLI 65.2.0): metric -> { dims, aggs }
const CATALOG = {
  'vercel.request.count': { dims: ['route', 'cacheResult', 'httpStatus', 'requestMethod', 'botCategory'], aggs: ['count', 'unique'] },
  'vercel.external_api_request.count': { dims: ['originHostname', 'requestPath'], aggs: ['count', 'unique'] },
  'vercel.external_api_request.request_duration_ms': { dims: ['originHostname'], aggs: ['count', 'sum', 'avg', 'p50', 'p75', 'p95'] },
  'vercel.external_api_request.transfer_bytes': { dims: ['originHostname'], aggs: ['count', 'sum'] },
  'vercel.request.fdt_total_bytes': { dims: ['route', 'cacheResult', 'botCategory'], aggs: ['count', 'sum', 'avg', 'p95'] },
  'vercel.middleware_invocation.count': { dims: ['route', 'requestPath'], aggs: ['count', 'unique'] },
  'vercel.middleware_invocation.request_duration_ms': { dims: ['route', 'requestPath'], aggs: ['count', 'sum', 'p95'] },
  'vercel.image_transformation.count': { dims: ['sourceImageHostname'], aggs: ['count', 'unique'] },
  'vercel.firewall_action.count': { dims: ['wafAction', 'action', 'route'], aggs: ['count', 'unique'] },
  'vercel.speed_insights.lcp_ms': { dims: ['route'], aggs: ['count', 'p75'] },
  'vercel.speed_insights.inp_ms': { dims: ['route'], aggs: ['count', 'p75'] },
  'vercel.speed_insights.cls': { dims: ['route'], aggs: ['count', 'p75'] },
  'vercel.speed_insights.ttfb_ms': { dims: ['route'], aggs: ['count', 'p75'] },
};

const FAILED_ON_65 = ['externalApiP75', 'fdtByBot', 'fdtByCache', 'middlewareCount', 'middlewareDurationP95', 'imageByHost',
  'cwvLcpByRoute', 'cwvInpByRoute', 'cwvClsByRoute', 'cwvTtfbByRoute', 'cwvCount', 'cwvCountByRoute', 'firewallByAction',
  'externalApiCount', 'externalApiBytes'];

test('modernizeMetricQuery: every query that failed on CLI 65.2.0 maps to a valid current query', () => {
  for (const id of FAILED_ON_65) {
    const q = QUERIES.find((x) => x.id === id);
    assert.ok(q, `query ${id} exists`);
    const m = modernizeMetricQuery(q.metricId, q);
    const entry = CATALOG[m.metricId];
    assert.ok(entry, `${id}: ${m.metricId} is in the current catalog`);
    assert.ok(entry.aggs.includes(m.aggregation), `${id}: aggregation ${m.aggregation} is allowed`);
    for (const dim of m.groupBy) assert.ok(entry.dims.includes(dim), `${id}: dimension ${dim} is allowed`);
  }
});

test('modernizeMetricQuery: renames, camelCases, and switches sum to count where needed', () => {
  assert.deepEqual(modernizeMetricQuery('vercel.request.count', { aggregation: 'sum', groupBy: ['route', 'cache_result'] }),
    { metricId: 'vercel.request.count', aggregation: 'count', groupBy: ['route', 'cacheResult'], filter: undefined, changed: true });
  const cwv = modernizeMetricQuery('vercel.speed_insights_metric.count', { aggregation: 'sum', groupBy: ['route'] });
  assert.equal(cwv.metricId, 'vercel.speed_insights.lcp_ms');
  assert.equal(cwv.aggregation, 'count');
  const mw = modernizeMetricQuery('vercel.middleware_invocation.duration_ms', { aggregation: 'p95', groupBy: ['request_path'] });
  assert.deepEqual([mw.metricId, mw.aggregation, mw.groupBy], ['vercel.middleware_invocation.request_duration_ms', 'p95', ['requestPath']]);
  assert.equal(modernizeMetricQuery('vercel.function_invocation.function_duration_ms', { aggregation: 'p95', groupBy: ['route'] }).changed, false);
});

test('modernizeMetricQuery: rewrites grouped dimension names inside a filter', () => {
  const m = modernizeMetricQuery('vercel.request.fdt_total_bytes', { aggregation: 'sum', groupBy: ['cache_result'], filter: "cache_result eq 'MISS'" });
  assert.equal(m.filter, "cacheResult eq 'MISS'");
});

test('restoreLegacyMetricShape: maps fields and dimensions back so normalizeSummary is unchanged', () => {
  const legacy = { metricId: 'vercel.speed_insights_metric.lcp', aggregation: 'p75', groupBy: ['route'] };
  const modern = modernizeMetricQuery(legacy.metricId, legacy);
  const out = restoreLegacyMetricShape({
    query: { metric: modern.metricId, aggregation: 'p75' },
    summary: [{ route: '/a', vercel_speed_insights_lcp_ms_p75: 2100 }],
    data: [{ timestamp: 't', vercel_speed_insights_lcp_ms_p75: 2000 }],
  }, legacy, modern);
  assert.deepEqual(normalizeSummary(out, legacy.metricId, legacy.aggregation, legacy.groupBy), [{ value: 2100, route: '/a' }]);
  assert.equal(out.data[0].vercel_speed_insights_metric_lcp_p75, 2000);
  assert.equal(out.query.metric, legacy.metricId);

  const legacy2 = { metricId: 'vercel.request.count', aggregation: 'sum', groupBy: ['route', 'cache_result'] };
  const modern2 = modernizeMetricQuery(legacy2.metricId, legacy2);
  const out2 = restoreLegacyMetricShape({ summary: [{ route: '/a', cacheResult: 'HIT', vercel_request_count_count: 257 }] }, legacy2, modern2);
  assert.deepEqual(normalizeSummary(out2, legacy2.metricId, 'sum', legacy2.groupBy), [{ value: 257, route: '/a', cache_result: 'HIT' }]);
  assert.ok(!JSON.stringify(out2).includes('cacheResult'));
});

test('restoreLegacyMetricShape: passes through non-objects', () => {
  assert.equal(restoreLegacyMetricShape(null, { metricId: 'a', aggregation: 'sum', groupBy: [] }, { metricId: 'a', aggregation: 'count', groupBy: [] }), null);
});
