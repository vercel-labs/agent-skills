#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <API_KEY> <PAGE_ID> <true/false>"
  exit 1
fi

# Get the API Key from environment or argument
API_KEY="${GEO_API_KEY:-$1}"
PAGE_ID="$2"
IS_PUBLISHED="$3"
API_BASE="https://geo.yigather.com/api/v1/open"

PAYLOAD=$(jq -n --argjson pub "$IS_PUBLISHED" '{is_published: $pub}')

curl -s -X PATCH "${API_BASE}/pages/${PAGE_ID}/publish" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"
