#!/bin/bash

# Package for uv Script
# Creates a portable package with run script that uses uv to serve
# Usage: ./package-uv.sh [project-path] [output-dir]
# Returns: JSON with packagePath and instructions

set -e

# Parse arguments
PROJECT_PATH="${1:-.}"
OUTPUT_DIR="${2:-./deploy-package}"

# Resolve to absolute path
PROJECT_PATH=$(cd "$PROJECT_PATH" && pwd)

echo "Creating uv deployment package..." >&2

# Check for npm (needed for build)
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required but not installed" >&2
    echo "Install Node.js from https://nodejs.org/" >&2
    exit 1
fi

# Detect build output directory
detect_build_dir() {
    # Common build output directories
    if [ -d "$PROJECT_PATH/dist" ]; then
        echo "dist"
        return
    fi
    if [ -d "$PROJECT_PATH/build" ]; then
        echo "build"
        return
    fi
    if [ -d "$PROJECT_PATH/out" ]; then
        echo "out"
        return
    fi
    if [ -d "$PROJECT_PATH/public" ]; then
        echo "public"
        return
    fi
    echo "dist"
}

# Create output directory
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR=$(cd "$OUTPUT_DIR" && pwd)

# Build the project if it has package.json
if [ -f "$PROJECT_PATH/package.json" ]; then
    echo "Found package.json, building project..." >&2

    cd "$PROJECT_PATH"

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..." >&2
        npm install >&2
    fi

    # Check if build script exists
    if grep -q '"build"' package.json; then
        echo "Running build..." >&2
        npm run build >&2
    else
        echo "Warning: No build script found in package.json" >&2
    fi

    BUILD_DIR=$(detect_build_dir)

    if [ -d "$PROJECT_PATH/$BUILD_DIR" ]; then
        echo "Copying build output from $BUILD_DIR..." >&2
        cp -r "$PROJECT_PATH/$BUILD_DIR" "$OUTPUT_DIR/static"
    else
        echo "Warning: Build directory '$BUILD_DIR' not found, copying project root" >&2
        mkdir -p "$OUTPUT_DIR/static"
        # Copy everything except node_modules and .git
        find "$PROJECT_PATH" -maxdepth 1 -not -name "node_modules" -not -name ".git" -not -name "." -exec cp -r {} "$OUTPUT_DIR/static/" \;
    fi
else
    # Static HTML project
    echo "No package.json found, copying as static site..." >&2
    mkdir -p "$OUTPUT_DIR/static"
    cp -r "$PROJECT_PATH"/* "$OUTPUT_DIR/static/" 2>/dev/null || true

    # Handle single HTML file rename
    HTML_COUNT=$(find "$OUTPUT_DIR/static" -maxdepth 1 -name "*.html" -type f | wc -l | tr -d ' ')

    if [ "$HTML_COUNT" -eq 1 ]; then
        HTML_FILE=$(find "$OUTPUT_DIR/static" -maxdepth 1 -name "*.html" -type f | head -1)
        BASENAME=$(basename "$HTML_FILE")
        if [ "$BASENAME" != "index.html" ]; then
            echo "Renaming $BASENAME to index.html..." >&2
            mv "$HTML_FILE" "$OUTPUT_DIR/static/index.html"
        fi
    fi
fi

# Create pyproject.toml for uv
cat > "$OUTPUT_DIR/pyproject.toml" << 'EOF'
[project]
name = "deploy-server"
version = "1.0.0"
description = "Local deployment server"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.109.0",
    "uvicorn[standard]>=0.27.0",
]

[project.scripts]
serve = "server:main"
EOF

# Create the server.py file
cat > "$OUTPUT_DIR/server.py" << 'EOF'
#!/usr/bin/env python3
"""
Local deployment server using FastAPI.
Serves static files from the 'static' directory.
"""

import argparse
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn


def create_app(static_dir: str = "static") -> FastAPI:
    """Create FastAPI app configured to serve static files."""
    app = FastAPI(title="Deploy Server")

    static_path = Path(__file__).parent / static_dir
    if not static_path.exists():
        raise RuntimeError(f"Static directory not found: {static_path}")

    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="static")
    return app


def main():
    """Entry point for the server."""
    parser = argparse.ArgumentParser(description="Serve static files")
    parser.add_argument("--port", "-p", type=int, default=8000, help="Port to serve on")
    parser.add_argument("--host", "-H", type=str, default="127.0.0.1", help="Host to bind to")
    args = parser.parse_args()

    app = create_app()

    print(f"Starting server at http://localhost:{args.port}")
    print("Press Ctrl+C to stop")

    uvicorn.run(app, host=args.host, port=args.port, log_level="warning")


if __name__ == "__main__":
    main()
EOF

# Create run.sh script
cat > "$OUTPUT_DIR/run.sh" << 'EOF'
#!/bin/bash
# Run the deployment server using uv
# Usage: ./run.sh [port]

set -e

PORT="${1:-8000}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$SCRIPT_DIR"

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Error: uv is not installed"
    echo "Install it with: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

echo "Starting server on port $PORT..."
uv run server.py --port "$PORT"
EOF

chmod +x "$OUTPUT_DIR/run.sh"

# Create README
cat > "$OUTPUT_DIR/README.md" << EOF
# Deployment Package

This package contains a self-contained web application ready to run with \`uv\`.

## Requirements

- Python 3.11+
- uv (https://github.com/astral-sh/uv)

## Quick Start

\`\`\`bash
./run.sh
\`\`\`

The server will start at http://localhost:8000

## Custom Port

\`\`\`bash
./run.sh 3000
\`\`\`

## Manual Run with uv

\`\`\`bash
uv run server.py --port 8000
\`\`\`

## Install uv

\`\`\`bash
curl -LsSf https://astral.sh/uv/install.sh | sh
\`\`\`

## Contents

- \`static/\` - Built web application files
- \`server.py\` - FastAPI server script
- \`pyproject.toml\` - Python project configuration
- \`run.sh\` - Convenience script to start server
EOF

echo "" >&2
echo "Package created successfully!" >&2
echo "" >&2
echo "Location: $OUTPUT_DIR" >&2
echo "" >&2
echo "To run the package:" >&2
echo "  cd $OUTPUT_DIR" >&2
echo "  ./run.sh" >&2
echo "" >&2
echo "Or with uv directly:" >&2
echo "  cd $OUTPUT_DIR" >&2
echo "  uv run server.py" >&2
echo "" >&2

# Output JSON for programmatic use
echo "{\"packagePath\": \"$OUTPUT_DIR\", \"runCommand\": \"./run.sh\", \"uvCommand\": \"uv run server.py\"}"
