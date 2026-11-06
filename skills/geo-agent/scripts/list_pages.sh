#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: $0 <API_KEY> [PRODUCT_ID]"
  exit 1
fi

API_KEY="$1"
PRODUCT_ID="$2"
API_BASE="https://geo.yigather.com/api/v1/open"

if [ -n "$PRODUCT_ID" ]; then
  API_URL="${API_BASE}/pages?product_id=${PRODUCT_ID}"
else
  API_URL="${API_BASE}/pages"
fi

curl -s -X GET "$API_URL" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json"
