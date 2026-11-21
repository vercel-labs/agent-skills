// A project pinned to Enhanced or Turbo pays for every vCPU on every billed build minute.
// A smaller machine is cheaper unless the same build gets slower by more than the vCPU ratio,
// so the gate reports a break-even duration instead of a savings figure.
// Peak memory is not collected, so the headline fix is Elastic, which resizes after out-of-memory failures and
// after consistently short builds. The break-even is supporting context, not the recommendation.
// Account-scoped: the lever is the project's build machine setting, not code.
import { VCPU_BY_MACHINE, normalizeMachineType } from '../build-signals.mjs';

export const metadata = {
  id: 'build_machine_oversized',
  threshold: 'fixed build machine is enhanced or turbo AND >= 5 successful billed builds sampled AND estimated window CPU minutes >= 300 AND no memory-related Elastic resize reason',
  billingDimension: 'build',
  scope: 'account',
  sourceCitation: 'vercel-optimize gate threshold',
  description:
    'Project is pinned to a larger build machine. Build CPU Minutes are billed duration times vCPUs, so the recommended fix is Elastic, which sizes each build. The gate reports the break-even billed duration on the next smaller machine as context.',
};

const NEXT_SMALLER = Object.freeze({ turbo: 'enhanced', enhanced: 'standard' });
const MIN_SAMPLED_BUILDS = 5;
const MIN_WINDOW_CPU_MINUTES = 300;
const HIGH_PRIORITY_CPU_MINUTES = 5000;
const BUILT_STATES = new Set(['READY', 'ERROR']);
const MEMORY_REASONS = new Set(['oom-failure', 'high-peak-memory']);
// Standard has 8 GB, half of Enhanced; memory-bound builds fail there, so that step carries less certainty.
const SMALLER_MEMORY_GB = Object.freeze({ enhanced: 16, standard: 8 });

export function gate(signals) {
  // Without project config we can't tell which machine is pinned; recommending a change blind erodes trust.
  const project = signals?.project;
  if (!project || project.error) return [];

  const rc = project.resourceConfig ?? {};
  const selection = typeof rc.buildMachineSelection === 'string' ? rc.buildMachineSelection : null;
  if (selection === 'elastic') return [];

  const machine = normalizeMachineType(rc.buildMachineType);
  const smaller = NEXT_SMALLER[machine];
  if (!smaller) return [];

  const builds = signals?.builds;
  if (!builds?.ok || !Array.isArray(builds.deployments)) return [];

  // Eligible = built on the pinned machine (or machine unknown) and not skipped.
  // The median uses successful builds only: early failures bill a short minimum and would drag the break-even down.
  const eligible = builds.deployments.filter((d) =>
    BUILT_STATES.has(d?.state)
    && d.buildSkipped !== true
    && d.machineSelection !== 'elastic'
    && (d.buildMachine == null || d.buildMachine === machine));
  const billed = eligible.filter((d) => Number.isFinite(d?.timeForBillingMs) && d.timeForBillingMs > 0);
  const sampled = billed.filter((d) => d.state === 'READY');
  if (sampled.length < MIN_SAMPLED_BUILDS) return [];

  // Elastic records why it resized a project. Memory reasons mean a smaller fixed machine is the wrong advice.
  const elasticReason = typeof rc.buildMachineElasticReason === 'string' ? rc.buildMachineElasticReason : null;
  if (MEMORY_REASONS.has(elasticReason)) return [];

  const builtCount = eligible.length;
  const erroredSampled = billed.filter((d) => d.state === 'ERROR').length;
  const medianBilledMinutes = median(sampled.map((d) => d.timeForBillingMs / 60_000));
  const vcpu = VCPU_BY_MACHINE[machine];
  const smallerVcpu = VCPU_BY_MACHINE[smaller];
  // Prefer Vercel's own CPU-minute figure when every sampled build has it; fall back to billed minutes x vCPUs.
  const cpuSource = sampled.every((d) => Number.isFinite(d.cpuTimeForBillingMs)) ? 'cpuTimeForBilling' : 'billed_x_vcpu';
  const medianCpuMinutes = cpuSource === 'cpuTimeForBilling'
    ? median(sampled.map((d) => d.cpuTimeForBillingMs / 60_000))
    : medianBilledMinutes * vcpu;
  const windowCpuMinutesEstimate = Math.round(medianCpuMinutes * builtCount);
  const hookTriggeredBuilds = eligible.filter((d) => d.triggeredByDeployHook === true).length;
  if (windowCpuMinutesEstimate < MIN_WINDOW_CPU_MINUTES) return [];

  // Billed minutes are whole minutes, so the break-even on the smaller machine is floored.
  const breakEvenBilledMinutes = Math.floor((medianBilledMinutes * vcpu) / smallerVcpu);
  const isEnterprise = signals?.plan?.plan === 'enterprise';

  return [{
    kind: metadata.id,
    scope: 'account',
    files: [],
    priority: windowCpuMinutesEstimate >= HIGH_PRIORITY_CPU_MINUTES ? 60 : 45,
    confidence: confidenceFor(machine, selection),
    o11ySignal: `machine=${machine} builds=${builtCount} median_billed_min=${round1(medianBilledMinutes)} fix=elastic smaller=${smaller} break_even_min=${breakEvenBilledMinutes}`,
    reason: `Project is pinned to ${capitalize(machine)} (${vcpu} vCPUs) with a median ${round1(medianBilledMinutes)} billed minutes per build; switch to Elastic`,
    question: [
      `Builds bill a median ${round1(medianBilledMinutes)} minutes on ${capitalize(machine)}. Would Elastic, which sizes each build, cover this project?`,
      `For context, ${capitalize(smaller)} alone costs less unless the same builds take longer than ${breakEvenBilledMinutes} billed minutes there.`,
      `Peak build memory is not collected, and ${capitalize(smaller)} has ${SMALLER_MEMORY_GB[smaller]} GB. Elastic moves a project to a larger machine after an out-of-memory failure, so recommend Elastic, not a fixed smaller machine.`,
      'After switching, expect a few builds at the old size while Elastic adjusts.',
      isEnterprise ? 'On Enterprise, confirm the machine is not set by contract; contract machines change through the account manager.' : null,
    ].filter(Boolean).join(' '),
    evidence: {
      metric: 'builds.deployments',
      machineType: machine,
      machineSelection: selection,
      smallerMachine: smaller,
      vcpu,
      smallerVcpu,
      vcpuRatio: round2(vcpu / smallerVcpu),
      builtCount,
      sampledBuilds: sampled.length,
      erroredBuildsExcludedFromMedian: erroredSampled,
      smallerMachineMemoryGb: SMALLER_MEMORY_GB[smaller],
      peakMemoryCollected: false,
      medianBilledMinutes: round1(medianBilledMinutes),
      medianCpuMinutes: round1(medianCpuMinutes),
      cpuMinutesSource: cpuSource,
      hookTriggeredBuilds,
      recommendedFix: 'elastic',
      windowCpuMinutesEstimate,
      breakEvenBilledMinutesOnSmaller: breakEvenBilledMinutes,
      detailSampleTruncated: billed.length < builtCount,
      windowDays: builds.windowDays ?? null,
    },
  }];
}

function confidenceFor(machine, selection) {
  // Turbo -> Enhanced keeps 16 GB and a 3.75x vCPU ratio; Enhanced -> Standard halves memory to 8 GB.
  const base = machine === 'turbo' ? 0.8 : 0.55;
  return selection === 'fixed' ? base : round2(base - 0.1);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function round1(n) { return Math.round(n * 10) / 10; }
function round2(n) { return Math.round(n * 100) / 100; }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
