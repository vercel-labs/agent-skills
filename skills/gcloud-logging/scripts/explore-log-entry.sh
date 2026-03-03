#!/usr/bin/env bash
# explore-log-entry.sh — Sample one log entry and print its structure.
# Use this to discover the correct resource.type, labels, and payload fields
# before writing a full query.
#
# Usage:
#   explore-log-entry.sh --project PROJECT_ID [OPTIONS]
#
# Options:
#   --project        PROJECT_ID  (required) GCP project
#   --resource-type  TYPE        Monitored resource type to query (default: cloud_run_revision)
#   --label          KEY=VALUE   Add a resource label filter (repeatable)
#   --filter         FILTER      Full custom filter (overrides --resource-type and --label)
#   --raw                        Print the full raw JSON entry instead of the summary
#
# Examples:
#   # Discover structure for a Cloud Run service
#   explore-log-entry.sh --project my-proj --resource-type cloud_run_revision --label service_name=api
#
#   # Discover structure for a Firebase function
#   explore-log-entry.sh --project my-proj --resource-type cloud_function --label function_name=riskEngine
#
#   # Custom filter
#   explore-log-entry.sh --project my-proj --filter 'resource.type="k8s_container" resource.labels.cluster_name="prod"'

set -euo pipefail

# ── Defaults ──────────────────────────────────────────────────────────────────
PROJECT=""
RESOURCE_TYPE="cloud_run_revision"
LABELS=()
CUSTOM_FILTER=""
RAW=false

usage() {
  cat <<'USAGE'
Usage: explore-log-entry.sh --project PROJECT_ID [OPTIONS]

Required:
  --project PROJECT_ID   GCP project ID

Optional:
  --resource-type TYPE   Monitored resource type (default: cloud_run_revision)
  --label KEY=VALUE      Resource label filter (repeatable)
  --filter FILTER        Custom filter (overrides --resource-type and --label)
  --raw                  Print full raw JSON entry
USAGE
  exit 1
}

# ── Parse args ────────────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)       PROJECT="$2";       shift 2 ;;
    --resource-type) RESOURCE_TYPE="$2"; shift 2 ;;
    --label)         LABELS+=("$2");     shift 2 ;;
    --filter)        CUSTOM_FILTER="$2"; shift 2 ;;
    --raw)           RAW=true;           shift ;;
    -h|--help)       usage ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      usage
      ;;
  esac
done

# ── Validate ──────────────────────────────────────────────────────────────────
if [[ -z "$PROJECT" ]]; then
  echo "Error: --project is required." >&2
  echo "  Hint: run 'gcloud config get-value project' to see your current default." >&2
  exit 1
fi

if ! command -v gcloud &>/dev/null; then
  echo "Error: gcloud CLI not found. Install: https://cloud.google.com/sdk/docs/install" >&2
  exit 1
fi

if ! command -v jq &>/dev/null; then
  echo "Error: jq is required. Install: https://stedolan.github.io/jq/download/" >&2
  exit 1
fi

# ── Build filter ──────────────────────────────────────────────────────────────
if [[ -n "$CUSTOM_FILTER" ]]; then
  FILTER="$CUSTOM_FILTER"
else
  FILTER="resource.type=\"${RESOURCE_TYPE}\""
  for lbl in "${LABELS[@]}"; do
    KEY="${lbl%%=*}"
    VALUE="${lbl#*=}"
    FILTER="$FILTER resource.labels.${KEY}=\"${VALUE}\""
  done
fi

echo "# Sampling 1 entry..." >&2
echo "# Project: $PROJECT" >&2
echo "# Filter:  $FILTER" >&2
echo "" >&2

# ── Fetch one entry ──────────────────────────────────────────────────────────
ENTRY=$(gcloud logging read "$FILTER" --project="$PROJECT" --limit=1 --format=json 2>&1)

if [[ "$ENTRY" == "[]" || -z "$ENTRY" ]]; then
  echo "No entries found for this filter." >&2
  echo "" >&2
  echo "Possible causes:" >&2
  echo "  1. Wrong resource.type — try a different --resource-type" >&2
  echo "  2. Wrong labels — check with 'gcloud logging read \"resource.type=\\\"${RESOURCE_TYPE}\\\"\" --project=$PROJECT --limit=1 --format=json'" >&2
  echo "  3. No recent logs — the default query window may be too narrow" >&2
  exit 1
fi

# ── Output ────────────────────────────────────────────────────────────────────
if $RAW; then
  echo "$ENTRY" | jq '.[0]'
  exit 0
fi

echo "$ENTRY" | jq -r '.[0] | "
═══════════════════════════════════════════════════════
 RESOURCE
═══════════════════════════════════════════════════════
 type:   \(.resource.type // "N/A")
 labels:
\((.resource.labels // {}) | to_entries | map("   \(.key): \(.value)") | join("\n"))

═══════════════════════════════════════════════════════
 ENTRY METADATA
═══════════════════════════════════════════════════════
 timestamp:  \(.timestamp // "N/A")
 severity:   \(.severity // "DEFAULT")
 logName:    \(.logName // "N/A")
 insertId:   \(.insertId // "N/A")
 trace:      \(.trace // "N/A")
 spanId:     \(.spanId // "N/A")

═══════════════════════════════════════════════════════
 PAYLOAD TYPE
═══════════════════════════════════════════════════════
 jsonPayload:  \(if .jsonPayload then "present" else "absent" end)
 textPayload:  \(if .textPayload then "present (\(.textPayload | length) chars)" else "absent" end)
 protoPayload: \(if .protoPayload then "present" else "absent" end)
\(if .jsonPayload then "
═══════════════════════════════════════════════════════
 jsonPayload KEYS (top-level)
═══════════════════════════════════════════════════════
\((.jsonPayload | keys_unsorted | map("   \(.)")) | join("\n"))
" else "" end)\(if .httpRequest then "
═══════════════════════════════════════════════════════
 httpRequest
═══════════════════════════════════════════════════════
 method: \(.httpRequest.requestMethod // "N/A")
 url:    \(.httpRequest.requestUrl // "N/A")
 status: \(.httpRequest.status // "N/A")
 latency: \(.httpRequest.latency // "N/A")
" else "" end)\(if .labels then "
═══════════════════════════════════════════════════════
 LABELS (entry-level)
═══════════════════════════════════════════════════════
\((.labels | to_entries | map("   \(.key): \(.value)")) | join("\n"))
" else "" end)"'

echo "" >&2
echo "# Tip: use --raw to see the full JSON entry" >&2
echo "# Tip: use the resource.type + labels above in your query filter" >&2
