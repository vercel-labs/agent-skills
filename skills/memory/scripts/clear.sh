#!/bin/bash

# Clear Memories Script
# Removes all stored memories (requires confirmation)
# Usage: ./clear.sh --confirm

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
CONFIRM=false

for arg in "$@"; do
    case $arg in
        --confirm)
            CONFIRM=true
            shift
            ;;
    esac
done

if [ "$CONFIRM" != true ]; then
    log_warn "This will DELETE ALL stored memories!"
    echo "" >&2
    echo "To confirm, run:" >&2
    echo "  bash /mnt/skills/user/memory/scripts/clear.sh --confirm" >&2
    echo "" >&2
    echo '{"status": "error", "message": "Confirmation required. Use --confirm flag."}'
    exit 1
fi

log_info "Clearing all memories..."
echo "" >&2

# Activate virtual environment and run
cd "$SIMPLEMEM_DIR"
source .venv/bin/activate

python3 "$MEMORY_SCRIPT" clear --confirm
