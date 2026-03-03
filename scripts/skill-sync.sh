#!/usr/bin/env bash
# Usage: scripts/skill-sync.sh [options]
# Deploy skills from the registry to their configured target paths.
#
# Options:
#   --skill=NAME     Deploy only the named skill
#   --scope=SCOPE    Deploy only skills with this scope (global|project)
#   --target=TARGET  Deploy only to this target (cursor|agents|claude)
#   --dry-run        Show what would be done without making changes
#   --force          Overwrite even if target version matches
#   --list           List all skills and their deploy status
#   --help           Show this help
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$REPO_ROOT/skill-registry.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

DRY_RUN=false
FORCE=false
FILTER_SKILL=""
FILTER_SCOPE=""
FILTER_TARGET=""
LIST_MODE=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY_RUN=true ;;
    --force)       FORCE=true ;;
    --list)        LIST_MODE=true ;;
    --skill=*)     FILTER_SKILL="${arg#--skill=}" ;;
    --scope=*)     FILTER_SCOPE="${arg#--scope=}" ;;
    --target=*)    FILTER_TARGET="${arg#--target=}" ;;
    --help)
      head -13 "$0" | tail -11
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}" >&2
      exit 1
      ;;
  esac
done

if [[ ! -f "$REGISTRY" ]]; then
  echo -e "${RED}Registry not found: $REGISTRY${NC}" >&2
  exit 1
fi

resolve_target_path() {
  local target="$1"
  local path
  path=$(jq -r ".targetPaths[\"$target\"] // empty" "$REGISTRY")
  echo "${path/#\~/$HOME}"
}

get_skill_source_dir() {
  local skill_name="$1"
  local custom_path
  custom_path=$(jq -r ".skills[\"$skill_name\"].path // empty" "$REGISTRY")
  if [[ -n "$custom_path" ]]; then
    echo "$REPO_ROOT/skills/$custom_path"
  else
    echo "$REPO_ROOT/skills/$skill_name"
  fi
}

get_installed_version() {
  local target_dir="$1"
  if [[ -f "$target_dir/metadata.json" ]]; then
    jq -r '.version // "unknown"' "$target_dir/metadata.json" 2>/dev/null || echo "unknown"
  elif [[ -f "$target_dir/SKILL.md" ]]; then
    # Try to extract version from SKILL.md frontmatter
    local ver
    ver=$(sed -n '/^---$/,/^---$/p' "$target_dir/SKILL.md" | grep -E '^\s*version:' | head -1 | sed "s/.*version:[[:space:]]*['\"]*//" | sed "s/['\"].*//")
    if [[ -n "$ver" ]]; then
      echo "$ver"
    else
      echo "unknown"
    fi
  else
    echo "not installed"
  fi
}

deploy_skill() {
  local skill_name="$1"
  local target="$2"
  local source_dir="$3"
  local target_base
  target_base=$(resolve_target_path "$target")
  local target_dir="$target_base/$skill_name"
  local registry_version
  registry_version=$(jq -r ".skills[\"$skill_name\"].version // \"unknown\"" "$REGISTRY")

  if [[ ! -d "$source_dir" ]]; then
    echo -e "  ${RED}SKIP${NC} source not found: $source_dir"
    return 1
  fi

  local installed_version
  installed_version=$(get_installed_version "$target_dir")

  if [[ "$FORCE" == false && "$installed_version" == "$registry_version" ]]; then
    echo -e "  ${CYAN}UP-TO-DATE${NC} $target/$skill_name ($installed_version)"
    return 0
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo -e "  ${YELLOW}DRY-RUN${NC} $source_dir -> $target_dir ($installed_version -> $registry_version)"
    return 0
  fi

  mkdir -p "$target_dir"
  rsync -a --delete \
    --exclude='.git' \
    --exclude='rules/' \
    --exclude='README.md' \
    "$source_dir/" "$target_dir/"

  echo -e "  ${GREEN}DEPLOYED${NC} $target/$skill_name ($installed_version -> $registry_version)"
}

list_skills() {
  echo -e "${BOLD}Skill Registry${NC} ($REGISTRY)"
  echo ""
  printf "  ${BOLD}%-35s %-10s %-18s %-15s %s${NC}\n" "SKILL" "VERSION" "AUTHOR" "SCOPE" "TARGETS"
  echo "  $(printf '%.0s-' {1..95})"

  local skills
  skills=$(jq -r '.skills | keys[]' "$REGISTRY")

  for skill_name in $skills; do
    if [[ -n "$FILTER_SKILL" && "$skill_name" != "$FILTER_SKILL" ]]; then continue; fi

    local version author scope targets_json
    version=$(jq -r ".skills[\"$skill_name\"].version" "$REGISTRY")
    author=$(jq -r ".skills[\"$skill_name\"].author" "$REGISTRY")
    scope=$(jq -r ".skills[\"$skill_name\"].scope" "$REGISTRY")
    targets_json=$(jq -r ".skills[\"$skill_name\"].targets | join(\", \")" "$REGISTRY")

    if [[ -n "$FILTER_SCOPE" && "$scope" != "$FILTER_SCOPE" ]]; then continue; fi

    # Check install status per target
    local status_parts=()
    local targets
    targets=$(jq -r ".skills[\"$skill_name\"].targets[]" "$REGISTRY")
    for t in $targets; do
      if [[ -n "$FILTER_TARGET" && "$t" != "$FILTER_TARGET" ]]; then continue; fi
      local tpath
      tpath=$(resolve_target_path "$t")
      local installed_ver
      installed_ver=$(get_installed_version "$tpath/$skill_name")
      if [[ "$installed_ver" == "not installed" ]]; then
        status_parts+=("${t}:${RED}missing${NC}")
      elif [[ "$installed_ver" == "$version" ]]; then
        status_parts+=("${t}:${GREEN}${installed_ver}${NC}")
      else
        status_parts+=("${t}:${YELLOW}${installed_ver}${NC}")
      fi
    done

    local status_str
    status_str=$(IFS=', '; echo "${status_parts[*]}")
    printf "  %-35s %-10s %-18s %-15s %b\n" "$skill_name" "$version" "$author" "$scope" "$status_str"
  done
  echo ""
}

sync_skills() {
  local skills
  skills=$(jq -r '.skills | keys[]' "$REGISTRY")
  local deployed=0
  local skipped=0
  local errors=0

  echo -e "${BOLD}Syncing skills...${NC}"
  echo ""

  for skill_name in $skills; do
    if [[ -n "$FILTER_SKILL" && "$skill_name" != "$FILTER_SKILL" ]]; then continue; fi

    local scope
    scope=$(jq -r ".skills[\"$skill_name\"].scope" "$REGISTRY")
    if [[ -n "$FILTER_SCOPE" && "$scope" != "$FILTER_SCOPE" ]]; then continue; fi

    local source_dir
    source_dir=$(get_skill_source_dir "$skill_name")

    echo -e "${BOLD}$skill_name${NC}"

    local targets
    targets=$(jq -r ".skills[\"$skill_name\"].targets[]" "$REGISTRY")
    for target in $targets; do
      if [[ -n "$FILTER_TARGET" && "$target" != "$FILTER_TARGET" ]]; then continue; fi
      if deploy_skill "$skill_name" "$target" "$source_dir"; then
        ((deployed++))
      else
        ((errors++))
      fi
    done
  done

  echo ""
  if [[ "$DRY_RUN" == true ]]; then
    echo -e "${YELLOW}Dry run complete.${NC} No changes made."
  else
    echo -e "${GREEN}Sync complete.${NC} Deployed: $deployed, Errors: $errors"
  fi
}

if [[ "$LIST_MODE" == true ]]; then
  list_skills
else
  sync_skills
fi
