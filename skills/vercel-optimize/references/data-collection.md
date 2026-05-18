# Data collection

What the skill collects in Step 1, where each signal comes from, and how it degrades when a capability is missing.

All shapes here are covered by sanitized CLI fixtures in `packages/vercel-optimize-tests/test/fixtures/real-cli-output/`.

## Table of contents

- [The `signals.json` shape](#the-signalsjson-shape)
- [Per-signal source matrix](#per-signal-source-matrix)
- [Error states and fallbacks](#error-states-and-fallbacks)
- [Real JSON shapes](#real-json-shapes)
- [Why we avoid stderr grep](#why-we-avoid-stderr-grep)

## The `signals.json` shape

`node scripts/collect-signals.mjs` emits the Vercel-side signal document. `node scripts/scan-codebase.mjs <repo-root>` emits the local codebase scan. `node scripts/merge-signals.mjs vercel-signals.json codebase.json --out signals.json` combines them into the artifact consumed by the gate, deep-dive, verifier, and renderer. The merge step also annotates scanner findings with route-level observability, `COLD-PATH`, or `NO-ROUTE-MAPPING`; scanner gates reject non-traffic-independent findings that do not carry one of those deterministic annotations.

The merged `signals.json` has this top-level shape:

```json
{
  "schemaVersion": "1.2",
  "collectedAt": "2026-05-12T20:48:44.123Z",
  "timeWindow": "14d",
  "projectId": "prj_xxx",
  "orgId": "team_xxx",
  "projectIdSource": "repo.json" | "project.json" | "arg" | "env",
  "frameworkSupport": {
    "ok": true,
    "status": "supported" | "limited" | "unsupported",
    "blocker": null | "unsupported_framework",
    "framework": "next",
    "label": "Next.js",
    "detail": "..."
  },
  "frameworkSupportBlocker": null | "unsupported_framework",
  "frameworkSupportDetail": "...",
  "observabilityPlus": true | false | null,
  "observabilityPlusPreflight": { /* public OpenAPI configuration probe result */ },
  "observabilityPlusUsable": true | false | null,
  "observabilityPlusBlocker": null | "no_oplus_probe" | "project_disabled" | "payment_required" | "forbidden" | "daily_quota_exceeded" | "project_not_found" | "not_linked" | "all_failed_other" | "no_traffic",
  "observabilityPlusBlockerDetail": "...",
  "plan": { "plan": "pro" | "enterprise" | "uncertain", "reason": "..." },
  "project": { /* /v9/projects/:id response, scoped to orgId via ?teamId */ },
  "contract": { "context": "...", "commitments": [], "totalCommitments": 0 },
  "usage": { /* vercel usage --format json --breakdown daily, or null */ },
  "usageError": null | "USAGE_UNAVAILABLE" | "EXIT_<n>",
  "stack": { /* framework + version + router + ORM + monorepo */ },
  "codebase": { /* scan-codebase output: stack + routes + findings */ },
  "metrics": { /* per-metric query results (only when observabilityPlus=true) */ },
  "metricsSchema": [ /* array of {id, description} */ ]
}
```

All metric queries use the same `timeWindow` constant (`14d`) — defined as `TIME_WINDOW` in [lib/queries.mjs](../lib/queries.mjs) and covered by the repo test suite. Mixing windows silently produces incompatible rollups; never pin a per-query `since`.

Downstream consumers reference `signals.<field>` paths verbatim. Bumping `schemaVersion` is required when any consumed path is renamed or removed.

## Per-signal source matrix

| Signal | CLI command | Required for | Fallback when missing |
|---|---|---|---|
| Auth | `vercel whoami` | Everything | Exit with "run `vercel login`" |
| CLI version | `vercel --version` | Everything | Exit with "upgrade to v53+" |
| Project ID + Org ID | `.vercel/repo.json` (newer) or `.vercel/project.json` (legacy) → `VERCEL_PROJECT_ID` + `VERCEL_ORG_ID` → argv | Everything | Exit with "run `vercel link` or pass projectId" |
| Framework support | local `package.json` via `detectStack()` + `classifyFrameworkSupport()` | Code-backed route recommendations | Stop before metric fan-out on unsupported frameworks unless the user chooses `--continue-unsupported-framework` |
| Observability Plus configuration | Public OpenAPI endpoint via `vercel api /v1/observability/manage/configuration/projects?teamId=<orgId>` | All `metrics.*` signals | Stop early when the team lacks Observability Plus or this project is disabled |
| Observability Plus metrics access | One canary `vercel metrics vercel.request.count --since 14d --limit 1`, then full fan-out only if it succeeds | All `metrics.*` signals | Set `observabilityPlusUsable=false` with blocker detail; emit a minimal blocker document before slower project config / usage collection unless `--continue-without-observability` is passed |
| Project config | `vercel api /v9/projects/:id?teamId=<orgId>` | Fluid Compute, BotID, Speed Insights, security flags | `{error: "..."}` placeholder; gates that need it skip |
| Plan tier | `vercel contract --format json --scope <orgId>` → `inferPlan()` | Cost-context framing only | `plan="uncertain"`; cost magnitudes still computed from `usage.services[].billedCost` |
| Billing usage | `vercel usage --format json --from <14d> --to <today> --group-by project --scope <orgId>` | Cost magnitude framing, billing-driven candidates | `null` + `usageError` set; cost magnitudes degrade to "small" by default |
| Stack | local `package.json` + dir scan | Version-aware citation filtering, scanner gating | "unknown" framework → all framework-specific citations filtered |
| `metrics.fnDurationP95ByRoute` | `vercel metrics vercel.function_invocation.function_duration_ms -a p95 --group-by route --since 14d` | `slow_route`, `platform_fluid_compute` gates | `{ok:false}`; gate emits no candidates |
| `metrics.requestsByRouteCache` | `vercel metrics vercel.request.count --group-by route --group-by cache_result --since 14d` | `uncached_route`, traffic-total computation | `{ok:false}` |
| `metrics.fnStatusByRoute` | `vercel metrics vercel.function_invocation.count --group-by route --group-by http_status --since 14d` | Canonical function-level 5xx source for `route_errors` and `slow_route` error disqualification | `{ok:false}`; fall back to `requestsByRouteStatus` only for older fixtures |
| `metrics.requestsByRouteStatus` | `vercel metrics vercel.request.count --group-by route --group-by http_status --since 14d` | Compatibility fallback for request-level status | `{ok:false}` |
| `metrics.externalApiP75` | `vercel metrics vercel.external_api_request.request_duration_ms -a p75 --group-by origin_hostname --since 14d` | `external_api_slow` gate | `{ok:false}` |
| `metrics.fnStartTypeByRoute` | `vercel metrics vercel.function_invocation.count -a sum --group-by route --group-by function_start_type --since 14d` | `cold_start`, `platform_fluid_compute` | `{ok:false}`; gate dormant. **`function_start_type` ∈ {cold,hot,prewarmed}** is the public way to read cold-start rate on CLI v53.4.0+ (replaces the old "not derivable" gap). |
| `metrics.fnGbHrByRoute` | `vercel metrics vercel.function_invocation.function_duration_gbhr -a sum --group-by route --since 14d` | Cost ranking / report breakdown | `{ok:false}` |
| `metrics.fnCpuMsByRoute` | `vercel metrics vercel.function_invocation.function_cpu_time_ms -a sum --group-by route --since 14d` | Active CPU ranking (Fluid Compute billing unit) | `{ok:false}` |
| `metrics.fnPeakMemoryByRoute` | `vercel metrics vercel.function_invocation.peak_memory_mb -a max --group-by route --since 14d` | `oversized_memory` gate | `{ok:false}` |
| `metrics.fnProvisionedMemoryByRoute` | `vercel metrics vercel.function_invocation.provisioned_memory_mb -a max --group-by route --since 14d` | `oversized_memory` gate | `{ok:false}` |
| `metrics.fnTtfbP95ByRoute` | `vercel metrics vercel.function_invocation.ttfb_ms -a p95 --group-by route --since 14d` | TTFB cross-check for slow routes | `{ok:false}` |
| `metrics.fdtByRoute` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by route --since 14d` | Bandwidth-cost ranking | `{ok:false}` |
| `metrics.fdtByBot` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by bot_category --since 14d` | Strengthens `platform_bot_protection` with observed bot bandwidth share | `{ok:false}`; gate falls back to config-only signal |
| `metrics.fdtByCache` | `vercel metrics vercel.request.fdt_total_bytes -a sum --group-by cache_result --since 14d` | Uncached-bandwidth narrative | `{ok:false}` |
| `metrics.middlewareCount` | `vercel metrics vercel.middleware_invocation.count -a sum --group-by request_path --since 14d` | `middleware_heavy` gate | `{ok:false}`; gate dormant |
| `metrics.middlewareDurationP95` | `vercel metrics vercel.middleware_invocation.duration_ms -a p95 --group-by request_path --since 14d` | Middleware latency narrative | `{ok:false}` |
| `metrics.isrReadsByRoute` | `vercel metrics vercel.isr_operation.read_units -a sum --group-by route --since 14d` | `isr_overrevalidation` gate (denominator) | `{ok:false}` |
| `metrics.isrWritesByRoute` | `vercel metrics vercel.isr_operation.write_units -a sum --group-by route --since 14d` | `isr_overrevalidation` gate (numerator) | `{ok:false}` |

**ISR read:write ratio caveat.** `isrReadsByRoute` exposes the **origin-tier** read count only. CDN-tier reads (regional cache hits that never reach the ISR origin) are not separately surfaced today and frequently dominate total read volume — Porsche PDP and Nectar Sleep audits both showed CDN reads at 71% / 80%+ of total. Before flagging "writes > reads" as inverted, the gate and report must (a) acknowledge CDN-tier reads aren't included, (b) corroborate with `requestsByRouteCache` `cache_result=HIT` share before alarming. A high origin-write rate alone does not imply pathological over-revalidation if the CDN is absorbing the steady-state read traffic.
| `metrics.imageCount`, `imageByHost`, `imageSourceBytes` | `vercel metrics vercel.image_transformation.*` | Image-optimization narrative | `{ok:false}` |
| `metrics.cwvLcpByRoute`, `cwvInpByRoute`, `cwvClsByRoute`, `cwvTtfbByRoute`, `cwvCount`, `cwvCountByRoute` | `vercel metrics vercel.speed_insights_metric.*` (`p75` for vitals, `sum` for counts) `--since 14d` | `cwv_poor` gate | Empty when Speed Insights not enabled on the project — gate stays dormant |
| `metrics.firewallByAction` | `vercel metrics vercel.firewall_action.count -a sum --group-by waf_action --since 14d` | Bot-protection narrative; shows existing managed rule activity | `{ok:false}` |
| `metrics.botIdChecks` | `vercel metrics vercel.bot_id_check.count -a sum --since 14d` | Confirms whether BotID is actively running | `{ok:false}` |
| `metrics.externalApiCount`, `externalApiBytes` | `vercel metrics vercel.external_api_request.*` grouped by `origin_hostname` | External-dependency cost narrative | `{ok:false}` |

## Error states and fallbacks

`lib/vercel.mjs`'s `runVercelJson()` parses stdout as JSON first (the most reliable signal — the CLI emits structured error payloads even when exit code is non-zero), and only falls back to stderr substring matching when JSON parsing fails:

| Code | Meaning | Skill behavior |
|---|---|---|
| `unsupported_framework` | Detected framework cannot reliably map Vercel route metrics back to source files | Stop before metric fan-out; ask whether to continue with a limited platform/scanner audit |
| `no_oplus_probe` | Observability Plus not enabled on team | Stop before full metric fan-out; ask whether to enable Observability Plus or run scanner-only |
| `project_disabled` | Observability Plus enabled for team but disabled for project | Stop before full metric fan-out; ask the user to enable Observability Plus for this project or continue scanner-only |
| `USAGE_UNAVAILABLE` | `vercel usage` 404 — team has no Costs feature enabled | `usage=null`; cost-tier gates emit lower-priority candidates; billing section of the report shows "unavailable" |
| `PROJECT_NOT_FOUND` | `vercel api /v9/projects/<id>` 404 (typically wrong scope) | `project={error}`; platform gates that depend on project config skip; report flags the data gap |
| `invalid_filter_dimension` / `invalid_dimension` | Metric query used a dimension the metric doesn't support | Metric returns `{ok:false, code, allowedValues}`; consumer can introspect and adjust |
| `NOT_LINKED` | The app directory is not linked in the way `vercel metrics` requires | Run `vercel link --yes --project <project-name-or-id> --cwd <app-dir>`; add `--team <team-id-or-slug>` when known. Passing only `VERCEL_PROJECT_ID` is not enough for route metrics if cwd is unlinked |
| `NOT_AUTH` | Session expired | Caller exits with "run `vercel login`" |
| `FORBIDDEN` | 403 — role lacks permission | Skip that endpoint; continue with degraded signal; surface in report |
| `RATE_LIMIT` | 429 from API | Treat as "missing data" (no retry implemented yet) |
| `EXIT_N` | Anything else | Treat as missing data; continue |

The skill never crashes the entire collection on a single endpoint failure. Every catch-block uses `?? null` or `?? {}` so the JSON output is always well-shaped.

## Real JSON shapes

### `vercel metrics <id> --format json`

```jsonc
{
  "query": {
    "metric": "vercel.request.count",
    "aggregation": "sum",
    "groupBy": ["route"],
    "startTime": "2026-04-13T04:00:00.000Z",
    "endTime": "2026-05-13T08:00:00.000Z",
    "granularity": { "hours": 4 }
  },
  "summary": [
    { "route": "/dashboard/[sessionId]", "vercel_request_count_sum": 4923 },
    { "route": "/sw.js",               "vercel_request_count_sum": 872 }
  ],
  "data": [
    { "timestamp": "2026-04-13T04:00:00.000Z", "vercel_request_count_sum": 0, "route": "/dashboard/[sessionId]" }
    /* ... */
  ],
  "statistics": { "bytesRead": 10267, "rowsRead": 947, "dbTimeSeconds": 0 }
}
```

Field naming rule: the metric ID's dots become underscores, and the aggregation suffix is appended — `vercel.request.count` + `sum` → `vercel_request_count_sum`. `lib/vercel.mjs::normalizeSummary()` flattens `summary[]` into `[{<dim>: v, ..., value: <n>}]`.

### `vercel metrics schema --format json`

Array of `{id, description}` entries — NOT an object. Many metric IDs in earlier docs don't exist: there is no `vercel.function.cold_starts`, no `vercel.cache.hits`. Cache state is the `cache_result` dimension on `vercel.request.count`.

### `vercel metrics <id> --filter "<bad>"`

```jsonc
{
  "error": {
    "code": "invalid_filter_dimension",
    "message": "Filter uses invalid dimension \"status\" for metric \"vercel.request.count\".",
    "allowedValues": [ "asn_id", ..., "http_status", ..., "route" ]
  }
}
```

Status filtering uses `http_status` (not `status`). Both `http_status eq '500'` and `http_status ge 500` work.

### `vercel api /v9/projects/<id>?teamId=<orgId>`

Top-level keys relevant to the skill (real, verified):
- `framework` (string, e.g. `"nextjs"`)
- `resourceConfig.fluid` (boolean) — **Fluid Compute toggle**
- `defaultResourceConfig.fluid` — template for new functions
- `security.botIdEnabled` (boolean) — **BotID toggle**
- `security.managedRules.bot_filter` (`{active, action}`) — firewall rule
- `speedInsights` (`{id, hasData}`)
- `webAnalytics` (`{id}`) — installed but `features.webAnalytics` says enabled state
- `nodeVersion` (e.g. `"22.x"`)

Calling without `?teamId=` returns 404 when the project belongs to a team other than the user's `currentTeam`.

### `vercel contract --format json`

```jsonc
{ "context": "example-team", "commitments": [], "totalCommitments": 0 }
```

`commitments[]` field names are not stable. `inferPlan()` tries `category`, `commitmentCategory`, and `type`; empty array → `plan="uncertain"`.

### `vercel usage --format json`

May return `Error: Costs not found (404)` on teams without the Costs feature. Treat as `USAGE_UNAVAILABLE` and degrade — the skill still produces a useful report from metrics + scanner.

## Why we avoid stderr grep

CLI error message strings are not stable contracts — they can change between versions. Detecting `OPLUS_REQUIRED` by greping `stderr.includes('Observability Plus')` will break the moment Vercel rewords the message.

`runVercelJson()` therefore:
1. Always tries to **parse stdout as JSON** first. Most failures emit a structured `{error:{code,message,allowedValues}}` payload that's deterministic.
2. Only falls back to a lower-case stderr substring match when stdout was not parseable JSON.
3. Categorizes anything unrecognized as `EXIT_N` and treats it as "missing data, continue."

The skill is correct without precise category detection. The categories exist to give the user better error messages, not to drive control flow.
