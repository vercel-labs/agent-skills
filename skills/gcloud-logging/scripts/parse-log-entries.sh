#!/usr/bin/env bash
# parse-log-entries.sh — Extract and format fields from Cloud Logging JSON output.
#
# Usage:
#   parse-log-entries.sh INPUT [OPTIONS]
#
#   INPUT can be a file path or "-" for stdin.
#
# Options:
#   --fields FIELDS   Comma-separated list of fields to extract (default: timestamp,severity,message)
#   --format FORMAT   Output format: tsv (default), json, csv
#   --severity LEVEL  Filter to entries at or above this severity (DEBUG, INFO, NOTICE, WARNING, ERROR, CRITICAL)
#   --grep PATTERN    Only include entries where message matches this pattern (case-insensitive)
#
# Examples:
#   # Basic: extract default fields as TSV
#   parse-log-entries.sh logs.json
#
#   # Pipe from gcloud
#   gcloud logging read '...' --format=json | parse-log-entries.sh - --fields timestamp,severity,trace,message
#
#   # Filter to errors, output as JSON
#   parse-log-entries.sh logs.json --severity ERROR --format json
#
#   # Search within message
#   parse-log-entries.sh logs.json --grep "timeout"

set -euo pipefail

# ── Severity ordering ─────────────────────────────────────────────────────────
severity_rank() {
  case "$1" in
    DEFAULT)  echo 0 ;;
    DEBUG)    echo 100 ;;
    INFO)     echo 200 ;;
    NOTICE)   echo 300 ;;
    WARNING)  echo 400 ;;
    ERROR)    echo 500 ;;
    CRITICAL) echo 600 ;;
    ALERT)    echo 700 ;;
    EMERGENCY)echo 800 ;;
    *)        echo 0 ;;
  esac
}

# ── Defaults ──────────────────────────────────────────────────────────────────
INPUT=""
FIELDS="timestamp,severity,message"
FORMAT="tsv"
SEVERITY_FILTER=""
GREP_PATTERN=""

usage() {
  cat <<'USAGE'
Usage: parse-log-entries.sh INPUT [OPTIONS]

  INPUT              Path to JSON file from gcloud logging read, or "-" for stdin

Options:
  --fields FIELDS    Comma-separated fields (default: timestamp,severity,message)
                     Available: timestamp, severity, logName, trace, spanId, resource_type,
                     service_name, function_name, message, httpStatus, httpMethod, httpUrl,
                     insertId, labels (as JSON string)
  --format FORMAT    Output format: tsv (default), json, csv
  --severity LEVEL   Filter to entries >= this level
  --grep PATTERN     Filter entries where message matches (case-insensitive)
USAGE
  exit 1
}

# ── Parse args ────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo "Error: INPUT is required (file path or '-' for stdin)." >&2
  usage
fi

INPUT="$1"; shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fields)   FIELDS="$2";          shift 2 ;;
    --format)   FORMAT="$2";          shift 2 ;;
    --severity) SEVERITY_FILTER="$2"; shift 2 ;;
    --grep)     GREP_PATTERN="$2";    shift 2 ;;
    -h|--help)  usage ;;
    *)
      echo "Error: unknown argument '$1'" >&2
      usage
      ;;
  esac
done

# ── Validate ──────────────────────────────────────────────────────────────────
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required. Install: https://stedolan.github.io/jq/download/" >&2
  exit 1
fi

if [[ "$INPUT" != "-" && ! -f "$INPUT" ]]; then
  echo "Error: file not found: $INPUT" >&2
  exit 1
fi

# ── Build jq extraction ──────────────────────────────────────────────────────
# Map field names to jq expressions
field_to_jq() {
  case "$1" in
    timestamp)     echo '.timestamp // ""' ;;
    severity)      echo '.severity // "DEFAULT"' ;;
    logName)       echo '.logName // ""' ;;
    trace)         echo '.trace // ""' ;;
    spanId)        echo '.spanId // ""' ;;
    insertId)      echo '.insertId // ""' ;;
    resource_type) echo '.resource.type // ""' ;;
    service_name)  echo '(.resource.labels.service_name // .resource.labels.function_name // "")' ;;
    function_name) echo '(.resource.labels.function_name // "")' ;;
    message)       echo '(.jsonPayload.message // .jsonPayload.msg // .textPayload // "")' ;;
    httpStatus)    echo '(.httpRequest.status // "")' ;;
    httpMethod)    echo '(.httpRequest.requestMethod // "")' ;;
    httpUrl)       echo '(.httpRequest.requestUrl // "")' ;;
    labels)        echo '(.labels // {} | tostring)' ;;
    *)
      echo "Error: unknown field '$1'. Run with --help to see available fields." >&2
      exit 1
      ;;
  esac
}

IFS=',' read -ra FIELD_ARRAY <<< "$FIELDS"
JQ_FIELDS=()
for f in "${FIELD_ARRAY[@]}"; do
  JQ_FIELDS+=("$(field_to_jq "$f")")
done

# ── Build jq pipeline ────────────────────────────────────────────────────────
JQ_EXPR='.[]'

# Severity filter
if [[ -n "$SEVERITY_FILTER" ]]; then
  MIN_RANK=$(severity_rank "$SEVERITY_FILTER")
  JQ_EXPR="$JQ_EXPR | select(
    (if .severity == \"EMERGENCY\" then 800
     elif .severity == \"ALERT\" then 700
     elif .severity == \"CRITICAL\" then 600
     elif .severity == \"ERROR\" then 500
     elif .severity == \"WARNING\" then 400
     elif .severity == \"NOTICE\" then 300
     elif .severity == \"INFO\" then 200
     elif .severity == \"DEBUG\" then 100
     else 0 end) >= $MIN_RANK
  )"
fi

# Grep filter
if [[ -n "$GREP_PATTERN" ]]; then
  JQ_EXPR="$JQ_EXPR | select(
    ((.jsonPayload.message // .jsonPayload.msg // .textPayload // \"\") | test(\"$GREP_PATTERN\"; \"i\"))
  )"
fi

# Output formatting
case "$FORMAT" in
  tsv)
    JOINED=$(IFS=','; echo "${JQ_FIELDS[*]}")
    JQ_EXPR="[$JQ_EXPR | [$JOINED] | @tsv] | .[]"
    HEADER=$(echo "$FIELDS" | tr ',' '\t')
    echo "$HEADER"
    ;;
  csv)
    JOINED=$(IFS=','; echo "${JQ_FIELDS[*]}")
    JQ_EXPR="[$JQ_EXPR | [$JOINED] | @csv] | .[]"
    echo "$FIELDS"
    ;;
  json)
    OBJ_PARTS=""
    for i in "${!FIELD_ARRAY[@]}"; do
      [[ -n "$OBJ_PARTS" ]] && OBJ_PARTS="$OBJ_PARTS, "
      OBJ_PARTS="$OBJ_PARTS\"${FIELD_ARRAY[$i]}\": (${JQ_FIELDS[$i]})"
    done
    JQ_EXPR="[$JQ_EXPR | {$OBJ_PARTS}]"
    ;;
  *)
    echo "Error: unknown format '$FORMAT'. Use: tsv, json, csv" >&2
    exit 1
    ;;
esac

# ── Execute ───────────────────────────────────────────────────────────────────
if [[ "$INPUT" == "-" ]]; then
  jq -r "$JQ_EXPR"
else
  jq -r "$JQ_EXPR" "$INPUT"
fi
