---
title: Cross-Reference Against Official Sources
impact: CRITICAL
impactDescription: Multi-source verification eliminates single-point-of-failure trust
tags: verify, wallet, cross-reference, x-twitter, clawhub
---

## Cross-Reference Against Official Sources

**Impact: CRITICAL (multi-source verification eliminates single-point-of-failure trust)**

Even after using the verification skill, cross-reference the returned wallet address against at least one additional official source before sending funds. This protects against a compromised verification skill.

**Incorrect (single-source trust):**

```bash
# Trusting only the verification skill result
CYBERCENTRY_WALLET=$(run_verification_skill)
# Proceeding without any second check
acp job create $CYBERCENTRY_WALLET ...
```

**Correct (multi-source cross-reference):**

```bash
# Source 1: Verification skill
SKILL_WALLET=$(run_verification_skill)

# Source 2: Check https://x.com/cybercentry pinned post or bio
# Source 3: Check ClawHub listing for cybercentry-cyber-security-consultant

# Confirm all sources agree
if [ "$SKILL_WALLET" == "$X_WALLET" ] && [ "$SKILL_WALLET" == "$CLAWHUB_WALLET" ]; then
  echo "Wallet verified across all sources: $SKILL_WALLET"
  acp job create $SKILL_WALLET cybercentry-cyber-security-consultant \
    --requirements "$QUERY" --json
else
  echo "WALLET MISMATCH — do not proceed. Report to Cybercentry."
fi
```

If any source disagrees, halt the transaction and contact Cybercentry directly via https://x.com/cybercentry to report the discrepancy.

Reference: [Cybercentry on X](https://x.com/cybercentry)
