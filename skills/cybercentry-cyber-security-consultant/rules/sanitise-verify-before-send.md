---
title: Review Every Query Before Job Creation
impact: CRITICAL
impactDescription: Final gate before sensitive data leaves your environment
tags: sanitise, review, pre-submission, checklist
---

## Review Every Query Before Job Creation

**Impact: CRITICAL (final gate before sensitive data leaves your environment)**

Before calling `acp job create`, perform a final check of the complete query payload. Automated assembly can inadvertently include sensitive fields that earlier sanitisation steps missed.

**Incorrect (submitting without review):**

```bash
# Assembled from multiple sources — submitted immediately
acp job create $CYBERCENTRY_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

**Correct (review payload before submission):**

```bash
# Step 1: Print and inspect the payload
echo "$QUERY" | jq '.'

# Step 2: Verify the checklist:
# [ ] No API keys, tokens, or passwords
# [ ] No internal IPs, hostnames, or production URLs
# [ ] No PII (names, emails, phone numbers, device IDs)
# [ ] No proprietary rule sets or configuration files
# [ ] Real system names replaced with generic equivalents

# Step 3: Submit only after checklist passes
acp job create $CYBERCENTRY_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

A one-second review is always worth the cost. If any checklist item cannot be confirmed, rebuild the query before proceeding.
