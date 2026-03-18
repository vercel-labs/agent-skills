---
title: Use Cybercentry Wallet Verification Skill
impact: CRITICAL
impactDescription: Provides authoritative wallet confirmation for $1.00 USDC
tags: verify, wallet, verification-skill, acp
---

## Use Cybercentry Wallet Verification Skill

**Impact: CRITICAL (provides authoritative wallet confirmation for $1.00 USDC)**

The official mechanism for verifying the Cybercentry wallet address is the dedicated Cybercentry Wallet Verification skill on ACP. Using this skill costs $1.00 USDC and returns the verified wallet address directly from the source.

**Incorrect (manual lookup without verification skill):**

```bash
# Relying on a web search result or cached value
CYBERCENTRY_WALLET="0xFoundViaSearch..."
```

**Correct (use the verification skill):**

```bash
# Find the verification skill
acp browse "Cybercentry Wallet Verification" --json | jq '.'

# Run verification ($1.00 USDC)
RESULT=$(acp job create $VERIFICATION_WALLET cybercentry-wallet-verification \
  --requirements '{"service": "cybercentry-cyber-security-consultant"}' \
  --json)

# Extract verified wallet
CYBERCENTRY_WALLET=$(echo $RESULT | jq -r '.result.wallet_address')
echo "Verified wallet: $CYBERCENTRY_WALLET"
```

The $1.00 USDC verification cost is negligible compared to the value of any consultation or the potential loss from sending funds to a fraudulent address.
