// Sub-agent observations: abstentions carry an optional `observation` field
// for findings that aren't perf recs but matter (deploy regression, error storm).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderReport } from '../../../skills/vercel-optimize/lib/render-report.mjs';
import { buildBrief, citationSubset } from '../../../skills/vercel-optimize/lib/investigation-brief.mjs';

const baseSignals = {
  stack: { framework: 'next', frameworkVersion: '16.3.0', hasAppRouter: true, orm: 'none' },
  plan: { plan: 'pro' },
  observabilityPlus: true,
};

test('investigation brief: documents the observation schema (B1)', async () => {
  const candidate = {
    kind: 'slow_route',
    route: '/event',
    scope: 'route',
    priority: 100,
    confidence: 0.9,
    o11ySignal: 'inv=2.8M,p95=3010ms',
    question: 'What is the bottleneck in /event?',
    evidence: { deepDive: { latency: { p95: 3010 } } },
  };
  const citations = await citationSubset('slow_route', 'next', '16.3.0');
  const md = buildBrief({
    candidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['app/event/page.tsx'],
    signals: baseSignals,
    citations,
    playbookId: null,
    playbookBody: null,
    frameworkPlaybookId: null,
    frameworkPlaybookBody: null,
    generatedAt: null,
  });
  assert.match(md, /Abstain with an observation/);
  assert.match(md, /"observation":/);
  assert.match(md, /"summary":/);
  assert.match(md, /"evidence":/);
  assert.match(md, /"suggestedAction":/);
  assert.match(md, /"kind":/);
});

test('renderReport: emits Observations from investigation section when present', () => {
  const observations = [
    {
      candidateRef: 'slow_route:/event',
      summary: 'perDeployment p95 spiked from 256ms to 3135ms across the last 3 deployments — likely regression.',
      evidence: 'deployment-slow p95=3135ms vs deployment-fast p95=256ms',
      suggestedAction: 'Check the changeset between those deployments for added awaits or new external API calls.',
      kind: 'regression',
    },
  ];
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [],
    observations,
    signals: baseSignals,
    opts: { projectName: 'x' },
  });
  assert.match(md, /## Observations from investigation/);
  assert.match(md, /per-deployment 95th percentile spiked/);
  assert.match(md, /regression/);
  assert.match(md, /deployment-slow/);
});

test('renderReport: no Observations section when none provided', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [],
    observations: [],
    signals: baseSignals,
    opts: { projectName: 'x' },
  });
  assert.ok(!md.includes('## Observations from investigation'));
});

test('summarizeDeepDiveFailures: emits notice when >=50% of entries failed', async () => {
  const { summarizeDeepDiveFailures } = await import('../../../skills/vercel-optimize/lib/investigation-brief.mjs');
  const out = summarizeDeepDiveFailures({
    latencyP50: { value: 100 },
    latencyP95: { value: 500 },
    startTypeSplit: { ok: false, code: 'RATE_LIMITED' },
    cacheBreakdown: { ok: false, code: 'RATE_LIMITED' },
    perDeployment: { ok: false, code: 'PAYMENT_REQUIRED' },
  });
  assert.match(out, /3 of 5 deep-dive signals failed/);
  assert.match(out, /RATE_LIMITED|PAYMENT_REQUIRED/);
});

test('summarizeDeepDiveFailures: returns null when fewer than 3 entries failed and <50%', async () => {
  const { summarizeDeepDiveFailures } = await import('../../../skills/vercel-optimize/lib/investigation-brief.mjs');
  const out = summarizeDeepDiveFailures({
    a: { value: 1 }, b: { value: 2 }, c: { value: 3 }, d: { value: 4 },
    e: { ok: false, code: 'RATE_LIMITED' },
    f: { ok: false, code: 'RATE_LIMITED' },
  });
  assert.equal(out, null);
});

test('summarizeDeepDiveFailures: returns null on empty deep-dive', async () => {
  const { summarizeDeepDiveFailures } = await import('../../../skills/vercel-optimize/lib/investigation-brief.mjs');
  assert.equal(summarizeDeepDiveFailures({}), null);
  assert.equal(summarizeDeepDiveFailures(null), null);
});

test('renderReport: observation table escapes pipes in evidence cell', () => {
  const observations = [{
    candidateRef: 'slow_route:/x',
    summary: 'pipe | in | summary',
    evidence: 'value | with | pipes',
    suggestedAction: 'do | thing',
    kind: 'other',
  }];
  const md = renderReport({ recommendations: [], gated: [], observations, signals: baseSignals });
  const obsTableRow = md.split('\n').find((l) => l.startsWith('|') && l.includes('pipe \\| in \\| summary'));
  assert.ok(obsTableRow, `expected escaped pipes in observation row, got md:\n${md}`);
});
