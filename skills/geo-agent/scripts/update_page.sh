#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <API_KEY> <PAGE_ID> <JSON_PAYLOAD>"
  echo "Example JSON_PAYLOAD: '{\"title\": \"updated\", \"content\": \"...\", \"seo_title\": \"...\", \"geo_entities\": [\"...\"], \"faq\": []}'"
  exit 1
fi

API_KEY="$1"
PAGE_ID="$2"
JSON_PAYLOAD="$3"
API_BASE="https://geo.yigather.com/api/v1/open"

curl -s -X PATCH "${API_BASE}/pages/${PAGE_ID}" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD"
