import { gate as buildMachineGate } from './gates/build-machine-oversized.mjs';
import { gate as buildFanoutGate } from './gates/build-minutes-fanout.mjs';
import { impactMagnitude } from './impact-magnitude.mjs';

const SLOW_ROUTE_P95_THRESHOLD_MS = 500;
const CACHE_HIT_THRESHOLD_PCT = 50;
const COLD_START_THRESHOLD_PCT = 40;
const RELIABILITY_TARGET_PCT = 0.1;

export function computeImpactLabel(rec, signals = {}) {
  const il = rec?.impactLabel ?? {};
  if (il.performance) return il.performance;
  if (il.costPhrase) return il.costPhrase;

  if (typeof rec?.estimatedSavingsUsd === 'number' && rec.impactTier) {
    const magnitude = impactMagnitude({
      currentCost: rec.estimatedSavingsUsd,
      impactTier: rec.impactTier,
    });
    return magnitude.phrase;
  }

  return synthesizeImpactFromSignal(rec, signals);
}

export function synthesizeImpactFromSignal(rec, signals = {}) {
  const tier = rec?.impactTier;
  const sig = [
    rec?.o11ySignal,
    rec?.evidence?.o11ySignal,
    rec?.why,
    rec?.what,
    gateSignalFallback(rec, signals),
  ].filter((v) => typeof v === 'string' && v.trim()).join('\n') || null;
  if (!sig || !tier) return null;
  const m = String(sig);
  const inv = parseSigNumber(m, /inv=([\d,]+)/);
  const p95 = parseSigNumber(m, /p95=([\d,]+)ms/);
  const cachePct = parseSigNumber(m, /cache=([\d.]+)%/);
  const coldPct = parseSigNumber(m, /cold=([\d.]+)%/);
  const buildSharePct = parseSigNumber(m, /build_minutes_share=([\d.]+)%/i) ??
    parseSigNumber(m, /build(?: CPU)? minutes share:?\s*([\d.]+)%/i);
  const errors = parseSigNumber(m, /errs=([\d,]+)/);
  const errorRatePct = parseSigNumber(m, /rate=([\d.]+)%/);
  const writes = parseSigNumber(m, /writes=([\d,]+)/);
  const reads = parseSigNumber(m, /reads=([\d,]+)/);
  const cwvIssues = [
    cwvIssue('LCP', parseSigNumber(m, /LCP=([\d.]+)ms/i), 2500, 'ms'),
    cwvIssue('INP', parseSigNumber(m, /INP=([\d.]+)ms/i), 200, 'ms'),
    cwvIssue('CLS', parseSigNumber(m, /CLS=([\d.]+)/i), 0.1, ''),
  ].filter(Boolean);

  if (cwvIssues.length > 0) {
    return `${tier} impact — bring ${joinEnglish(cwvIssues.map(formatCwvIssue))}.`;
  }
  if (errors != null && errorRatePct != null) {
    const reductionPct = Math.ceil(Math.max(0, (1 - (RELIABILITY_TARGET_PCT / errorRatePct)) * 100));
    return `${tier} impact — cut 5xx rate by ~${reductionPct}% to get below ${RELIABILITY_TARGET_PCT}% (current ${errorRatePct}%, ${formatInteger(errors)} errors in this window).`;
  }
  if (errors != null) {
    return `${tier} impact — resolve ${formatInteger(errors)} billed 5xx errors in this window.`;
  }
  if (cachePct != null && inv != null) {
    if (cachePct < CACHE_HIT_THRESHOLD_PCT) {
      return `${tier} impact — current cache hit rate is ${cachePct}% across ${formatInteger(inv)} requests in this window; the gate fires below ${CACHE_HIT_THRESHOLD_PCT}%.`;
    }
    if (p95 == null) {
      return `${tier} impact — current cache hit rate is ${cachePct}% across ${formatInteger(inv)} requests in this window; this recommendation targets the remaining uncached traffic.`;
    }
  }
  if (writes != null && reads != null) {
    const ratio = reads > 0 ? writes / reads : null;
    return ratio == null
      ? `${tier} impact — ${formatInteger(writes)} ISR write units with no recorded read units in this window.`
      : `${tier} impact — ${formatInteger(writes)} ISR write units vs ${formatInteger(reads)} read units in this window (${round2(ratio)} writes per read).`;
  }
  if (p95 != null && inv != null) {
    const multiple = p95 / SLOW_ROUTE_P95_THRESHOLD_MS;
    return `${tier} impact — current 95th percentile duration is ${formatInteger(p95)}ms across ${formatInteger(inv)} function invocations in this window (${round1(multiple)}x the ${formatInteger(SLOW_ROUTE_P95_THRESHOLD_MS)}ms slow-route threshold).`;
  }
  if (coldPct != null) {
    return `${tier} impact — current cold-start share is ${coldPct}%; the gate fires above ${COLD_START_THRESHOLD_PCT}%.`;
  }
  const pinnedMachine = m.match(/machine=(enhanced|turbo)\b/i)?.[1] ?? null;
  const smallerMachine = m.match(/smaller=(standard|enhanced)\b/i)?.[1] ?? null;
  const medianBilledMin = parseSigNumber(m, /median_billed_min=([\d.]+)/);
  const breakEvenMin = parseSigNumber(m, /break_even_min=([\d]+)/);
  if (pinnedMachine && smallerMachine && medianBilledMin != null && breakEvenMin != null) {
    return `${tier} impact — builds on the pinned ${capitalizeWord(pinnedMachine)} machine bill a median ${medianBilledMin} minutes; switching to Elastic lets each build use a smaller machine when it fits (${capitalizeWord(smallerMachine)} alone costs less unless builds take longer than ${breakEvenMin} billed minutes).`;
  }
  if (rec?.candidateRef?.startsWith('build_minutes_fanout:') || rec?.kind === 'build_minutes_fanout') {
    if (buildSharePct != null && buildSharePct > 0) {
      return `${tier} impact — Build CPU Minutes account for ${buildSharePct}% of observed billed cost in this window.`;
    }
    // Fired by the repo scanner alone (usage missing or zero): don't imply a billing threshold was measured.
    const scannerFindings = parseSigNumber(m, /scanner_findings=(\d+)/);
    return scannerFindings
      ? `${tier} impact — the repo disables or bypasses the Turborepo build cache; build usage for this window wasn't available to size it.`
      : `${tier} impact — Build CPU Minutes exceeded the gate threshold in this window.`;
  }
  return `${tier} impact — see follow-up metrics for magnitude.`;
}

function cwvIssue(metric, value, threshold, unit) {
  if (value == null || value <= threshold) return null;
  return { metric, value, threshold, unit };
}

function formatCwvIssue(i) {
  const current = i.metric === 'CLS' ? round2(i.value) : Math.round(i.value);
  if (i.unit === 'ms') {
    return `${i.metric} below ${formatInteger(i.threshold)}ms (current ${formatInteger(current)}ms)`;
  }
  return `${i.metric} below ${i.threshold}${i.unit} (current ${current}${i.unit})`;
}

function joinEnglish(parts) {
  if (parts.length <= 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}`;
}

function parseSigNumber(s, re) {
  const m = re.exec(s);
  if (!m) return null;
  const n = Number(String(m[1]).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function formatInteger(n) {
  if (!Number.isFinite(n)) return String(n);
  return Math.round(n).toLocaleString('en-US');
}

function capitalizeWord(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// Account-scoped build gates are deterministic over signals.json, so when a written recommendation
// omits the gate's o11ySignal, re-derive it instead of falling back to a placeholder impact line.
const BUILD_GATES = Object.freeze({
  build_machine_oversized: { gate: buildMachineGate, has: /machine=(?:enhanced|turbo)\b/i },
  build_minutes_fanout: { gate: buildFanoutGate, has: /build_minutes_share=/i },
});

function gateSignalFallback(rec, signals) {
  const kind = rec?.kind ?? (typeof rec?.candidateRef === 'string' ? rec.candidateRef.split(':')[0] : null);
  const entry = BUILD_GATES[kind];
  if (!entry || !signals || typeof signals !== 'object') return null;
  const existing = [rec?.o11ySignal, rec?.evidence?.o11ySignal].filter((v) => typeof v === 'string').join('\n');
  if (entry.has.test(existing)) return null;
  try {
    return entry.gate(signals)?.[0]?.o11ySignal ?? null;
  } catch {
    return null;
  }
}
