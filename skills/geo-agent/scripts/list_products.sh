#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <API_KEY>"
  exit 1
fi

API_KEY="$1"
API_BASE="https://geo.yigather.com/api/v1/open"

curl -s -X GET "${API_BASE}/products" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json"
