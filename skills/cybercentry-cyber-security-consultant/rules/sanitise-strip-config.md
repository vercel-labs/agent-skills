---
title: Remove Proprietary Security Configurations
impact: CRITICAL
impactDescription: Prevents disclosure of defensive controls to adversaries
tags: sanitise, config, firewall, waf, security-controls
---

## Remove Proprietary Security Configurations

**Impact: CRITICAL (prevents disclosure of defensive controls to adversaries)**

Firewall rule sets, WAF policies, SIEM alert thresholds, and IDS signatures describe exactly how your defences work. This information is highly sensitive — sending it to any external service creates unnecessary risk.

**Incorrect (reveals defensive posture):**

```json
{
  "question": "Are my firewall rules correct?",
  "context": {
    "firewall_rules": [
      "ALLOW TCP 0.0.0.0/0 -> 10.0.0.5:443",
      "DENY TCP 0.0.0.0/0 -> 10.0.0.5:22",
      "ALLOW TCP 10.0.1.0/24 -> 10.0.0.5:22"
    ],
    "waf_bypasses_blocked": ["SQLi pattern v3", "XSS-ENCODED-7"]
  }
}
```

**Correct (pattern described, specifics removed):**

```json
{
  "question": "Are my firewall rules correct?",
  "context": {
    "firewall_summary": "Public HTTPS allowed, SSH restricted to internal subnet only",
    "waf_provider": "AWS WAF v2",
    "concern": "Verifying the SSH ingress restriction is sufficient for a production web tier"
  }
}
```

Describe the intent and pattern of your security controls rather than their exact implementation. Cybercentry can assess correctness from a description without needing the raw rule set.
