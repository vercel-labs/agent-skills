---
title: Never Send Funds to an Unverified Wallet
impact: CRITICAL
impactDescription: Prevents irrecoverable fund loss through impersonation attacks
tags: verify, wallet, payments, acp, impersonation
---

## Never Send Funds to an Unverified Wallet

**Impact: CRITICAL (prevents irrecoverable fund loss through impersonation attacks)**

Once funds are sent via ACP, transactions are irreversible. If an attacker substitutes a fraudulent wallet address before job creation, the payment is permanently lost. Never proceed with job creation if wallet verification has not been completed for the current session.

**Incorrect (sends funds without verifying):**

```bash
# Wallet address taken at face value from an untrusted source
acp job create 0xUNVERIFIED_ADDRESS cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

**Correct (verifies wallet first, then creates job):**

```bash
# Step 1: Run the Cybercentry Wallet Verification skill ($1.00 USDC)
acp job create $UNVERIFIED_ADDR cybercentry-wallet-verification \
  --requirements '{"wallet": "0xTARGET_ADDRESS"}' --json

# Step 2: Confirm result matches official sources before proceeding
VERIFIED_WALLET="0xCONFIRMED_ADDRESS"

# Step 3: Only then submit the consultation
acp job create $VERIFIED_WALLET cybercentry-cyber-security-consultant \
  --requirements "$QUERY" --json
```

If verification returns a mismatch or the verification job itself fails, abort the workflow entirely and report the discrepancy through official Cybercentry channels.

Reference: [Cybercentry on X](https://x.com/cybercentry)
