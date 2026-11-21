// Build-cost signals for build-scoped gates. Platform data only, so it works without Observability Plus.
// Sources:
//   GET /v7/deployments            list deployments in the window (state, target, source, branch)
//   GET /v13/deployments/:id       duration.timeForBilling and duration.cpuTimeForBilling (ms), resourceConfig.buildMachine
//                                  ({ purchaseType, cores, memory, machineSelectionType, selectionSource }), meta.deployHookName
// meta.deployHookId is the secret last segment of the hook URL. Never read, store, or log it.
import { runVercelJson } from './vercel.mjs';

export const BUILD_WINDOW_DAYS = 14;
export const LIST_PAGE_SIZE = 100;
export const MAX_LIST_PAGES = 5;
// Detail calls are one request per deployment; cap them to stay well under the 100 req / 60s team limit.
export const MAX_DETAIL_FETCHES = 40;

export const VCPU_BY_MACHINE = Object.freeze({ basic: 2, standard: 4, enhanced: 8, turbo: 30 });

const BUILT_STATES = new Set(['READY', 'ERROR']);

export function normalizeMachineType(value) {
  if (value == null) return null;
  const raw = typeof value === 'string'
    ? value
    : (value.purchaseType ?? value.type ?? value.machineType ?? value.default ?? value.name ?? null);
  if (typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase();
  return Object.hasOwn(VCPU_BY_MACHINE, key) || key === 'elastic' ? key : null;
}

export async function collectBuildSignals({ projectId, orgId, now = Date.now(), run = runVercelJson } = {}) {
  if (!projectId) return { ok: false, code: 'NO_PROJECT' };
  const teamQs = orgId && !String(orgId).startsWith('usr_') ? `teamId=${encodeURIComponent(orgId)}` : '';
  const since = now - BUILD_WINDOW_DAYS * 86_400_000;

  const listed = [];
  let until = null;
  let truncated = false;
  for (let page = 0; page < MAX_LIST_PAGES; page += 1) {
    const qs = [
      `projectId=${encodeURIComponent(projectId)}`,
      `since=${since}`,
      `limit=${LIST_PAGE_SIZE}`,
      until ? `until=${until}` : null,
      teamQs || null,
    ].filter(Boolean).join('&');
    const r = await run(['api', `/v7/deployments?${qs}`]);
    if (!r?.ok) {
      if (page === 0) return { ok: false, code: r?.code ?? 'UNKNOWN' };
      truncated = true;
      break;
    }
    const rows = Array.isArray(r.data?.deployments) ? r.data.deployments : [];
    for (const d of rows) listed.push(normalizeListRow(d));
    const next = r.data?.pagination?.next;
    if (!next || rows.length < LIST_PAGE_SIZE) break;
    if (page === MAX_LIST_PAGES - 1) truncated = true;
    until = next;
  }

  const deployments = dedupeAndSort(listed);
  const toDetail = deployments.filter((d) => BUILT_STATES.has(d.state)).slice(0, MAX_DETAIL_FETCHES);
  let detailFailures = 0;
  for (const d of toDetail) {
    const r = await run(['api', `/v13/deployments/${encodeURIComponent(d.id)}${teamQs ? `?${teamQs}` : ''}`]);
    if (!r?.ok) {
      detailFailures += 1;
      d.detailError = r?.code ?? 'UNKNOWN';
      continue;
    }
    const duration = r.data?.duration ?? {};
    const machine = r.data?.resourceConfig?.buildMachine;
    d.timeForBillingMs = positiveNumber(duration.timeForBilling);
    d.cpuTimeForBillingMs = positiveNumber(duration.cpuTimeForBilling);
    d.buildMachine = normalizeMachineType(machine);
    d.buildCores = positiveNumber(machine?.cores);
    d.buildMemoryMb = positiveNumber(machine?.memory);
    d.machineSelection = typeof machine?.machineSelectionType === 'string' ? machine.machineSelectionType : null;
    d.buildSkipped = r.data?.buildSkipped === true;
    // Presence only: source is "git" for both pushes and hook builds, so the hook name is the reliable marker.
    d.triggeredByDeployHook = typeof r.data?.meta?.deployHookName === 'string';
  }

  return {
    ok: true,
    windowDays: BUILD_WINDOW_DAYS,
    listedCount: deployments.length,
    builtCount: deployments.filter((d) => BUILT_STATES.has(d.state)).length,
    detailedCount: toDetail.length - detailFailures,
    detailFailures,
    listTruncated: truncated,
    deployments,
  };
}

function normalizeListRow(d = {}) {
  const meta = d.meta ?? {};
  return {
    id: String(d.uid ?? d.id ?? ''),
    createdAt: Number(d.created ?? d.createdAt ?? 0) || 0,
    state: String(d.readyState ?? d.state ?? '').toUpperCase() || null,
    target: d.target ?? null,
    source: d.source ?? null,
    branch: meta.githubCommitRef ?? meta.gitlabCommitRef ?? meta.bitbucketCommitRef ?? null,
    timeForBillingMs: null,
    cpuTimeForBillingMs: null,
    buildMachine: null,
    buildCores: null,
    buildMemoryMb: null,
    machineSelection: null,
    buildSkipped: null,
    triggeredByDeployHook: null,
  };
}

// Project config is stored in signals.json verbatim. link.deployHooks[] carries each hook's id and full URL,
// which are bearer secrets, so replace them with name/ref/createdAt only.
export function redactProjectSecrets(cfg) {
  if (!cfg || typeof cfg !== 'object' || !Array.isArray(cfg.link?.deployHooks)) return cfg;
  return {
    ...cfg,
    link: {
      ...cfg.link,
      deployHooks: cfg.link.deployHooks.map((h) => ({
        name: h?.name ?? null,
        ref: h?.ref ?? null,
        createdAt: h?.createdAt ?? null,
      })),
    },
  };
}

function positiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function dedupeAndSort(rows) {
  const byId = new Map();
  for (const row of rows) if (row.id && !byId.has(row.id)) byId.set(row.id, row);
  return [...byId.values()].sort((a, b) => (b.createdAt - a.createdAt) || a.id.localeCompare(b.id));
}
