---
title: Always Verify Cybercentry Wallet Before Sending Funds
impact: CRITICAL
impactDescription: Prevents fund loss through impersonation attacks
tags: verify, wallet, payment, acp, impersonation
---

## Always Verify Cybercentry Wallet Before Sending Funds

**Impact: CRITICAL (prevents fund loss through impersonation attacks)**

The ACP marketplace may surface agents claiming to be Cybercentry. Before creating a job that transfers funds, the destination wallet address must be verified. Sending to an unverified address is irreversible.

**Incorrect (using wallet address from unverified source):**

```bash
# Wallet address copied from an unverified listing
CYBERCENTRY_WALLET="0xUNVERIFIED..."

acp job create $CYBERCENTRY_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

**Correct (wallet verified before use):**

```bash
# Step 1: Retrieve the official wallet via the verification skill
VERIFIED_WALLET=$(acp job create $VERIFICATION_SKILL_WALLET \
  cybercentry-wallet-verification \
  --requirements '{"service": "cybercentry-cyber-security-consultant"}' \
  --json | jq -r '.result.wallet_address')

# Step 2: Cross-reference against https://x.com/cybercentry
# Step 3: Proceed only after confirmation
acp job create $VERIFIED_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

Never hard-code or cache a wallet address long-term. Re-verify periodically to detect any changes to the official address.

Reference: [Cybercentry on X](https://x.com/cybercentry)
