#!/usr/bin/env node
// Runs AFTER gate-investigations.mjs and BEFORE any sub-agent reads source.
// Attaches per-candidate evidence.deepDive to gate.toLaunch + gate.platform.
// Byte-stable apart from totalWallMs; each CLI query is isolated.

import { readFile } from 'node:fs/promises';
import { queryMetric, readProjectJson } from '../lib/vercel.mjs';
import { specsForCandidate, mergeIntoEvidence, SCANNER_KINDS, TIME_WINDOW } from '../lib/deep-dive.mjs';

const SCHEMA_VERSION = '1.0';
const log = (...a) => console.error('[deep-dive]', ...a);

async function main() {
  // --cwd is load-bearing: the Vercel CLI resolves project/team from cwd's
  // .vercel/project.json. Outside the project, metric queries silently hit the
  // wrong team and look like "no traffic". We hard-fail on mismatch below.
  const positional = [];
  let explicitCwd = null;
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a === '--cwd' && i + 1 < process.argv.length) {
      explicitCwd = process.argv[++i];
    } else if (a.startsWith('--cwd=')) {
      explicitCwd = a.slice('--cwd='.length);
    } else {
      positional.push(a);
    }
  }
  const mergedPath = positional[0];
  const gatePath = positional[1];
  if (!mergedPath || !gatePath) {
    console.error('usage: node scripts/deep-dive.mjs <merged.json> <gate.json> [--cwd <project-dir>]');
    process.exit(1);
  }

  const [merged, gate] = await Promise.all([
    readFile(mergedPath, 'utf-8').then(JSON.parse),
    readFile(gatePath, 'utf-8').then(JSON.parse),
  ]);

  if (explicitCwd) {
    process.chdir(explicitCwd);
    log(`cwd: ${process.cwd()} (via --cwd)`);
  }

  const link = await readProjectJson(process.cwd());
  if (!link) {
    console.error(`[deep-dive] FATAL: cwd ${process.cwd()} has no .vercel/project.json or .vercel/repo.json.`);
    console.error('         Re-run with --cwd <project-dir> pointing at the linked project, or cd into it first.');
    console.error('         (The Vercel CLI resolves team/project from cwd; without a .vercel/ linkage every query returns empty rows for the wrong team.)');
    process.exit(2);
  }
  if (merged.projectId && link.projectId !== merged.projectId) {
    console.error(`[deep-dive] FATAL: cwd .vercel/ links project ${link.projectId}, but merged.json was collected for ${merged.projectId}.`);
    console.error(`         Re-run with --cwd <dir-linked-to-${merged.projectId}>.`);
    process.exit(2);
  }
  log(`cwd link OK (project ${link.projectId}, source ${link.source})`);

  const scope = merged.orgId || undefined;
  const toLaunch = Array.isArray(gate.toLaunch) ? gate.toLaunch : [];
  const platform = Array.isArray(gate.platform) ? gate.platform : [];

  log(`enriching ${toLaunch.length} toLaunch + ${platform.length} platform candidate(s) (window=${TIME_WINDOW})`);

  const t0 = Date.now();
  const errors = [];

  // Flatten {candidate, spec}, fire all CLI calls in one Promise.all, re-group.
  // Avoids per-candidate sequentiality.
  const allCandidates = [...toLaunch.map((c, i) => ({ c, group: 'toLaunch', i })),
                        ...platform.map((c, i) => ({ c, group: 'platform', i }))];

  const flatJobs = [];
  const skipNotes = new Map();

  for (const entry of allCandidates) {
    const specs = specsForCandidate(entry.c);
    if (specs.length === 0) {
      if (SCANNER_KINDS.has(entry.c.kind)) {
        skipNotes.set(`${entry.group}:${entry.i}`, 'scanner-driven (no deep-dive needed)');
      } else if (entry.c.kind === 'platform_fluid_compute') {
        skipNotes.set(`${entry.group}:${entry.i}`, 'reused from broad pass (fnStartTypeByRoute)');
      } else {
        skipNotes.set(`${entry.group}:${entry.i}`, `no deep-dive spec for kind=${entry.c.kind}`);
      }
      continue;
    }
    for (const spec of specs) {
      flatJobs.push({ entry, spec });
    }
  }

  // Cut CLI calls two ways: (1) extract per-route slices already collected in
  // the broad pass; (2) dedupe identical queries across candidates (same route
  // can fire multiple gates wanting the same metric).
  let extractedFromBroadPass = 0;
  let dedupedQueryHits = 0;
  const broadPassResults = [];
  const remainingJobs = [];
  for (const job of flatJobs) {
    const extracted = tryExtractFromBroadPass(job.spec, merged);
    if (extracted) {
      broadPassResults.push({ entry: job.entry, spec: job.spec, ok: true, ...extracted });
      extractedFromBroadPass++;
    } else {
      remainingJobs.push(job);
    }
  }

  // One CLI call per unique dedup key; jobs sharing a key share the result.
  const queryGroups = new Map();
  for (const job of remainingJobs) {
    const key = queryKey(job.spec, scope);
    if (!queryGroups.has(key)) {
      queryGroups.set(key, { spec: job.spec, jobs: [] });
    }
    queryGroups.get(key).jobs.push(job);
  }
  dedupedQueryHits = remainingJobs.length - queryGroups.size;

  const totalCliQueries = queryGroups.size;
  log(`${flatJobs.length} specs total: ${extractedFromBroadPass} extracted from broad-pass, ${dedupedQueryHits} deduped, ${totalCliQueries} CLI queries to run`);

  const groupResults = await Promise.all([...queryGroups.values()].map(async ({ spec, jobs }) => {
    const r = await queryMetric(spec.metricId, {
      aggregation: spec.aggregation,
      groupBy: spec.groupBy,
      filter: spec.filter,
      since: spec.since,
      limit: spec.limit,
      scope,
    });
    return { spec, jobs, response: r };
  }));

  const cliResults = [];
  for (const { spec, jobs, response: r } of groupResults) {
    if (!r.ok) {
      for (const job of jobs) {
        errors.push({
          candidateGroup: job.entry.group,
          candidateIndex: job.entry.i,
          kind: job.entry.c.kind,
          route: job.entry.c.route ?? job.entry.c.hostname ?? null,
          specId: spec.id,
          code: r.code,
        });
        cliResults.push({ entry: job.entry, spec, ok: false, error: r.code });
      }
      continue;
    }
    const norm = normalizeResponse(r.data, spec);
    for (const job of jobs) {
      cliResults.push({ entry: job.entry, spec, ok: true, ...norm });
    }
  }
  const results = [...broadPassResults, ...cliResults];

  const wallMs = Date.now() - t0;
  log(`done in ${wallMs}ms (${totalCliQueries} CLI queries, ${extractedFromBroadPass} extracted from broad-pass, ${dedupedQueryHits} deduped, ${errors.length} errors)`);

  const byCandidate = new Map();
  for (const res of results) {
    const k = `${res.entry.group}:${res.entry.i}`;
    if (!byCandidate.has(k)) byCandidate.set(k, []);
    byCandidate.get(k).push(res);
  }

  function enrich(c, group, i) {
    const k = `${group}:${i}`;
    const note = skipNotes.get(k);
    if (note) {
      return {
        ...c,
        evidence: {
          ...(c.evidence ?? {}),
          deepDive: { note },
        },
      };
    }
    const list = byCandidate.get(k) ?? [];
    const merged = mergeIntoEvidence(list);
    return {
      ...c,
      evidence: {
        ...(c.evidence ?? {}),
        deepDive: merged,
      },
    };
  }

  const enrichedToLaunch = toLaunch.map((c, i) => enrich(c, 'toLaunch', i));
  const enrichedPlatform = platform.map((c, i) => enrich(c, 'platform', i));

  const out = {
    schemaVersion: SCHEMA_VERSION,
    appliedAt: new Date().toISOString(),
    candidatesEnriched: toLaunch.length + platform.length,
    specsTotal: flatJobs.length,
    queriesRun: totalCliQueries,
    extractedFromBroadPass,
    dedupedQueryHits,
    totalWallMs: wallMs,
    errors,
    toLaunch: enrichedToLaunch,
    platform: enrichedPlatform,
  };

  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

// Reduce CLI response to {value} or {rows:[{value,...dims}]}. The per-metric
// underscore field (e.g. vercel_function_invocation_count_sum) gets renamed
// to `value` for compactness.
function normalizeResponse(data, spec) {
  if (!data || !Array.isArray(data.summary)) return { value: null };
  const field = `${spec.metricId.replace(/\./g, '_')}_${spec.aggregation}`;
  if (spec.groupBy.length === 0) {
    const first = data.summary[0];
    if (!first) return { value: null };
    const v = first[field];
    return { value: typeof v === 'number' ? round4(v) : null };
  }
  const rows = data.summary.map((row) => {
    const out = { value: typeof row[field] === 'number' ? round4(row[field]) : null };
    for (const dim of spec.groupBy) {
      if (row[dim] !== undefined) out[dim] = row[dim];
    }
    return out;
  });
  return { rows };
}

function round4(n) {
  if (!Number.isFinite(n)) return n;
  return Math.round(n * 10000) / 10000;
}

// Skip the CLI call when broad-pass already collected the same metric grouped
// by [route, dim]. Returns {rows} on hit, null on miss. Cuts rate-limit pressure
// for per-route slice specs (startTypeSplit, cacheBreakdown, methodDistribution).
function tryExtractFromBroadPass(spec, merged) {
  const eq = spec.broadPassEquivalent;
  if (!eq) return null;
  const broadRows = merged?.metrics?.[eq.key]?.rows;
  if (!Array.isArray(broadRows)) return null;
  const rows = [];
  for (const row of broadRows) {
    if (row.route !== eq.routeFilter) continue;
    const out = { value: typeof row.value === 'number' ? row.value : null };
    for (const dim of (eq.projectDims ?? [])) {
      if (row[dim] !== undefined) out[dim] = row[dim];
    }
    rows.push(out);
  }
  // Zero rows ≠ "no data" — broad-pass row limit may have truncated the route.
  // Fall through to CLI so the caller gets a definitive answer.
  if (rows.length === 0) return null;
  return { rows };
}

// Two specs sharing this key answer the same question — one CLI call serves both.
// Must include everything that affects the CLI's arg list.
function queryKey(spec, scope) {
  const groupBy = [...(spec.groupBy ?? [])].sort();
  return JSON.stringify({
    metricId: spec.metricId,
    aggregation: spec.aggregation,
    groupBy,
    filter: spec.filter ?? null,
    since: spec.since ?? null,
    limit: spec.limit ?? null,
    scope: scope ?? null,
  });
}

main().catch((err) => {
  console.error('[deep-dive] FAILED:', err.message);
  console.error(err.stack);
  process.exit(1);
});
