#!/bin/bash
# /mnt/skills/user/vercel-cost-optimization/scripts/detect-stack.sh
# Analyzes a project directory and outputs a JSON object describing the stack.

set -e

# --- Cleanup trap for temp files ---
TMPFILES=()
cleanup() {
  for f in "${TMPFILES[@]}"; do
    rm -f "$f"
  done
}
trap cleanup EXIT

# --- Arguments ---
PROJECT_DIR="${1:-$(pwd)}"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "[detect-stack] ERROR: Directory not found: $PROJECT_DIR" >&2
  exit 1
fi

echo "[detect-stack] Analyzing project at: $PROJECT_DIR" >&2

PKG_JSON="$PROJECT_DIR/package.json"

# --- Helper: check if jq is available ---
HAS_JQ=false
if command -v jq &>/dev/null; then
  HAS_JQ=true
fi

# --- Helper: get a field from package.json dependencies/devDependencies ---
# Usage: get_dep_version <package-name>
# Returns the semver range from package.json, or empty string if not found.
get_dep_version() {
  local pkg="$1"
  if [ ! -f "$PKG_JSON" ]; then
    echo ""
    return
  fi
  if $HAS_JQ; then
    local ver
    ver=$(jq -r --arg p "$pkg" '(.dependencies[$p] // .devDependencies[$p]) // ""' "$PKG_JSON" 2>/dev/null || echo "")
    echo "$ver"
  else
    # grep/sed fallback: look for "package": "version"
    local ver
    ver=$(grep -E "\"${pkg}\"[[:space:]]*:[[:space:]]*\"[^\"]+\"" "$PKG_JSON" 2>/dev/null \
      | head -1 \
      | sed 's/.*"[^"]*"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' || echo "")
    echo "$ver"
  fi
}

# --- Helper: get installed version from node_modules ---
get_installed_version() {
  local pkg="$1"
  local nm_pkg_json="$PROJECT_DIR/node_modules/$pkg/package.json"
  if [ -f "$nm_pkg_json" ]; then
    if $HAS_JQ; then
      jq -r '.version // ""' "$nm_pkg_json" 2>/dev/null || echo ""
    else
      grep -E '"version"[[:space:]]*:[[:space:]]*"[^"]+"' "$nm_pkg_json" 2>/dev/null \
        | head -1 \
        | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' || echo ""
    fi
  else
    echo ""
  fi
}

# ============================================================
# 1. Framework detection
# ============================================================
echo "[detect-stack] Detecting framework..." >&2

FRAMEWORK="unknown"
FRAMEWORK_PKG=""

if [ -f "$PKG_JSON" ]; then
  if [ -n "$(get_dep_version "next")" ]; then
    FRAMEWORK="nextjs"
    FRAMEWORK_PKG="next"
  elif [ -n "$(get_dep_version "nuxt")" ]; then
    FRAMEWORK="nuxt"
    FRAMEWORK_PKG="nuxt"
  elif [ -n "$(get_dep_version "astro")" ]; then
    FRAMEWORK="astro"
    FRAMEWORK_PKG="astro"
  elif [ -n "$(get_dep_version "@sveltejs/kit")" ]; then
    FRAMEWORK="sveltekit"
    FRAMEWORK_PKG="@sveltejs/kit"
  elif [ -n "$(get_dep_version "@remix-run/react")" ]; then
    FRAMEWORK="remix"
    FRAMEWORK_PKG="@remix-run/react"
  fi
fi

echo "[detect-stack] Framework: $FRAMEWORK" >&2

# ============================================================
# 2. Framework version
# ============================================================
FRAMEWORK_VERSION=""
if [ -n "$FRAMEWORK_PKG" ]; then
  FRAMEWORK_VERSION=$(get_installed_version "$FRAMEWORK_PKG")
  if [ -z "$FRAMEWORK_VERSION" ]; then
    # Fall back to semver range from package.json
    FRAMEWORK_VERSION=$(get_dep_version "$FRAMEWORK_PKG")
  fi
fi
echo "[detect-stack] Framework version: ${FRAMEWORK_VERSION:-unknown}" >&2

# ============================================================
# 3. hasAppRouter
# ============================================================
HAS_APP_ROUTER=false
if [ -d "$PROJECT_DIR/app" ] || [ -d "$PROJECT_DIR/src/app" ]; then
  HAS_APP_ROUTER=true
fi
echo "[detect-stack] hasAppRouter: $HAS_APP_ROUTER" >&2

# ============================================================
# 4. hasPagesRouter
# ============================================================
HAS_PAGES_ROUTER=false
if [ -d "$PROJECT_DIR/pages" ] || [ -d "$PROJECT_DIR/src/pages" ]; then
  HAS_PAGES_ROUTER=true
fi
echo "[detect-stack] hasPagesRouter: $HAS_PAGES_ROUTER" >&2

# ============================================================
# 5. TypeScript
# ============================================================
TYPESCRIPT=false
if [ -f "$PROJECT_DIR/tsconfig.json" ]; then
  TYPESCRIPT=true
fi
echo "[detect-stack] typescript: $TYPESCRIPT" >&2

# ============================================================
# 6. ORM detection
# ============================================================
ORM="none"
if [ -f "$PKG_JSON" ]; then
  if [ -n "$(get_dep_version "prisma")" ] || [ -n "$(get_dep_version "@prisma/client")" ]; then
    ORM="prisma"
  elif [ -n "$(get_dep_version "drizzle-orm")" ]; then
    ORM="drizzle"
  elif [ -n "$(get_dep_version "kysely")" ]; then
    ORM="kysely"
  fi
fi
echo "[detect-stack] orm: $ORM" >&2

# ============================================================
# 7. Monorepo detection
# ============================================================
IS_MONOREPO=false
if [ -f "$PROJECT_DIR/pnpm-workspace.yaml" ] || [ -f "$PROJECT_DIR/lerna.json" ]; then
  IS_MONOREPO=true
elif [ -f "$PKG_JSON" ]; then
  if $HAS_JQ; then
    HAS_WORKSPACES=$(jq -r 'if .workspaces then "true" else "false" end' "$PKG_JSON" 2>/dev/null || echo "false")
    if [ "$HAS_WORKSPACES" = "true" ]; then
      IS_MONOREPO=true
    fi
  else
    if grep -q '"workspaces"' "$PKG_JSON" 2>/dev/null; then
      IS_MONOREPO=true
    fi
  fi
fi
echo "[detect-stack] isMonorepo: $IS_MONOREPO" >&2

# ============================================================
# 8. configFlags: parse next.config.* and vercel.json
# ============================================================
echo "[detect-stack] Detecting config flags..." >&2

CONFIG_FLAGS=()

# Find next config file (prefer .js, then .mjs, then .ts)
NEXT_CONFIG=""
for ext in js mjs ts; do
  if [ -f "$PROJECT_DIR/next.config.$ext" ]; then
    NEXT_CONFIG="$PROJECT_DIR/next.config.$ext"
    break
  fi
done

if [ -n "$NEXT_CONFIG" ]; then
  echo "[detect-stack] Parsing $NEXT_CONFIG" >&2

  # images: key present
  if grep -qE '\bimages[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
    # Check for remotePatterns specifically
    if grep -qE '\bremotePatterns[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("images.remotePatterns")
    else
      CONFIG_FLAGS+=("images")
    fi
  fi

  # experimental block
  if grep -qE '\bexperimental[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
    # ppr
    if grep -qE '\bppr[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.ppr")
    fi
    # serverActions (inside experimental)
    if grep -qE '\bserverActions[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.serverActions")
    fi
    # turbo / turbopack
    if grep -qE '\bturbo[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.turbo")
    fi
    # appDir
    if grep -qE '\bappDir[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.appDir")
    fi
    # partial prerendering
    if grep -qE '\bpartialPrerendering[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.partialPrerendering")
    fi
    # instrumentationHook
    if grep -qE '\binstrumentationHook[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
      CONFIG_FLAGS+=("experimental.instrumentationHook")
    fi
    # If experimental block found but no specific flags matched, still record it
    FOUND_EXPERIMENTAL_SPECIFIC=false
    for flag in "${CONFIG_FLAGS[@]}"; do
      if [[ "$flag" == experimental.* ]]; then
        FOUND_EXPERIMENTAL_SPECIFIC=true
        break
      fi
    done
    if ! $FOUND_EXPERIMENTAL_SPECIFIC; then
      CONFIG_FLAGS+=("experimental")
    fi
  fi

  # serverActions at top level (Next.js 14+)
  if grep -qE '^\s*serverActions[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
    # avoid double-adding if already added under experimental
    ALREADY_ADDED=false
    for flag in "${CONFIG_FLAGS[@]}"; do
      if [ "$flag" = "experimental.serverActions" ] || [ "$flag" = "serverActions" ]; then
        ALREADY_ADDED=true
        break
      fi
    done
    if ! $ALREADY_ADDED; then
      CONFIG_FLAGS+=("serverActions")
    fi
  fi

  # output mode
  if grep -qE '\boutput[[:space:]]*:' "$NEXT_CONFIG" 2>/dev/null; then
    CONFIG_FLAGS+=("output")
  fi

  # rewrites
  if grep -qE '\brewrites[[:space:]]*[\(\[]' "$NEXT_CONFIG" 2>/dev/null || grep -qE 'rewrites\(\)' "$NEXT_CONFIG" 2>/dev/null; then
    CONFIG_FLAGS+=("rewrites")
  fi

  # redirects
  if grep -qE '\bredirects[[:space:]]*[\(\[]' "$NEXT_CONFIG" 2>/dev/null || grep -qE 'redirects\(\)' "$NEXT_CONFIG" 2>/dev/null; then
    CONFIG_FLAGS+=("redirects")
  fi

  # headers
  if grep -qE '\bheaders[[:space:]]*[\(\[]' "$NEXT_CONFIG" 2>/dev/null || grep -qE 'headers\(\)' "$NEXT_CONFIG" 2>/dev/null; then
    CONFIG_FLAGS+=("headers")
  fi
fi

VERCEL_JSON="$PROJECT_DIR/vercel.json"
if [ -f "$VERCEL_JSON" ]; then
  echo "[detect-stack] Parsing $VERCEL_JSON" >&2

  # cron field (handled separately below too)
  if $HAS_JQ; then
    if jq -e '.crons' "$VERCEL_JSON" &>/dev/null; then
      CONFIG_FLAGS+=("cron")
    fi
  else
    if grep -q '"crons"' "$VERCEL_JSON" 2>/dev/null; then
      CONFIG_FLAGS+=("cron")
    fi
  fi

  # functions
  if $HAS_JQ; then
    if jq -e '.functions' "$VERCEL_JSON" &>/dev/null; then
      CONFIG_FLAGS+=("functions")
    fi
  else
    if grep -q '"functions"' "$VERCEL_JSON" 2>/dev/null; then
      CONFIG_FLAGS+=("functions")
    fi
  fi

  # rewrites in vercel.json
  if $HAS_JQ; then
    if jq -e '.rewrites' "$VERCEL_JSON" &>/dev/null; then
      # avoid duplicate
      ALREADY_ADDED=false
      for flag in "${CONFIG_FLAGS[@]}"; do
        [ "$flag" = "rewrites" ] && ALREADY_ADDED=true && break
      done
      $ALREADY_ADDED || CONFIG_FLAGS+=("rewrites")
    fi
  else
    if grep -q '"rewrites"' "$VERCEL_JSON" 2>/dev/null; then
      ALREADY_ADDED=false
      for flag in "${CONFIG_FLAGS[@]}"; do
        [ "$flag" = "rewrites" ] && ALREADY_ADDED=true && break
      done
      $ALREADY_ADDED || CONFIG_FLAGS+=("rewrites")
    fi
  fi

  # headers in vercel.json
  if $HAS_JQ; then
    if jq -e '.headers' "$VERCEL_JSON" &>/dev/null; then
      ALREADY_ADDED=false
      for flag in "${CONFIG_FLAGS[@]}"; do
        [ "$flag" = "headers" ] && ALREADY_ADDED=true && break
      done
      $ALREADY_ADDED || CONFIG_FLAGS+=("headers")
    fi
  else
    if grep -q '"headers"' "$VERCEL_JSON" 2>/dev/null; then
      ALREADY_ADDED=false
      for flag in "${CONFIG_FLAGS[@]}"; do
        [ "$flag" = "headers" ] && ALREADY_ADDED=true && break
      done
      $ALREADY_ADDED || CONFIG_FLAGS+=("headers")
    fi
  fi

  # regions
  if $HAS_JQ; then
    if jq -e '.regions' "$VERCEL_JSON" &>/dev/null; then
      CONFIG_FLAGS+=("regions")
    fi
  else
    if grep -q '"regions"' "$VERCEL_JSON" 2>/dev/null; then
      CONFIG_FLAGS+=("regions")
    fi
  fi
fi

echo "[detect-stack] configFlags: ${CONFIG_FLAGS[*]:-none}" >&2

# ============================================================
# 9. hasCron / 10. cronCount
# ============================================================
HAS_CRON=false
CRON_COUNT=0

if [ -f "$VERCEL_JSON" ]; then
  if $HAS_JQ; then
    CRONS_VAL=$(jq -r 'if .crons then (.crons | length | tostring) else "0" end' "$VERCEL_JSON" 2>/dev/null || echo "0")
    if [ "$CRONS_VAL" -gt 0 ] 2>/dev/null; then
      HAS_CRON=true
      CRON_COUNT=$CRONS_VAL
    fi
  else
    if grep -q '"crons"' "$VERCEL_JSON" 2>/dev/null; then
      HAS_CRON=true
      # Count entries by counting objects inside the crons array (heuristic: count "path" keys)
      CRON_COUNT=$(grep -c '"path"' "$VERCEL_JSON" 2>/dev/null || echo "0")
      # If count is 0 but we found crons key, set to 1 as minimum
      [ "$CRON_COUNT" -eq 0 ] && CRON_COUNT=1
    fi
  fi
fi

echo "[detect-stack] hasCron: $HAS_CRON, cronCount: $CRON_COUNT" >&2

# ============================================================
# Build JSON output
# ============================================================

# Build configFlags JSON array
CONFIG_FLAGS_JSON="["
FIRST=true
for flag in "${CONFIG_FLAGS[@]}"; do
  if $FIRST; then
    CONFIG_FLAGS_JSON+="\"$flag\""
    FIRST=false
  else
    CONFIG_FLAGS_JSON+=",\"$flag\""
  fi
done
CONFIG_FLAGS_JSON+="]"

# Escape strings for JSON (basic escaping of backslash and double-quote)
json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  echo "$s"
}

FW_ESC=$(json_escape "$FRAMEWORK")
FW_VER_ESC=$(json_escape "$FRAMEWORK_VERSION")
ORM_ESC=$(json_escape "$ORM")

echo "[detect-stack] Done. Outputting JSON." >&2

cat <<EOF
{
  "framework": "$FW_ESC",
  "frameworkVersion": "$FW_VER_ESC",
  "hasAppRouter": $HAS_APP_ROUTER,
  "hasPagesRouter": $HAS_PAGES_ROUTER,
  "typescript": $TYPESCRIPT,
  "orm": "$ORM_ESC",
  "isMonorepo": $IS_MONOREPO,
  "configFlags": $CONFIG_FLAGS_JSON,
  "hasCron": $HAS_CRON,
  "cronCount": $CRON_COUNT
}
EOF
