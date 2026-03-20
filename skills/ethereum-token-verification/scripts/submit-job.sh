#!/bin/bash
# Job submission script for Ethereum Token Verification
# Usage: ./submit-job.sh <platform_id> <chain_id> <contract_address>

SELLER_WALLET="0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63"
OFFERING="ethereum-token-verification"
PLATFORM_ID="$1"
CHAIN_ID="$2"
CONTRACT_ADDRESS="$3"

if [ -z "$PLATFORM_ID" ] || [ -z "$CHAIN_ID" ] || [ -z "$CONTRACT_ADDRESS" ]; then
  echo "Usage: ./submit-job.sh <platform_id> <chain_id> <contract_address>"
  echo "Example: ./submit-job.sh 1 1 0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b"
  exit 1
fi

echo "Submitting Ethereum token verification job..."
JOB_RESPONSE=$(acp job create "$SELLER_WALLET" "$OFFERING" \
  --requirements "{\"platform_id\": $PLATFORM_ID, \"chain_id\": $CHAIN_ID, \"contract_address\": \"$CONTRACT_ADDRESS\"}" \
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
