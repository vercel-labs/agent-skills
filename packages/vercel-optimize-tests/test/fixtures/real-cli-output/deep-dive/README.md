# Deep-dive fixtures

Sanitized from a 2026-05-13 `fixture-app` Vercel CLI v53.4.0 run. These are
trimmed CLI responses (`{query, summary, statistics}` only — the `data[]`
time-series array is stripped to keep fixtures small). Identifiers and route names are synthetic; metric shapes and numeric relationships are preserved.

## Empirical findings from `scripts/deep-dive.mjs` shake-out

1. **Route filter with brackets works without escaping.** `--filter "route eq
   '/dashboard/[sessionId]'"` returns 4923 invocations on fixture-app. No
   escaping or URL-encoding required; the CLI handles the brackets as part
   of the OData literal.

2. **OData `and` works.** `--filter "route eq 'R' and http_status ge '500'"`
   evaluates as expected. We compose this string verbatim in `lib/deep-dive.mjs`.

3. **Multi-aggregation does NOT work.** Passing `-a p50 -a p95` only honours
   the *last* `-a`. Each percentile (p50, p75, p95, p99) must be its own
   query. The deep-dive runner exploits Promise.all parallelism so the
   wall-clock cost is one CLI-round-trip per candidate, not four.

4. **`vercel.external_api_request.count` dimensions** (verified via
   `vercel metrics schema vercel.external_api_request.count`):
   `deployment_id, environment, error_code, fetch_type, function_region,
   http_status, origin_hostname, origin_path, origin_route, project_id,
   project_name, request_hostname, request_method, request_path`.
   The "calling route" dimension is `origin_route` (NOT `route` or
   `function_path`).

5. **`vercel.function_invocation.function_duration_ms` percentile aggregations
   supported:** `sum, persecond, percent, avg, min, max, p50, p75, p90, p95,
   p99, stddev`. Default is `avg`.

## Files

- `slow_route_latency_p95.json` — single-percentile latency query (no group-by, filter only)
- `slow_route_perDeployment.json` — p95 latency grouped by deployment_id
- `slow_route_startTypeSplit.json` — function_start_type split (hot/cold/prewarmed)
- `slow_route_statusDist.json` — http_status distribution
- `uncached_route_cacheBreakdown.json` — cache_result distribution on a route

Deployment identifiers are synthetic. No customer data is included.
