import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/build-machine-oversized.mjs';
import { gates } from '../../../skills/vercel-optimize/lib/gates/index.mjs';
import { validateCandidates } from '../../../skills/vercel-optimize/lib/gates/contract.mjs';
import { synthesizeImpactFromSignal } from '../../../skills/vercel-optimize/lib/impact-label.mjs';

const MIN = 60_000;

function builds(count, { billedMinutes = 3, machine = null, state = 'READY', skipped = false } = {}) {
  return Array.from({ length: count }, (_, i) => ({
    id: `dpl_${String(i).padStart(3, '0')}`,
    createdAt: 1_700_000_000_000 - i * 1000,
    state,
    target: i % 2 ? 'production' : null,
    source: 'git',
    branch: 'main',
    timeForBillingMs: billedMinutes * MIN,
    buildMachine: machine,
    buildSkipped: skipped,
  }));
}

function signals({ machine = 'turbo', selection = 'fixed', deployments = builds(10), plan = 'pro', project } = {}) {
  return {
    plan: { plan },
    project: project ?? { id: 'prj_test', resourceConfig: { buildMachineType: machine, buildMachineSelection: selection } },
    builds: { ok: true, windowDays: 14, deployments },
  };
}

test('build_machine_oversized: metadata sane and registered', () => {
  assert.equal(metadata.id, 'build_machine_oversized');
  assert.equal(metadata.scope, 'account');
  assert.equal(metadata.billingDimension, 'build');
  assert.ok(gates.some((g) => g.metadata.id === 'build_machine_oversized'));
});

test('build_machine_oversized: fires for fixed Turbo with break-even on Enhanced', () => {
  const out = gate(signals());
  assert.equal(out.length, 1);
  const [c] = out;
  assert.equal(c.kind, 'build_machine_oversized');
  assert.equal(c.scope, 'account');
  assert.equal(c.evidence.smallerMachine, 'enhanced');
  assert.equal(c.evidence.medianBilledMinutes, 3);
  // 3 billed minutes x 30 vCPUs / 8 vCPUs = 11.25 -> 11 whole minutes
  assert.equal(c.evidence.breakEvenBilledMinutesOnSmaller, 11);
  assert.equal(c.evidence.windowCpuMinutesEstimate, 900);
  assert.equal(c.priority, 45);
  assert.equal(c.confidence, 0.8);
  assert.match(c.o11ySignal, /machine=turbo builds=10 median_billed_min=3 fix=elastic smaller=enhanced break_even_min=11/);
  assert.equal(c.evidence.cpuMinutesSource, 'billed_x_vcpu');
  assert.doesNotThrow(() => validateCandidates(out));
});

test('build_machine_oversized: Enhanced compares against Standard with a 2x ratio', () => {
  const [c] = gate(signals({ machine: 'enhanced', deployments: builds(20, { billedMinutes: 3 }) }));
  assert.equal(c.evidence.smallerMachine, 'standard');
  assert.equal(c.evidence.vcpuRatio, 2);
  assert.equal(c.evidence.breakEvenBilledMinutesOnSmaller, 6);
  assert.equal(c.confidence, 0.55);
  assert.equal(c.evidence.smallerMachineMemoryGb, 8);
});

test('build_machine_oversized: scales the estimate to all built deployments when detail is sampled', () => {
  const sampled = builds(10);
  const listedOnly = builds(40).map((d, i) => ({ ...d, id: `dpl_l${i}`, timeForBillingMs: null }));
  const [c] = gate(signals({ deployments: [...sampled, ...listedOnly] }));
  assert.equal(c.evidence.builtCount, 50);
  assert.equal(c.evidence.sampledBuilds, 10);
  assert.equal(c.evidence.windowCpuMinutesEstimate, 4500);
  assert.equal(c.evidence.detailSampleTruncated, true);
});

test('build_machine_oversized: raises priority at high CPU-minute volume', () => {
  const [c] = gate(signals({ deployments: builds(60, { billedMinutes: 3 }) }));
  assert.equal(c.evidence.windowCpuMinutesEstimate, 5400);
  assert.equal(c.priority, 60);
});

test('build_machine_oversized: lowers confidence when selection mode is unknown', () => {
  const [c] = gate(signals({ project: { id: 'prj_test', resourceConfig: { buildMachineType: 'turbo' } } }));
  assert.equal(c.evidence.machineSelection, null);
  assert.equal(c.confidence, 0.7);
});

test('build_machine_oversized: mentions contract machines on Enterprise', () => {
  const [c] = gate(signals({ plan: 'enterprise' }));
  assert.match(c.question, /contract/);
  const [pro] = gate(signals({ plan: 'pro' }));
  assert.doesNotMatch(pro.question, /contract/);
});

test('build_machine_oversized: ignores skipped builds and builds on another machine', () => {
  const deployments = [
    ...builds(4),
    ...builds(5, { skipped: true }).map((d, i) => ({ ...d, id: `dpl_s${i}` })),
    ...builds(5, { machine: 'enhanced' }).map((d, i) => ({ ...d, id: `dpl_e${i}` })),
  ];
  assert.deepEqual(gate(signals({ deployments })), []);
});

test('build_machine_oversized: excludes skipped and other-machine builds from the build count', () => {
  const deployments = [
    ...builds(6),
    ...builds(5, { skipped: true }).map((d, i) => ({ ...d, id: `dpl_s${i}` })),
    ...builds(5, { machine: 'enhanced' }).map((d, i) => ({ ...d, id: `dpl_e${i}` })),
  ];
  const [c] = gate(signals({ deployments }));
  assert.equal(c.evidence.builtCount, 6);
  // 3 billed minutes x 30 vCPUs x 6 builds
  assert.equal(c.evidence.windowCpuMinutesEstimate, 540);
});

test('build_machine_oversized: leaves failed builds out of the median but counts them', () => {
  const deployments = [
    ...builds(5, { billedMinutes: 3 }),
    ...builds(4, { billedMinutes: 1, state: 'ERROR' }).map((d, i) => ({ ...d, id: `dpl_x${i}` })),
  ];
  const [c] = gate(signals({ deployments }));
  assert.equal(c.evidence.medianBilledMinutes, 3);
  assert.equal(c.evidence.breakEvenBilledMinutesOnSmaller, 11);
  assert.equal(c.evidence.builtCount, 9);
  assert.equal(c.evidence.erroredBuildsExcludedFromMedian, 4);
});

test('build_machine_oversized: needs 5 successful builds, not 5 builds of any state', () => {
  const deployments = [
    ...builds(4),
    ...builds(6, { state: 'ERROR' }).map((d, i) => ({ ...d, id: `dpl_x${i}` })),
  ];
  assert.deepEqual(gate(signals({ deployments })), []);
});

test('build_machine_oversized: silent when Elastic recorded a memory resize reason', () => {
  for (const reason of ['oom-failure', 'high-peak-memory']) {
    const project = { id: 'prj_test', resourceConfig: { buildMachineType: 'enhanced', buildMachineSelection: 'fixed', buildMachineElasticReason: reason } };
    assert.deepEqual(gate(signals({ project, deployments: builds(40) })), [], reason);
  }
});

test('build_machine_oversized: steers toward Elastic because peak memory is not collected', () => {
  const [c] = gate(signals({ machine: 'enhanced', deployments: builds(20) }));
  assert.match(c.question, /recommend Elastic, not a fixed smaller machine/);
  assert.match(c.question, /Standard has 8 GB/);
  assert.equal(c.evidence.recommendedFix, 'elastic');
  assert.match(c.reason, /switch to Elastic/);
  assert.equal(c.evidence.peakMemoryCollected, false);
});

test('build_machine_oversized: uses cpuTimeForBilling when every sampled build has it', () => {
  const deployments = builds(10, { billedMinutes: 2, machine: 'turbo' }).map((d) => ({ ...d, cpuTimeForBillingMs: 60 * MIN }));
  const [c] = gate(signals({ deployments }));
  assert.equal(c.evidence.cpuMinutesSource, 'cpuTimeForBilling');
  assert.equal(c.evidence.medianCpuMinutes, 60);
  assert.equal(c.evidence.windowCpuMinutesEstimate, 600);
});

test('build_machine_oversized: excludes builds Elastic sized after a switch, and counts hook builds', () => {
  const pinned = builds(6, { machine: 'turbo' }).map((d, i) => ({ ...d, machineSelection: 'fixed', triggeredByDeployHook: i < 2 }));
  const elasticEra = builds(5, { machine: 'turbo' }).map((d, i) => ({ ...d, id: `dpl_el${i}`, machineSelection: 'elastic' }));
  const [c] = gate(signals({ deployments: [...pinned, ...elasticEra] }));
  assert.equal(c.evidence.builtCount, 6);
  assert.equal(c.evidence.hookTriggeredBuilds, 2);
});

test('build_machine_oversized: silent for Elastic, Standard, and Basic', () => {
  assert.deepEqual(gate(signals({ selection: 'elastic' })), []);
  assert.deepEqual(gate(signals({ machine: 'standard' })), []);
  assert.deepEqual(gate(signals({ machine: 'basic' })), []);
});

test('build_machine_oversized: silent without project config or build signals', () => {
  assert.deepEqual(gate({}), []);
  assert.deepEqual(gate(signals({ project: { error: 'forbidden' } })), []);
  assert.deepEqual(gate({ ...signals(), builds: { ok: false, code: 'FORBIDDEN' } }), []);
  assert.deepEqual(gate({ ...signals(), builds: undefined }), []);
});

test('build_machine_oversized: silent below the sample and volume floors', () => {
  assert.deepEqual(gate(signals({ deployments: builds(4) })), []);
  // 5 builds x 1 billed minute x 8 vCPUs = 40 CPU minutes, under the 300 floor
  assert.deepEqual(gate(signals({ machine: 'enhanced', deployments: builds(5, { billedMinutes: 1 }) })), []);
});

test('build_machine_oversized: deterministic', () => {
  const s = signals();
  assert.deepEqual(gate(s), gate(s));
});

test('build_machine_oversized: impact label states break-even, not savings', () => {
  const [c] = gate(signals());
  const label = synthesizeImpactFromSignal({ kind: c.kind, o11ySignal: c.o11ySignal, impactTier: 'High' });
  assert.equal(
    label,
    'High impact — builds on the pinned Turbo machine bill a median 3 minutes; switching to Elastic lets each build use a smaller machine when it fits (Enhanced alone costs less unless builds take longer than 11 billed minutes).',
  );
  assert.doesNotMatch(label, /\$|sav/i);
});
