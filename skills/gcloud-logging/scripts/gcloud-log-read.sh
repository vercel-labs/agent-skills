#!/usr/bin/env bash
# gcloud-log-read.sh — Wrapper around `gcloud logging read` with sensible defaults.
# Adds automatic time bounds, JSON output, and basic validation.
#
# Usage:
#   gcloud-log-read.sh --project PROJECT_ID --filter 'FILTER' [--limit N] [--hours H] [--since TS] [--until TS] [--output FILE]
#
# Examples:
#   # Last 2 hours of Cloud Run errors
#   gcloud-log-read.sh --project my-proj \
#     --filter 'resource.type="cloud_run_revision" resource.labels.service_name="api" severity>=ERROR' \
#     --hours 2
#
#   # Explicit time window, save to file
#   gcloud-log-read.sh --project my-proj \
#     --filter 'resource.type="cloud_function" resource.labels.function_name="riskEngine"' \
#     --since "2026-02-26T15:00:00Z" --until "2026-02-26T16:00:00Z" \
#     --output logs.json

set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────
LIMIT=200
HOURS=""
SINCE=""
UNTIL=""
PROJECT=""
FILTER=""
OUTPUT=""

usage() {
  cat <<'USAGE'
Usage: gcloud-log-read.sh [OPTIONS]

Required:
  --project PROJECT_ID   GCP project ID
  --filter  FILTER       Cloud Logging filter expression (DSL)

Optional:
  --limit   N            Max entries to return (default: 200)
  --hours   H            Look back H hours from now (generates timestamp bounds)
  --since   TIMESTAMP    Explicit start time (RFC 3339, e.g. 2026-02-26T15:00:00Z)
  --until   TIMESTAMP    Explicit end time   (RFC 3339)
  --output  FILE         Write JSON output to FILE instead of stdout

Time precedence: --since/--until override --hours if both are given.
USAGE
  exit 1
}

# ── Parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --filter)  FILTER="$2";  shift 2 ;;
    --limit)   LIMIT="$2";   shift 2 ;;
    --hours)   HOURS="$2";   shift 2 ;;
    --since)   SINCE="$2";   shift 2 ;;
    --until)   UNTIL="$2";   shift 2 ;;
    --output)  OUTPUT="$2";  shift 2 ;;
    -h|--help) usage ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      usage
      ;;
  esac
done

# ── Validate required args ───────────────────────────────────────────────────
if [[ -z "$PROJECT" ]]; then
  echo "Error: --project is required." >&2
  echo "  Hint: run 'gcloud config get-value project' to see your current default." >&2
  exit 1
fi

if [[ -z "$FILTER" ]]; then
  echo "Error: --filter is required." >&2
  echo "  Hint: start with 'resource.type=\"cloud_run_revision\"' and add labels." >&2
  exit 1
fi

# ── Check prerequisites ──────────────────────────────────────────────────────
if ! command -v gcloud &>/dev/null; then
  echo "Error: gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

# ── Build time bounds ─────────────────────────────────────────────────────────
TIME_FILTER=""

if [[ -n "$SINCE" || -n "$UNTIL" ]]; then
  [[ -n "$SINCE" ]] && TIME_FILTER="timestamp>=\"${SINCE}\""
  [[ -n "$UNTIL" ]] && TIME_FILTER="${TIME_FILTER:+$TIME_FILTER }timestamp<=\"${UNTIL}\""
elif [[ -n "$HOURS" ]]; then
  if command -v gdate &>/dev/null; then
    DATE_CMD="gdate"  # macOS with coreutils
  else
    DATE_CMD="date"
  fi
  SINCE_TS=$($DATE_CMD -u -d "${HOURS} hours ago" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || \
             $DATE_CMD -u -v-${HOURS}H +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)
  if [[ -z "$SINCE_TS" ]]; then
    echo "Warning: could not compute time offset. Proceeding without time bounds." >&2
  else
    TIME_FILTER="timestamp>=\"${SINCE_TS}\""
  fi
fi

# ── Assemble full filter ─────────────────────────────────────────────────────
FULL_FILTER="$FILTER"
if [[ -n "$TIME_FILTER" ]]; then
  FULL_FILTER="${FULL_FILTER} ${TIME_FILTER}"
fi

# ── Execute ───────────────────────────────────────────────────────────────────
echo "# Project: $PROJECT" >&2
echo "# Filter:  $FULL_FILTER" >&2
echo "# Limit:   $LIMIT" >&2

CMD=(gcloud logging read "$FULL_FILTER" --project="$PROJECT" --limit="$LIMIT" --format=json)

if [[ -n "$OUTPUT" ]]; then
  "${CMD[@]}" > "$OUTPUT"
  ENTRY_COUNT=$(jq 'length' "$OUTPUT" 2>/dev/null || echo "?")
  echo "# Written $ENTRY_COUNT entries to $OUTPUT" >&2
else
  "${CMD[@]}"
fi
