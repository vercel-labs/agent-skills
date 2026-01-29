#!/bin/bash

# Sync Memory Script
# Exports memories to Claude Code's CLAUDE.md files
# Usage: ./sync.sh [target] [--category category]

set -e

MEMORY_DIR="${HOME}/.claude/memory"
SIMPLEMEM_DIR="${MEMORY_DIR}/simplemem"
MEMORY_SCRIPT="${MEMORY_DIR}/memory.py"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if setup has been run
if [ ! -d "$SIMPLEMEM_DIR" ] || [ ! -f "$MEMORY_SCRIPT" ]; then
    log_error "Memory skill not set up. Run setup.sh first:"
    echo "bash /mnt/skills/user/memory/scripts/setup.sh" >&2
    exit 1
fi

# Parse arguments
TARGET="${1:-user}"
CATEGORY=""
NO_MERGE=false

shift || true
while [[ $# -gt 0 ]]; do
    case $1 in
        --category)
            CATEGORY="$2"
            shift 2
            ;;
        --no-merge)
            NO_MERGE=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Validate target
if [[ ! "$TARGET" =~ ^(user|project|rules)$ ]]; then
    log_error "Invalid target: $TARGET"
    echo "" >&2
    echo "Usage: sync.sh [target] [--category category] [--no-merge]" >&2
    echo "" >&2
    echo "Targets:" >&2
    echo "  user    - Sync to ~/.claude/CLAUDE.md (personal, all projects)" >&2
    echo "  project - Sync to ./CLAUDE.md (shared with team via git)" >&2
    echo "  rules   - Sync to ./.claude/rules/*.md (modular topic files)" >&2
    echo "" >&2
    echo "Options:" >&2
    echo "  --category CATEGORY  Filter by category (preferences, decisions, etc.)" >&2
    echo "  --no-merge           Overwrite instead of merging with existing content" >&2
    exit 1
fi

# Determine target path for display
case $TARGET in
    user)
        TARGET_PATH="${HOME}/.claude/CLAUDE.md"
        ;;
    project)
        TARGET_PATH="$(pwd)/CLAUDE.md"
        ;;
    rules)
        TARGET_PATH="$(pwd)/.claude/rules/"
        ;;
esac

log_info "Syncing memories to: $TARGET_PATH"
if [ -n "$CATEGORY" ]; then
    log_info "Category filter: $CATEGORY"
fi
echo "" >&2

# Build command arguments
CMD_ARGS="$TARGET"
if [ -n "$CATEGORY" ]; then
    CMD_ARGS="$CMD_ARGS --category $CATEGORY"
fi
if [ "$NO_MERGE" = true ]; then
    CMD_ARGS="$CMD_ARGS --no-merge"
fi

# Activate virtual environment and run
cd "$SIMPLEMEM_DIR"
source .venv/bin/activate

python3 "$MEMORY_SCRIPT" sync $CMD_ARGS
