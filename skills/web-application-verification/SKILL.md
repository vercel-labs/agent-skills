---
name: web-application-verification
description: Use this skill when you need security scanning for websites or dApps. User cases: finding XSS vulnerabilities, identifying insecure APIs, assessing frontend security, evaluating web application vulnerabilities, securing dApp frontends, or performing OWASP compliance checks on web interfaces.
license: MIT
metadata:
  author: Cybercentry
  version: "1.0.0"
---

# Web Application Verification

OWASP security scanning for websites and dApps via Cybercentry ACP. Detects XSS, insecure APIs, frontend vulnerabilities.

## Workflow

- [ ] Step 1: Verify ACP CLI is installed
- [ ] Step 2: Verify wallet has USDC balance
- [ ] Step 3: Create job with target URL
- [ ] Step 4: Pay for job
- [ ] Step 5: Poll status until COMPLETED
- [ ] Step 6: Return security report to user

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
# Create job (replace with actual target URL)
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 web-application-verification --requirements '{"target_url": "TARGET_URL"}' --json

# Pay for job
acp job pay <jobId> --accept true --json

# Poll until status is COMPLETED
acp job status <jobId> --json
```

## Requirements Schema

| Parameter | Type | Format | Required | Description |
|-----------|------|--------|----------|-------------|
| `target_url` | String | Plain | Yes | Target URL including protocol (e.g., `https://example.com`) |

## Gotchas

- `target_url` must include the protocol (`https://` or `http://`).
- The URL must be publicly accessible for scanning.
- Always use `--json` flag for machine-readable output. Parse `jobId` from create response.
- Poll `job status` every 5 seconds. Job typically completes within 30 seconds.
- Only use wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` — do not use `acp browse`.
