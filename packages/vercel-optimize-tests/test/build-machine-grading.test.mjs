// Regression: end-to-end run on the build fixture held back the build_machine_oversized rec at
// quality 0.17 because its `build_machine_oversized:<account>` candidateRef was graded as route scope
// (expecting file:line). Account-sentinel refs must be graded on the account rubric.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeRecommendation, applyQualityFloor } from '../../../skills/vercel-optimize/lib/grade-recommendation.mjs';

const machineRec = {
  what: 'Switch web from a fixed Turbo build machine to Elastic.',
  why: 'web is pinned to Turbo (30 vCPUs). Its 9 builds in the last 14 days bill a median 2 billed minutes, about 60 CPU minutes each. Enhanced alone costs less unless builds take longer than 7 billed minutes.',
  fix: 'Set the build machine to Elastic under Settings → Build and Deployment → Build Machines.',
  verify: 'Compare CPU minutes per deployment over the next 5 builds.',
  bucket: 'cost',
  effort: 'low',
  affectedFiles: [],
  candidateRef: 'build_machine_oversized:<account>',
  o11ySignal: 'machine=turbo builds=9 median_billed_min=2 fix=elastic smaller=enhanced break_even_min=7',
  citations: ['https://vercel.com/docs/builds/managing-builds', 'https://vercel.com/docs/pricing#builds'],
};

test('grading: build_machine_oversized rec with an <account> ref clears the quality floor', () => {
  const q = gradeRecommendation(machineRec);
  assert.equal(q.scope, 'account');
  assert.ok(q.overall >= 0.55, `expected >= 0.55, got ${q.overall} (${JSON.stringify(q)})`);
  const { kept, dropped } = applyQualityFloor([{ ...machineRec, quality: q }]);
  assert.equal(kept.length, 1);
  assert.equal(dropped.length, 0);
});

test('grading: a vague <account> rec still falls below the floor', () => {
  const q = gradeRecommendation({ ...machineRec, why: 'It is expensive.', fix: 'Use Elastic.', verify: undefined, citations: [], o11ySignal: undefined });
  assert.ok(q.overall < 0.55, `vague rec should stay below the floor (got ${q.overall})`);
});

test('grading: an <account> rec with file:line evidence keeps its route-scope score when that is higher', () => {
  const fanoutRec = {
    what: 'Turn the Turborepo build cache back on for web.',
    why: 'Builds are 100% of the bill and turbo.json:8 sets "cache": false on the build task.',
    fix: 'Remove `"cache": false` from tasks.build in turbo.json:8 and enable skip-unaffected projects.',
    bucket: 'cost',
    affectedFiles: ['turbo.json'],
    candidateRef: 'build_minutes_fanout:<account>',
    o11ySignal: 'build_minutes_share=100% scanner_findings=1',
    citations: ['https://vercel.com/docs/builds'],
  };
  const both = gradeRecommendation(fanoutRec);
  const routeOnly = gradeRecommendation({ ...fanoutRec, candidateRef: 'build_minutes_fanout:turbo.json' });
  assert.ok(both.overall >= routeOnly.overall, `sentinel grading must not lower the score (${both.overall} < ${routeOnly.overall})`);
});

test('grading: build units count as evidence', () => {
  const withUnits = gradeRecommendation(machineRec);
  const withoutUnits = gradeRecommendation({ ...machineRec, why: 'web is pinned to Turbo and builds are short.' });
  assert.ok(withUnits.evidence > withoutUnits.evidence);
});

import { synthesizeImpactFromSignal } from '../../../skills/vercel-optimize/lib/impact-label.mjs';

test('impact label: scanner-only fanout does not claim a billing threshold', () => {
  const scannerOnly = synthesizeImpactFromSignal({ kind: 'build_minutes_fanout', candidateRef: 'build_minutes_fanout:<account>', o11ySignal: 'build_minutes_share=0% scanner_findings=1', impactTier: 'High' });
  assert.match(scannerOnly, /bypasses the Turborepo build cache/);
  assert.doesNotMatch(scannerOnly, /exceeded the gate threshold/);
  const measured = synthesizeImpactFromSignal({ kind: 'build_minutes_fanout', candidateRef: 'build_minutes_fanout:<account>', o11ySignal: 'build_minutes_share=100% scanner_findings=1', impactTier: 'High' });
  assert.match(measured, /100% of observed billed cost/);
});

test('impact label: re-derives build gate signals when the written rec omits o11ySignal', () => {
  const MIN = 60_000;
  const signals = {
    plan: { plan: 'enterprise' },
    project: { id: 'prj_1', resourceConfig: { buildMachineType: 'turbo', buildMachineSelection: 'fixed' } },
    builds: { ok: true, windowDays: 14, deployments: Array.from({ length: 9 }, (_, i) => ({ id: `d${i}`, createdAt: i, state: 'READY', timeForBillingMs: 2 * MIN, cpuTimeForBillingMs: 60 * MIN, buildMachine: 'turbo', machineSelection: 'fixed', buildSkipped: false })) },
    usage: { services: [{ name: 'Build CPU Minutes', billedCost: 9.99 }, { name: 'Fast Data Transfer', billedCost: 0.01 }] },
    codebase: { findings: [] },
  };
  const machine = synthesizeImpactFromSignal({ candidateRef: 'build_machine_oversized:<account>', impactTier: 'High', why: 'Switch to Elastic.' }, signals);
  assert.match(machine, /pinned Turbo machine bill a median 2 minutes/);
  assert.match(machine, /longer than 7 billed minutes/);
  const fanout = synthesizeImpactFromSignal({ candidateRef: 'build_minutes_fanout:<account>', impactTier: 'High', why: 'Re-enable caching.' }, signals);
  assert.match(fanout, /100% of observed billed cost/);
  // An explicit o11ySignal still wins over the fallback.
  const explicit = synthesizeImpactFromSignal({ candidateRef: 'build_machine_oversized:<account>', impactTier: 'High', o11ySignal: 'machine=enhanced builds=9 median_billed_min=3 fix=elastic smaller=standard break_even_min=6' }, signals);
  assert.match(explicit, /pinned Enhanced machine bill a median 3 minutes/);
});
