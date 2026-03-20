---
name: quantum-cryptography-verification
description: Quantum-resistant AES-256-GCM encryption and data verification via Cybercentry ACP. Encrypts text data securely in real time using advanced quantum-safe algorithms. Returns record_id and decrypt_url for secure storage and retrieval in Web3 applications. Ensures trustless, privacy-preserving access control for sensitive data sharing and archival. Priced at $1.00 per encryption.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# Quantum Cryptography Verification

Encrypt data with quantum-resistant AES-256-GCM via Cybercentry ACP. Returns record_id and decrypt_url.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Create job with data to encrypt
- [ ] Step 4: Pay for job
- [ ] Step 5: Poll status until COMPLETED
- [ ] Step 6: Return record_id and decrypt_url to user

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
# Create job (replace USER_DATA with data to encrypt)
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 quantum-cryptography-verification --requirements '{"cqcv_data": "USER_DATA"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Requirements Schema

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cqcv_data` | String | Yes | Data to encrypt with quantum-resistant cryptography |

## Gotchas

- `cqcv_data` must be a plain string. Escape special characters that could break JSON parsing.
- The response contains `record_id` and `decrypt_url` for future data retrieval.
- Always use `--json` flag for machine-readable output. Parse `jobId` from create response.
- Poll `job status` every 5 seconds. Job typically completes within 30 seconds.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse`.
