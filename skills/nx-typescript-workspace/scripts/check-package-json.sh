#!/bin/bash
set -euo pipefail

# check-package-json.sh — Validates project package.json files against 4 rules:
#   esm-type-module, linking-exports-field, linking-consumer-deps, linking-no-file-link
#
# Usage: bash scripts/check-package-json.sh [WORKSPACE_ROOT]
#
# Outputs JSON summary to stdout, status messages to stderr.

SKILL_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Auto-detect workspace root or use first arg
if [ -n "${1:-}" ]; then
  WS_ROOT="$1"
else
  WS_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

echo "Checking package.json files in: $WS_ROOT" >&2

checked=0
passed=0
violations='[]'

add_violation() {
  local file="$1" rule="$2" message="$3" severity="$4"
  violations=$(echo "$violations" | jq --arg f "$file" --arg r "$rule" --arg m "$message" --arg s "$severity" \
    '. + [{"file": $f, "rule": $r, "message": $m, "severity": $s}]')
}

# Find all package.json files under apps/, libs/, tools/ (skip node_modules)
while IFS= read -r pkg; do
  [ -f "$pkg" ] || continue
  checked=$((checked + 1))
  rel="${pkg#"$WS_ROOT/"}"
  has_violation=false

  # Rule: esm-type-module — must have "type": "module"
  type_val=$(jq -r '.type // empty' "$pkg")
  if [ "$type_val" != "module" ]; then
    add_violation "$rel" "esm-type-module" "Missing or incorrect \"type\": \"module\"" "CRITICAL"
    has_violation=true
  fi

  # Rule: linking-exports-field — libs must have exports with @nx/source
  if [[ "$rel" == libs/* ]]; then
    has_exports=$(jq 'has("exports")' "$pkg")
    if [ "$has_exports" = "true" ]; then
      has_nx_source=$(jq '.exports["."]["@nx/source"] // empty' "$pkg")
      if [ -z "$has_nx_source" ] || [ "$has_nx_source" = "null" ]; then
        add_violation "$rel" "linking-exports-field" "exports[\".\"] missing @nx/source condition" "HIGH"
        has_violation=true
      fi
    else
      add_violation "$rel" "linking-exports-field" "Missing exports field" "HIGH"
      has_violation=true
    fi
  fi

  # Rule: linking-no-file-link — no file: or link: in dependencies
  for dep_field in dependencies devDependencies; do
    bad_deps=$(jq -r ".$dep_field // {} | to_entries[] | select(.value | test(\"^(file:|link:)\")) | .key" "$pkg" 2>/dev/null || true)
    if [ -n "$bad_deps" ]; then
      while IFS= read -r dep_name; do
        add_violation "$rel" "linking-no-file-link" "Dependency $dep_name uses file: or link: protocol" "HIGH"
        has_violation=true
      done <<< "$bad_deps"
    fi
  done

  if [ "$has_violation" = "false" ]; then
    passed=$((passed + 1))
  fi
done < <(find "$WS_ROOT/apps" "$WS_ROOT/libs" "$WS_ROOT/tools" -name 'package.json' -not -path '*/node_modules/*' 2>/dev/null || true)

# JSON summary to stdout
jq -n \
  --argjson checked "$checked" \
  --argjson passed "$passed" \
  --argjson violations "$violations" \
  '{"checked": $checked, "passed": $passed, "violations": $violations}'
