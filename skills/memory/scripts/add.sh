#!/bin/bash

# Add Memory Script
# Stores a dialogue/fact in SimpleMem
# Usage: ./add.sh "speaker" "content" ["timestamp"]

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
SPEAKER="${1:-}"
CONTENT="${2:-}"
TIMESTAMP="${3:-}"

if [ -z "$SPEAKER" ] || [ -z "$CONTENT" ]; then
    log_error "Usage: add.sh \"speaker\" \"content\" [\"timestamp\"]"
    echo "" >&2
    echo "Examples:" >&2
    echo "  add.sh \"user\" \"I prefer TypeScript\"" >&2
    echo "  add.sh \"team\" \"We chose PostgreSQL\" \"2025-01-15T14:00:00\"" >&2
    exit 1
fi

log_info "Adding memory..."
echo "Speaker: $SPEAKER" >&2
echo "Content: $CONTENT" >&2
if [ -n "$TIMESTAMP" ]; then
    echo "Timestamp: $TIMESTAMP" >&2
fi
echo "" >&2

# Activate virtual environment and run
cd "$SIMPLEMEM_DIR"
source .venv/bin/activate

if [ -n "$TIMESTAMP" ]; then
    python3 "$MEMORY_SCRIPT" add "$SPEAKER" "$CONTENT" --timestamp "$TIMESTAMP"
else
    python3 "$MEMORY_SCRIPT" add "$SPEAKER" "$CONTENT"
fi
