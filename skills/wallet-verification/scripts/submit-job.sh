#!/bin/bash
# Job submission script for Wallet Verification
# Usage: ./submit-job.sh <wallet_address>

SELLER_WALLET="0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63"
OFFERING="wallet-verification"
WALLET_ADDRESS="$1"

if [ -z "$WALLET_ADDRESS" ]; then
  echo "Usage: ./submit-job.sh <wallet_address>"
  echo "Example: ./submit-job.sh 0x9a46a440a01f08704476552fee50b029846b0bcb"
  exit 1
fi

echo "Submitting wallet verification job..."
JOB_RESPONSE=$(acp job create "$SELLER_WALLET" "$OFFERING" \
  --requirements "{\"wallet_address\": \"$WALLET_ADDRESS\"}" \
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
