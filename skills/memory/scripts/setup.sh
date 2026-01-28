#!/bin/bash

# Memory Skill Setup Script
# Installs SimpleMem and configures integration with Claude Code memory
# Usage: ./setup.sh [--rebuild]

set -e

MEMORY_DIR="${HOME}/.claude/memory"
SIMPLEMEM_DIR="${MEMORY_DIR}/simplemem"
CONFIG_FILE="${MEMORY_DIR}/config.py"
DB_DIR="${MEMORY_DIR}/db"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Parse arguments
REBUILD=false
for arg in "$@"; do
    case $arg in
        --rebuild)
            REBUILD=true
            shift
            ;;
    esac
done

# Check Python version and find a suitable Python interpreter
check_python() {
    PYTHON_CMD=""

    # Try to find Python 3.10+
    for py_cmd in python3.12 python3.11 python3.10 python3; do
        if command -v "$py_cmd" &> /dev/null; then
            PY_VERSION=$("$py_cmd" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
            PY_MAJOR=$(echo $PY_VERSION | cut -d. -f1)
            PY_MINOR=$(echo $PY_VERSION | cut -d. -f2)

            if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 10 ]; then
                PYTHON_CMD="$py_cmd"
                PYTHON_VERSION="$PY_VERSION"
                break
            fi
        fi
    done

    if [ -z "$PYTHON_CMD" ]; then
        log_error "Python 3.10+ required but not found"
        log_error "Please install Python 3.10 or later"
        exit 1
    fi

    log_info "Python $PYTHON_VERSION detected ($PYTHON_CMD)"
    export PYTHON_CMD
}

# Check uv is installed
check_uv() {
    if ! command -v uv &> /dev/null; then
        log_warn "uv not found, installing..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        export PATH="$HOME/.cargo/bin:$PATH"
    fi
    log_info "uv package manager available"
}

# Create directory structure
setup_directories() {
    log_info "Creating directory structure..."
    mkdir -p "$MEMORY_DIR"
    mkdir -p "$DB_DIR"
}

# Clone or update SimpleMem
setup_simplemem() {
    if [ -d "$SIMPLEMEM_DIR" ] && [ "$REBUILD" = false ]; then
        log_info "SimpleMem already installed, pulling updates..."
        cd "$SIMPLEMEM_DIR"
        git pull origin main 2>/dev/null || log_warn "Could not pull updates"
    else
        if [ -d "$SIMPLEMEM_DIR" ]; then
            log_info "Rebuilding SimpleMem installation..."
            rm -rf "$SIMPLEMEM_DIR"
        fi
        log_info "Cloning SimpleMem repository..."
        git clone https://github.com/aiming-lab/SimpleMem.git "$SIMPLEMEM_DIR"
    fi
}

# Setup Python virtual environment and dependencies
setup_venv() {
    cd "$SIMPLEMEM_DIR"

    if [ -d ".venv" ] && [ "$REBUILD" = false ]; then
        log_info "Virtual environment exists, updating dependencies..."
    else
        log_info "Creating virtual environment with $PYTHON_CMD..."
        uv venv --python "$PYTHON_CMD" 2>/dev/null || uv venv
    fi

    log_info "Installing dependencies (this may take a few minutes)..."

    # Detect if CUDA is available
    HAS_CUDA=false
    if command -v nvidia-smi &> /dev/null; then
        if nvidia-smi &> /dev/null; then
            HAS_CUDA=true
            log_info "CUDA detected, installing with GPU support..."
        fi
    fi

    if [ "$HAS_CUDA" = true ]; then
        # Full installation with CUDA support
        uv pip install -r requirements.txt
    else
        # Non-CUDA installation (macOS, Linux without GPU, etc.)
        log_info "No CUDA detected, installing CPU-only dependencies..."

        # Filter out NVIDIA and triton packages
        grep -v -E "^nvidia-|^triton" requirements.txt > requirements-cpu.txt 2>/dev/null || true

        if [ -s requirements-cpu.txt ]; then
            uv pip install -r requirements-cpu.txt || {
                log_warn "Some packages failed, installing core dependencies..."
                install_core_packages
            }
        else
            install_core_packages
        fi
    fi

    # Install additional dependencies for Claude Code integration
    uv pip install pyyaml python-dateutil
}

# Install core packages without CUDA dependencies
install_core_packages() {
    log_info "Installing core packages..."
    uv pip install \
        "openai>=1.0.0" \
        "anthropic>=0.20.0" \
        "langchain>=0.1.0" \
        "langchain-openai>=0.0.5" \
        "sentence-transformers>=2.2.0" \
        "lancedb>=0.4.0" \
        "rank-bm25>=0.2.2" \
        "pydantic>=2.0.0" \
        "python-dotenv>=1.0.0" \
        "tqdm>=4.60.0" \
        "tenacity>=8.0.0" \
        "httpx>=0.24.0" \
        "aiohttp>=3.8.0" \
        "numpy>=1.24.0" \
        "pandas>=2.0.0" \
        "torch --index-url https://download.pytorch.org/whl/cpu" 2>/dev/null || \
        uv pip install "torch"
}

# Create config file
setup_config() {
    if [ -f "$CONFIG_FILE" ] && [ "$REBUILD" = false ]; then
        log_info "Config file exists, preserving..."
        return
    fi

    log_info "Creating config file..."

    cat > "$CONFIG_FILE" << 'EOF'
# SimpleMem Configuration for Claude Code Memory Skill
# Edit this file to configure your memory system

# API Configuration
# -----------------
# Set your OpenAI API key (or compatible endpoint)
OPENAI_API_KEY = ""  # Required: Add your API key here

# Optional: Use a different OpenAI-compatible endpoint
OPENAI_BASE_URL = None  # e.g., "https://api.openai.com/v1"

# Model Configuration
# -------------------
LLM_MODEL = "gpt-4.1-mini"  # Model for compression and answers
EMBEDDING_MODEL = "Qwen/Qwen3-Embedding-0.6B"  # Model for embeddings

# Enable deep thinking mode (better quality, slower)
ENABLE_DEEP_THINKING = False
ENABLE_STREAMING = False
FORCE_JSON_FORMAT = True

# Memory Processing
# -----------------
WINDOW_SIZE = 40  # Number of dialogues per compression window
OVERLAP = 2       # Overlap between processing windows

# Retrieval Configuration
# -----------------------
SEMANTIC_SEARCH_LIMIT = 25   # Max results from vector search
KEYWORD_SEARCH_LIMIT = 5     # Max results from keyword search
STRUCTURED_SEARCH_LIMIT = 5  # Max results from metadata search

# Database Configuration
# ----------------------
import os
LANCEDB_PATH = os.path.expanduser("~/.claude/memory/db/lancedb")

# Parallel Processing
# -------------------
ENABLE_PARALLEL_PROCESSING = True
MAX_PARALLEL_WORKERS = 8
ENABLE_PARALLEL_RETRIEVAL = True
MAX_RETRIEVAL_WORKERS = 4

# Planning and Reflection
# -----------------------
ENABLE_PLANNING = False
ENABLE_REFLECTION = False
MAX_REFLECTION_ROUNDS = 2

# Judge LLM (for evaluation, optional)
# ------------------------------------
JUDGE_OPENAI_API_KEY = None  # Use main key if None
JUDGE_OPENAI_BASE_URL = None
JUDGE_LLM_MODEL = "gpt-4.1-mini"
JUDGE_LLM_TEMPERATURE = 0.3
EOF

    log_info "Config file created at: $CONFIG_FILE"
    log_warn "Please edit $CONFIG_FILE and add your OPENAI_API_KEY"
}

# Create wrapper script for SimpleMem
create_wrapper() {
    log_info "Creating memory wrapper..."

    cat > "${MEMORY_DIR}/memory.py" << 'WRAPPER_EOF'
#!/usr/bin/env python3
"""
Memory Wrapper for Claude Code
Bridges SimpleMem with Claude Code's CLAUDE.md memory system
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# Add SimpleMem to path
SIMPLEMEM_DIR = Path(__file__).parent / "simplemem"
sys.path.insert(0, str(SIMPLEMEM_DIR))

# Load config
CONFIG_PATH = Path(__file__).parent / "config.py"
if CONFIG_PATH.exists():
    exec(open(CONFIG_PATH).read())

def get_system():
    """Initialize SimpleMem system"""
    from main import SimpleMemSystem
    return SimpleMemSystem(clear_db=False)

def add_memory(speaker: str, content: str, timestamp: str = None):
    """Add a dialogue to memory"""
    if timestamp is None:
        timestamp = datetime.now().isoformat()

    system = get_system()
    system.add_dialogue(speaker, content, timestamp)
    system.finalize()

    # Categorize the memory
    category = categorize_memory(content)

    return {
        "status": "success",
        "speaker": speaker,
        "content": content,
        "timestamp": timestamp,
        "category": category
    }

def query_memory(question: str):
    """Query memories semantically"""
    system = get_system()
    answer = system.ask(question)

    # Get relevant memories for context
    memories = system.get_all_memories()
    relevant = []
    for mem in memories[-10:]:  # Last 10 for context
        relevant.append({
            "content": mem.restatement if hasattr(mem, 'restatement') else str(mem),
            "timestamp": mem.timestamp if hasattr(mem, 'timestamp') else None
        })

    return {
        "status": "success",
        "answer": answer,
        "relevant_memories": relevant
    }

def list_memories(limit: int = 50, category: str = None):
    """List stored memories"""
    system = get_system()
    memories = system.get_all_memories()

    results = []
    for mem in memories[-limit:]:
        entry = {
            "content": mem.restatement if hasattr(mem, 'restatement') else str(mem),
            "timestamp": mem.timestamp if hasattr(mem, 'timestamp') else None,
            "category": categorize_memory(str(mem))
        }
        if category is None or entry["category"] == category:
            results.append(entry)

    return {
        "status": "success",
        "count": len(results),
        "memories": results
    }

def categorize_memory(content: str) -> str:
    """Categorize a memory based on content"""
    content_lower = content.lower()

    # Preference indicators
    if any(word in content_lower for word in ['prefer', 'like', 'want', 'use', 'always', 'never', 'favorite']):
        return 'preferences'

    # Decision indicators
    if any(word in content_lower for word in ['decided', 'chose', 'selected', 'will use', 'going with', 'decision']):
        return 'decisions'

    # People indicators
    if any(word in content_lower for word in ['is the', 'works at', 'manages', 'leads', 'contact']):
        return 'people'

    # Event indicators
    if any(word in content_lower for word in ['meeting', 'deadline', 'scheduled', 'tomorrow', 'friday', 'monday', 'date', 'time']):
        return 'events'

    # Context indicators
    if any(word in content_lower for word in ['project is', 'app is', 'system is', 'about', 'purpose']):
        return 'context'

    return 'facts'

def sync_to_claude_md(target: str = "user", category: str = None, merge: bool = True):
    """Sync memories to CLAUDE.md files"""
    memories = list_memories(limit=100, category=category)["memories"]

    if not memories:
        return {"status": "success", "synced": 0, "message": "No memories to sync"}

    # Determine target file
    if target == "user":
        target_file = Path.home() / ".claude" / "CLAUDE.md"
    elif target == "project":
        target_file = Path.cwd() / "CLAUDE.md"
    elif target == "rules":
        rules_dir = Path.cwd() / ".claude" / "rules"
        rules_dir.mkdir(parents=True, exist_ok=True)
        return sync_to_rules(memories, rules_dir)
    else:
        return {"status": "error", "message": f"Unknown target: {target}"}

    # Ensure parent directory exists
    target_file.parent.mkdir(parents=True, exist_ok=True)

    # Group memories by category
    by_category = {}
    for mem in memories:
        cat = mem["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(mem["content"])

    # Generate markdown content
    new_section = generate_memory_section(by_category)

    # Handle existing file
    if target_file.exists() and merge:
        existing = target_file.read_text()
        # Backup
        backup_file = target_file.with_suffix('.md.bak')
        backup_file.write_text(existing)

        # Remove old memory section if present
        if "# Memories (Synced from SimpleMem)" in existing:
            parts = existing.split("# Memories (Synced from SimpleMem)")
            # Find end of memory section (next # header or end of file)
            if len(parts) > 1:
                rest = parts[1]
                next_section = rest.find("\n# ")
                if next_section != -1:
                    existing = parts[0] + rest[next_section+1:]
                else:
                    existing = parts[0]

        content = existing.rstrip() + "\n\n" + new_section
    else:
        content = new_section

    target_file.write_text(content)

    return {
        "status": "success",
        "synced": len(memories),
        "target": str(target_file),
        "categories": list(by_category.keys())
    }

def sync_to_rules(memories: list, rules_dir: Path) -> dict:
    """Sync memories to individual rule files by category"""
    by_category = {}
    for mem in memories:
        cat = mem["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(mem["content"])

    synced_files = []
    for category, items in by_category.items():
        rule_file = rules_dir / f"memory-{category}.md"
        content = f"# {category.title()} (from Memory)\n\n"
        for item in items:
            content += f"- {item}\n"
        rule_file.write_text(content)
        synced_files.append(str(rule_file))

    return {
        "status": "success",
        "synced": len(memories),
        "files": synced_files
    }

def generate_memory_section(by_category: dict) -> str:
    """Generate markdown section for memories"""
    lines = ["# Memories (Synced from SimpleMem)", ""]

    category_titles = {
        'preferences': 'Preferences',
        'decisions': 'Decisions',
        'people': 'People',
        'events': 'Events & Schedules',
        'context': 'Project Context',
        'facts': 'Facts & Information'
    }

    for category, items in by_category.items():
        title = category_titles.get(category, category.title())
        lines.append(f"## {title}")
        lines.append("")
        for item in items:
            lines.append(f"- {item}")
        lines.append("")

    return "\n".join(lines)

def clear_memories(confirm: bool = False):
    """Clear all memories (requires confirmation)"""
    if not confirm:
        return {"status": "error", "message": "Confirmation required. Use --confirm flag."}

    db_path = Path.home() / ".claude" / "memory" / "db"
    if db_path.exists():
        import shutil
        shutil.rmtree(db_path)
        db_path.mkdir(parents=True)

    return {"status": "success", "message": "All memories cleared"}

def main():
    parser = argparse.ArgumentParser(description="Memory management for Claude Code")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a memory")
    add_parser.add_argument("speaker", help="Who said it")
    add_parser.add_argument("content", help="What was said")
    add_parser.add_argument("--timestamp", help="ISO timestamp")

    # Query command
    query_parser = subparsers.add_parser("query", help="Query memories")
    query_parser.add_argument("question", help="Question to ask")

    # List command
    list_parser = subparsers.add_parser("list", help="List memories")
    list_parser.add_argument("--limit", type=int, default=50, help="Max memories to show")
    list_parser.add_argument("--category", help="Filter by category")

    # Sync command
    sync_parser = subparsers.add_parser("sync", help="Sync to CLAUDE.md")
    sync_parser.add_argument("target", choices=["user", "project", "rules"], help="Sync target")
    sync_parser.add_argument("--category", help="Filter by category")
    sync_parser.add_argument("--no-merge", action="store_true", help="Don't merge with existing")

    # Clear command
    clear_parser = subparsers.add_parser("clear", help="Clear all memories")
    clear_parser.add_argument("--confirm", action="store_true", help="Confirm deletion")

    args = parser.parse_args()

    if args.command == "add":
        result = add_memory(args.speaker, args.content, args.timestamp)
    elif args.command == "query":
        result = query_memory(args.question)
    elif args.command == "list":
        result = list_memories(args.limit, args.category)
    elif args.command == "sync":
        result = sync_to_claude_md(args.target, args.category, not args.no_merge)
    elif args.command == "clear":
        result = clear_memories(args.confirm)

    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
WRAPPER_EOF

    chmod +x "${MEMORY_DIR}/memory.py"
}

# Initialize database
init_database() {
    log_info "Initializing vector database..."
    mkdir -p "$DB_DIR/lancedb"
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."

    cd "$SIMPLEMEM_DIR"
    source .venv/bin/activate

    # Test Python imports
    python3 -c "import lancedb; import sentence_transformers; print('Core imports OK')" 2>/dev/null || {
        log_error "Failed to import core dependencies"
        exit 1
    }

    log_info "Installation verified successfully"
}

# Print completion message
print_completion() {
    echo "" >&2
    echo "========================================" >&2
    echo -e "${GREEN}Memory Skill Setup Complete!${NC}" >&2
    echo "========================================" >&2
    echo "" >&2
    echo "Installation directory: $MEMORY_DIR" >&2
    echo "" >&2
    echo "Next steps:" >&2
    echo "1. Edit config file and add your API key:" >&2
    echo "   $CONFIG_FILE" >&2
    echo "" >&2
    echo "2. Test the installation:" >&2
    echo "   bash /mnt/skills/user/memory/scripts/add.sh test \"Hello memory!\"" >&2
    echo "" >&2
    echo "3. Query your memories:" >&2
    echo "   bash /mnt/skills/user/memory/scripts/query.sh \"What do you remember?\"" >&2
    echo "" >&2

    # Output JSON for programmatic use
    echo "{\"status\": \"success\", \"memory_dir\": \"$MEMORY_DIR\", \"config_file\": \"$CONFIG_FILE\"}"
}

# Main execution
main() {
    log_info "Starting Memory Skill setup..."

    check_python
    check_uv
    setup_directories
    setup_simplemem
    setup_venv
    setup_config
    create_wrapper
    init_database
    verify_installation
    print_completion
}

main "$@"
