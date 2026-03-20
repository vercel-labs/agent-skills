---
name: solidity-code-verification
description: Use this skill when you need security analysis of Solidity smart contract code. User cases: auditing Solidity contracts, identifying re-entrancy bugs, detecting access control issues, reviewing unsafe external calls, evaluating code before deployment, gate-checking contracts in transaction pipelines, or performing security assessments.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# Solidity Code Verification

Analyze Solidity code for vulnerabilities via Cybercentry ACP. Returns High/Medium/Low/Informational risk level.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Create job with Solidity code
- [ ] Step 4: Pay for job
- [ ] Step 5: Poll status until COMPLETED (typically < 2 minutes)
- [ ] Step 6: Return risk assessment to user

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
# Create job (replace SOLIDITY_CODE with actual code)
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 solidity-code-verification --requirements '{"solidity_code": "SOLIDITY_CODE"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Requirements Schema

| Parameter | Type | Format | Required | Description |
|-----------|------|--------|----------|-------------|
| `solidity_code` | String | Plain | Yes | Solidity source code to analyze |

## Gotchas

- Escape double quotes and newlines in the Solidity code for valid JSON.
- For multi-file contracts, concatenate all files into a single string.
- Execution time averages under 2 minutes. Poll every 10 seconds for this job.
- Always use `--json` flag for machine-readable output. Parse `jobId` from create response.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse`.
