#!/bin/bash
# /mnt/skills/user/vercel-cost-optimization/scripts/get-usage.sh
#
# Wraps `vercel usage --format json` for cost data collection.
# Outputs JSON usage data to stdout; status/error messages go to stderr.
#
# Usage:
#   get-usage.sh --from YYYY-MM-DD --to YYYY-MM-DD [--breakdown]

set -e

# ---------------------------------------------------------------------------
# Cleanup trap for any temp files created during execution
# ---------------------------------------------------------------------------
TMPFILES=()
cleanup() {
    for f in "${TMPFILES[@]}"; do
        [[ -f "$f" ]] && rm -f "$f"
    done
}
trap cleanup EXIT

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
FROM_DATE=""
TO_DATE=""
BREAKDOWN=false

usage() {
    cat >&2 <<EOF
Usage: $(basename "$0") --from YYYY-MM-DD --to YYYY-MM-DD [--breakdown]

Options:
  --from YYYY-MM-DD   Start date for usage query (required)
  --to   YYYY-MM-DD   End date for usage query (required)
  --breakdown         Include per-resource cost breakdown (optional)
  -h, --help          Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --from)
            FROM_DATE="$2"
            shift 2
            ;;
        --to)
            TO_DATE="$2"
            shift 2
            ;;
        --breakdown)
            BREAKDOWN=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "ERROR: Unknown argument: $1" >&2
            usage
            exit 1
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Validate required arguments
# ---------------------------------------------------------------------------
if [[ -z "$FROM_DATE" ]]; then
    echo "ERROR: --from date is required." >&2
    usage
    exit 1
fi

if [[ -z "$TO_DATE" ]]; then
    echo "ERROR: --to date is required." >&2
    usage
    exit 1
fi

DATE_REGEX='^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
if ! [[ "$FROM_DATE" =~ $DATE_REGEX ]]; then
    echo "ERROR: --from value '$FROM_DATE' is not a valid YYYY-MM-DD date." >&2
    exit 1
fi

if ! [[ "$TO_DATE" =~ $DATE_REGEX ]]; then
    echo "ERROR: --to value '$TO_DATE' is not a valid YYYY-MM-DD date." >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Verify vercel CLI is installed
# ---------------------------------------------------------------------------
if ! command -v vercel &>/dev/null; then
    echo "ERROR: 'vercel' CLI is not installed or not found in PATH." >&2
    echo "Install it with: npm install -g vercel" >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Verify vercel is authenticated
# ---------------------------------------------------------------------------
echo "Checking Vercel authentication..." >&2
if ! vercel whoami &>/dev/null; then
    echo "ERROR: Not authenticated with Vercel. Run 'vercel login' first." >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Build and execute the vercel usage command
# ---------------------------------------------------------------------------
CMD=(vercel usage --format json --from "$FROM_DATE" --to "$TO_DATE")

if [[ "$BREAKDOWN" == true ]]; then
    CMD+=(--breakdown)
fi

echo "Fetching Vercel usage data from $FROM_DATE to $TO_DATE..." >&2
if [[ "$BREAKDOWN" == true ]]; then
    echo "Breakdown mode enabled." >&2
fi

# Execute command; JSON goes to stdout, errors surface naturally to stderr
"${CMD[@]}"
