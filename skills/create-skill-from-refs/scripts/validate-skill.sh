#!/usr/bin/env bash
# Usage: scripts/validate-skill.sh <skill-directory>
# Validates a Cursor Agent Skill directory for structural correctness.
# Returns JSON with pass/fail results and any errors found.
set -euo pipefail

SKILL_DIR="${1:?Usage: validate-skill.sh <skill-directory>}"
SKILL_DIR="${SKILL_DIR%/}"
SKILL_FILE="$SKILL_DIR/SKILL.md"

errors=()
warnings=()

add_error() { errors+=("$1"); }
add_warning() { warnings+=("$1"); }

# --- SKILL.md existence ---
if [[ ! -f "$SKILL_FILE" ]]; then
  echo '{"pass":false,"errors":["SKILL.md not found at '"$SKILL_FILE"'"],"warnings":[]}'
  exit 1
fi

# --- Frontmatter presence ---
first_line=$(head -n1 "$SKILL_FILE")
if [[ "$first_line" != "---" ]]; then
  add_error "SKILL.md must start with YAML frontmatter (---)"
fi

# --- Extract frontmatter (between first and second ---) ---
frontmatter=$(awk '/^---$/{n++; next} n==1{print} n>=2{exit}' "$SKILL_FILE")

# --- name field ---
name_value=$(echo "$frontmatter" | grep -E '^name:\s*' | head -1 | sed 's/^name:\s*//' | tr -d '[:space:]')
if [[ -z "$name_value" ]]; then
  add_error "Missing required field: name"
else
  folder_name=$(basename "$SKILL_DIR")
  if [[ "$name_value" != "$folder_name" ]]; then
    add_error "name '$name_value' does not match folder name '$folder_name'"
  fi
  if [[ ${#name_value} -gt 64 ]]; then
    add_error "name exceeds 64 characters (${#name_value})"
  fi
  if ! echo "$name_value" | grep -qE '^[a-z0-9-]+$'; then
    add_error "name contains invalid characters (allowed: lowercase, digits, hyphens)"
  fi
fi

# --- description field ---
desc_value=$(echo "$frontmatter" | grep -E '^description:' | head -1 | sed 's/^description:\s*//')
if [[ -z "$desc_value" ]]; then
  desc_multiline=$(echo "$frontmatter" | awk '/^description:/{found=1; next} found && /^  /{print; next} found{exit}')
  if [[ -z "$desc_multiline" ]]; then
    add_error "Missing required field: description"
  fi
fi

# --- Line count ---
line_count=$(wc -l < "$SKILL_FILE" | tr -d '[:space:]')
if [[ "$line_count" -gt 500 ]]; then
  add_error "SKILL.md exceeds 500 lines ($line_count lines)"
elif [[ "$line_count" -gt 400 ]]; then
  add_warning "SKILL.md is $line_count lines (approaching 500-line limit)"
fi

# --- Empty directories ---
while IFS= read -r dir; do
  count=$(find "$dir" -maxdepth 1 -type f 2>/dev/null | wc -l | tr -d '[:space:]')
  if [[ "$count" -eq 0 ]]; then
    sub_count=$(find "$dir" -mindepth 2 -type f 2>/dev/null | wc -l | tr -d '[:space:]')
    if [[ "$sub_count" -eq 0 ]]; then
      add_warning "Empty directory: ${dir#$SKILL_DIR/}"
    fi
  fi
done < <(find "$SKILL_DIR" -mindepth 1 -type d 2>/dev/null)

# --- Windows paths (look for word\word patterns, not markdown escapes) ---
if grep -rqE '[a-zA-Z0-9]\\[a-zA-Z0-9]' --include='*.md' "$SKILL_DIR" 2>/dev/null; then
  add_warning "Possible Windows-style paths (backslashes) found in markdown files"
fi

# --- Broken internal references (only check paths within the skill tree) ---
body=$(awk '/^---$/{n++; next} n>=2{print}' "$SKILL_FILE")
while IFS= read -r ref; do
  ref_path="$SKILL_DIR/$ref"
  if [[ ! -e "$ref_path" ]]; then
    add_error "Broken reference in SKILL.md: $ref (file not found)"
  fi
done < <(echo "$body" | grep -oE '\]\([^)]+\)' | sed 's/\](//;s/)$//' \
  | grep -vE '^https?://' \
  | grep -E '^(references/|assets/|scripts/|\./)'  || true)

# --- Script executability ---
if [[ -d "$SKILL_DIR/scripts" ]]; then
  while IFS= read -r script; do
    if [[ ! -x "$script" ]]; then
      add_warning "Script not executable: ${script#$SKILL_DIR/}"
    fi
  done < <(find "$SKILL_DIR/scripts" -type f -name '*.sh' 2>/dev/null)
fi

# --- Output JSON ---
pass=true
if [[ ${#errors[@]} -gt 0 ]]; then
  pass=false
fi

if [[ ${#errors[@]} -gt 0 ]]; then
  errors_json=$(printf '%s\n' "${errors[@]}" | jq -R . | jq -s .)
else
  errors_json='[]'
fi

if [[ ${#warnings[@]} -gt 0 ]]; then
  warnings_json=$(printf '%s\n' "${warnings[@]}" | jq -R . | jq -s .)
else
  warnings_json='[]'
fi

jq -n \
  --argjson pass "$pass" \
  --argjson errors "$errors_json" \
  --argjson warnings "$warnings_json" \
  --arg lines "$line_count" \
  --arg name "${name_value:-}" \
  --arg folder "$(basename "$SKILL_DIR")" \
  '{
    pass: $pass,
    skill: $folder,
    name_field: $name,
    lines: ($lines | tonumber),
    errors: $errors,
    warnings: $warnings
  }'
