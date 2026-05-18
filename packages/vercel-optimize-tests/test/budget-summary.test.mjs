import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildBudgetSummary, renderBudgetSummaryMarkdown } from '../../../skills/vercel-optimize/lib/budget-summary.mjs';

const baseGate = (overrides = {}) => ({
  budget: { maxCandidates: 6, source: 'default' },
  toLaunch: [],
  platform: [],
  gated: [],
  ...overrides,
});

test('buildBudgetSummary: shouldAsk=false when no candidates skipped', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: [{ kind: 'slow_route', route: '/a', priority: 100, o11ySignal: 'inv=1000,p95=600ms' }],
  }));
  assert.equal(s.shouldAsk, false);
  assert.match(s.reason, /no candidates skipped by budget/);
});

test('buildBudgetSummary: shouldAsk=false when user pinned budget via flag', () => {
  const s = buildBudgetSummary(baseGate({
    budget: { maxCandidates: 12, source: 'flag' },
    toLaunch: [{ kind: 'slow_route', route: '/a', priority: 100 }],
    gated: [{ kind: 'slow_route', route: '/b', gatedReason: 'skippedByBudget (max-candidates=12)' }],
  }));
  assert.equal(s.shouldAsk, false);
  assert.match(s.reason, /pre-set budget via flag/);
});

test('buildBudgetSummary: shouldAsk=false when user pinned budget via env', () => {
  const s = buildBudgetSummary(baseGate({
    budget: { maxCandidates: 'all', source: 'env' },
    toLaunch: [{ kind: 'slow_route', route: '/a' }],
    gated: [],
  }));
  assert.equal(s.shouldAsk, false);
});

test('buildBudgetSummary: shouldAsk=true when default budget skipped candidates', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: Array.from({ length: 6 }, (_, i) => ({
      kind: 'slow_route', route: `/a${i}`, priority: 1000 - i, o11ySignal: `inv=${10000 - i * 100}`,
    })),
    gated: Array.from({ length: 4 }, (_, i) => ({
      kind: 'slow_route', route: `/b${i}`, priority: 500 - i,
      gatedReason: 'skippedByBudget (max-candidates=6; raise with --max-candidates N or =all)',
    })),
  }));
  assert.equal(s.shouldAsk, true);
  assert.equal(s.totalPassed, 10);
  assert.equal(s.skipped, 4);
  assert.equal(s.currentBudget, 6);
  assert.equal(s.topInvestigating.length, 6);
  assert.equal(s.topSkipped.length, 4);
  assert.match(s.printContract, /Print chatPreview verbatim/);
  assert.equal(s.exactChatMessage.body, s.chatPreview);
  assert.equal(s.exactChatMessage.lineCount, s.chatPreview.split('\n').length);
  assert.equal(
    s.exactChatMessage.sha256,
    createHash('sha256').update(s.chatPreview).digest('hex'),
  );
  assert.equal(s.printCheck.bodyField, 'exactChatMessage.body');
  assert.equal(s.printCheck.requiredSkippedRows, 4);
  assert.equal(s.printCheck.requiredSkippedHeading, 'Only checked if you expand this run (4):');
  assert.match(s.printCheck.forbiddenSummaryPatterns.join('\n'), /more/);
  assert.equal(s.questionPayload.questions[0].question, s.questionText);
  assert.equal(s.questionPayload.questions[0].header, 'Audit scope');
  assert.equal(s.questionPayload.questions[0].options[0].label, 'Check 6 (default)');
  assert.ok(s.options.find((o) => o.recommended)?.label.includes('default'));
});

test('buildBudgetSummary: coveredBy entries do NOT count as skipped', () => {
  // coveredBy entries aren't reachable by raising the budget — already
  // covered by their canonical sibling.
  const s = buildBudgetSummary(baseGate({
    toLaunch: [{ kind: 'slow_route', route: '/a' }],
    gated: [
      { kind: 'slow_route', route: '/a.dup', gatedReason: 'coveredBy (slow_route::/a) — duplicate' },
      { kind: 'slow_route', route: '/b', gatedReason: 'skippedByBudget (...)' },
    ],
  }));
  assert.equal(s.skipped, 1, 'only the real budget skip counts');
  assert.equal(s.shouldAsk, true);
});

test('renderBudgetSummaryMarkdown: produces a "no question" block when shouldAsk=false', () => {
  const s = buildBudgetSummary(baseGate());
  const md = renderBudgetSummaryMarkdown(s);
  assert.match(md, /No question needed/i);
});

test('renderBudgetSummaryMarkdown: lists investigating + skipped + options', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: [
      { kind: 'slow_route', route: '/a', priority: 100, o11ySignal: 'inv=10000,p95=900ms' },
    ],
    gated: [
      { kind: 'uncached_route', route: '/b', priority: 50, o11ySignal: 'inv=5000,cache=0%', gatedReason: 'skippedByBudget (...)' },
    ],
  }));
  const md = renderBudgetSummaryMarkdown(s);
  assert.match(md, /Checking now/);
  assert.match(md, /Found \d+ potential issue/);
  assert.match(md, /Only checked if you expand this run \(1\)/);
  assert.match(md, /Slow route on \/a - function invocations: 10,000; 95th percentile duration: 900ms/);
  assert.match(md, /Low cache-hit route on \/b - requests: 5,000; cache hit rate: 0%/);
  assert.match(md, /Options/);
  assert.match(md, /recommended/);
  assert.match(md, /Question:/);
});

test('buildBudgetSummary: chatPreview uses friendly kind labels so duplicate routes disambiguate', () => {
  // Regression: fixture-site /event/[code]/[location]/register fired on both
  // uncached_route (toLaunch) and slow_route (gated). Without kind annotation
  // the user can't tell the two list entries apart.
  const s = buildBudgetSummary(baseGate({
    toLaunch: [
      { kind: 'uncached_route', route: '/event/[code]/[location]/register', priority: 200, o11ySignal: 'inv=118267,cache=0%' },
    ],
    gated: [
      { kind: 'slow_route', route: '/event/[code]/[location]/register', priority: 100, o11ySignal: 'inv=118267,p95=735ms', gatedReason: 'skippedByBudget (...)' },
    ],
  }));
  assert.match(s.chatPreview, /Low cache-hit route on \/event\/\[code\]\/\[location\]\/register/);
  assert.match(s.chatPreview, /Slow route on \/event\/\[code\]\/\[location\]\/register/);
});

test('buildBudgetSummary: uses displayRoute for encoded metric placeholders', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: [
      {
        kind: 'isr_overrevalidation',
        route: '/event/[*]/london',
        displayRoute: '/event/[code]/[location]',
        priority: 200,
        o11ySignal: 'writes=32777,reads=56829,w/r=0.58',
      },
    ],
    gated: [
      { kind: 'slow_route', route: '/event/[code]', priority: 100, gatedReason: 'skippedByBudget (...)' },
    ],
  }));
  assert.match(s.chatPreview, /ISR over-revalidation on \/event\/\[code\]\/\[location\]/);
  assert.doesNotMatch(s.chatPreview, /\/event\/\[\*\]\/london/);
});

test('buildBudgetSummary: questionText is one short sentence', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: Array.from({ length: 6 }, (_, i) => ({ kind: 'slow_route', route: `/a${i}`, priority: 100 - i })),
    gated: Array.from({ length: 4 }, (_, i) => ({ kind: 'slow_route', route: `/b${i}`, gatedReason: 'skippedByBudget (...)', priority: 10 - i })),
  }));
  assert.equal(s.questionText, 'How many potential issues should I check in this run?');
  // Must fit cleanly into a single question field.
  assert.ok(!s.questionText.includes('\n'));
});

test('buildBudgetSummary: chatPreview is empty-message style when shouldAsk=false', () => {
  const s = buildBudgetSummary(baseGate());
  assert.match(s.chatPreview, /no question/i);
  assert.equal(s.questionText, '');
});

test('buildBudgetSummary: budget preview avoids internal shorthand while raw candidates stay unchanged', () => {
  const rawToLaunch = { kind: 'slow_route', route: '/a', priority: 100, o11ySignal: 'inv=10000,p95=900ms,5xx=2%' };
  const rawSkipped = { kind: 'isr_overrevalidation', route: '/blog/[slug]', priority: 50, o11ySignal: 'writes=50,reads=100,w/r=0.50', gatedReason: 'skippedByBudget (...)' };
  const s = buildBudgetSummary(baseGate({
    toLaunch: [rawToLaunch],
    gated: [rawSkipped],
  }));

  assert.equal(s.topInvestigating[0].o11ySignal, rawToLaunch.o11ySignal);
  assert.equal(s.topSkipped[0].o11ySignal, rawSkipped.o11ySignal);
  assert.match(s.chatPreview, /function invocations: 10,000/);
  assert.match(s.chatPreview, /95th percentile duration: 900ms/);
  assert.match(s.chatPreview, /5xx error rate: 2%/);
  assert.match(s.chatPreview, /ISR writes per read: 0.50/);
  assert.doesNotMatch(s.chatPreview, /(?:^|[,\s])inv=/);
  assert.doesNotMatch(s.chatPreview, /(?:^|[,\s])p95=/);
  assert.doesNotMatch(s.chatPreview, /inv\s*[x×]\s*p95/i);
  assert.doesNotMatch(s.chatPreview, /top \d+ by priority/i);
  assert.doesNotMatch(s.chatPreview, /high-priority candidates/i);
  assert.doesNotMatch(s.chatPreview, /sub-agent invocations/i);
  assert.doesNotMatch(s.chatPreview, /budget checkpoint/i);
  assert.doesNotMatch(s.chatPreview, /first-pass signals/i);
  assert.doesNotMatch(s.chatPreview, /follow-up metrics/i);
  assert.doesNotMatch(s.chatPreview, /investigation threshold/i);
  assert.doesNotMatch(JSON.stringify(s.questionPayload), /budget checkpoint|follow-up metrics|investigation threshold|candidate/i);
  assert.doesNotMatch(s.chatPreview, /\d+-\d+×/);
  assert.doesNotMatch(s.options.map((o) => o.rationale).join('\n'), /\d+-\d+×/);
  assert.match(s.chatPreview, /Found 2 potential issues worth checking/);
  assert.match(s.chatPreview, /More checks take longer\./);
  assert.doesNotMatch(s.chatPreview, /Vercel metrics found|no code change recommended/i);
  assert.match(s.options[0].label, /default/);
  assert.match(s.options[0].rationale, /fastest first pass/);
  assert.match(s.options[1].rationale, /most complete/);
});

test('buildBudgetSummary: chatPreview renders every budget-skipped candidate', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: Array.from({ length: 6 }, (_, i) => ({ kind: 'slow_route', route: `/a${i}`, priority: 100 - i })),
    gated: Array.from({ length: 12 }, (_, i) => ({
      kind: 'slow_route',
      route: `/skipped-${i}`,
      priority: 50 - i,
      gatedReason: 'skippedByBudget (...)',
      o11ySignal: `inv=${1000 + i}`,
    })),
  }));
  assert.match(s.chatPreview, /Only checked if you expand this run \(12\):/);
  assert.match(s.chatPreview, /12\. Slow route on \/skipped-11 - function invocations: 1,011/);
  assert.doesNotMatch(s.chatPreview, /more in gated list/);
});

test('buildBudgetSummary: default preview shows all launched candidates when the default is small', () => {
  const s = buildBudgetSummary(baseGate({
    toLaunch: Array.from({ length: 6 }, (_, i) => ({ kind: 'slow_route', route: `/launched-${i}`, priority: 100 - i })),
    gated: [{
      kind: 'slow_route',
      route: '/skipped',
      priority: 1,
      gatedReason: 'skippedByBudget (...)',
    }],
  }));
  assert.match(s.chatPreview, /Checking now:/);
  assert.match(s.chatPreview, /6\. Slow route on \/launched-5/);
  assert.doesNotMatch(s.chatPreview, /5 shown|top 5 shown/i);
});
