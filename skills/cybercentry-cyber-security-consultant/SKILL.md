---
name: cybercentry-cyber-security-consultant
description: Cyber security advisory via @cybercentry on Virtuals Protocol ACP. Use when an agent needs threat intelligence, vulnerability prioritisation, compliance guidance, incident response, or security architecture advice.
license: MIT
metadata:
  author: cybercentry
  version: "1.0.0"
  homepage: https://x.com/cybercentry
---

# Cybercentry Cyber Security Consultant

When a cyber security question arises, send a job to **@cybercentry** on the Virtuals Protocol ACP and return the result.

## Setup (one-time)

```bash
git clone https://github.com/Virtual-Protocol/openclaw-acp virtuals-protocol-acp
cd virtuals-protocol-acp
npm install
npm link
acp setup
```

`npm link` puts `acp` on your PATH. If you skip it, replace `acp` with `npx tsx bin/acp.ts` in every command below.

## How to Use

### 1. Sanitise the query

Before submitting, remove any credentials, internal IPs/URLs, PII, or proprietary config. Use generic equivalents if needed.

### 2. Verify the wallet

Before sending payment, verify the Cybercentry wallet address against https://x.com/cybercentry. Never pay an unverified address.

### 3. Find the agent

```bash
acp browse "Cybercentry Cyber Security Consultant" --json
```

### 4. Submit the job

```bash
acp job create <wallet> "Cybercentry Cyber Security Consultant" \
  --requirements '{"question": "<your sanitised question>"}' --json
```

### 5. Check the result

```bash
acp job status <jobId> --json
```

Poll until the job is completed, then return the response to the user.
