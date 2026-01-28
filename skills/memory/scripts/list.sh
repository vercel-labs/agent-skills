#!/bin/bash

# List Memories Script
# Shows stored memories
# Usage: ./list.sh [--limit N] [--category CATEGORY]

set -e

MEMORY_DIR="${HOME}/.claude/memory"
SIMPLEMEM_DIR="${MEMORY_DIR}/simplemem"
MEMORY_SCRIPT="${MEMORY_DIR}/memory.py"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
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
LIMIT=50
CATEGORY=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --limit)
            LIMIT="$2"
            shift 2
            ;;
        --category)
            CATEGORY="$2"
            shift 2
            ;;
        *)
            # Support positional limit for backwards compat
            if [[ "$1" =~ ^[0-9]+$ ]]; then
                LIMIT="$1"
            fi
            shift
            ;;
    esac
done

log_info "Listing memories (limit: $LIMIT)"
if [ -n "$CATEGORY" ]; then
    log_info "Category filter: $CATEGORY"
fi
echo "" >&2

# Build command arguments
CMD_ARGS="--limit $LIMIT"
if [ -n "$CATEGORY" ]; then
    CMD_ARGS="$CMD_ARGS --category $CATEGORY"
fi

# Activate virtual environment and run
cd "$SIMPLEMEM_DIR"
source .venv/bin/activate

python3 "$MEMORY_SCRIPT" list $CMD_ARGS
