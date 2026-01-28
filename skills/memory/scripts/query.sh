#!/bin/bash

# Query Memory Script
# Searches memories semantically
# Usage: ./query.sh "question"

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
QUESTION="${1:-}"

if [ -z "$QUESTION" ]; then
    log_error "Usage: query.sh \"question\""
    echo "" >&2
    echo "Examples:" >&2
    echo "  query.sh \"What programming language does the user prefer?\"" >&2
    echo "  query.sh \"What database are we using?\"" >&2
    echo "  query.sh \"When is the next meeting?\"" >&2
    exit 1
fi

log_info "Searching memories for: \"$QUESTION\""
echo "" >&2

# Activate virtual environment and run
cd "$SIMPLEMEM_DIR"
source .venv/bin/activate

python3 "$MEMORY_SCRIPT" query "$QUESTION"
