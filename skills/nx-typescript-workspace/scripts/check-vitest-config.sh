#!/bin/bash
set -euo pipefail

# check-vitest-config.sh — Validates vitest.config.ts files against 4 rules:
#   testing-vitest-workspace-root, testing-import-meta-url,
#   testing-workspace-relative-include, build-rootdir-separation
#
# Usage: bash scripts/check-vitest-config.sh [WORKSPACE_ROOT]
#
# Outputs JSON summary to stdout, status messages to stderr.

if [ -n "${1:-}" ]; then
  WS_ROOT="$1"
else
  WS_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

echo "Checking vitest.config.ts files in: $WS_ROOT" >&2

checked=0
passed=0
violations='[]'

add_violation() {
  local file="$1" rule="$2" message="$3" severity="$4"
  violations=$(echo "$violations" | jq --arg f "$file" --arg r "$rule" --arg m "$message" --arg s "$severity" \
    '. + [{"file": $f, "rule": $r, "message": $m, "severity": $s}]')
}

while IFS= read -r config; do
  [ -f "$config" ] || continue
  checked=$((checked + 1))
  rel="${config#"$WS_ROOT/"}"
  has_violation=false
  content=$(<"$config")

  # Rule: testing-import-meta-url — must use import.meta.url pattern
  if ! echo "$content" | grep -q 'import\.meta\.url'; then
    add_violation "$rel" "testing-import-meta-url" "Missing import.meta.url pattern" "HIGH"
    has_violation=true
  fi

  # Rule: testing-import-meta-url — must use fileURLToPath
  if ! echo "$content" | grep -q 'fileURLToPath'; then
    add_violation "$rel" "testing-import-meta-url" "Missing fileURLToPath import" "HIGH"
    has_violation=true
  fi

  # Rule: testing-vitest-workspace-root — must set root
  if ! echo "$content" | grep -q 'root:'; then
    add_violation "$rel" "testing-vitest-workspace-root" "Missing root: workspaceRoot setting" "HIGH"
    has_violation=true
  fi

  # Rule: testing-workspace-relative-include — include should not start with src/
  if echo "$content" | grep -qE "include:.*\[.*'src/"; then
    add_violation "$rel" "testing-workspace-relative-include" "Include path appears relative to config dir, not workspace root" "HIGH"
    has_violation=true
  fi

  # Rule: build-rootdir-separation — vitest.config.ts should be in tsconfig.spec.json include
  config_dir=$(dirname "$config")
  spec_tsconfig="$config_dir/tsconfig.spec.json"
  if [ -f "$spec_tsconfig" ]; then
    if ! jq -e '.include | map(select(. == "vitest.config.ts")) | length > 0' "$spec_tsconfig" >/dev/null 2>&1; then
      add_violation "$rel" "build-rootdir-separation" "vitest.config.ts not found in tsconfig.spec.json include array" "HIGH"
      has_violation=true
    fi
  fi

  # Rule: build-rootdir-separation — vitest.config.ts should NOT be in tsconfig.lib.json include
  lib_tsconfig="$config_dir/tsconfig.lib.json"
  if [ -f "$lib_tsconfig" ]; then
    if jq -e '.include | map(select(. == "vitest.config.ts" or test("vitest"))) | length > 0' "$lib_tsconfig" >/dev/null 2>&1; then
      add_violation "$rel" "build-rootdir-separation" "vitest.config.ts found in tsconfig.lib.json include (should be in tsconfig.spec.json only)" "HIGH"
      has_violation=true
    fi
  fi

  if [ "$has_violation" = "false" ]; then
    passed=$((passed + 1))
  fi
done < <(find "$WS_ROOT/apps" "$WS_ROOT/libs" "$WS_ROOT/tools" -name 'vitest.config.ts' -not -path '*/node_modules/*' 2>/dev/null || true)

jq -n \
  --argjson checked "$checked" \
  --argjson passed "$passed" \
  --argjson violations "$violations" \
  '{"checked": $checked, "passed": $passed, "violations": $violations}'
