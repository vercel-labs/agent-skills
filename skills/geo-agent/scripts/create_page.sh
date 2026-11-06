#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
  echo "Usage: $0 <API_KEY> <PRODUCT_ID> <TITLE> <MARKDOWN_CONTENT> [OPTIONAL_JSON_PAYLOAD_FOR_SEO_AND_SLUG]"
  echo "Example OPTIONAL_JSON_PAYLOAD: '{\"slug\": \"my-page\", \"seo_title\": \"...\", \"geo_entities\": [\"...\"], \"faq\": []}'"
  exit 1
fi
API_KEY="$1"
PRODUCT_ID="$2"
TITLE="$3"
CONTENT="$4"
EXTRA_JSON="${5:-"{}"}"
API_BASE="https://geo.yigather.com/api/v1/open"

PAYLOAD=$(jq -n \
  --arg pid "$PRODUCT_ID" \
  --arg title "$TITLE" \
  --arg text "$CONTENT" \
  --argjson extra "$EXTRA_JSON" \
  '{product_id: $pid, title: $title, content: $text} + $extra')

curl -s -X POST "${API_BASE}/pages" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"
