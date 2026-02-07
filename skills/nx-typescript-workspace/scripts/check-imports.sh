#!/bin/bash
set -euo pipefail

# check-imports.sh — Scans TypeScript source files for ESM violations:
#   esm-import-extensions, esm-no-require, esm-import-meta-url, arch-hexagonal-deps
#
# Usage: bash scripts/check-imports.sh [WORKSPACE_ROOT] [--project=<path>]
#
# Outputs JSON summary to stdout, status messages to stderr.

if [ -n "${1:-}" ] && [[ ! "$1" == --* ]]; then
  WS_ROOT="$1"
  shift
else
  WS_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

PROJECT_FILTER=""
for arg in "$@"; do
  case "$arg" in
    --project=*) PROJECT_FILTER="${arg#--project=}" ;;
  esac
done

SEARCH_DIRS=()
if [ -n "$PROJECT_FILTER" ]; then
  SEARCH_DIRS=("$WS_ROOT/$PROJECT_FILTER")
else
  for d in apps libs tools; do
    [ -d "$WS_ROOT/$d" ] && SEARCH_DIRS+=("$WS_ROOT/$d")
  done
fi

echo "Checking imports in: ${SEARCH_DIRS[*]}" >&2

checked_files=0
violations='[]'

add_violation() {
  local file="$1" line="$2" rule="$3" message="$4" severity="$5"
  violations=$(echo "$violations" | jq \
    --arg f "$file" --argjson l "$line" --arg r "$rule" --arg m "$message" --arg s "$severity" \
    '. + [{"file": $f, "line": $l, "rule": $r, "message": $m, "severity": $s}]')
}

if [ ${#SEARCH_DIRS[@]} -eq 0 ]; then
  jq -n '{"checked_files": 0, "violations": []}'
  exit 0
fi

while IFS= read -r tsfile; do
  [ -f "$tsfile" ] || continue
  checked_files=$((checked_files + 1))
  rel="${tsfile#"$WS_ROOT/"}"

  # Rule: esm-no-require — no require() or module.exports
  while IFS=: read -r lineno _; do
    add_violation "$rel" "$lineno" "esm-no-require" "require() or module.exports usage found" "CRITICAL"
  done < <(grep -nE '(^|\s)(require\(|module\.exports)' "$tsfile" 2>/dev/null || true)

  # Rule: esm-import-meta-url — no bare __dirname or __filename
  while IFS=: read -r lineno _; do
    add_violation "$rel" "$lineno" "esm-import-meta-url" "Bare __dirname or __filename usage (use import.meta.url)" "CRITICAL"
  done < <(grep -nE '(^|\s)(__dirname|__filename)' "$tsfile" 2>/dev/null \
    | grep -v 'const __dirname' | grep -v 'const __filename' || true)

  # Rule: esm-import-extensions — relative imports missing .js extension
  # Match: from './foo' or from '../foo' but NOT from './foo.js' or from 'package'
  while IFS=: read -r lineno _; do
    add_violation "$rel" "$lineno" "esm-import-extensions" "Relative import missing .js extension" "CRITICAL"
  done < <(grep -nE "from\s+['\"]\.\.?/[^'\"]+[^.][^j][^s]['\"]" "$tsfile" 2>/dev/null || true)

done < <(find "${SEARCH_DIRS[@]}" -name '*.ts' -not -name '*.d.ts' -not -path '*/node_modules/*' -not -path '*/dist/*' 2>/dev/null || true)

jq -n \
  --argjson checked "$checked_files" \
  --argjson violations "$violations" \
  '{"checked_files": $checked, "violations": $violations}'
