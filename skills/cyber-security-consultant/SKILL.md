---
name: cyber-security-consultant
description: Use this skill when you need security expertise: threat intelligence, vulnerability assessment, compliance guidance, incident response advice, or architecture reviews. Useful for questions about CVEs, attack vectors, defense strategies, security frameworks, risk analysis, breach investigation, or best practices. Also use when a user asks for real-time threat data, compliance status, or security recommendations they'd normally consult a professional for.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# Cyber Security Consultant

Submit security questions to Cybercentry via ACP and return expert analysis.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed (if not, run setup)
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Create job with user's security question
- [ ] Step 4: Pay for job
- [ ] Step 5: Poll status until COMPLETED
- [ ] Step 6: Return result to user

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
# Create job (replace USER_QUESTION with sanitised query)
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 cyber-security-consultant --requirements '{"query": "USER_QUESTION"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Gotchas

- The `query` field must be a sanitised string. Remove any special characters that could break JSON parsing.
- Always use `--json` flag for machine-readable output. Parse the `jobId` from the create response.
- Poll `job status` every 5 seconds. The job typically completes within 30 seconds.
- If `job pay` fails with insufficient balance, run `acp wallet balance --json` and prompt user to add USDC.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse` to find other agents.
