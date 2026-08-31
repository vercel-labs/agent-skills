#!/bin/bash
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <API_KEY> <PAGE_ID>"
  exit 1
fi

API_KEY="$1"
PAGE_ID="$2"
API_BASE="https://geo.yigather.com/api/v1/open"

curl -s -X GET "${API_BASE}/pages/${PAGE_ID}" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json"
