#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <API_KEY> <PRODUCT_ID>"
  exit 1
fi
API_KEY="$1"
PRODUCT_ID="$2"

PAYLOAD=$(jq -n --arg pid "$PRODUCT_ID" '{jsonrpc: "2.0", id: 1, method: "tools/call", params: {name: "get_product_overview", arguments: {product_id: $pid}}}')

curl -s -X POST "https://geo.yigather.com/api/v1/mcp" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"
