---
name: vercel-optimize
description: Deep cost and performance optimization for Vercel projects on supported frameworks: Next.js, SvelteKit, and Nuxt, with limited Astro support. This skill pulls observability metrics, billing, and project config from the Vercel CLI, then investigates the codebase only where those metrics point, producing ranked recommendations with before/after code grounded in Vercel and framework-aware documentation. Use this skill whenever the user asks to optimize a Vercel project, cut their Vercel bill, audit Vercel performance, investigate why a specific route is slow or expensive, find caching opportunities, reduce function invocations, or get a cost breakdown. Also use proactively whenever the user shares a Vercel deployment URL or mentions performance/cost concerns about a supported app deployed to Vercel.
license: MIT
metadata:
  version: "1.1.0"
---

# Vercel Optimize

**Always observability-first.** Run `node scripts/collect-signals.mjs` before anything else. Derive candidates from the metric signals. Investigate only the files those candidates point at. Never grep the codebase without a candidate-bound scope.

This skill is built from field-tested Vercel optimization patterns. The architecture is opinionated about one thing above all: **we don't make recommendations without data backing them.** Cost framing is magnitudes (never precise dollar amounts). Performance framing is precise (observed milliseconds). Citations come only from a curated allow-list. Every threshold gate is mechanical, not LLM-judgment.

## When to use this skill

- "Optimize my Vercel project"
- "Reduce my Vercel bill"
- "Audit my performance"
- "Why is /api/products slow?"
- "Find caching opportunities"
- The user shares a Vercel deployment URL or mentions Vercel cost/performance in passing

## When NOT to use this skill

- Projects not deployed on Vercel (this skill depends on Vercel observability + billing data)
- General code review or framework migration (use a different skill — this one is scoped to cost, performance, and reliability)
- Greenfield projects with no deployment yet (no signals to gate on; come back after first deploy + meaningful traffic)
- Architectural rewrites (this skill optimizes what exists; it doesn't redesign)

## Prerequisites

- `vercel` CLI v53 or higher (`npm i -g vercel@latest`). The skill refuses older versions.
- Authenticated: `vercel login`.
- Linked project: `vercel link`, or set `VERCEL_PROJECT_ID` env var, or pass the project ID as the first argument to `collect-signals.mjs`.
- Node.js 20+ on the host running the skill (built-in `node:test`, `fs.readdir({recursive})`, no installed deps required).
- For metric-backed route ranking: **Observability Plus** on the team.

Do not put auth tokens in shell commands. Use `vercel login` or pre-existing environment variables; never type `VERCEL_TOKEN=...`, `--token ...`, or `Authorization: Bearer ...` into a command that the coding agent will echo in chat.

**Framework support:**

The skill detects the framework from `package.json`. Current coverage:

| Framework | Preflight status | Route mapping | Scanners | Playbook | Citation library | Notes |
|---|---|---|---|---|---|
| Next.js (App Router) | supported | ✓ | ✓ (Next-shaped + generic) | ✓ (application-profile) | 18 next-specific + wildcard | Best supported |
| Next.js (Pages Router) | supported | ✓ | ✓ (most) | ✓ (saas/api-service) | same | Recs scoped to Pages Router idioms when detected |
| SvelteKit | supported | ✓ | ✓ (`sveltekit-prerender-missing`) | ✓ (`sveltekit.md`) | 10 sveltekit URLs | Routes from `src/routes/+page.svelte`, `+page.server.ts`, `+server.ts` |
| Nuxt | supported | ✓ | generic | — | 3 nuxt URLs | Routes from `pages/**` and `server/api/**` / `server/routes/**` |
| Astro | limited | ✓ | generic | — | 3 astro URLs | Metrics + generic route mapping; fewer framework-specific playbooks |
| Hono / Remix / unknown | blocked by default | — | generic only if user continues | — | wildcard only | Continue only when the user accepts a limited platform/scanner audit |

✅ Right:
```bash
cd ~/projects/my-app
vercel link                                  # one-time
RUN_DIR="$(mktemp -d)"
node scripts/collect-signals.mjs > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$RUN_DIR/vercel-signals.json"
node scripts/scan-codebase.mjs . > "$RUN_DIR/codebase.json"
node scripts/merge-signals.mjs "$RUN_DIR/vercel-signals.json" "$RUN_DIR/codebase.json" --out "$RUN_DIR/signals.json"
```

✅ Right, monorepo with a known Vercel project:
```bash
vercel link --yes --project <project-name-or-id> --cwd apps/my-app
```

If the team is known, include it:
```bash
vercel link --yes --team <team-id-or-slug> --project <project-name-or-id> --cwd apps/my-app
```

Then run collection with the app directory as the working directory. `vercel metrics` reads project linkage from the current directory; passing a project ID to `collect-signals.mjs` is not enough for metrics if the working directory is unlinked.

❌ Wrong:
```bash
node scripts/collect-signals.mjs             # no project linked, no project id → exits
```

## Quick reference

| Step | Input | Output | Reference |
|---|---|---|---|
| 1. Collect + scan + merge signals | None (Vercel CLI + repo) | `signals.json` | [references/data-collection.md](references/data-collection.md) |
| 2.1 Gate candidates | `signals.json` | `gate.json` (`{toLaunch, platform, gated}`) | [references/doctrine.md](references/doctrine.md), generated [references/candidates.md](references/candidates.md) |
| 2.2 Deep-dive scope | `signals.json` + `gate.json` | `investigation-evidence.json` (gate + `evidence.deepDive` per candidate) | [lib/deep-dive.mjs](lib/deep-dive.mjs) |
| 2.2.5 Reconcile evidence | `investigation-evidence.json` + `gate.json` | `reconciled-investigation.json` + pre-resolved records | [lib/reconcile-candidates.mjs](lib/reconcile-candidates.mjs) |
| 2.3 Investigate launched | `reconciled-investigation.json` | raw investigation outputs | [references/doctrine.md](references/doctrine.md) |
| 2.4 Collect outputs | raw investigation outputs + manifest | `recommendations.json` | [references/recommendations.md](references/recommendations.md) |
| 3. Verify + grade recs | `recommendations.json` | `verify.json` | [references/recommendations.md](references/recommendations.md), [references/verification.md](references/verification.md) |
| 4. Score and report | `verify.json` + `gated.json` | Markdown report | [references/scoring.md](references/scoring.md) |

## Step 1 — Collect signals

Pull everything observability gives us, before reading any source code.

### 1.1 Run the collection script

```bash
node scripts/collect-signals.mjs [projectId] > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$RUN_DIR/vercel-signals.json"
```

The script handles:
- Preflight (CLI version, auth, project ID resolution)
- Framework support preflight from `package.json`. Unsupported frameworks stop before metric fan-out unless the user chooses `--continue-unsupported-framework`.
- Observability Plus configuration preflight via the public `vercel api` OpenAPI surface, followed by a one-query metrics access check before full metrics fan-out
- Fast blocker output: when Observability Plus is unavailable, it writes a minimal `signals.json` and stops before slower project config / usage collection unless `--continue-without-observability` is passed
- `vercel api /v9/projects/<id>` for project config
- `vercel contract` for plan inference (commitments[].category: Spend=Pro, Usage=Enterprise)
- `vercel usage --format json --from <14d ago>` for billing
- ~29 concurrent metric queries over a uniform 14-day window — function billing (count, cold-start split, GB-hr, CPU, peak/provisioned memory, TTFB, duration p95), request-level (cache, status, FDT by route/bot/cache), middleware (count + duration), ISR (reads + writes), images (count + host + source bytes), Speed Insights (LCP/INP/CLS/TTFB/count), firewall + BotID, external APIs (count + bytes + duration). Single source of truth: [lib/queries.mjs](lib/queries.mjs).
- Stack detection from `package.json` (framework, version, ORM, monorepo)

Output: one JSON document to stdout matching the schema in `references/data-collection.md`. Status messages go to stderr. Do not combine streams; if log lines appear in `vercel-signals.json`, rerun collection with `2> "$RUN_DIR/collect.stderr"` before parsing or merging.

### 1.2 Run the codebase scan

```bash
node scripts/scan-codebase.mjs <repo-root>
```

Outputs `{stack, routes, findings}`. The findings come from nine deterministic scanners (image, force-dynamic, middleware matcher, cache headers, use-client cascade, max-age without s-maxage, dynamic APIs in pages, source maps in production, deep Prisma includes).

### 1.3 Merge into a single `signals.json`

```bash
node scripts/merge-signals.mjs vercel-signals.json codebase.json --out signals.json
```

The merge helper writes the `collect-signals` output at the top level and the `scan-codebase` output under `codebase`. During the merge it annotates every scanner finding with a route-level observability signal, `COLD-PATH`, or `NO-ROUTE-MAPPING`; scanner gates will not launch non-traffic-independent findings without that annotation. It refuses to overwrite an existing output file unless `--force` is passed. Use a fresh run directory for every invocation so old artifacts cannot leak into a new report.

### 1.4 Observability Plus capability check — STOP AND ASK if blocked

**This is a stop-and-ask point.** Before proceeding to Step 2, first check `signals.frameworkSupportBlocker`, then `signals.observabilityPlusBlocker`.

If `signals.frameworkSupportBlocker === "unsupported_framework"`, pause before scanning or gating. Tell the user:

```text
This project uses <framework>. Vercel Optimize supports metric-backed code recommendations for Next.js, SvelteKit, and Nuxt. Astro support is limited. For <framework>, I can still run a limited platform/scanner audit, but route-level Vercel metrics may not map back to source files.

Do you want me to continue with the limited audit, or stop here?
```

If the user continues, re-run collection with:

```bash
node scripts/collect-signals.mjs [projectId] --continue-unsupported-framework > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
```

Then scan + merge as usual. If the final report has no code recommendations, frame the reason as a framework/route-mapping limitation, not "nothing to do."

Next, check `signals.observabilityPlusBlocker` (emitted by `collect-signals.mjs`). If non-null, the per-route metric queries did not produce usable data — and the entire premise of this skill (observability-anchored recommendations) depends on them.

```bash
jq '{observabilityPlus, observabilityPlusUsable, observabilityPlusBlocker, observabilityPlusBlockerDetail}' signals.json
```

| `observabilityPlusBlocker` | What it means | Required action |
|---|---|---|
| `null` | Observability Plus is usable, queries returned data | Proceed to Step 2 |
| `no_traffic` | Observability Plus enabled, but no traffic in window | Tell the user (different state, not a blocker per se); they may choose to come back after traffic accumulates OR proceed in scanner-only mode |
| `payment_required` | Route-level metrics are recognized but not usable for these queries | **Render the verbatim choice from [references/observability-plus.md](references/observability-plus.md), pause for user input** |
| `no_oplus_probe` | The team does not expose route-level Observability Plus metrics | Same — render the choice template, pause for user input |
| `not_linked` | `vercel metrics` cannot find project linkage in the app directory | Link the app directory and rerun Step 1. If the user supplied app path + project name, run `vercel link --yes --project <project-name-or-id> --cwd <app-dir>`; add `--team <team-id-or-slug>` when known. Do not fall back to scanner-only unless the user declines linking |
| `forbidden` | Auth-scope mismatch — wrong team | Do NOT pitch Observability Plus; tell the user to run `vercel switch <team>` and re-run |
| `project_not_found` | Project ID not visible to auth'd team | Same — fix auth first, no Observability Plus pitch |
| `project_disabled` | Observability Plus is enabled for the team but disabled for this project | Tell the user to enable Observability Plus for this project, then re-run. Do not fall back to scanner-only unless the user declines enabling it |
| `all_failed_other` | Every query failed with some other error | Show the raw error code; ask if they want to continue in scanner-only mode |

**Do NOT silently fall back to scanner-only mode.** The user chose this skill expecting an optimization audit; if we can't deliver one, present the explicit choice.

If the user chooses scanner-only mode after a blocker, re-run collection with:

```bash
node scripts/collect-signals.mjs [projectId] --continue-without-observability > "$RUN_DIR/vercel-signals.json" 2> "$RUN_DIR/collect.stderr"
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))' "$RUN_DIR/vercel-signals.json"
```

Then continue with scan + merge. This second run may collect project config and usage, but it must happen only after the user accepts the limited audit.

**Render the template in [references/observability-plus.md](references/observability-plus.md) VERBATIM.** Adapt only the one-line specifics slot from `observabilityPlusBlockerDetail`. Do not add a preface before the template; the heading is the first line the user should see. Frame this as a data dependency, not an upsell. The template contains exactly what the user needs to decide:
- the specific metric access problem,
- why route-level metrics prevent guesswork,
- the limited value of scanner-only mode,
- two options + ask.

**Do not embellish.** Do not add a "For context, your project is Nuxt and you're billing $X/mo" paragraph at the end — the user can compute the tradeoff themselves. Do not expand the Observability Plus feature list, do not quote pricing tables, and do not write sales copy. Every extra word dilutes the decision. The reference doc lists the anti-patterns explicitly.

### 1.5 Other failure modes (verbatim)

| What | Tell the user |
|---|---|
| `vercel` not in PATH | "Install Vercel CLI: `npm i -g vercel@latest`" |
| CLI version < 53 | "Upgrade Vercel CLI to v53+: `npm i -g vercel@latest`" |
| `vercel whoami` fails | "Run `vercel login` and re-try" |
| No `.vercel/project.json` | "Run `vercel link` in this directory, or set VERCEL_PROJECT_ID" |
| No traffic in last 14 days (Observability Plus on but `no_traffic` blocker) | "No observability data yet. The skill will surface only static/scanner-driven recommendations and platform recs." |

## Step 2 — Investigate candidates

This is the observability-first investigation phase. **No file reads until `signals.json` exists.**

### 2.1 Run the deterministic gate

```bash
node scripts/gate-investigations.mjs signals.json
```

The gate is pure JS, no LLM. Output:

```json
{
  "toLaunch": [ /* code-scope candidates that passed thresholds, capped at budget */ ],
  "platform": [ /* account-scope recs (Fluid, Bot Protection) */ ],
  "gated": [ /* candidates that failed thresholds, hit the budget cap, OR were folded into a sibling via route canonicalization */ ],
  "budget": { "maxCandidates": 6, "source": "default", "selection": "diverse-default" },
  "gateVersion": "1.4.0",
  "appliedAt": "..."
}
```

The `gated` list is **never thrown away** — it surfaces in Step 4's "Not investigated in this run" section. This is the trust mechanism. Three reasons a candidate ends up there:

- `skippedByBudget` — passed thresholds but ranked below `MAX_CODE_CANDIDATES`. Raise the budget if you want to investigate more.
- `coveredBy (<key>)` — folded into a higher-priority sibling because both routes canonicalize to the same source file. Next.js 16's segment-tree metrics produce many label variants for one physical page (`/event/.../london.segments/.../__PAGE__.segment`, `_tree.segment`, `_index.segment`); the canonicalizer (`lib/route-normalize.mjs`) collapses them.
- `disqualified` — a hard rule rejected the candidate (e.g. mostly-POST route for `uncached_route`).

**Tuning the budget.** Default is 6 launched code-scope candidates. The default is impact-first with a diversity guardrail: it keeps coverage across failure types only when that failure type has a strong enough signal for a first-pass slot. This prevents a tiny error cluster or low-traffic scanner finding from displacing much larger measured cost/performance signals. Candidate `priority` is a gate-local signal magnitude, not a dollar-impact estimate. Explicit budgets (`--max-candidates 12` or `all`) use raw priority order after route dedupe. Two ways to raise it:

```bash
# CLI flag (per-run):
node scripts/gate-investigations.mjs signals.json --max-candidates 12
node scripts/gate-investigations.mjs signals.json --max-candidates all   # unbounded

# Env var (persistent):
VERCEL_OPTIMIZE_MAX_CANDIDATES=all node scripts/gate-investigations.mjs signals.json
```

Use `all` for a one-shot exhaustive audit (every gate-passing candidate gets investigated; expect more wall-clock on a 50+ candidate fleet). Use a specific integer when you want to investigate more than 6 but cap orchestrator load.

For large runs, keep the manifest's `fanoutPlan` visible to the orchestrator. It groups briefs by failure family and primary source file so a host can label work clearly and avoid confusing duplicate-looking tasks. The skill still emits one brief per candidate unless the host implements family batching; the manifest is the contract for that batching.

### 2.1.5 Audit scope choice — ask the user when the default would skip work

Deep-dive is the most expensive step (one Vercel CLI round-trip per candidate). Before paying for it, check whether the user wants a focused first pass or a broader audit:

```bash
node scripts/budget-summary.mjs gate.json --format json
```

The script returns a structured object:

```json
{
  "shouldAsk": true,
  "reason": "default budget skipped 15 candidate(s); ask user whether to expand",
  "totalPassed": 21,
  "currentBudget": 6,
  "budgetSource": "default",
  "skipped": 15,
  "printContract": "Print chatPreview verbatim by copying exactChatMessage.body as a chat message before asking questionText. Do not summarize, truncate, reorder, shorten, or rewrite options.",
  "chatPreview": "Found 21 potential issues worth checking. By default I'll inspect the 6 strongest now; 15 will stay in the report for a larger run.\nChoose a larger scope if you want broader coverage. More checks take longer.\n\nChecking now:\n  1. Slow route on /event - function invocations: 2,867,116; 95th percentile duration: 3010ms\n  ...\n\nOnly checked if you expand this run (15):\n  1. Slow route on /event/[code]/[location]/register - function invocations: 118,267; 95th percentile duration: 735ms\n  ...",
  "exactChatMessage": {
    "body": "same string as chatPreview",
    "lineCount": 43,
    "sha256": "..."
  },
  "printCheck": {
    "bodyField": "exactChatMessage.body",
    "requiredSkippedRows": 15,
    "requiredSkippedHeading": "Only checked if you expand this run (15):",
    "instruction": "The audit-scope message is valid only when every line from exactChatMessage.body is preserved exactly."
  },
  "questionText": "How many potential issues should I check in this run?",
  "topInvestigating": [...],
  "topSkipped": [...],
  "options": [
    { "label": "Check 6 (default)", "value": 6, "recommended": true, "description": "Fastest first pass; checks the strongest cost and performance signals." },
    { "label": "Check all 21", "value": "all", ... },
    { "label": "Pick a number", "value": "custom", ... }
  ],
  "questionPayload": {
    "questions": [{
      "question": "How many potential issues should I check in this run?",
      "header": "Audit scope",
      "multiSelect": false,
      "options": [
        { "label": "Check 6 (default)", "description": "Fastest first pass; checks the strongest cost and performance signals." },
        { "label": "Check all 21", "description": "Most complete; takes longer because every flagged route is investigated." },
        { "label": "Pick a number", "description": "Check more than 6 without running the full 21." }
      ]
    }]
  }
}
```

**Branch on `shouldAsk`:**

- `false` — proceed to deep-dive with the current budget. Either the user already pinned the budget (`source: flag|env`), or no candidates were skipped. **No question.**
- `true` — surface the structured preview AND ask the question:

  1. **Print `exactChatMessage.body` as a chat message FIRST, exactly as returned.** Use `chatPreview` only as a legacy alias; for interactive hosts, read and copy `exactChatMessage.body`. Treat it as an opaque string. Do not rebuild it from `topInvestigating`, `topSkipped`, or memory. Each candidate is on its own line with kind + route + signal. Do NOT collapse it into a paragraph, shorten it to "top skipped," reorder it, or rewrite the metric labels. If you summarized it, the checkpoint is invalid: print the exact `exactChatMessage.body` and only then ask.
     - Self-check against `printCheck` before asking: the message must have `requiredLineCount` lines, include `requiredSkippedHeading`, and preserve `requiredSkippedRows` numbered skipped rows. If it has collapsed ranges like "6-16", "11 more", "more candidates", or "etc.", it is wrong.
  2. **THEN call the host's question primitive** with `questionPayload` when the host supports it, or with `questionText` plus the exact option labels/descriptions from `options`.
     - **Claude Code**: pass `questionPayload.questions` directly to `AskUserQuestion`. Do not rewrite option labels or descriptions. The question field should be exactly `questionText` (one sentence) — the detail lives in the chat message you just printed.
     - **Codex CLI / Aider / shell**: print `exactChatMessage.body`, then prompt for a number / 'all' / 'keep'.
     - **CI / batch hosts**: pass `--no-prompt` to `budget-summary.mjs` to suppress (`shouldAsk` becomes false).

**Do NOT stuff `exactChatMessage.body` or `chatPreview` into the question field.** It will mash into a paragraph and lose the per-line structure. The chat message and the question are different surfaces — use them accordingly.

If the user picks something other than the default, **re-run** the gate with `--max-candidates <user-choice>`. The dedup / canonicalization is byte-deterministic, so re-running is cheap (no CLI calls). Do NOT run the deep-dive twice.

**Why ask here and not earlier or later.** Earlier (before the gate) and we don't know how many candidates there are. Later (after the deep-dive) and we've already paid the cost. The gate output is the first moment we have the full count and the cheapest moment to change our minds.

**Why not ask more questions.** Every question is a tax on the user. The budget question survives the bar because (a) the right number depends on the project's fleet shape — no good universal default, (b) the cost of being wrong is invisible (skipped candidates sit in the gated table, most users won't read it), and (c) the user has the full budget-skipped list before choosing. Most other choices in this pipeline (which gates, which playbooks, whether to apply patches) fail one of those three tests today.

### 2.2 Run the deep-dive

```bash
node scripts/deep-dive.mjs signals.json gate.json --cwd <project-dir> > investigation-evidence.json
```

**Why `--cwd` matters.** The Vercel CLI resolves project/team from the working directory's `.vercel/` linkage. If the runner is invoked from outside the linked project, every `vercel metrics` call silently hits the wrong team and returns empty rows. The runner now hard-fails when cwd doesn't match `merged.projectId`; pass `--cwd` or `cd` into the project first.

For every `toLaunch` and `platform` candidate, the deep-dive runs a focused set of follow-up metric queries scoped to that candidate's `route` or `hostname`. Each candidate kind has its own spec (registered in [lib/deep-dive.mjs](lib/deep-dive.mjs)):

| Kind | Deep-dive views |
|---|---|
| `slow_route` | latency p50/p75/p95/p99, TTFB p50/p75/p95/p99, CPU p95, start-type split, status distribution, per-deployment p95 |
| `uncached_route` | cache_result breakdown, method distribution, bot-bandwidth share, bandwidth-by-cache |
| `cold_start` | start-type split, cold-vs-warm p95, cold-only count per deployment |
| `oversized_memory` | memory p50/p75/p95/p99, gb-hours per deployment |
| `route_errors` | 5xx pattern by status, error_code distribution, per-deployment 5xx split |
| `external_api_slow` | duration p50/p75/p95/p99, calling routes (`origin_route`), transfer bytes |
| `isr_overrevalidation` | write_units × cache_result, read_units × cache_result |
| `cwv_poor` | LCP/INP/CLS p50/p75/p95 |
| `middleware_heavy` | top middleware request_paths |
| `platform_bot_protection` | WAF rule firings |

Every query runs in parallel (`Promise.all`) so the entire pass is one round-trip's worth of wall-clock time, not N. Output enriches each candidate with `evidence.deepDive` and is the input to the reconciliation step.

### 2.2.5 Reconcile deep-dive evidence before briefs

```bash
node scripts/reconcile-candidates.mjs investigation-evidence.json \
  --gate gate.json \
  --out reconciled-investigation.json
```

Reconciliation is deterministic and runs before any source investigation. It removes candidates whose follow-up metrics already disprove or reframe the gate hypothesis:

- `metric_mismatch` — broad slow-route signal did not survive the focused latency query.
- `error_storm` — function-level 5xx responses dominate a slow-route candidate, so it belongs in reliability triage.
- `deployment_regression` — one deployment is a latency outlier, so the next action is regression triage.
- `scanner_only_no_metric` — static scanner finding has no matching Vercel metric signal.

Dropped candidates become `preResolvedRecords`. They do not need an investigation output file. The manifest carries them forward, the collector prepends them to `recommendations.json`, and the report surfaces them under observations / no-change findings.

### 2.3 Investigate each launched candidate — fan-out to sub-agents

This is **the most important step** in the skill. Each candidate becomes its own sub-agent with a self-contained brief. The orchestrator's context never holds more than one candidate at a time.

#### 2.3.1 Generate briefs

First, list every candidate that needs a brief:

```bash
node scripts/prepare-investigation-brief.mjs signals.json reconciled-investigation.json --list
```

This emits `{briefs: [{group, index, kind, route, files, candidateRef, label}, ...], preResolvedRecords}` — a deterministic manifest. `candidateRef` is file-aware for candidates without a route, and `label` is the human-readable task label hosts should use for visible worker names. Name workers like `Low cache-hit route on /docs/llm-digest/[...slug]`, not `Investigate brief toLaunch-7`. Use the manifest to decide fan-out shape (see [2.3.3 below](#233-when-to-fan-out-vs-inline)).

Then generate one brief per candidate:

```bash
for i in 0 1 2 3; do
  node scripts/prepare-investigation-brief.mjs signals.json reconciled-investigation.json \
    --group toLaunch --index "$i" --out briefs/toLaunch-$i.md
done
```

Brief output refuses to overwrite an existing file. Use a fresh run directory for every invocation. If you intentionally need to regenerate a brief in place, pass `--force`.

Each brief contains: repo root, app root, repo-relative JSON paths plus absolute read paths for every allowed file, the candidate, its `evidence.deepDive` JSON, the version+kind filtered citation subset, per-kind interpretation hints, selected support topics, the relevant playbook body, the investigation protocol verbatim, the required output schema, and an explicit abstention escape hatch. **Briefs are everything the sub-agent sees** — no SKILL.md, no doctrine, no other reference is loaded by the sub-agent.

#### 2.3.2 Spawn one sub-agent per brief

Pass the brief markdown as the prompt to a fresh sub-agent. The sub-agent's job is to read the named files, verify patterns, and emit ONE JSON object — either a recommendation matching the schema in `references/recommendations.md`, or an abstention (`{abstain: true, candidateRef, reason}`).

Use your host's sub-agent primitive:

| Host | Primitive |
|---|---|
| Claude Code | `Agent` tool (one call per brief, all in a single message → parallel) |
| OpenAI Codex CLI | `/agent` sub-task; ask the planner to dispatch one per brief |
| Cursor | Background composer task per brief (Cursor 2.4+ supports nested sub-agents) |
| Roo Code | Boomerang-mode orchestrator dispatching to sub-modes |
| GitHub Copilot coding agent | Custom agent (`.github/agents/<name>.agent.md`) per brief |
| Aider, plain shell loops, claude.ai web | No sub-agent primitive — run inline (see 2.3.3) |

#### 2.3.3 When to fan out vs inline

Spawning N sub-agents costs ~1 round-trip's worth of overhead. The break-even point in practice:

| `toLaunch.length` | Pattern |
|---|---|
| 1-2 | Run inline serially. The fan-out overhead beats the parallelism win. Read the briefs into the orchestrator's context and investigate yourself. |
| 3+ | Fan out via parallel sub-agent calls. Each sub-agent's context stays small (~12KB brief) and they finish concurrently. |

Hosts that don't support sub-agent spawning (Aider, plain shell loops, claude.ai web) always run inline — the skill produces a correct result either way, just serially.

#### 2.3.4 The hard rule (verbatim from [doctrine.md](references/doctrine.md))

If you reach for a repo-wide grep, stop. Re-read the candidate's question. If the question doesn't constrain the search, the candidate is malformed — drop it and move on. **Both the orchestrator AND every sub-agent must respect this.** The brief encodes it as the investigation protocol; failing to follow it produces drift and hallucinations.

### 2.4 Collect sub-agent outputs

Save each raw sub-agent answer to a file (for example `sub-agent-outputs/toLaunch-0.md`). The file may contain raw JSON, fenced JSON, or a short prose wrapper around the JSON object.

Then collect them into the array shape consumed by the verifier:

```bash
mkdir -p briefs sub-agent-outputs
node scripts/prepare-investigation-brief.mjs signals.json reconciled-investigation.json --list > briefs/manifest.json
node scripts/collect-sub-agent-outputs.mjs --manifest briefs/manifest.json sub-agent-outputs/ > recommendations.json
```

The manifest includes one row per brief plus a `fanoutPlan` family rollup. Use each brief's `label` for the sub-agent task name (for example, `Slow route on /docs`, not `toLaunch-7`). The collector extracts the first valid recommendation or abstention JSON from each output, prepends `manifest.preResolvedRecords`, orders records by the brief manifest, and fails if a `candidateRef` is missing, duplicated, unknown, or mismatched. Pre-resolved records do not require output files. Use `--out recommendations.json` instead of shell redirection when you want the script to write the file directly.

### 2.5 Verify findings mechanically

For each finding:

- File exists?
- Pattern actually present at that line?
- Not in a test/dev-config/build-output file?

Drop findings that fail mechanical verification.

### 2.6 Drop cold-path scanner findings

Scanner findings annotated `COLD-PATH` or `NO-ROUTE-MAPPING` get dropped UNLESS their scanner declared `trafficIndependent: true`. Traffic-independent patterns (middleware matcher, source maps, React Compiler config, build settings) survive; everything else needs traffic evidence.

The allow-list of traffic-independent scanners is in their `metadata.trafficIndependent` flag. See generated [references/scanner-patterns.md](references/scanner-patterns.md).

## Step 3 — Generate + verify recommendations

Draft recommendations, then mechanically verify the claims they make.

### 3.1 Merit-prune findings

For each finding, score `actionable + evidenced + impactful` (1-5 each) using the observed signal already attached. Cap drop ratio at 30% (don't gut the report). High-signal findings stay; cold-path findings deprioritize naturally.

### 3.2 Select playbook

Match the project's application profile against the playbook selection matrix in [references/scoring.md](references/scoring.md). At most two playbooks apply per project. Playbooks shape ordering and phrasing — they never invent claims.

### 3.3 Draft recommendations

Follow the schema in [references/recommendations.md](references/recommendations.md). Every rec must:

- Trace to a verified candidate OR a verified scanner finding (no playbook-only inventions)
- Lead with impact in the `what` field
- Cite codebase findings with line numbers in `why`
- Include before/after code fences in `currentBehavior`/`desiredBehavior`
- Include ≥1 citation from `references/docs-library.json`
- Use the magnitude framing for cost (never `$N` literals); precise framing for performance
- **Use deep-dive evidence to frame the recommendation precisely.** A slow_route rec on a route whose deepDive shows `latency.p99=2695` but `cpu.p95=116` should be framed as a wall-clock / external-IO problem, NOT a CPU problem. A per-deployment view that shows the slow p95 is concentrated on the newest `deployment_id` should phrase the rec as "regression introduced in <deployment_id>". The deep-dive is the evidence anchor — quote it verbatim.

### 3.4 Apply sanitizers

The sanitization checks run in code via `lib/sanitizers/index.mjs`'s `applySanitizers(rec, ctx)`. Each mutation records a tag on `rec.sanitizerTrail`. The orchestrator runs them in the order documented in [references/recommendations.md](references/recommendations.md#the-12-sanitizers):

1. `$-strip` — first, deterministic
2. `vercel-directive-strip` — strip `stale-if-error`/`proxy-revalidate`/`must-revalidate`
3. `rate-limit` — Notion/OpenAI/Stripe/Anthropic concurrency caveat
4. `pre-release` — flag canary/rc/beta features
5. `middleware-conflict` — caveat when middleware matcher covers the route
6. `undeclared-dep` — prepend `npm i <pkg>` for unlisted imports
7. `count-correct` / `count-strip` — rewrite cited counts that the verifier failed
8. `rendering-mode-mislabel` — warn on static-vs-ISR-vs-SSR mismatch
9. `unknown-citation` — strip URLs not in the allow-list, mark `needsReview`
10. `version-mismatch` — strip URLs whose `applicableFrameworks` doesn't include the user's `framework@version`
11. `missing-citation` — **last**: drops recs with empty `citations[]`

```js
import { applySanitizersBatch } from './lib/sanitizers/index.mjs';
const { kept, dropped } = await applySanitizersBatch(recs, {
  signals,            // for middleware-conflict + rendering-mode-mislabel
  package: pkgJson,   // for undeclared-dep
  framework, version, // for citation sanitizers
  verifyResults,      // for count-correct/strip (from verify-and-regen)
});
```

`dropped` is preserved for the report's "What we dropped" section so the customer sees what was sanitized and why.

### 3.5 Verify + grade + plan re-gen (one script)

All three steps are wrapped in `scripts/verify-and-regen.mjs`:

```bash
node scripts/verify-and-regen.mjs recommendations.json \
  --signals signals.json --repo-root <project-dir> --out verify.json
```

The script:
1. Extracts verifiable claims from each rec via `lib/extract-claims.mjs` (citations, affected files, finding refs, plus any explicit `rec.verifiableClaims`).
2. Verifies every claim in-process via `lib/verify-claim.mjs` (no subprocess fan-out). File checks accept both repo-relative paths and app-root-relative paths when `signals.project.rootDirectory` is known.
3. Grades each rec via `lib/grade-recommendation.mjs` on the four rubric axes (specificity, actionability, grounding, evidence) and assigns Excellent/Good/Fair/Poor.
4. Applies the quality floor (`overall < 0.55` → dropped).
5. Emits `verifiedRecommendations`, `withheldRecommendations`, and `renderableRecommendations` so humans and downstream tools do not need to infer which recommendations can appear in the customer report.
6. Emits a `regenPlan` for any rec where `passRate < 0.8 AND verifiableClaimCount >= 2`, with the top 5 failures attached as `topFailures` so the orchestrator can re-spawn the sub-agent with that feedback.
7. Emits a hard `regenPlan` trigger for project-config contradictions, cache-safety failures, and framework-semantic failures. Examples: a shared CDN cache recommendation for output that varies by Vercel geolocation must include `Vary: X-Vercel-IP-Country`; cache headers must have valid directive syntax; long shared caching for 404/not-found branches needs explicit freshness evidence or must stay uncached/short-lived; cache-tag invalidation claims must prove matching `revalidateTag()` / `updateTag()` evidence; lengthening `cacheLife()` for tagged content must prove matching tag invalidation for every affected tag; cache recommendations on error-heavy routes must acknowledge or exclude error traffic; dynamic routes must not get browser `immutable` caching unless the URL is byte-versioned; private-data parallelization must preserve auth/ownership guards; parallelization impact must not promise a helper-sized latency drop unless that helper/span was measured; CPU-bound or compile-bound parallelization needs measured wait/I/O evidence; a Next.js 16 cache recommendation must use stable `cacheLife` / `cacheTag` APIs; a Next.js 16 project with `cacheComponents=true` must prefer `use cache: remote` before lower-level Runtime Cache APIs; a Next.js 16 project with `cacheComponents=true` must not recommend removed route segment config like `dynamicParams`; Turbo build-cache recommendations must prove the build task has no migration side effects and has complete framework outputs; a route-error root-cause claim needs runtime logs or stack evidence. The report holds hard failures back until re-gen fixes them or abstains.

### 3.6 Re-gen (orchestrator's job)

For each entry in `regenPlan`, re-spawn the sub-agent with the same brief PLUS a `## Previous attempt failed these checks` section listing the `topFailures`. Re-run verify-and-regen on the re-gen output. Accept the re-gen only if `regenPassRate >= originalPassRate` AND citation count not gutted. Otherwise keep the original.

## Step 4 — Render the report

```bash
node scripts/render-report.mjs verify.json gate.json signals.json \
  --project <name> --out report.md --message-out final-message.json
```

Use `--debug-out debug.json` when developing the skill and you need internal verification fields (`quality`, `passRate`, sanitizer trail). The customer Markdown never includes those fields.

`render-report.mjs` is a pure deterministic renderer (`lib/render-report.mjs`). Same inputs → byte-identical output (modulo `generatedAt`). It applies the quality floor + platform cap + quick-wins extraction internally, then renders every section from [references/scoring.md](references/scoring.md):

- Cost breakdown — from `vercel usage` when present, else observability-derived GB-hr ranking
- Highest-impact recommendations — top 5 recs with readable metric labels + what-to-do + impact + citations
- Recommendations — partitioned High / Medium / Low + Quick wins table
- Detailed recommendations — full rec body (why / fix / before / after / verify / citations)
- Platform recommendations — capped at 3
- Observations from investigation — non-recommendation findings like deployment regressions, error storms, and metric mismatches
- Investigated, no change recommended — checked candidates where no supported recommendation shipped
- Not investigated in this run — held-back candidates grouped by reason (the trust mechanism)
- Strengths — derived from the signals (healthy cache hit rate, low cold starts, low 5xx)
- Configuration notes — project settings that affect interpretation but are not proof of optimization impact
- Data gaps — derived from the signals (no Observability Plus, no Core Web Vitals data, no ISR, no images, no middleware)

### 4.1 Manual rules the renderer encodes

- Drop recs with `quality.overall < 0.55`.
- Cap platform recs at 3.
- Extract quickWins (`effort=low AND priority > 40`).
- Dedupe overlapping recommendations before rendering. The customer-visible recommendation count is the report's **Coverage** line or `debug.json.renderedRecommendationCount`, not raw `verify.json.recsGraded.length`.
- Hold back recommendation records whose `candidateRef` is absent from the current run's launched/platform candidates. This catches stale temp files and gate-output mismatches.
- Hold back observations that make unsupported framework-causal claims, especially `notFound()` + `'use cache'` 5xx claims without runtime logs or official framework evidence.

### 4.2 Final response after rendering

After writing the report, print `final-message.json.body` verbatim and stop. The final chat response must contain exactly that body — no highlights, no debug notes, no "quick context," no sub-agent summary, no withheld-recommendation explanation, no extra paragraph. The renderer includes the report path, coverage line, and top ready recommendations; the full report keeps the evidence and no-change details.

Do not summarize from raw `verify.json` counts because render-time dedupe, platform caps, and hard-safety drops can change the customer-visible count. If you already printed a longer summary, correct it by printing only `final-message.json.body` in a new message.

Use customer terms:
- `recommendations ready`
- `observations from investigation`
- `investigated, no change recommended`

Avoid process terms in the final response:
- `sub-agent`
- `abstention`
- `passRate`
- `quality score`

### 4.3 Never recommend "verify X is on" for facts we already have

The Strengths section now surfaces deterministic project-config facts:
- **Fluid Compute status** (`signals.project.defaultResourceConfig.fluid`)
- **Function memory tier** (`functionDefaultMemoryType`: `standard` or `performance`)
- **Function regions** (`functionDefaultRegions`)
- **In-function concurrency** (`elasticConcurrencyEnabled`)
- **Default timeout** (`functionDefaultTimeout`)

**Never emit a recommendation that asks the user to "verify" any of the above.** If the project config loaded, the Strengths section already states the truth. If it didn't load (`signals.project.error` is set — usually auth scope mismatch), the gates for those features stay silent rather than guess.

Examples of the anti-pattern (do NOT emit these):

- ❌ "Verify Fluid Compute is on in Project Settings → Functions" — read `signals.project.defaultResourceConfig.fluid`.
- ❌ "Check what memory tier your functions are using" — it's in `functionDefaultMemoryType`.
- ❌ "Confirm you're deployed to the right region" — `functionDefaultRegions` is right there.

The deterministic facts replace these would-be recs. Spend the platform-rec budget (max 3) on things the customer can't see themselves.

### 4.2 Compute impact labels

For each rec, populate `impactLabel`:

- Performance: precise observed-data string (`"Reduce /api/products p95 from 850ms toward ~250-400ms"`).
- Cost: magnitude bucket via `impactMagnitude({currentCost, impactTier})` — phrases like `"hundreds of dollars per month at current traffic"`. **Never** `$N` literals.

### 4.3 Sort

Internal priority: `currentDimensionCost × fractionReduced × confidence`. Used only for ordering — never rendered.

### 4.4 Render the report

Follow the template in [references/scoring.md](references/scoring.md#the-customer-facing-report-template). The "Not investigated in this run" section pulls directly from `gated.json`. This earns trust by showing every signal we considered and the reason it was held back.

## Output template

Always end with a structured markdown report. The full template is in [references/scoring.md](references/scoring.md). Top-level shape:

```
# Vercel Optimization Report — <project>

**Stack** | **Plan** | **Period** | **Observability**

## Cost breakdown (precise observed billing)
## Highest-impact recommendations
## Recommendations (sorted by priority)
   ### High impact
   ### Medium impact
   ### Quick wins
## Platform recommendations (capped at 3)
## Observations from investigation
## Investigated, no change recommended
## Not investigated in this run (gated list grouped by reason)
## Strengths
## Data gaps
```

Never render precise dollar savings. Always anchor cost framing on "at current traffic." Performance numbers stay precise.

## Critical rules (the nine invariants)

1. **Observability before investigation.** No file read outside Step 1 may run before `signals.json` exists.
2. **Deterministic gate before sub-agent investigation.** `gate-investigations.mjs` decides launch/skip by threshold expression. No LLM in the gate. Failed gates appear in the report's "Not investigated in this run" section.
3. **Candidate-bound scope.** Every Step 2 file read happens because a candidate's `files` list points at it. No repo-wide grep.
4. **Cost framing is magnitude, never precise.** "Hundreds of dollars per month at current traffic" — never `$340/mo`. The `$-strip` sanitizer enforces this. Performance lines stay precise.
5. **No rec without evidence + citation.** Every rec ties to (a) ≥1 verified codebase finding AND (b) ≥1 citation from the curated library.
6. **No invented doc URLs.** The LLM may only cite URLs from `references/docs-library.json`. Out-of-library URLs → `unknown-citation` strips them.
7. **No version-mismatched citations.** `'use cache'` citation on a Next 13 project → `version-mismatch` strips it. Closes the "agent recommends features that don't exist in your version" failure mode.
8. **Verifier mechanical.** Claim verification uses grep/ast-grep/filesystem reads. No LLM "judgment" verification.
9. **Performance citations cite observed data.** Performance recs MUST cite the actual metric datum from `signals.json` (e.g., `signals.metrics.fnDurationP95ByRoute[/api/products].p95Ms=850`). Estimated improvements are ranges grounded in the observed baseline.

## Failure modes (verbatim user-facing copy)

If something goes wrong in any step, tell the user what happened and how to fix it. Use these templates:

**No traffic in last 14 days:**
> This project has no meaningful traffic in the last 14 days, so route-level metrics are sparse. I can still check traffic-independent scanner findings and platform settings, but I cannot rank route fixes until traffic accumulates.

**Route-level metrics unavailable:**
> Use the verbatim choice template in [references/observability-plus.md](references/observability-plus.md). Do NOT silently fall back to scanner-only mode; present the two-path choice: enable Observability Plus and re-run the metric-backed audit, or accept a limited scanner-only run.

**No `vercel.json` and the project isn't linked:**
> This worktree is not linked to a Vercel project. Run `vercel link --yes --project <project-name-or-id> --cwd <app-dir>` and rerun the audit. If the team is known, add `--team <team-id-or-slug>`.

**Most route → file mappings failed (monorepo with custom structure):**
> The route inventory matched fewer than half of the routes we saw in observability. This is common in monorepos with custom routing. I've surfaced what I can match; the rest appear in the "Not investigated in this run" section.

## Contributing

This is a living skill. New patterns, gates, support topics, and playbooks land via one-file PRs. See [CONTRIBUTING.md](CONTRIBUTING.md) for the common paths.
