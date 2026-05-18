# Real CLI output fixtures

Sanitized from Vercel CLI v53.4.0 output against a fixture project. Identifiers, hostnames, and route names are synthetic; response shapes, metric names, dimensions, and numeric relationships are preserved for regression testing.

## Key shape findings

- **Metrics**: response is `{query, summary, data, statistics}` (NOT `{series:[]}`). `summary[]` is the grouped roll-up; `data[]` is the time-bucketed series. Field key is `<metric_id_with_dots_replaced_by_underscores>_<aggregation>`, e.g. `vercel_request_count_sum`, `vercel_function_invocation_function_duration_ms_p95`.
- **Metric IDs**: The function-duration metric is `vercel.function_invocation.function_duration_ms`. External APIs is `vercel.external_api_request.request_duration_ms`. There is NO `vercel.cache.hits` or `vercel.function.cold_starts` — cache state is a `cache_result` dimension on `vercel.request.count`.
- **Status filter**: field is `http_status` (not `status`). Both `http_status eq '500'` and `http_status ge 500` work.
- **Group by**: dimensions are documented in error response `allowedValues[]`. Available for `vercel.request.count` include `route`, `http_status`, `cache_result`, `request_path`, etc.
- **External API group-by**: `origin_hostname` (not `hostname`).
- **Project API**: `vercel api /v9/projects/<id>` returns 404 unless scoped to the team that owns the project. Pass `?teamId=<orgId>` from `.vercel/repo.json`.
- **Project schema**: `resourceConfig.fluid` is the Fluid Compute flag. Bot Protection state is `security.botIdEnabled` (top-level boolean) and `security.managedRules.bot_filter.active` (challenge action). Top-level `framework` is `"nextjs"` (NOT `"next"`).
- **Contract**: shape is `{context, commitments, totalCommitments}`. On this team `commitments=[]`. Plan-from-commitments is unreliable — fall back to "uncertain".
- **Usage**: returns `Error: Costs not found (404)` on teams without the Costs feature enabled. The skill must degrade gracefully.

## Metric coverage (added in v1.1)

Captures for every entry in `lib/queries.mjs`. Each fixture is a full untruncated CLI response (`summary` + `data` time-series + `statistics`). See `test/queries.test.mjs` for the normalizer contract.

Function-billing:
- `metrics-fn-start-type-by-route.json` — `vercel.function_invocation.count` × `(route, function_start_type)`. **Replaces the old "cold start not derivable" gap** — the `function_start_type` dimension exposes cold | hot | prewarmed in CLI v53.4.0.
- `metrics-fn-count-by-route-http-status.json` — `vercel.function_invocation.count` × `(route, http_status)`. Canonical function-level 5xx source for route-error gating and slow-route disqualification.
- `metrics-fn-peak-memory-by-route.json` + `metrics-fn-provisioned-memory-by-route.json` — peak vs provisioned MB per route. Feeds the `oversized_memory` gate; on fixture-app peak=310MB vs provisioned=1769MB (18%) demonstrates the right-sizing signal.
- `metrics-fn-gbhr-by-route.json`, `metrics-fn-cpu-by-route.json`, `metrics-fn-ttfb-p95-by-route.json` — Fluid Compute billing dimensions.

Request-level:
- `metrics-fdt-by-route.json` — bandwidth per route.
- `metrics-fdt-by-bot.json` — bandwidth by `bot_category`. Empty string `""` is the human bucket; non-empty values include `automated_browser`, `preview`, `browser_impersonation`, `http_client`, `client_anomaly`.
- `metrics-fdt-by-cache.json` — uncached vs cached bandwidth.

Middleware / ISR / Images:
- `metrics-middleware-count.json`, `metrics-middleware-duration-p95.json` — empty on fixture-app (no `middleware.ts`).
- `metrics-isr-reads-by-route.json`, `metrics-isr-writes-by-route.json` — 35 routes per file; non-zero rows exist for `/admin`, `/status`, `/`, etc.
- `metrics-image-*.json` — empty on fixture-app (no `next/image` usage in the window).

Speed Insights / Security / External:
- `metrics-cwv-*.json` — all empty (Speed Insights ID present in project config but no measurements in window).
- `metrics-firewall-by-action.json` — `allow=10256`, `challenge=21`.
- `metrics-bot-id-checks.json` — empty (BotID disabled).
- `metrics-external-api-count.json` + `metrics-external-api-bytes.json` — top hostnames + outgoing bytes per host.
