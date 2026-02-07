#!/bin/bash

# Local Deployment Script
# Builds npm project and serves via FastAPI
# Usage: ./deploy-local.sh [project-path] [port]
# Returns: JSON with localUrl and serverPid

set -e

# Parse arguments
PROJECT_PATH="${1:-.}"
PORT="${2:-8000}"

# Resolve to absolute path
PROJECT_PATH=$(cd "$PROJECT_PATH" && pwd)

echo "Preparing local deployment..." >&2

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required but not installed" >&2
    echo "Install Node.js from https://nodejs.org/" >&2
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Error: python3 is required but not installed" >&2
    exit 1
fi

# Detect build output directory
detect_build_dir() {
    local pkg_json="$1"

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
    if [ -d "$PROJECT_PATH/.next" ]; then
        echo ".next"
        return
    fi
    if [ -d "$PROJECT_PATH/public" ]; then
        echo "public"
        return
    fi

    # Default to dist
    echo "dist"
}

# Check if project has package.json
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

    BUILD_DIR=$(detect_build_dir "$PROJECT_PATH/package.json")
    SERVE_PATH="$PROJECT_PATH/$BUILD_DIR"

    if [ ! -d "$SERVE_PATH" ]; then
        echo "Warning: Build directory '$BUILD_DIR' not found, serving project root" >&2
        SERVE_PATH="$PROJECT_PATH"
    fi
else
    # Static HTML project
    echo "No package.json found, serving as static site..." >&2
    SERVE_PATH="$PROJECT_PATH"

    # Handle single HTML file rename (like deploy.sh does)
    HTML_COUNT=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f | wc -l | tr -d ' ')

    if [ "$HTML_COUNT" -eq 1 ]; then
        HTML_FILE=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f | head -1)
        BASENAME=$(basename "$HTML_FILE")
        if [ "$BASENAME" != "index.html" ]; then
            echo "Renaming $BASENAME to index.html..." >&2
            cp "$HTML_FILE" "$PROJECT_PATH/index.html"
        fi
    fi
fi

echo "Serve path: $SERVE_PATH" >&2

# Create a simple FastAPI server script with cleanup trap
TEMP_SERVER=""
cleanup() {
    if [ -n "$TEMP_SERVER" ] && [ -f "$TEMP_SERVER" ]; then
        rm -f "$TEMP_SERVER"
    fi
}
trap cleanup EXIT INT TERM

TEMP_SERVER=$(mktemp)
cat > "$TEMP_SERVER" << 'PYEOF'
import sys
import os
from pathlib import Path

# Get arguments
serve_path = sys.argv[1] if len(sys.argv) > 1 else "."
port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000

# Try FastAPI first, fall back to http.server
try:
    from fastapi import FastAPI
    from fastapi.staticfiles import StaticFiles
    import uvicorn

    app = FastAPI()
    app.mount("/", StaticFiles(directory=serve_path, html=True), name="static")

    print(f"Starting FastAPI server on port {port}...", file=sys.stderr)
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")
except ImportError:
    # Fall back to built-in http.server
    import http.server
    import socketserver

    os.chdir(serve_path)

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass  # Suppress logging

    print(f"Starting Python http.server on port {port}...", file=sys.stderr)
    print(f"(Install fastapi and uvicorn for better performance)", file=sys.stderr)

    with socketserver.TCPServer(("127.0.0.1", port), QuietHandler) as httpd:
        httpd.serve_forever()
PYEOF

echo "" >&2
echo "Starting local server..." >&2
echo "" >&2
echo "Local server running at: http://localhost:$PORT" >&2
echo "Serving from: $SERVE_PATH" >&2
echo "Press Ctrl+C to stop the server" >&2
echo "" >&2

# Output JSON for programmatic use
echo "{\"localUrl\": \"http://localhost:$PORT\", \"servePath\": \"$SERVE_PATH\"}"

# Run the server (this blocks until Ctrl+C)
# Cleanup handled by trap on EXIT/INT/TERM
python3 "$TEMP_SERVER" "$SERVE_PATH" "$PORT"
