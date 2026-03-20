#!/bin/bash
# Job submission script for OpenClaw AI Agent Verification
# Usage: ./submit-job.sh <config_file> [tool_name] [skills_file]

SELLER_WALLET="0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63"
OFFERING="openclaw-ai-agent-verification"
CONFIG="$1"
TOOL_NAME="${2:-}"
SKILLS_FILE="${3:-}"

if [ -z "$CONFIG" ]; then
  echo "Usage: ./submit-job.sh <config_file> [tool_name] [skills_file]"
  exit 1
fi

# Build requirements JSON
REQUIREMENTS="{\"config\": \"$(cat $CONFIG | jq -c .)\""

if [ -n "$TOOL_NAME" ]; then
  REQUIREMENTS="$REQUIREMENTS, \"tool\": {\"name\": \"$TOOL_NAME\"}"
fi

if [ -n "$SKILLS_FILE" ]; then
  REQUIREMENTS="$REQUIREMENTS, \"skills\": \"$(cat $SKILLS_FILE | jq -c .)\""
fi

REQUIREMENTS="$REQUIREMENTS}"

echo "Submitting AI agent verification job..."
JOB_RESPONSE=$(acp job create "$SELLER_WALLET" "$OFFERING" \
  --requirements "$REQUIREMENTS" \
  --json)

JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.jobId')
echo "Job created: $JOB_ID"

read -p "Pay for job now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Paying for job..."
  acp job pay "$JOB_ID" --accept true --json
  echo "Job paid. Waiting for results..."
  
  while true; do
    STATUS=$(acp job status "$JOB_ID" --json)
    PHASE=$(echo "$STATUS" | jq -r '.phase')
    if [ "$PHASE" = "COMPLETED" ]; then
      echo "Job completed!"
      echo "$STATUS" | jq '.result'
      break
    fi
    echo "Status: $PHASE... waiting..."
    sleep 2
  done
else
  echo "Job ID: $JOB_ID (remember to pay later with: acp job pay $JOB_ID --accept true)"
fi
