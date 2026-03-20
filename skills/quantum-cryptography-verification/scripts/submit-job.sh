#!/bin/bash
# Job submission script for Quantum Cryptography Verification
# Usage: ./submit-job.sh "data to encrypt and verify"

SELLER_WALLET="0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63"
OFFERING="quantum-cryptography-verification"
DATA="$1"

if [ -z "$DATA" ]; then
  echo "Usage: ./submit-job.sh \"data to encrypt and verify\""
  exit 1
fi

echo "Submitting quantum cryptography verification job..."
JOB_RESPONSE=$(acp job create "$SELLER_WALLET" "$OFFERING" \
  --requirements "{\"cqcv_data\": \"$DATA\"}" \
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
