#!/usr/bin/env bash
# Usage: scripts/skill-import.sh <source-project-path> <skill-name> [options]
# Import a skill from a project's .cursor/skills/ into the agent-skills registry.
#
# Options:
#   --author=NAME    Set the author (default: felipeblassioli)
#   --scope=SCOPE    Set scope: global|project (default: global)
#   --targets=LIST   Comma-separated targets (default: cursor)
#   --tags=LIST      Comma-separated tags
#   --dry-run        Show what would be done
#   --force          Overwrite existing skill
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGISTRY="$REPO_ROOT/skill-registry.json"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
NC='\033[0m'

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <source-project-path> <skill-name> [options]" >&2
  echo "Example: $0 ~/dev/tmp/tguard-riskEngineV2 commit-hygiene --tags=git,conventions" >&2
  exit 1
fi

SOURCE_PROJECT="${1/#\~/$HOME}"
SKILL_NAME="$2"
shift 2

AUTHOR="felipeblassioli"
SCOPE="global"
TARGETS="cursor"
TAGS=""
DRY_RUN=false
FORCE=false

for arg in "$@"; do
  case "$arg" in
    --author=*)  AUTHOR="${arg#--author=}" ;;
    --scope=*)   SCOPE="${arg#--scope=}" ;;
    --targets=*) TARGETS="${arg#--targets=}" ;;
    --tags=*)    TAGS="${arg#--tags=}" ;;
    --dry-run)   DRY_RUN=true ;;
    --force)     FORCE=true ;;
    *)
      echo -e "${RED}Unknown option: $arg${NC}" >&2
      exit 1
      ;;
  esac
done

SOURCE_SKILL_DIR="$SOURCE_PROJECT/.cursor/skills/$SKILL_NAME"
DEST_SKILL_DIR="$REPO_ROOT/skills/$SKILL_NAME"

if [[ ! -d "$SOURCE_SKILL_DIR" ]]; then
  echo -e "${RED}Skill not found: $SOURCE_SKILL_DIR${NC}" >&2
  exit 1
fi

if [[ -d "$DEST_SKILL_DIR" && "$FORCE" == false ]]; then
  echo -e "${RED}Skill already exists: $DEST_SKILL_DIR${NC}" >&2
  echo "Use --force to overwrite." >&2
  exit 1
fi

# Extract version from SKILL.md frontmatter if available
extract_version() {
  local skill_md="$1/SKILL.md"
  if [[ -f "$skill_md" ]]; then
    local ver
    ver=$(sed -n '/^---$/,/^---$/p' "$skill_md" | grep -E '^\s*version:' | head -1 | sed "s/.*version:[[:space:]]*['\"]*//" | sed "s/['\"].*//")
    if [[ -n "$ver" ]]; then
      echo "$ver"
      return
    fi
  fi
  echo "1.0.0"
}

# Extract description from SKILL.md frontmatter
extract_description() {
  local skill_md="$1/SKILL.md"
  if [[ -f "$skill_md" ]]; then
    awk '
      BEGIN { in_frontmatter = 0; frontmatter_seen = 0; capture_multiline = 0; out = ""; printed = 0 }

      /^---$/ {
        if (frontmatter_seen == 0) {
          in_frontmatter = 1
          frontmatter_seen = 1
          next
        }
        if (in_frontmatter == 1) {
          in_frontmatter = 0
          exit
        }
      }

      in_frontmatter == 1 && /^description:[[:space:]]*/ {
        desc = $0
        sub(/^description:[[:space:]]*/, "", desc)
        if (desc == "" || desc ~ /^[>|]/) {
          capture_multiline = 1
          next
        }
        printed = 1
        print desc
        exit
      }

      in_frontmatter == 1 && capture_multiline == 1 {
        if ($0 ~ /^[[:alpha:]_][[:alnum:]_-]*:[[:space:]]*/) {
          printed = 1
          print out
          exit
        }
        line = $0
        sub(/^[[:space:]]+/, "", line)
        if (line != "") {
          if (out != "") out = out " "
          out = out line
        }
      }

      END {
        if (capture_multiline == 1 && out != "" && printed == 0) print out
      }
    ' "$skill_md"
  fi
}

VERSION=$(extract_version "$SOURCE_SKILL_DIR")
DESCRIPTION=$(extract_description "$SOURCE_SKILL_DIR")

echo -e "${BOLD}Importing skill: $SKILL_NAME${NC}"
echo -e "  Source:      $SOURCE_SKILL_DIR"
echo -e "  Destination: $DEST_SKILL_DIR"
echo -e "  Version:     $VERSION"
echo -e "  Author:      $AUTHOR"
echo -e "  Scope:       $SCOPE"
echo -e "  Targets:     $TARGETS"
[[ -n "$TAGS" ]] && echo -e "  Tags:        $TAGS"
echo ""

if [[ "$DRY_RUN" == true ]]; then
  echo -e "${YELLOW}Dry run — no changes made.${NC}"
  exit 0
fi

# Copy skill directory
mkdir -p "$DEST_SKILL_DIR"
rsync -a --delete "$SOURCE_SKILL_DIR/" "$DEST_SKILL_DIR/"
echo -e "  ${GREEN}copied${NC} skill files"

# Create metadata.json if it doesn't exist
METADATA_FILE="$DEST_SKILL_DIR/metadata.json"
if [[ ! -f "$METADATA_FILE" ]]; then
  local_date=$(date '+%B %Y')
  cat > "$METADATA_FILE" << EOF
{
  "version": "$VERSION",
  "author": "$AUTHOR",
  "date": "$local_date",
  "abstract": "$DESCRIPTION"
}
EOF
  echo -e "  ${GREEN}created${NC} metadata.json"
fi

# Build targets JSON array
TARGETS_JSON=$(echo "$TARGETS" | tr ',' '\n' | jq -R . | jq -s .)

# Build tags JSON array
if [[ -n "$TAGS" ]]; then
  TAGS_JSON=$(echo "$TAGS" | tr ',' '\n' | jq -R . | jq -s .)
else
  TAGS_JSON="[]"
fi

# Update skill-registry.json
jq --arg name "$SKILL_NAME" \
   --arg version "$VERSION" \
   --arg author "$AUTHOR" \
   --arg scope "$SCOPE" \
   --arg desc "$DESCRIPTION" \
   --argjson targets "$TARGETS_JSON" \
   --argjson tags "$TAGS_JSON" \
   '.skills[$name] = {
      version: $version,
      author: $author,
      scope: $scope,
      targets: $targets,
      tags: $tags,
      description: $desc
    }' "$REGISTRY" > "$REGISTRY.tmp" && mv "$REGISTRY.tmp" "$REGISTRY"
echo -e "  ${GREEN}updated${NC} skill-registry.json"

echo -e "\n${GREEN}Import complete.${NC}"
echo -e "Next steps:"
echo -e "  1. Review the imported skill: ${BOLD}ls $DEST_SKILL_DIR${NC}"
echo -e "  2. Deploy to targets: ${BOLD}bash scripts/skill-sync.sh --skill=$SKILL_NAME${NC}"
echo -e "  3. Commit: ${BOLD}git add skills/$SKILL_NAME skill-registry.json && git commit${NC}"
