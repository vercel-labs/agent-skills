#!/usr/bin/env bash
# Usage: scripts/skill-version.sh <skill-name> [patch|minor|major]
# Bump the version of a skill in metadata.json, SKILL.md frontmatter,
# and skill-registry.json.
#
# Defaults to "patch" if no bump type is specified.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$REPO_ROOT/skill-registry.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <skill-name> [patch|minor|major]" >&2
  exit 1
fi

SKILL_NAME="$1"
BUMP_TYPE="${2:-patch}"

if [[ ! "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo -e "${RED}Invalid bump type: $BUMP_TYPE. Use patch, minor, or major.${NC}" >&2
  exit 1
fi

# Resolve skill source directory (respects custom path in registry)
get_skill_source_dir() {
  local skill_name="$1"
  local custom_path
  custom_path=$(jq -r ".skills[\"$skill_name\"].path // empty" "$REGISTRY" 2>/dev/null)
  if [[ -n "$custom_path" ]]; then
    echo "$REPO_ROOT/skills/$custom_path"
  else
    echo "$REPO_ROOT/skills/$skill_name"
  fi
}

SKILL_DIR=$(get_skill_source_dir "$SKILL_NAME")

if [[ ! -d "$SKILL_DIR" ]]; then
  echo -e "${RED}Skill directory not found: $SKILL_DIR${NC}" >&2
  exit 1
fi

bump_version() {
  local version="$1"
  local bump="$2"
  IFS='.' read -ra parts <<< "$version"

  local major="${parts[0]:-0}"
  local minor="${parts[1]:-0}"
  local patch="${parts[2]:-0}"

  case "$bump" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch) patch=$((patch + 1)) ;;
  esac

  echo "$major.$minor.$patch"
}

# Get current version from registry
CURRENT_VERSION=$(jq -r ".skills[\"$SKILL_NAME\"].version // \"0.0.0\"" "$REGISTRY")
NEW_VERSION=$(bump_version "$CURRENT_VERSION" "$BUMP_TYPE")

echo -e "${BOLD}$SKILL_NAME${NC}: $CURRENT_VERSION -> ${GREEN}$NEW_VERSION${NC} ($BUMP_TYPE)"

# 1. Update skill-registry.json
jq ".skills[\"$SKILL_NAME\"].version = \"$NEW_VERSION\"" "$REGISTRY" > "$REGISTRY.tmp" \
  && mv "$REGISTRY.tmp" "$REGISTRY"
echo -e "  ${GREEN}updated${NC} skill-registry.json"

# 2. Update metadata.json if it exists
METADATA_FILE="$SKILL_DIR/metadata.json"
if [[ ! -f "$METADATA_FILE" ]]; then
  METADATA_FILE="$SKILL_DIR/assets/metadata.json"
fi

if [[ -f "$METADATA_FILE" ]]; then
  jq ".version = \"$NEW_VERSION\"" "$METADATA_FILE" > "$METADATA_FILE.tmp" \
    && mv "$METADATA_FILE.tmp" "$METADATA_FILE"
  echo -e "  ${GREEN}updated${NC} $(basename "$METADATA_FILE")"
fi

# 3. Update SKILL.md frontmatter (metadata.version or version field)
SKILL_MD="$SKILL_DIR/SKILL.md"
if [[ -f "$SKILL_MD" ]]; then
  if grep -q "version:" "$SKILL_MD"; then
    # Replace version in frontmatter (handles both quoted and unquoted)
    sed -i '' -E "s/(version:[[:space:]]*)['\"]?[0-9]+\.[0-9]+\.[0-9]+['\"]?/\1\"$NEW_VERSION\"/" "$SKILL_MD"
    echo -e "  ${GREEN}updated${NC} SKILL.md frontmatter"
  else
    echo -e "  ${YELLOW}skipped${NC} SKILL.md (no version field in frontmatter)"
  fi
fi

echo -e "\n${GREEN}Done.${NC} Don't forget to commit and run ${BOLD}skill-sync.sh${NC} to deploy."
