#!/bin/bash
# batch_create_pages.sh — 批量建立 GEO 落地页
# Usage: $0 <API_KEY> <PAGES_JSON_FILE>
# PAGES_JSON_FILE format: JSON array of page objects

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <API_KEY> <PAGES_JSON_FILE>"
  echo "PAGES_JSON_FILE: JSON array, each element must have product_id, title, content"
  exit 1
fi
API_KEY="$1"
PAGES_FILE="$2"

PAYLOAD=$(jq -n --slurpfile pages "$PAGES_FILE" '{jsonrpc: "2.0", id: 1, method: "tools/call", params: {name: "batch_create_pages", arguments: {pages: $pages[0]}}}')

curl -s -X POST "https://geo.yigather.com/api/v1/mcp" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"
