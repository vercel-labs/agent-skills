#!/bin/bash

# Check if arguments are provided
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$4" ]; then
  echo "Usage: $0 <API_KEY> <PRODUCT_NAME> <SLOGAN> <KNOWLEDGE_TEXT>"
  exit 1
fi

API_KEY="$1"
PRODUCT_NAME="$2"
SLOGAN="$3"
KNOWLEDGE_TEXT="$4"
API_BASE="https://geo.yigather.com/api/v1/open"

# Create JSON payload securely using jq (to handle escapes)
PAYLOAD=$(jq -n \
  --arg name "$PRODUCT_NAME" \
  --arg slogan "$SLOGAN" \
  --arg text "$KNOWLEDGE_TEXT" \
  '{name: $name, slogan: $slogan, knowledge_text: $text}')

curl -s -X POST "${API_BASE}/products" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"
