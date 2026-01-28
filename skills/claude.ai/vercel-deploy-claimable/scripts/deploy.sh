#!/bin/bash

# Vercel Deployment Script (via claimable deploy endpoint)
# Usage: ./deploy.sh [project-path]
# Returns: JSON with previewUrl, claimUrl, deploymentId, projectId

set -e

DEPLOY_ENDPOINT="https://claude-skills-deploy.vercel.com/api/deploy"

# Detect framework from package.json
detect_framework() {
    local pkg_json="$1"

    if [ ! -f "$pkg_json" ]; then
        echo "null"
        return
    fi

    local content=$(cat "$pkg_json")

    # Helper to check if a package exists in dependencies or devDependencies
    has_dep() {
        echo "$content" | grep -q "\"$1\""
    }

    # Order matters - check more specific frameworks first

    # Blitz
    if has_dep "blitz"; then echo "blitzjs"; return; fi

    # Next.js
    if has_dep "next"; then echo "nextjs"; return; fi

    # Gatsby
    if has_dep "gatsby"; then echo "gatsby"; return; fi

    # Remix
    if has_dep "@remix-run/"; then echo "remix"; return; fi

    # React Router (v7 framework mode)
    if has_dep "@react-router/"; then echo "react-router"; return; fi

    # TanStack Start
    if has_dep "@tanstack/start"; then echo "tanstack-start"; return; fi

    # Astro
    if has_dep "astro"; then echo "astro"; return; fi

    # Hydrogen (Shopify)
    if has_dep "@shopify/hydrogen"; then echo "hydrogen"; return; fi

    # SvelteKit
    if has_dep "@sveltejs/kit"; then echo "sveltekit-1"; return; fi

    # Svelte (standalone)
    if has_dep "svelte"; then echo "svelte"; return; fi

    # Nuxt
    if has_dep "nuxt"; then echo "nuxtjs"; return; fi

    # Vue with Vitepress
    if has_dep "vitepress"; then echo "vitepress"; return; fi

    # Vue with Vuepress
    if has_dep "vuepress"; then echo "vuepress"; return; fi

    # Gridsome
    if has_dep "gridsome"; then echo "gridsome"; return; fi

    # SolidStart
    if has_dep "@solidjs/start"; then echo "solidstart-1"; return; fi

    # Docusaurus
    if has_dep "@docusaurus/core"; then echo "docusaurus-2"; return; fi

    # RedwoodJS
    if has_dep "@redwoodjs/"; then echo "redwoodjs"; return; fi

    # Hexo
    if has_dep "hexo"; then echo "hexo"; return; fi

    # Eleventy
    if has_dep "@11ty/eleventy"; then echo "eleventy"; return; fi

    # Angular / Ionic Angular
    if has_dep "@ionic/angular"; then echo "ionic-angular"; return; fi
    if has_dep "@angular/core"; then echo "angular"; return; fi

    # Ionic React
    if has_dep "@ionic/react"; then echo "ionic-react"; return; fi

    # Create React App
    if has_dep "react-scripts"; then echo "create-react-app"; return; fi

    # Ember
    if has_dep "ember-cli" || has_dep "ember-source"; then echo "ember"; return; fi

    # Dojo
    if has_dep "@dojo/framework"; then echo "dojo"; return; fi

    # Polymer
    if has_dep "@polymer/"; then echo "polymer"; return; fi

    # Preact
    if has_dep "preact"; then echo "preact"; return; fi

    # Stencil
    if has_dep "@stencil/core"; then echo "stencil"; return; fi

    # UmiJS
    if has_dep "umi"; then echo "umijs"; return; fi

    # Sapper (legacy Svelte)
    if has_dep "sapper"; then echo "sapper"; return; fi

    # Saber
    if has_dep "saber"; then echo "saber"; return; fi

    # Sanity
    if has_dep "sanity"; then echo "sanity-v3"; return; fi
    if has_dep "@sanity/"; then echo "sanity"; return; fi

    # Storybook
    if has_dep "@storybook/"; then echo "storybook"; return; fi

    # NestJS
    if has_dep "@nestjs/core"; then echo "nestjs"; return; fi

    # Elysia
    if has_dep "elysia"; then echo "elysia"; return; fi

    # Hono
    if has_dep "hono"; then echo "hono"; return; fi

    # Fastify
    if has_dep "fastify"; then echo "fastify"; return; fi

    # h3
    if has_dep "h3"; then echo "h3"; return; fi

    # Nitro
    if has_dep "nitropack"; then echo "nitro"; return; fi

    # Express
    if has_dep "express"; then echo "express"; return; fi

    # Vite (generic - check last among JS frameworks)
    if has_dep "vite"; then echo "vite"; return; fi

    # Parcel
    if has_dep "parcel"; then echo "parcel"; return; fi

    # No framework detected
    echo "null"
}

# Helper function to extract JSON values
# Try to use jq if available, otherwise use fallback secure
extract_json_value() {
    local json="$1"
    local key="$2"
    
    # Try to use jq first (more robust)
    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq -r ".$key // empty" 2>/dev/null
    else
        # Fallback: use grep but with more secure validation
        # Remove blank spaces and line breaks, search for the pattern
        local cleaned=$(echo "$json" | tr -d '\n\r' | sed 's/[[:space:]]*//g')
        echo "$cleaned" | grep -o "\"$key\":\"[^\"]*\"" | sed 's/.*:"\([^"]*\)".*/\1/' || echo ""
    fi
}

# Check if the response is valid JSON
validate_json() {
    local json="$1"
    
    if command -v jq >/dev/null 2>&1; then
        echo "$json" | jq . >/dev/null 2>&1
    else
        # Basic validation: check if starts with { and ends with }
        # Remove blank spaces
        local trimmed=$(echo "$json" | tr -d '\n\r' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        echo "$trimmed" | grep -q '^{.*}$'
    fi
}

# Parse arguments
INPUT_PATH="${1:-.}"

# Create temp directory for packaging
TEMP_DIR=$(mktemp -d)
TARBALL="$TEMP_DIR/project.tgz"
CLEANUP_TEMP=true

cleanup() {
    if [ "$CLEANUP_TEMP" = true ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

echo "Preparing deployment..." >&2

# Check if input is a .tgz file or a directory
FRAMEWORK="null"

if [ -f "$INPUT_PATH" ] && [[ "$INPUT_PATH" == *.tgz ]]; then
    # Input is already a tarball, use it directly
    echo "Using provided tarball..." >&2
    TARBALL="$INPUT_PATH"
    CLEANUP_TEMP=false
    # Can't detect framework from tarball, leave as null
elif [ -d "$INPUT_PATH" ]; then
    # Input is a directory, need to tar it
    PROJECT_PATH=$(cd "$INPUT_PATH" && pwd)

    # Detect framework from package.json
    FRAMEWORK=$(detect_framework "$PROJECT_PATH/package.json")

    # Check if this is a static HTML project (no package.json)
    if [ ! -f "$PROJECT_PATH/package.json" ]; then
        # Find HTML files in root
        HTML_FILES=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f)
        HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo 0)

        # If there's exactly one HTML file and it's not index.html, rename it
        if [ "$HTML_COUNT" -eq 1 ]; then
            HTML_FILE=$(echo "$HTML_FILES" | head -1)
            BASENAME=$(basename "$HTML_FILE")
            if [ "$BASENAME" != "index.html" ]; then
                echo "Renaming $BASENAME to index.html..." >&2
                mv "$HTML_FILE" "$PROJECT_PATH/index.html"
            fi
        fi
    fi

    # Create tarball of the project (excluding node_modules and .git)
    echo "Creating deployment package..." >&2
    tar -czf "$TARBALL" -C "$PROJECT_PATH" --exclude='node_modules' --exclude='.git' .
else
    echo "Error: Input must be a directory or a .tgz file" >&2
    exit 1
fi

if [ "$FRAMEWORK" != "null" ]; then
    echo "Detected framework: $FRAMEWORK" >&2
fi

# Deploy
echo "Deploying..." >&2
RESPONSE=$(curl -s -X POST "$DEPLOY_ENDPOINT" -F "file=@$TARBALL" -F "framework=$FRAMEWORK")

# Check if the response is valid JSON before processing
if ! validate_json "$RESPONSE"; then
    echo "Error: Invalid JSON response from server" >&2
    echo "$RESPONSE" >&2
    exit 1
fi

# Check for error in response
ERROR_MSG=$(extract_json_value "$RESPONSE" "error")
if [ -n "$ERROR_MSG" ]; then
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi

# Extract values from response using robust JSON parsing
PREVIEW_URL=$(extract_json_value "$RESPONSE" "previewUrl")
CLAIM_URL=$(extract_json_value "$RESPONSE" "claimUrl")
DEPLOYMENT_ID=$(extract_json_value "$RESPONSE" "deploymentId")
PROJECT_ID=$(extract_json_value "$RESPONSE" "projectId")

if [ -z "$PREVIEW_URL" ]; then
    echo "Error: Could not extract preview URL from response" >&2
    echo "$RESPONSE" >&2
    exit 1
fi

echo "" >&2
echo "Deployment successful!" >&2
echo "" >&2
echo "Preview URL: $PREVIEW_URL" >&2
echo "Claim URL:   $CLAIM_URL" >&2
echo "" >&2

# Output JSON for programmatic use
echo "$RESPONSE"
