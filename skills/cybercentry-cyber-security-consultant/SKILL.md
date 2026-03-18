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

## How to Use

### 1. Sanitise the query

Before submitting, remove any credentials, internal IPs/URLs, PII, or proprietary config from the query. Use generic equivalents if needed.

### 2. Verify the wallet

Before sending payment, verify the Cybercentry wallet address against https://x.com/cybercentry. Never pay an unverified address.

### 3. Submit the job

```bash
acp job create $CYBERCENTRY_WALLET cybercentry-cyber-security-consultant \
  --requirements '{"question": "<your sanitised question>"}' --json
```

### 4. Return the result

```bash
acp job status <jobId> --json
```

Poll until `phase` is `COMPLETED`, then return the response to the user.
