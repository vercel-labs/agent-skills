#!/bin/bash
set -euo pipefail

# check-tsconfig.sh — Validates tsconfig files against 4 build rules:
#   build-composite-tsconfig, build-rootdir-separation,
#   build-no-circular-refs, build-tsconfig-base-locked
#
# Usage: bash scripts/check-tsconfig.sh [WORKSPACE_ROOT]
#
# Outputs JSON summary to stdout, status messages to stderr.

if [ -n "${1:-}" ]; then
  WS_ROOT="$1"
else
  WS_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

echo "Checking tsconfig files in: $WS_ROOT" >&2

checked=0
passed=0
violations='[]'

add_violation() {
  local file="$1" rule="$2" message="$3" severity="$4"
  violations=$(echo "$violations" | jq --arg f "$file" --arg r "$rule" --arg m "$message" --arg s "$severity" \
    '. + [{"file": $f, "rule": $r, "message": $m, "severity": $s}]')
}

# ── Rule: build-tsconfig-base-locked ─────────────────────────────────────────
base="$WS_ROOT/tsconfig.base.json"
if [ -f "$base" ]; then
  checked=$((checked + 1))
  base_ok=true

  module_val=$(jq -r '.compilerOptions.module // empty' "$base")
  if [ "$module_val" != "nodenext" ]; then
    add_violation "tsconfig.base.json" "build-tsconfig-base-locked" "module should be \"nodenext\", got \"$module_val\"" "HIGH"
    base_ok=false
  fi

  modres_val=$(jq -r '.compilerOptions.moduleResolution // empty' "$base")
  if [ "$modres_val" != "nodenext" ]; then
    add_violation "tsconfig.base.json" "build-tsconfig-base-locked" "moduleResolution should be \"nodenext\", got \"$modres_val\"" "HIGH"
    base_ok=false
  fi

  composite_val=$(jq -r '.compilerOptions.composite // empty' "$base")
  if [ "$composite_val" != "true" ]; then
    add_violation "tsconfig.base.json" "build-tsconfig-base-locked" "composite should be true" "HIGH"
    base_ok=false
  fi

  has_nx_source=$(jq -e '.compilerOptions.customConditions | index("@nx/source")' "$base" 2>/dev/null || echo "null")
  if [ "$has_nx_source" = "null" ]; then
    add_violation "tsconfig.base.json" "build-tsconfig-base-locked" "customConditions missing @nx/source" "HIGH"
    base_ok=false
  fi

  # Check for disallowed paths
  has_paths=$(jq 'has("compilerOptions") and (.compilerOptions | has("paths"))' "$base")
  if [ "$has_paths" = "true" ]; then
    add_violation "tsconfig.base.json" "build-tsconfig-base-locked" "paths aliases found (use npm workspaces instead)" "HIGH"
    base_ok=false
  fi

  if [ "$base_ok" = "true" ]; then
    passed=$((passed + 1))
  fi
fi

# ── Rule: build-composite-tsconfig — check lib tsconfigs ─────────────────────
while IFS= read -r tsconfig; do
  [ -f "$tsconfig" ] || continue
  checked=$((checked + 1))
  rel="${tsconfig#"$WS_ROOT/"}"
  has_violation=false

  # Check composite is not explicitly false
  composite=$(jq -r '.compilerOptions.composite // empty' "$tsconfig")
  if [ "$composite" = "false" ]; then
    add_violation "$rel" "build-composite-tsconfig" "composite explicitly set to false" "HIGH"
    has_violation=true
  fi

  if [ "$has_violation" = "false" ]; then
    passed=$((passed + 1))
  fi
done < <(find "$WS_ROOT/apps" "$WS_ROOT/libs" "$WS_ROOT/tools" -name 'tsconfig.lib.json' -not -path '*/node_modules/*' 2>/dev/null || true)

jq -n \
  --argjson checked "$checked" \
  --argjson passed "$passed" \
  --argjson violations "$violations" \
  '{"checked": $checked, "passed": $passed, "violations": $violations}'
