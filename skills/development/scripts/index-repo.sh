#!/usr/bin/env bash
# Repo Indexer for Development Skill
# Generates a searchable codebase index at .claude/repo-index/
# Usage: ./index-repo.sh [repo-root]

set -uo pipefail

REPO_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
REPO_NAME=$(basename "$REPO_ROOT")
INDEX_DIR="$REPO_ROOT/.claude/repo-index"

mkdir -p "$INDEX_DIR"

# --- Load .indexignore patterns ---
IGNORE_FILE="$INDEX_DIR/.indexignore"
if [ ! -f "$IGNORE_FILE" ]; then
  # Create default .indexignore
  cat > "$IGNORE_FILE" << 'IGNORE_EOF'
# Patterns to exclude from indexing (one per line, glob-style)
# Media / binary files
*.wav
*.mp3
*.mp4
*.avi
*.mov
*.flac
*.ogg
*.png
*.jpg
*.jpeg
*.gif
*.webp
*.bmp
*.ico
*.svg
*.tiff
*.tif
# Archives
*.zip
*.tar
*.gz
*.bz2
*.7z
*.rar
# Compiled / build artifacts
*.map
*.min.js
*.min.css
*.woff
*.woff2
*.ttf
*.eot
*.pyc
*.pyo
*.o
*.so
*.dylib
*.dll
*.exe
# Lock files
package-lock.json
yarn.lock
pnpm-lock.yaml
bun.lockb
Cargo.lock
poetry.lock
# Data files
*.sqlite
*.db
*.sqlite3
*.tsbuildinfo
IGNORE_EOF
  echo "  Created default .indexignore"
fi

# Build find exclusion args from .indexignore
FIND_EXCLUDES=()
while IFS= read -r pattern; do
  # Skip comments and empty lines
  [[ -z "$pattern" || "$pattern" == \#* ]] && continue
  FIND_EXCLUDES+=(-not -name "$pattern")
done < "$IGNORE_FILE"

echo "Indexing $REPO_ROOT ..."

# --- 1. File Tree (full paths, sizes) ---
echo "  Building file tree..."
FILE_TREE="$INDEX_DIR/file-tree.txt"
{
  echo "# Repo: $REPO_NAME"
  echo "# Root: $REPO_ROOT"
  echo "# Indexed: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "# Format: [size] [path]"
  echo ""
  find "$REPO_ROOT" -type f \
    -not -path '*/node_modules/*' \
    -not -path '*/.git/*' \
    -not -path '*/.next/*' \
    -not -path '*/dist/*' \
    -not -path '*/.claude/repo-index/*' \
    -not -path '*/__pycache__/*' \
    -not -path '*/target/*' \
    -not -path '*/.turbo/*' \
    "${FIND_EXCLUDES[@]}" \
    2>/dev/null | sort | while IFS= read -r f; do
      rel="${f#$REPO_ROOT/}"
      size=$(wc -c < "$f" 2>/dev/null | tr -d ' ')
      printf "%8s  %s\n" "$size" "$rel"
    done
} > "$FILE_TREE"

FILE_COUNT=$(grep -c '/' "$FILE_TREE" 2>/dev/null || echo 0)
echo "  $FILE_COUNT files indexed"

# --- 2. Directory Structure ---
echo "  Building directory structure..."
DIR_TREE="$INDEX_DIR/dir-tree.txt"
{
  echo "# Directory Structure: $REPO_NAME"
  echo "# Root: $REPO_ROOT"
  echo ""
  if command -v tree &>/dev/null; then
    tree -d -L 4 --noreport -I 'node_modules|.git|.next|dist|__pycache__|.claude|target|.turbo' "$REPO_ROOT" 2>/dev/null || true
  else
    find "$REPO_ROOT" -type d -maxdepth 4 \
      -not -path '*/node_modules/*' \
      -not -path '*/.git/*' \
      -not -path '*/.next/*' \
      -not -path '*/dist/*' \
      -not -path '*/__pycache__/*' \
      -not -path '*/.claude/repo-index/*' \
      2>/dev/null | sort | while IFS= read -r d; do
        rel="${d#$REPO_ROOT}"
        [ -z "$rel" ] && { echo "."; continue; }
        depth=$(echo "$rel" | tr -cd '/' | wc -c | tr -d ' ')
        indent=""
        for ((i=1; i<depth; i++)); do indent="  $indent"; done
        echo "${indent}$(basename "$d")/"
      done
  fi
} > "$DIR_TREE"

# --- 3. Symbol Index (functions, classes, types, exports) ---
echo "  Extracting symbols..."
SYMBOLS="$INDEX_DIR/symbols.txt"
{
  echo "# Symbol Index: $REPO_NAME"
  echo "# Root: $REPO_ROOT"
  echo "# Format: [type] [name] [file:line]"
  echo ""

  # TypeScript/JavaScript - functions
  grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    -E '^\s*(export\s+)?(async\s+)?function\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      name=$(echo "$content" | grep -oE 'function\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "FUNC" "$name" "$rel" "$lineno"
    done

  # TypeScript/JavaScript - classes
  grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    -E '^\s*(export\s+)?(default\s+)?class\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      name=$(echo "$content" | grep -oE 'class\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "CLASS" "$name" "$rel" "$lineno"
    done

  # TypeScript - types and interfaces
  grep -rn --include='*.ts' --include='*.tsx' \
    -E '^\s*export\s+(type|interface)\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      if echo "$content" | grep -qE 'interface\s'; then
        type="IFACE"
      else
        type="TYPE"
      fi
      name=$(echo "$content" | grep -oE '(type|interface)\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "$type" "$name" "$rel" "$lineno"
    done

  # TypeScript/JavaScript - exported consts (components, etc)
  grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    -E '^\s*export\s+(const|let|var)\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      name=$(echo "$content" | grep -oE '(const|let|var)\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "EXPORT" "$name" "$rel" "$lineno"
    done

  # Python
  grep -rn --include='*.py' \
    -E '^\s*(def|class|async def)\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=__pycache__ \
    --exclude-dir=.venv 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      if echo "$content" | grep -qE '^\s*class\s'; then
        type="CLASS"
      else
        type="FUNC"
      fi
      name=$(echo "$content" | grep -oE '(def|class)\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "$type" "$name" "$rel" "$lineno"
    done

  # Go
  grep -rn --include='*.go' \
    -E '^\s*(func|type)\s+' \
    "$REPO_ROOT" \
    --exclude-dir=vendor 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      if echo "$content" | grep -qE 'type\s+\w+\s+struct'; then type="STRUCT"
      elif echo "$content" | grep -qE 'type\s+\w+\s+interface'; then type="IFACE"
      else type="FUNC"; fi
      name=$(echo "$content" | grep -oE '\b(func|type)\s+\w+' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "$type" "$name" "$rel" "$lineno"
    done

  # Rust
  grep -rn --include='*.rs' \
    -E '^\s*(pub\s+)?(fn|struct|enum|trait|impl)\s+[a-zA-Z_]\w*' \
    "$REPO_ROOT" \
    --exclude-dir=target 2>/dev/null | while IFS= read -r line; do
      file_line="${line%%:*}"
      rest="${line#*:}"
      lineno="${rest%%:*}"
      content="${rest#*:}"
      rel="${file_line#$REPO_ROOT/}"
      if echo "$content" | grep -qE 'struct\s'; then type="STRUCT"
      elif echo "$content" | grep -qE 'enum\s'; then type="ENUM"
      elif echo "$content" | grep -qE 'trait\s'; then type="TRAIT"
      elif echo "$content" | grep -qE 'impl\s'; then type="IMPL"
      else type="FUNC"; fi
      name=$(echo "$content" | grep -oE '(fn|struct|enum|trait|impl)\s+[a-zA-Z_]\w*' | head -1 | awk '{print $2}')
      [ -n "$name" ] && printf "%-7s %-40s %s:%s\n" "$type" "$name" "$rel" "$lineno"
    done

} > "$SYMBOLS"

SYM_COUNT=$(grep -cE '^(FUNC|CLASS|TYPE|IFACE|EXPORT|STRUCT|ENUM|TRAIT|IMPL)' "$SYMBOLS" 2>/dev/null || echo 0)
echo "  $SYM_COUNT symbols extracted"

# --- 4. Dependency Map (imports between local files) ---
echo "  Mapping dependencies..."
DEPS="$INDEX_DIR/dependencies.txt"
{
  echo "# Import/Dependency Map: $REPO_NAME"
  echo "# Format: [file] -> [imported module]"
  echo ""

  # TS/JS imports (only local/relative imports, not node_modules)
  grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    -E "from\s+['\"][@./]" \
    "$REPO_ROOT" \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist 2>/dev/null | while IFS= read -r line; do
      file="${line%%:*}"
      rel="${file#$REPO_ROOT/}"
      module=$(echo "$line" | grep -oE "from\s+['\"][^'\"]+['\"]" | grep -oE "['\"][^'\"]+['\"]" | tr -d "'" | tr -d '"' | head -1)
      [ -n "$module" ] && echo "$rel -> $module"
    done | sort -u

  # Python local imports
  grep -rn --include='*.py' \
    -E '^\s*from\s+\.\S+\s+import' \
    "$REPO_ROOT" \
    --exclude-dir=__pycache__ \
    --exclude-dir=.venv 2>/dev/null | while IFS= read -r line; do
      file="${line%%:*}"
      rel="${file#$REPO_ROOT/}"
      module=$(echo "$line" | grep -oE 'from\s+\S+' | head -1 | awk '{print $2}')
      [ -n "$module" ] && echo "$rel -> $module"
    done | sort -u

} > "$DEPS"

DEP_COUNT=$(grep -c ' -> ' "$DEPS" 2>/dev/null || echo 0)

# --- 5. Summary ---
echo "  Generating summary..."
SUMMARY="$INDEX_DIR/SUMMARY.md"
{
  echo "# Repo Index: $REPO_NAME"
  echo ""
  echo "- **Root**: \`$REPO_ROOT\`"
  echo "- **Indexed**: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- **Files**: $FILE_COUNT"
  echo "- **Symbols**: $SYM_COUNT"
  echo "- **Dependencies**: $DEP_COUNT"
  echo ""
  echo "## Index Files"
  echo ""
  echo "| File | Description | Search With |"
  echo "|------|-------------|-------------|"
  echo "| \`file-tree.txt\` | All files with sizes | \`grep 'pattern' .claude/repo-index/file-tree.txt\` |"
  echo "| \`dir-tree.txt\` | Directory structure | Read directly |"
  echo "| \`symbols.txt\` | Functions, classes, types + file:line | \`grep 'SymbolName' .claude/repo-index/symbols.txt\` |"
  echo "| \`dependencies.txt\` | Import map between files | \`grep 'module' .claude/repo-index/dependencies.txt\` |"
  echo ""

  # Language breakdown
  echo "## Language Breakdown"
  echo ""
  if [ -f "$FILE_TREE" ]; then
    echo "| Extension | Count |"
    echo "|-----------|-------|"
    grep -oE '\.[a-zA-Z0-9]+$' "$FILE_TREE" 2>/dev/null | sort | uniq -c | sort -rn | head -15 | \
    while read -r count ext; do
      echo "| \`$ext\` | $count |"
    done
  fi
  echo ""

  # Top-level directories
  echo "## Top-Level Structure"
  echo ""
  echo '```'
  ls -1dp "$REPO_ROOT"/*/ 2>/dev/null | while read -r d; do
    basename "$d"
  done
  echo '```'
} > "$SUMMARY"

echo ""
echo "Index complete: $INDEX_DIR/"
echo "  file-tree.txt      ($FILE_COUNT files)"
echo "  dir-tree.txt       (directory structure)"
echo "  symbols.txt        ($SYM_COUNT symbols)"
echo "  dependencies.txt   ($DEP_COUNT imports)"
echo "  SUMMARY.md         (overview)"
