import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { buildFinalReportMessage, renderReport } from '../../../skills/vercel-optimize/lib/render-report.mjs';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const RENDER_SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'render-report.mjs');

const baseSignals = {
  stack: { framework: 'next', frameworkVersion: '15.4.10', hasAppRouter: true, orm: 'none' },
  plan: { plan: 'pro', reason: 'commitment category=Spend' },
  observabilityPlus: true,
  usage: {
    period: { from: '2026-04-13', to: '2026-05-13' },
    services: [
      { name: 'Function Duration', usage: '1.20M GB-hr', billedCost: 142.50 },
      { name: 'Edge Requests', usage: 5_400_000, unit: 'requests', billedCost: 28.40 },
    ],
    totals: { billedCost: 170.90 },
  },
  metrics: {
    fdtByCache: { rows: [
      { cache_result: 'HIT', value: 2_000_000_000 },
      { cache_result: 'MISS', value: 400_000_000 },
    ]},
    fnStartTypeByRoute: { rows: [
      { route: '/x', total: 5000, coldCount: 50, warmCount: 4900, prewarmedCount: 50 },
    ]},
  },
};

async function renderCli(recsRaw, extraArgs = [], gateRaw = { toLaunch: [], platform: [], gated: [] }) {
  const root = await mkdtemp(join(tmpdir(), 'vo-render-report-'));
  try {
    const recsPath = join(root, 'recs.json');
    const gatePath = join(root, 'gate.json');
    const signalsPath = join(root, 'signals.json');
    await Promise.all([
      writeFile(recsPath, JSON.stringify(recsRaw), 'utf-8'),
      writeFile(gatePath, JSON.stringify(gateRaw), 'utf-8'),
      writeFile(signalsPath, JSON.stringify(baseSignals), 'utf-8'),
    ]);
    return await exec('node', [RENDER_SCRIPT, recsPath, gatePath, signalsPath, '--project', 'x', '--no-timestamp', ...extraArgs]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const sampleRec = {
  what: 'Parallelize three sequential fetch waves in /dashboard/[sessionId]',
  why: 'src/app/(app)/dashboard/[sessionId]/page.tsx:28 awaits getDashboardSummary() in isolation; cpu.p95=117ms but latency.p95=1066ms.',
  fix: '1. Start parallel fetches.\n2. Chain the plateau fan-out.\n3. Await all promises together.',
  bucket: 'performance',
  effort: 'low',
  impactTier: 'high',
  affectedFiles: ['src/app/(app)/dashboard/[sessionId]/page.tsx'],
  currentBehavior: '```ts\nconst data = await getDashboardSummary();\n```',
  desiredBehavior: '```ts\nconst dataPromise = getDashboardSummary();\n```',
  verify: 'Watch p95 drop on /dashboard/[sessionId].',
  candidateRef: 'slow_route:/dashboard/[sessionId]',
  o11ySignal: 'inv=4923,p95=1067ms',
  citations: [
    'https://react.dev/reference/react/cache',
    'vercel-react-best-practices:async-parallel',
  ],
  impactLabel: { performance: 'Reduce /dashboard/[sessionId] p95 from 1066ms toward ~400-600ms' },
  priority: 5253,
  quality: { overall: 0.85, grade: 'Excellent' },
};

function assertNoPublicInternals(md) {
  assert.doesNotMatch(md, /passRate|avgQuality|\bquality\b|sanitizer|\babstain(?:ed)?\b|\babstentions?\b|sub[- ]agent|debug/i);
}

test('renderReport: deterministic for same inputs (no timestamp)', () => {
  const args = {
    recommendations: [sampleRec],
    gated: [],
    signals: baseSignals,
    opts: { projectName: 'fixture-app', generatedAt: null },
  };
  assert.equal(renderReport(args), renderReport(args));
});

test('renderReport: contains every required section per scoring.md template', () => {
  const md = renderReport({
    recommendations: [sampleRec],
    gated: [],
    signals: baseSignals,
    opts: { projectName: 'fixture-app' },
  });
  for (const section of [
    '# Vercel Optimization Report — fixture-app',
    '## Cost breakdown',
    '## Highest-impact recommendations',
    '## Recommendations',
    '### High impact',
    '### Medium impact',
    '## Detailed recommendations',
    '## Platform recommendations',
    '## Not investigated in this run',
    '## Strengths',
    '## Data gaps',
  ]) {
    assert.ok(md.includes(section), `missing section: ${section}`);
  }
});

test('renderReport: renders usage.services + totals when usage is present', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    signals: baseSignals,
  });
  assert.match(md, /Function Duration.*\$142\.50/);
  assert.match(md, /\*\*Total billed: \$170\.90\*\*/);
});

test('renderReport: falls back to o11y-derived ranking when usage missing', () => {
  const signals = {
    ...baseSignals,
    usage: null,
    metrics: {
      ...baseSignals.metrics,
      fnGbHrByRoute: { rows: [
        { route: '/x', value: 0.5 },
        { route: '/y', value: 0.2 },
      ]},
    },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.match(md, /ranking by `function_duration_gbhr`/);
  assert.match(md, /\| \/x \| 0\.5000 \|/);
});

test('renderReport: canonicalizes o11y-derived cost routes', () => {
  const signals = {
    ...baseSignals,
    usage: null,
    metrics: {
      ...baseSignals.metrics,
      fnGbHrByRoute: { rows: [
        { route: '/docs/[[...slug]]/london.segments/_tree.segment', value: 0.25 },
        { route: '/docs/[[...slug]]', value: 0.25 },
      ]},
    },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.match(md, /\| \/docs\/\[\[\.\.\.slug\]\] \| 0\.5000 \|/);
});

test('renderReport: gated table groups the "Not investigated" rows', () => {
  const md = renderReport({
    recommendations: [],
    gated: [
      { kind: 'uncached_route', route: '/api/orders', gatedReason: 'hitRate 0.65 above threshold' },
      { kind: 'slow_route', route: '/api/healthcheck', gatedReason: 'only 50 invocations' },
    ],
    signals: baseSignals,
  });
  assert.match(md, /\| Low cache-hit route \| hitRate 0\.65 above threshold \| \/api\/orders \| 1 \|/);
  assert.match(md, /\| Slow route \| only 50 invocations \| \/api\/healthcheck \| 1 \|/);
});

test('renderReport: recommendations use displayRoute from candidate metadata', () => {
  const md = renderReport({
    recommendations: [{
      ...sampleRec,
      candidateRef: 'isr_overrevalidation:/event/[*]/london',
      what: 'Add cacheLife to the event homepage.',
      o11ySignal: null,
    }],
    candidates: [{
      kind: 'isr_overrevalidation',
      route: '/event/[*]/london',
      displayRoute: '/event/[code]/[location]',
      o11ySignal: 'writes=100,reads=20,w/r=5',
    }],
    gated: [],
    signals: baseSignals,
  });
  assert.match(md, /ISR over-revalidation on \/event\/\[code\]\/\[location\]/);
  assert.doesNotMatch(md, /ISR over-revalidation on \/event\/\[\*\]\/london/);
});

test('renderReport: gated table caps noisy target lists while preserving counts', () => {
  const md = renderReport({
    recommendations: [],
    gated: Array.from({ length: 8 }, (_, i) => ({
      kind: 'route_errors',
      route: `/docs/page-${i}`,
      gatedReason: 'coveredBy (route_errors::/docs) — duplicate of higher-priority sibling',
    })),
    signals: baseSignals,
  });
  assert.match(md, /\| Route errors \| covered by a higher-priority candidate .* \| \/docs\/page-0<br>\/docs\/page-1<br>\/docs\/page-2<br>\/docs\/page-3<br>\/docs\/page-4<br>\+3 more \| 8 \|/);
  assert.doesNotMatch(md, /\/docs\/page-7<br>/);
});

test('renderReport: public gated reasons avoid raw budget internals', () => {
  const md = renderReport({
    recommendations: [],
    gated: [
      {
        kind: 'slow_route',
        route: '/docs',
        gatedReason: 'skippedByBudget (max-candidates=6; raise with --max-candidates N or =all)',
      },
    ],
    signals: baseSignals,
  });
  assert.match(md, /left for a larger run \(max candidates: 6\)/);
  assert.doesNotMatch(md, /skippedByBudget/);
  assert.doesNotMatch(md, /=all/);
});

test('renderReport: partitions recs by impactTier into High / Medium / Low', () => {
  const md = renderReport({
    recommendations: [
      { ...sampleRec, what: 'high one', impactTier: 'high', candidateRef: 'a:1' },
      { ...sampleRec, what: 'medium one', impactTier: 'medium', candidateRef: 'b:1' },
      { ...sampleRec, what: 'low one', impactTier: 'low', candidateRef: 'c:1' },
    ],
    gated: [],
    signals: baseSignals,
  });
  const high = md.split('### Medium impact')[0];
  const med = md.split('### Medium impact')[1].split('### Low impact')[0];
  assert.ok(high.includes('high one'));
  assert.ok(med.includes('medium one'));
});

test('renderReport: omits quick wins table to avoid duplicate recommendation surfaces', () => {
  const md = renderReport({
    recommendations: [
      { ...sampleRec, what: 'high repeated elsewhere', impactTier: 'high', effort: 'low', priority: 100 },
      { ...sampleRec, what: 'medium quick win', impactTier: 'medium', effort: 'low', priority: 90, candidateRef: 'slow_route:/medium' },
    ],
    gated: [],
    signals: baseSignals,
  });
  assert.doesNotMatch(md, /### Quick wins/);
});

test('renderReport: caps platform-scope recs at 3', () => {
  const recs = Array.from({ length: 5 }, (_, i) => ({
    ...sampleRec,
    what: `platform rec ${i}`,
    candidateRef: `platform_fluid_compute:account-${i}`,
    scope: 'account',
  }));
  const md = renderReport({ recommendations: recs, gated: [], signals: baseSignals });
  const platSection = md.split('## Platform recommendations')[1].split('## Not investigated in this run')[0];
  const count = (platSection.match(/platform rec \d/g) ?? []).length;
  assert.equal(count, 3, `expected platform cap of 3, saw ${count}`);
});

test('renderReport: includes the abstention-friendly "no recs" fallback', () => {
  const md = renderReport({ recommendations: [], gated: [], signals: baseSignals });
  assert.match(md, /No recommendations are ready to apply from this run/);
});

test('renderReport: handles missing observabilityPlus gracefully', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    signals: { ...baseSignals, observabilityPlus: false },
  });
  assert.match(md, /Not enabled — analysis based on billing \+ scanner findings/);
  assert.match(md, /Observability Plus not enabled/);
});

test('renderReport: hides sanitizerTrail by default and does not emit generic review notes', () => {
  const rec = {
    ...sampleRec,
    needsReview: true,
    sanitizerTrail: ['$-strip:2', 'unknown-citation:https://made-up.example.com'],
  };
  const md = renderReport({
    recommendations: [rec],
    gated: [],
    signals: baseSignals,
  });
  assert.doesNotMatch(md, /Review before applying: automated checks flagged this recommendation/);
  assertNoPublicInternals(md);
  assert.doesNotMatch(md, /\$-strip:2/);
});

test('renderReport: public markdown hides internal reporting fields and labels', () => {
  const rec = {
    ...sampleRec,
    passRate: 0.67,
    avgQuality: 0.72,
    needsReview: true,
    sanitizerTrail: ['$-strip:2'],
  };
  const md = renderReport({
    recommendations: [rec],
    gated: [],
    abstentions: [{
      candidateRef: 'slow_route:/internal',
      reason: 'sub-agent was abstaining after quality + verification; sanitizer changed the draft',
    }],
    signals: baseSignals,
  });
  assertNoPublicInternals(md);
  assert.match(md, /Why no recommendation shipped/);
  assert.match(md, /investigation was not recommending a change after verification; checks changed the draft/);
});

test('renderReport: rewrites bare abstain in no-change reasons', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [{
      candidateRef: 'slow_route:/docs',
      reason: 'Evidence and source diverge — abstain.',
    }],
    signals: baseSignals,
  });
  assertNoPublicInternals(md);
  assert.match(md, /Evidence and source diverge — found no supported change\./);
});

test('renderReport: highest-impact recommendations use readable metric labels', () => {
  const md = renderReport({
    recommendations: [sampleRec],
    gated: [],
    signals: baseSignals,
  });
  const top = md.split('## Highest-impact recommendations')[1].split('## Recommendations')[0];
  assert.match(top, /Slow route on \/dashboard\/\[sessionId\]/);
  assert.match(top, /function invocations: 4,923/);
  assert.match(top, /95th percentile duration: 1067ms/);
  assert.doesNotMatch(top, /(?:^|[,\s])inv=/);
  assert.doesNotMatch(top, /(?:^|[,\s])p95=/);
});

test('renderReport: softens overconfident recommendation wording in public surfaces', () => {
  const rec = {
    ...sampleRec,
    what: 'Stop blocking metadata so the response head ships immediately.',
  };
  const md = renderReport({
    recommendations: [rec],
    gated: [],
    signals: baseSignals,
  });
  assert.ok(!md.includes('ships immediately'));
  assert.match(md, /response head can ship sooner/);
});

test('renderReport: never writes internal review details into public markdown', () => {
  const rec = {
    ...sampleRec,
    passRate: 0.8,
    avgQuality: 0.73,
    needsReview: true,
    sanitizerTrail: ['$-strip:2', 'unknown-citation:https://made-up.example.com'],
  };
  const md = renderReport({
    recommendations: [rec],
    gated: [],
    signals: baseSignals,
    opts: { debug: true },
  });
  assertNoPublicInternals(md);
  assert.doesNotMatch(md, /Internal debug details/);
  assert.doesNotMatch(md, /passRate: 0\.8/);
});

test('render-report CLI: --debug-out writes internal details outside customer markdown', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vo-render-report-debug-'));
  try {
    const debugPath = join(root, 'debug.json');
    const { stdout } = await renderCli({
      schemaVersion: '1.0',
      summary: { totalRecs: 1, observations: 0 },
      recsGraded: [{
        ...sampleRec,
        passRate: 0.8,
        avgQuality: 0.73,
        sanitizerTrail: ['$-strip:2'],
      }],
      abstentions: [],
      observations: [],
    }, ['--debug-out', debugPath]);
    assertNoPublicInternals(stdout);
    const debug = JSON.parse(await readFile(debugPath, 'utf-8'));
    assert.equal(debug.summary.rawRecommendationCount, 1);
    assert.equal(debug.summary.renderedRecommendationCount, 1);
    assert.equal(debug.recommendations[0].candidateRef, sampleRec.candidateRef);
    assert.equal(debug.recommendations[0].quality.overall, 0.85);
    assert.equal(debug.recommendations[0].passRate, 0.8);
    assert.deepEqual(debug.recommendations[0].sanitizerTrail, ['$-strip:2']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('buildFinalReportMessage: extracts concise public message from rendered markdown', () => {
  const md = renderReport({
    recommendations: [sampleRec],
    gated: [],
    candidates: [{ kind: 'slow_route', route: '/dashboard/[sessionId]' }],
    signals: baseSignals,
    opts: { projectName: 'x', generatedAt: null },
  });
  const message = buildFinalReportMessage({
    reportPath: '/tmp/report.md',
    markdown: md,
    recommendations: [sampleRec],
    signals: baseSignals,
  });
  assert.match(message.body, /^Report saved: \/tmp\/report\.md/);
  assert.match(message.body, /\*\*Coverage\*\*: Found \*\*1\*\* potential issue to check/);
  assert.match(message.body, /Ready recommendations:/);
  assert.match(message.body, /1\. Parallelize three sequential fetch waves in \/dashboard\/\[sessionId\]/);
  assert.match(message.body, /Impact: Reduce \/dashboard\/\[sessionId\] 95th percentile from 1066ms toward ~400-600ms/);
  assert.doesNotMatch(message.body, /details|passRate|\bquality\b|sanitizer|sub[- ]agent|abstention|debug/i);
  assert.equal(message.lineCount, message.body.split('\n').length);
  assert.equal(message.reportPath, '/tmp/report.md');
  assert.equal(message.recommendationsShown, 1);
});

test('buildFinalReportMessage: does not invent counts without a Coverage line', () => {
  const message = buildFinalReportMessage({ reportPath: '/tmp/report.md', markdown: '# Report\n\nNo coverage.' });
  assert.equal(message.body, 'Report saved: /tmp/report.md\n\nOpen the report for details. No coverage summary was available.');
  assert.equal(message.coverageLine, null);
});

test('render-report CLI: --message-out writes concise final message separate from debug', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vo-render-report-message-'));
  try {
    const recsPath = join(root, 'recs.json');
    const gatePath = join(root, 'gate.json');
    const signalsPath = join(root, 'signals.json');
    const reportPath = join(root, 'report.md');
    const messagePath = join(root, 'message.json');
    const debugPath = join(root, 'debug.json');
    await Promise.all([
      writeFile(recsPath, JSON.stringify({
        schemaVersion: '1.0',
        summary: { totalRecs: 1, observations: 0 },
        recsGraded: [{ ...sampleRec, passRate: 0.8, sanitizerTrail: ['$-strip:2'] }],
        abstentions: [],
        observations: [],
      }), 'utf-8'),
      writeFile(gatePath, JSON.stringify({ toLaunch: [{ kind: 'slow_route', route: '/dashboard/[sessionId]' }], platform: [], gated: [] }), 'utf-8'),
      writeFile(signalsPath, JSON.stringify(baseSignals), 'utf-8'),
    ]);
    await exec('node', [
      RENDER_SCRIPT,
      recsPath,
      gatePath,
      signalsPath,
      '--project',
      'x',
      '--no-timestamp',
      '--out',
      reportPath,
      '--message-out',
      messagePath,
      '--debug-out',
      debugPath,
    ]);

    const [report, message, debug] = await Promise.all([
      readFile(reportPath, 'utf-8'),
      readFile(messagePath, 'utf-8').then(JSON.parse),
      readFile(debugPath, 'utf-8').then(JSON.parse),
    ]);
    assertNoPublicInternals(report);
    assertNoPublicInternals(message.body);
    assert.match(message.body, /^Report saved:/);
    assert.match(message.body, /\*\*Coverage\*\*:/);
    assert.match(message.body, /Ready recommendations:/);
    assert.match(message.body, /Parallelize three sequential fetch waves/);
    assert.doesNotMatch(message.body, /Developer diagnostics|debug\.json|passRate|\bquality\b|sanitizer/i);
    assert.equal(message.recommendationsShown, 1);
    assert.equal(debug.recommendations[0].passRate, 0.8);
    assert.deepEqual(debug.recommendations[0].sanitizerTrail, ['$-strip:2']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('render-report CLI: legacy --debug does not leak into markdown', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 1, observations: 0 },
    recsGraded: [{
      ...sampleRec,
      passRate: 0.8,
      avgQuality: 0.73,
      sanitizerTrail: ['$-strip:2'],
    }],
    abstentions: [],
    observations: [],
  }, ['--debug']);
  assertNoPublicInternals(stdout);
});

test('renderReport: does NOT include $N literals when impactLabel is magnitude', () => {
  const rec = {
    ...sampleRec,
    impactLabel: { costPhrase: 'hundreds of dollars per month at current traffic' },
  };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals });
  assert.match(md, /hundreds of dollars per month/);
});

test('renderReport: renders "Investigated, no change recommended" section when no-change findings are present', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [
      { candidateRef: 'uncached_route:/dashboard/[sessionId]', reason: 'POST-heavy route, no cache opportunity' },
      { candidateRef: 'slow_route:/api/x', reason: 'wall-clock dominated by an external API not in scope' },
    ],
    signals: baseSignals,
  });
  assert.match(md, /## Investigated, no change recommended/);
  assert.match(md, /Why no recommendation shipped/);
  assert.match(md, /Low cache-hit route on \/dashboard\/\[sessionId\]/);
  assert.match(md, /POST-heavy route, no cache opportunity/);
  assert.match(md, /Slow route on \/api\/x/);
});

test('renderReport: separates held-back findings from no-change findings', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [
      { candidateRef: 'slow_route:/docs', reason: 'Needs stronger framework evidence before applying.', needsEvidence: true },
      { candidateRef: 'uncached_route:/api/search', reason: 'POST-heavy route, no cache opportunity' },
    ],
    signals: baseSignals,
  });
  assert.match(md, /## Needs more evidence/);
  assert.match(md, /Why it was held back/);
  assert.match(md, /Slow route on \/docs/);
  assert.match(md, /## Investigated, no change recommended/);
  assert.match(md, /Low cache-hit route on \/api\/search/);
  assert.ok(md.indexOf('Slow route on /docs') < md.indexOf('## Investigated, no change recommended'));
});

test('renderReport: NO "Investigated, no change recommended" section when no no-change findings exist', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [],
    signals: baseSignals,
  });
  assert.ok(!md.includes('## Investigated, no change recommended'));
});

test('renderReport: pipe-escapes user content inside table cells', () => {
  const rec = { ...sampleRec, what: 'before | after' };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals });
  const tableRow = md.split('\n').find((l) => l.startsWith('|') && l.includes('before'));
  assert.ok(tableRow, 'rec row should appear in a table');
  // Literal `|` must be escaped to `\|` so it doesn't break the column separator.
  assert.ok(
    tableRow.includes('before \\| after'),
    `expected escaped pipe in row, got: ${tableRow}`,
  );
});

test('renderReport: drops Usage column when every row has no real unit (CLI USD-collapse)', () => {
  // fixture-site: `vercel usage` returned pricingUnit=USD with
  // pricingQuantity==billedCost on every row. Detect + drop Usage column.
  const collapsed = {
    ...baseSignals,
    usage: {
      ...baseSignals.usage,
      services: [
        { name: 'Sandbox Provisioned Memory', billedCost: 518185.55 },
        { name: 'AI Gateway', billedCost: 207934.42 },
      ],
      totals: { billedCost: 726119.97 },
    },
  };
  const md = renderReport({ recommendations: [], gated: [], signals: collapsed, opts: { projectName: 'x' } });
  assert.ok(md.includes('| Service | Billed cost |'), 'collapsed table should be Service+Cost only');
  assert.ok(!md.includes('(unspecified)'), 'no "(unspecified)" rows should leak through');
});

test('renderReport: keeps Usage column when at least one row has a real unit', () => {
  const md = renderReport({ recommendations: [], gated: [], signals: baseSignals, opts: { projectName: 'x' } });
  assert.ok(md.includes('| Service | Usage | Billed cost |'));
});

test('renderReport: cost-header labels team-wide vs project scope', () => {
  const team = renderReport({ recommendations: [], gated: [], signals: { ...baseSignals, usageScope: 'team' }, opts: { projectName: 'x' } });
  assert.ok(team.includes('## Cost breakdown (team-wide — `vercel usage` has no per-project filter)'));
  const proj = renderReport({ recommendations: [], gated: [], signals: { ...baseSignals, usageScope: 'project' }, opts: { projectName: 'x' } });
  assert.ok(proj.includes('## Cost breakdown (this project)'));
});

test('renderReport: stack line omits plan-inference reason when plan is known', () => {
  // Pre-fix shipped "**Plan**: pro (commitments=[] but usage=...)" — debug leak.
  const md = renderReport({
    recommendations: [],
    gated: [],
    signals: {
      ...baseSignals,
      plan: { plan: 'pro', reason: "commitments=[] but usage=$2311899.01/window — Pro pay-as-you-go (Hobby teams don't bill)" },
    },
    opts: { projectName: 'x' },
  });
  assert.ok(md.includes('**Plan**: pro  ·'));
  assert.ok(!md.includes("Hobby teams don't bill"));
});

test('renderReport: synthesizes impact framing from o11ySignal when impactLabel absent', () => {
  const rec = {
    what: 'Speed up /api/x by parallelizing fetches.',
    impactTier: 'high',
    o11ySignal: 'inv=84004,p95=4609ms',
    candidateRef: 'slow_route:/api/x',
    bucket: 'performance',
    effort: 'medium',
    affectedFiles: [],
    citations: [],
    // impactLabel intentionally omitted.
  };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals, opts: { projectName: 'x' } });
  assert.ok(!md.includes('_(no impact framing recorded)_'), 'placeholder should be replaced by synthesized magnitude');
  assert.match(md, /current 95th percentile duration is 4,609ms across 84,004 function invocations in this window \(9\.2x the 500ms slow-route threshold\)/);
});

test('renderReport: synthesizes CWV impact against Google thresholds', () => {
  const rec = {
    what: 'Reduce landing page layout and interaction work.',
    impactTier: 'medium',
    o11ySignal: 'LCP=3200ms,INP=250ms,CLS=0.18',
    candidateRef: 'cwv_poor:/landing',
    bucket: 'performance',
    effort: 'medium',
    affectedFiles: ['src/app/page.tsx'],
    citations: [],
  };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals, opts: { projectName: 'x' } });
  assert.match(md, /bring LCP below 2,500ms \(current 3,200ms\), INP below 200ms \(current 250ms\), and CLS below 0\.1 \(current 0\.18\)/);
});

test('renderReport: synthesizes route-error impact toward sub-0.1% reliability', () => {
  const rec = {
    what: 'Fix failing send route.',
    impactTier: 'high',
    o11ySignal: 'errs=300,rate=1.2%',
    candidateRef: 'route_errors:/api/send',
    bucket: 'reliability',
    effort: 'medium',
    affectedFiles: ['src/app/api/send/route.ts'],
    citations: [],
  };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals, opts: { projectName: 'x' } });
  assert.match(md, /cut 5xx rate by ~92% to get below 0\.1% \(current 1\.2%, 300 errors in this window\)/);
});

test('renderReport: synthesizes route-error impact when rate is unavailable', () => {
  const rec = {
    what: 'Fix failing checkout route.',
    impactTier: 'medium',
    o11ySignal: 'errs=1250',
    candidateRef: 'route_errors:/api/checkout',
    bucket: 'reliability',
    effort: 'medium',
    affectedFiles: ['src/app/api/checkout/route.ts'],
    citations: [],
  };
  const md = renderReport({ recommendations: [rec], gated: [], signals: baseSignals, opts: { projectName: 'x' } });
  assert.match(md, /resolve 1,250 billed 5xx errors in this window/);
});

test('renderReport: Coverage line shows "investigated all N" when no skipping', () => {
  const candidates = [
    { kind: 'slow_route', route: '/a', priority: 100 },
    { kind: 'slow_route', route: '/b', priority: 50 },
  ];
  const md = renderReport({
    recommendations: [{ ...sampleRec, what: 'rec a', candidateRef: 'slow_route:/a' }],
    gated: [],
    candidates,
    signals: baseSignals,
    opts: { projectName: 'x' },
  });
  assert.match(md, /\*\*Coverage\*\*: Found \*\*2\*\* potential issues to check/);
  assert.match(md, /2 investigated/);
  assert.match(md, /1 recommendation ready/);
});

test('renderReport: Coverage line shows N of M when budget bound', () => {
  const candidates = [
    { kind: 'slow_route', route: '/a' },
    { kind: 'slow_route', route: '/b' },
    { kind: 'slow_route', route: '/c', gatedReason: 'skippedByBudget (max-candidates=2)' },
    { kind: 'slow_route', route: '/d', gatedReason: 'skippedByBudget (max-candidates=2)' },
  ];
  const md = renderReport({
    recommendations: [],
    gated: [],
    candidates,
    signals: baseSignals,
    opts: { projectName: 'x' },
  });
  assert.match(md, /\*\*Coverage\*\*: Found \*\*4\*\* potential issues to check/);
  assert.match(md, /2 investigated/);
  assert.match(md, /2 left for a larger run/);
  assert.match(md, /--max-candidates all/);
});

test('renderReport: Coverage line mentions grouped similar route variants', () => {
  const candidates = [
    { kind: 'slow_route', route: '/a' },
    { kind: 'slow_route', route: '/a.dup1', gatedReason: 'coveredBy (slow_route::/a)' },
    { kind: 'slow_route', route: '/a.dup2', gatedReason: 'coveredBy (slow_route::/a)' },
  ];
  const md = renderReport({
    recommendations: [],
    gated: [],
    candidates,
    signals: baseSignals,
    opts: { projectName: 'x' },
  });
  assert.match(md, /2 similar route variants grouped/);
});

test('renderReport: Coverage line includes no-change and held-back verification counts', () => {
  const md = renderReport({
    recommendations: [{ ...sampleRec, candidateRef: 'slow_route:/a' }],
    abstentions: [
      { candidateRef: 'slow_route:/b', reason: 'Deep-dive p95 is below threshold.' },
      { candidateRef: 'route_errors:/c', reason: 'Needs stronger evidence.' },
    ],
    gated: [],
    candidates: [
      { kind: 'slow_route', route: '/a' },
      { kind: 'slow_route', route: '/b' },
      { kind: 'route_errors', route: '/c' },
    ],
    signals: baseSignals,
    opts: { projectName: 'x', heldBackCount: 1 },
  });
  assert.match(md, /Found \*\*3\*\* potential issues to check/);
  assert.match(md, /1 recommendation ready/);
  assert.match(md, /1 need more evidence/);
  assert.match(md, /1 investigated, no change recommended/);
});

test('renderReport: Cost coverage gaps appears when uncovered services dominate', () => {
  const sig = {
    ...baseSignals,
    usage: {
      ...baseSignals.usage,
      services: [
        { name: 'Sandbox Provisioned Memory', billedCost: 500000 },
        { name: 'Function Duration', billedCost: 100000 },
      ],
      totals: { billedCost: 600000 },
    },
  };
  const md = renderReport({ recommendations: [], gated: [], signals: sig, opts: { projectName: 'x' } });
  assert.match(md, /### Coverage gaps/);
  assert.match(md, /Sandbox Provisioned Memory/);
});

test('render-report CLI: renders flat wrapper observations', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 0, observations: 1 },
    recsGraded: [],
    abstentions: [],
    observations: [{
      candidateRef: 'slow_route:/event',
      summary: 'deployment p95 rose from 256ms to 3135ms',
      evidence: 'latest deployment p95=3135ms',
      suggestedAction: 'Check the deployment diff for new awaits.',
      kind: 'regression',
    }],
  });
  assert.match(stdout, /## Observations from investigation/);
  assert.match(stdout, /deployment 95th percentile rose from 256ms to 3135ms/);
  assert.match(stdout, /latest deployment 95th percentile duration: 3135ms/);
});

test('render-report CLI: flattens nested wrapper observations', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 0, observations: 1 },
    recsGraded: [],
    abstentions: [],
    observations: [{
      candidateRef: 'route_errors:/api/send',
      observation: {
        summary: '5xx rate is concentrated on /api/send',
        evidence: 'status=500 count=1200',
        suggestedAction: 'Inspect the mail provider branch before tuning performance.',
        kind: 'error_storm',
      },
    }],
  });
  assert.match(stdout, /5xx rate is concentrated on \/api\/send/);
  assert.match(stdout, /status: 500 count: 1200/);
  assert.match(stdout, /Error Storm/);
});

test('renderReport: observation evidence expands raw metric shorthand', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    observations: [{
      candidateRef: 'slow_route:/docs',
      summary: 'Broad signal inv=10000,p95=900ms did not hold',
      evidence: 'deepDive.latency.p95=220ms',
      suggestedAction: 'Skip this candidate.',
      kind: 'metric_mismatch',
    }],
    signals: baseSignals,
  });
  assert.match(md, /function invocations: 10,000/);
  assert.match(md, /95th percentile duration: 900ms/);
  assert.match(md, /follow-up metric 95th percentile latency: 220ms/);
  assert.doesNotMatch(md, /(?:^|[,\s])inv=/);
  assert.doesNotMatch(md, /(?:^|[,\s])p95=/);
});

test('renderReport: throws when observation summary is missing', () => {
  assert.throws(
    () => renderReport({
      recommendations: [],
      gated: [],
      observations: [{ candidateRef: 'slow_route:/x', evidence: 'p95=3000ms' }],
      signals: baseSignals,
    }),
    /observations\[0\]\.summary is required/,
  );
});

test('render-report CLI: drops wrapper recs with missing quality', async () => {
  const { quality, ...ungradedRec } = sampleRec;
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 1, observations: 0 },
    recsGraded: [ungradedRec],
    abstentions: [],
    observations: [],
  });
  assert.ok(!stdout.includes(ungradedRec.what), 'ungraded wrapper rec should not ship');
  assert.match(stdout, /No recommendations are ready to apply from this run/);
});

test('render-report CLI: hard-drops cache-vary safety failures from customer recommendations', async () => {
  const unsafe = {
    ...sampleRec,
    what: 'Add s-maxage Cache-Control to /api/banner.',
    candidateRef: 'uncached_route:/api/banner',
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 1, observations: 0 },
    recsGraded: [unsafe],
    abstentions: [],
    observations: [],
    regenPlan: [{
      index: 5,
      candidateRef: 'uncached_route:/api/banner',
      regenTrigger: 'cache_vary_safety',
    }],
  });
  assert.ok(!stdout.includes(unsafe.what), 'unsafe cache rec should not ship');
  assert.match(stdout, /varies by request geography without the required Vary header/);
});

test('render-report CLI: hard-drops semantic safety failures from customer recommendations', async () => {
  const unsafe = {
    ...sampleRec,
    what: "Move notFound() out of 'use cache' to stop 500s.",
    candidateRef: 'route_errors:/docs/messages/dynamic-server-error',
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 1, observations: 0 },
    recsGraded: [unsafe],
    abstentions: [],
    observations: [],
    regenPlan: [{
      index: 0,
      candidateRef: unsafe.candidateRef,
      regenTrigger: 'semantic_safety',
    }],
  });
  assert.ok(!stdout.includes(unsafe.what), 'unsupported semantic rec should not ship');
  assert.match(stdout, /stronger framework evidence before it is safe to apply/);
});

test('render-report CLI: does not render needs-review recommendations as ready', async () => {
  const reviewOnly = {
    ...sampleRec,
    what: 'Enable a risky platform setting.',
    candidateRef: 'platform_bot_protection:<account>',
    needsReview: true,
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 1, observations: 0, withheldRecommendations: 1 },
    renderableRecommendations: [reviewOnly],
    recsGraded: [reviewOnly],
    withheldRecommendations: [{
      candidateRef: reviewOnly.candidateRef,
      what: reviewOnly.what,
      reason: 'needs_review',
    }],
    abstentions: [],
    observations: [],
  });
  assert.ok(!stdout.includes(reviewOnly.what), 'needs-review rec should not ship as ready');
  assert.match(stdout, /kept the recommendation out of the ready-to-apply list/);
});

test('render-report CLI: hard-drops stale wrapper recs that are absent from current gate output', async () => {
  const active = {
    ...sampleRec,
    what: 'Fix the active slow route.',
    candidateRef: 'slow_route:/active',
  };
  const stale = {
    ...sampleRec,
    what: 'Fix the stale slow route.',
    candidateRef: 'slow_route:/stale',
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 2, observations: 0 },
    recsGraded: [active, stale],
    abstentions: [],
    observations: [],
  }, [], {
    toLaunch: [{ kind: 'slow_route', route: '/active' }],
    platform: [],
    gated: [],
  });
  assert.match(stdout, /Fix the active slow route/);
  assert.ok(!stdout.includes('Fix the stale slow route'), 'stale rec should not ship');
  assert.match(stdout, /not in the current run output/);
});

test('render-report CLI: holds back unsupported framework-causal observations', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 0, observations: 1 },
    recsGraded: [],
    abstentions: [],
    observations: [{
      candidateRef: 'route_errors:/docs/pages',
      summary: "notFound() inside a 'use cache' page is a known Next.js Cache Components edge case that can surface as 5xx.",
      evidence: "apps/docs/page.tsx:1 declares 'use cache' and calls notFound().",
      suggestedAction: 'Move notFound() outside the cached scope.',
      kind: 'config_gap',
    }],
  });
  assert.ok(!stdout.includes('known Next.js Cache Components edge case'), 'unsupported observation should not ship');
  assert.ok(!stdout.includes('Move notFound() outside the cached scope'), 'unsupported action should not ship');
  assert.match(stdout, /framework-specific cause claim that verification could not support/);
});

test('render-report CLI: suppresses same-route same-family observations covered by a ready rec', async () => {
  const readyCacheRec = {
    ...sampleRec,
    what: 'Add Cache-Control to /docs/llm-digest success responses',
    candidateRef: 'uncached_route:/docs/llm-digest/[...slug]',
    o11ySignal: 'inv=1000,cache=44%',
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 2, observations: 2 },
    renderableRecommendations: [readyCacheRec],
    recsGraded: [readyCacheRec],
    abstentions: [],
    observations: [
      {
        candidateRef: 'cache_header_gap:/docs/llm-digest/[...slug]',
        summary: 'Cache fix is blocked on error-rate triage.',
        evidence: 'Same route and same cache family as the ready recommendation.',
        suggestedAction: 'Do not cache this route yet.',
        kind: 'error_storm',
      },
      {
        candidateRef: 'route_errors:/docs/llm-digest/[...slug]',
        summary: 'The route still has a confirmed 5xx storm.',
        evidence: 'Status distribution confirms many 500s.',
        suggestedAction: 'Pull runtime logs for the failing helper.',
        kind: 'error_storm',
      },
    ],
  });
  assert.match(stdout, /Add Cache-Control to \/docs\/llm-digest success responses/);
  assert.match(stdout, /requests: 1,000; cache hit rate: 44%/);
  assert.ok(!stdout.includes('function invocations: 1,000; cache hit rate: 44%'));
  assert.ok(!stdout.includes('Cache fix is blocked on error-rate triage'), 'same-family cache observation should not also ship');
  assert.match(stdout, /The route still has a confirmed 5xx storm/);
});

test('render-report CLI: holds back source-absence observations that need verification', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 0, observations: 1 },
    recsGraded: [],
    abstentions: [],
    observations: [{
      candidateRef: 'route_errors:/blog/llm-digest/next-16',
      summary: 'The route has no matching MDX file for next-16.',
      evidence: 'No corresponding post file exists in content/posts.',
      suggestedAction: 'Stop reading the file at request time.',
      kind: 'error_storm',
    }],
  });
  assert.ok(!stdout.includes('no matching MDX file'), 'unsupported source-absence observation should not ship');
  assert.match(stdout, /source-file absence claim that verification could not support/);
});

test('render-report CLI: holds back cacheLife-to-CDN observations and rewrites duplicate no-change rows', async () => {
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 0, observations: 1 },
    recsGraded: [],
    abstentions: [{
      candidateRef: 'uncached_route:/docs/other',
      reason: "The fix belongs in toLaunch-10; a single `cacheLife('weeks')` call covers every /docs/* slug.",
    }],
    observations: [{
      candidateRef: 'uncached_route:/docs/page',
      summary: 'This route rolls into the catch-all docs route fix tracked by toLaunch-10.',
      evidence: "page.tsx declares 'use cache' with no cacheLife(); cache breakdown is 0% HIT.",
      suggestedAction: "Treat toLaunch-10's `cacheLife('weeks')` rec as canonical for this slug.",
      kind: 'other',
    }],
  });
  assert.ok(!stdout.includes("cacheLife('weeks')"), 'unsupported cacheLife fix text should not ship');
  assert.ok(!stdout.includes('toLaunch-10'), 'internal candidate ids should not ship');
  assert.match(stdout, /unsupported cacheLife-to-CDN claim/);
  assert.match(stdout, /cache-lifetime draft that did not meet the framework evidence bar/);
});

test('render-report CLI: dedupes verified wrapper recs before rendering', async () => {
  const duplicate = {
    ...sampleRec,
    candidateRef: 'slow_route:/dashboard/[sessionId]/details',
    o11ySignal: 'inv=4000,p95=990ms',
    priority: sampleRec.priority - 10,
  };
  const { stdout } = await renderCli({
    schemaVersion: '1.0',
    summary: { totalRecs: 2, observations: 0 },
    recsGraded: [sampleRec, duplicate],
    abstentions: [],
    observations: [],
  });
  assert.match(stdout, /corroborated: 2/);
  assert.match(stdout, /Also applies to: Slow route on \/dashboard\/\[sessionId\]\/details/);
});
