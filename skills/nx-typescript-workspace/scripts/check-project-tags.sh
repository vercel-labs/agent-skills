#!/bin/bash
set -euo pipefail

# check-project-tags.sh — Validates project.json tags against 2 rules:
#   tags-required-dimensions, tags-hex-constraints
#
# Usage: bash scripts/check-project-tags.sh [WORKSPACE_ROOT]
#
# Outputs JSON summary to stdout, status messages to stderr.

if [ -n "${1:-}" ]; then
  WS_ROOT="$1"
else
  WS_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

echo "Checking project.json tags in: $WS_ROOT" >&2

checked=0
passed=0
violations='[]'

add_violation() {
  local file="$1" rule="$2" message="$3" severity="$4"
  violations=$(echo "$violations" | jq --arg f "$file" --arg r "$rule" --arg m "$message" --arg s "$severity" \
    '. + [{"file": $f, "rule": $r, "message": $m, "severity": $s}]')
}

while IFS= read -r project; do
  [ -f "$project" ] || continue
  checked=$((checked + 1))
  rel="${project#"$WS_ROOT/"}"
  has_violation=false

  tags=$(jq -r '.tags // [] | .[]' "$project" 2>/dev/null)

  # Rule: tags-required-dimensions — must have scope:* tag
  if ! echo "$tags" | grep -q '^scope:'; then
    add_violation "$rel" "tags-required-dimensions" "Missing required scope:* tag" "MEDIUM"
    has_violation=true
  fi

  # Rule: tags-required-dimensions — must have type:* tag
  if ! echo "$tags" | grep -q '^type:'; then
    add_violation "$rel" "tags-required-dimensions" "Missing required type:* tag" "MEDIUM"
    has_violation=true
  fi

  # Rule: tags-hex-constraints — domain must not depend on data/api/tool
  # (This checks tag declarations only; actual dependency check requires Nx graph)
  type_tag=$(echo "$tags" | grep '^type:' | head -1 || true)

  if [ "$type_tag" = "type:domain" ]; then
    project_dir=$(dirname "$project")
    pkg_json="$project_dir/package.json"
    if [ -f "$pkg_json" ]; then
      # Check if domain lib has infra dependencies (heuristic: kysely, express, pg, etc.)
      infra_deps=$(jq -r '.dependencies // {} | keys[]' "$pkg_json" 2>/dev/null \
        | grep -E '^(kysely|express|pg|@nestjs|fastify|typeorm|prisma)' || true)
      if [ -n "$infra_deps" ]; then
        add_violation "$rel" "tags-hex-constraints" "type:domain lib has infrastructure dependencies: $infra_deps" "HIGH"
        has_violation=true
      fi
    fi
  fi

  if [ "$has_violation" = "false" ]; then
    passed=$((passed + 1))
  fi
done < <(find "$WS_ROOT/apps" "$WS_ROOT/libs" "$WS_ROOT/tools" -name 'project.json' -not -path '*/node_modules/*' 2>/dev/null || true)

jq -n \
  --argjson checked "$checked" \
  --argjson passed "$passed" \
  --argjson violations "$violations" \
  '{"checked": $checked, "passed": $passed, "violations": $violations}'
