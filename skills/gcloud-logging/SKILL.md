---
name: gcloud-logging
description: >-
  Query and extract Google Cloud Logging entries using the Logging query language DSL
  and gcloud CLI. Covers Cloud Run, Firebase Functions (1st gen), GKE, Compute Engine,
  and other GCP resource types. Use when the user asks to read logs, debug Cloud Run errors,
  tail Firebase Functions output, build Logging filters, parse log entries, or investigate
  GCP service behavior via logs.
license: MIT
compatibility:
  - gcloud CLI installed and authenticated (`gcloud auth list`)
  - jq installed (used by helper scripts for JSON parsing)
  - Project ID accessible via `gcloud config get-value project` or passed explicitly
metadata:
  domain: observability
  cloud: gcp
  services: [cloud-logging, cloud-run, firebase-functions, gke, compute-engine]
disable-model-invocation: true
---

# Google Cloud Logging — Query & Extract

## When to use this skill

- Fetching logs from Cloud Run, Firebase Functions, GKE, Compute Engine, or any GCP resource
- Building Cloud Logging filter expressions (the DSL)
- Parsing JSON log output to extract timestamps, severity, payloads
- Investigating errors, latency, or unexpected behavior via logs
- Generating Logs Explorer URLs or deep links

## Delegate to the `log-reader` subagent when sensible

A companion subagent exists at `.cursor/agents/log-reader.md`. It runs in an isolated
context and returns a structured summary — keeping verbose JSON output out of the main
conversation.

**Delegate** (use the subagent) when:
- The investigation requires multiple iterative queries (discover shape → filter → refine → correlate)
- You expect more than ~20 log entries — raw JSON would bloat the parent context
- You need to correlate request logs with application logs via trace IDs
- The user is mid-task (e.g. implementing a fix) and needs log data without losing their working context

**Use this skill directly** (no subagent) when:
- You only need to build a single filter expression for the user to run
- The user explicitly asks you to show the raw output
- You need just 1-2 entries (e.g. sampling log shape) as a quick check

### How to delegate

Pass the subagent enough context to work independently:

```
/log-reader Investigate 500 errors on Cloud Run service "risk-engine"
in project "turbi-guard-dev", region us-central1, last 2 hours.
Look for stack traces and correlate with request logs via trace ID.
```

The subagent will use the scripts and recipes from this skill and return a
structured summary (log shape, filters used, key findings, root cause, next steps).

## Core workflow

### Step 1 — Identify the resource

Before writing any query, determine the **monitored resource type** and its labels.
If unsure, sample one entry first:

```bash
scripts/explore-log-entry.sh --project PROJECT_ID --resource-type cloud_run_revision --label service_name=SERVICE
```

This prints the entry's `resource.type`, `resource.labels`, and payload structure.

### Step 2 — Build the filter

Follow this checklist (order matters for performance):

1. `resource.type = "..."` — always start here
2. `resource.labels.* = "..."` — narrow to service/function/instance
3. `timestamp >= "..."` / `timestamp <= "..."` — bound the time window
4. `severity >= ERROR` (or other level) — if filtering by severity
5. `SEARCH("term")` or `jsonPayload.field =~ "regex"` — content matching last

**Boolean rules:**
- `AND` / `OR` / `NOT` must be UPPERCASE
- `AND` is implicit between comparisons (can be omitted)
- Always use parentheses when mixing `AND` + `OR`
- `-` (minus prefix) is equivalent to `NOT`

See [assets/query-recipes.md](assets/query-recipes.md) for ready-to-use filter templates.

### Step 3 — Execute the query

**Option A — Helper script (recommended for agents):**

```bash
scripts/gcloud-log-read.sh \
  --project PROJECT_ID \
  --filter 'resource.type="cloud_run_revision" resource.labels.service_name="myservice" severity>=ERROR' \
  --limit 100 \
  --hours 1
```

**Option B — Direct gcloud:**

```bash
gcloud logging read '
  resource.type="cloud_run_revision"
  resource.labels.service_name="myservice"
  severity>=ERROR
  timestamp>="2026-02-26T15:00:00Z"
  timestamp<="2026-02-26T16:00:00Z"
' --project PROJECT_ID --limit=200 --format=json
```

Always use `--format=json` for machine-readable output.

**Option C — Tail (live streaming):**

```bash
gcloud beta run services logs tail SERVICE --project PROJECT_ID
```

Requires the `log-streaming` gcloud component.

### Step 4 — Parse and extract

Pipe JSON output through `jq` or use the helper:

```bash
scripts/parse-log-entries.sh input.json --fields timestamp,severity,message
```

Common `jq` one-liners:

```bash
# Extract timestamp + severity + message from jsonPayload
jq -r '.[] | [.timestamp, .severity, (.jsonPayload.message // .textPayload // "N/A")] | @tsv'

# Count entries by severity
jq -r '.[].severity' | sort | uniq -c | sort -rn

# Filter to ERROR+ and extract trace IDs
jq '[.[] | select(.severity == "ERROR" or .severity == "CRITICAL") | {ts: .timestamp, trace: .trace, msg: .jsonPayload.message}]'
```

## DSL quick reference

### Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Equals | `severity = "ERROR"` |
| `!=` | Not equals | `severity != "DEFAULT"` |
| `>` `>=` `<` `<=` | Ordering | `severity >= ERROR` |
| `:` | Has / substring | `textPayload:"timeout"` |
| `=~` | Regex match (RE2) | `jsonPayload.msg =~ "err.*timeout"` |
| `!~` | Regex not match | `logName !~ "requests$"` |

### Built-in functions

| Function | Purpose | Example |
|----------|---------|---------|
| `SEARCH()` | Token-based search (fast, case-insensitive) | `SEARCH("connection refused")` |
| `SEARCH(field, q)` | Scoped token search | `SEARCH(jsonPayload, "OOM")` |
| `log_id()` | Match by log ID (no URL encoding) | `log_id("cloudaudit.googleapis.com/activity")` |
| `ip_in_net()` | IP in subnet check | `ip_in_net(httpRequest.remoteIp, "10.0.0.0/8")` |
| `sample()` | Deterministic sampling | `sample(insertId, 0.01)` |
| `cast()` | Type casting | `cast(timestamp, STRING, TIME_ZONE("America/Sao_Paulo"))` |
| `regexp_extract()` | Extract regex capture group | `regexp_extract(textPayload, "id=(\\d+)")` |

### Field existence & negation gotchas

- `field:*` — true only if field is explicitly present
- `NOT missingField=foo` — evaluates to **TRUE** (field absent → comparison fails → NOT flips)
- `missingField!=foo` — evaluates to **FALSE** (field absent → comparison fails)

### Indexed fields (prefer these for performance)

`resource.type`, `resource.labels.*`, `logName`, `severity`, `timestamp`, `insertId`,
`operation.id`, `trace`, `httpRequest.status`, `labels.*`

## Resource type quick reference

See [assets/resource-types.md](assets/resource-types.md) for the full table. Most common:

| Service | `resource.type` | Key labels |
|---------|-----------------|------------|
| Cloud Run (service) | `cloud_run_revision` | `service_name`, `revision_name`, `location` |
| Cloud Run (job) | `cloud_run_job` | `job_name`, `location` |
| Firebase Functions 1st gen | `cloud_function` | `function_name`, `region` |
| GKE container | `k8s_container` | `cluster_name`, `namespace_name`, `container_name` |
| Compute Engine | `gce_instance` | `instance_id`, `zone` |

## Utility scripts

All scripts live in [scripts/](scripts/) and are self-contained (Bash + jq).

| Script | Purpose | Usage |
|--------|---------|-------|
| `gcloud-log-read.sh` | Wrapper: builds filter, adds time bounds, outputs JSON | `scripts/gcloud-log-read.sh --project P --filter F --hours 2` |
| `parse-log-entries.sh` | Extract fields from JSON log output | `scripts/parse-log-entries.sh logs.json --fields severity,message` |
| `explore-log-entry.sh` | Sample 1 entry, print resource type + labels + payload keys | `scripts/explore-log-entry.sh --project P --resource-type T` |

## Additional resources

- Query recipe templates: [assets/query-recipes.md](assets/query-recipes.md)
- Resource type reference: [assets/resource-types.md](assets/resource-types.md)
