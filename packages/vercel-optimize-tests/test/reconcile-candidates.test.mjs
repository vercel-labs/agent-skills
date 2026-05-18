import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reconcileCandidate, reconcileInvestigation } from '../../../skills/vercel-optimize/lib/reconcile-candidates.mjs';

test('reconcileCandidate: drops slow route when deep-dive p95 is below threshold', () => {
  const decision = reconcileCandidate({
    kind: 'slow_route',
    route: '/docs',
    o11ySignal: 'inv=10000,p95=1200ms',
    evidence: { deepDive: { latency: { p95: 220 } } },
  }, { group: 'toLaunch', index: 0 });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'metric_mismatch');
  assert.equal(decision.record.abstain, true);
  assert.equal(decision.record.candidateRef, 'slow_route:/docs');
  assert.match(decision.record.reason, /below the slow-route threshold/);
});

test('reconcileCandidate: drops slow route when function-level 5xx dominates', () => {
  const decision = reconcileCandidate({
    kind: 'slow_route',
    route: '/docs/app',
    o11ySignal: 'inv=10000,p95=1600ms',
    evidence: {
      deepDive: {
        latency: { p95: 1600 },
        statusDistribution: [
          { http_status: '200', value: 100 },
          { http_status: '500', value: 900 },
        ],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'error_storm');
  assert.match(decision.record.observation.evidence, /900 5xx of 1,000/);
});

test('reconcileCandidate: drops slow route when one deployment is a large outlier', () => {
  const decision = reconcileCandidate({
    kind: 'slow_route',
    route: '/blog',
    o11ySignal: 'inv=10000,p95=1800ms',
    evidence: {
      deepDive: {
        latency: { p95: 1800 },
        statusDistribution: [{ http_status: '200', value: 1000 }],
        perDeployment: [
          { deployment_id: 'dpl_bad', value: 3300 },
          { deployment_id: 'dpl_ok_1', value: 900 },
          { deployment_id: 'dpl_ok_2', value: 800 },
        ],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'deployment_regression');
  assert.match(decision.record.observation.evidence, /dpl_bad p95=3300ms/);
});

test('reconcileCandidate: drops scanner-only candidates without metric evidence', () => {
  const decision = reconcileCandidate({
    kind: 'cache_header_gap',
    route: '/api/og',
    o11ySignal: 'scanner-only',
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'scanner_only_no_metric');
  assert.match(decision.record.reason, /no Vercel metric/);
});

test('reconcileCandidate: drops route errors when deep-dive 5xx volume does not confirm broad gate', () => {
  const decision = reconcileCandidate({
    kind: 'route_errors',
    route: '/learn',
    o11ySignal: 'errs=24715,rate=3.2%',
    evidence: {
      count: 24715,
      deepDive: {
        errorStatusPattern: [
          { http_status: '500', value: 96 },
        ],
        errorsByDeployment: [
          { deployment_id: 'dpl_ok', http_status: '200', value: 12000 },
          { deployment_id: 'dpl_err', http_status: '500', value: 96 },
        ],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'metric_mismatch');
  assert.match(decision.record.reason, /5xx volume/);
});

test('reconcileCandidate: keeps route errors when deep-dive confirms 5xx volume', () => {
  const decision = reconcileCandidate({
    kind: 'route_errors',
    route: '/docs/llm-digest/[...slug]',
    o11ySignal: 'errs=3907018,rate=36.5%',
    evidence: {
      count: 3907018,
      deepDive: {
        errorStatusPattern: [
          { http_status: '500', value: 3814515 },
        ],
      },
    },
  });

  assert.equal(decision.keep, true);
});

test('reconcileCandidate: drops uncached routes when follow-up cache hit rate is already healthy', () => {
  const decision = reconcileCandidate({
    kind: 'uncached_route',
    route: '/docs',
    o11ySignal: 'inv=10000,cache=0%,get=100%',
    evidence: {
      deepDive: {
        cacheBreakdown: [
          { cache_result: 'HIT', value: 9500 },
          { cache_result: 'MISS', value: 500 },
        ],
        methodDistribution: [{ request_method: 'GET', value: 10000 }],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'metric_mismatch');
  assert.match(decision.record.reason, /cache hit rate/);
});

test('reconcileCandidate: drops uncached routes when follow-up traffic is not GET-heavy', () => {
  const decision = reconcileCandidate({
    kind: 'uncached_route',
    route: '/api/write',
    o11ySignal: 'inv=10000,cache=0%,get=100%',
    evidence: {
      deepDive: {
        cacheBreakdown: [{ cache_result: 'MISS', value: 10000 }],
        methodDistribution: [
          { request_method: 'GET', value: 100 },
          { request_method: 'POST', value: 9900 },
        ],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'protocol_mismatch');
  assert.match(decision.record.reason, /GET share/);
});

test('reconcileCandidate: drops ISR over-revalidation when follow-up ISR writes per read no longer crosses threshold', () => {
  const decision = reconcileCandidate({
    kind: 'isr_overrevalidation',
    route: '/docs/[[...slug]]',
    o11ySignal: 'writes=1484353,reads=117790,w/r=12.60',
    evidence: {
      deepDive: {
        writePattern: [{ cache_result: 'STALE', value: 90 }],
        readPattern: [{ cache_result: 'HIT', value: 2000 }],
      },
    },
  });

  assert.equal(decision.keep, false);
  assert.equal(decision.reasonCode, 'metric_mismatch');
  assert.match(decision.record.reason, /ISR writes per read/);
});

test('reconcileInvestigation: removes dropped candidates and preserves pre-resolved records', () => {
  const out = reconcileInvestigation({
    schemaVersion: '1.0',
    preResolvedRecords: [
      { abstain: true, candidateRef: 'slow_route:/prior', reason: 'already resolved' },
    ],
    toLaunch: [
      {
        kind: 'slow_route',
        route: '/fast-now',
        o11ySignal: 'inv=10000,p95=900ms',
        evidence: { deepDive: { latency: { p95: 300 } } },
      },
      {
        kind: 'slow_route',
        route: '/still-slow',
        o11ySignal: 'inv=10000,p95=900ms',
        evidence: { deepDive: { latency: { p95: 900 } } },
      },
    ],
    platform: [],
  });

  assert.deepEqual(out.toLaunch.map((c) => c.route), ['/still-slow']);
  assert.equal(out.preResolvedRecords.length, 2);
  assert.equal(out.reconciliation.droppedBeforeInvestigation, 1);
  assert.equal(out.reconciliation.reasons.metric_mismatch, 1);
});
