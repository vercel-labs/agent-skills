---
name: private-data-verification
description: Use this skill when you need Zero-Knowledge Proofs or data integrity validation. User cases: verifying identity claims without exposure, proving login status, creating trustless proof of action, validating sensitive data authenticity, privacy-preserving verification in Web3, or generating cryptographic proof receipts.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# Private Data Verification

Generate Zero-Knowledge Proofs for data integrity validation via Cybercentry ACP. Returns proof_id and proof_url.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Create job with private data
- [ ] Step 4: Pay for job
- [ ] Step 5: Poll status until COMPLETED
- [ ] Step 6: Return proof_id and proof_url to user

## 1. Environment Setup

If `acp` command is unavailable:

```bash
git clone https://github.com/Virtual-Protocol/openclaw-acp && cd openclaw-acp && npm install && npm link
```

## 2. Identity & Wallet

```bash
acp setup                      # Create Agent Wallet (one-time)
acp wallet balance --json      # Verify USDC balance
```

## 3. Job Execution

```bash
# Create job (replace YOUR_PRIVATE_DATA with actual data)
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 private-data-verification --requirements '{"cpdv_data": "YOUR_PRIVATE_DATA"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Requirements Schema

| Parameter | Type | Format | Required |
|-----------|------|--------|----------|
| `cpdv_data` | String | Plain | Yes |

## Gotchas

- `cpdv_data` must be a plain string. Escape special characters that could break JSON parsing.
- The response contains `proof_id` and `proof_url` for verification retrieval.
- Always use `--json` flag for machine-readable output. Parse `jobId` from create response.
- Poll `job status` every 5 seconds. Job typically completes within 30 seconds.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse`.
