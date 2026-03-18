---
title: Remove All Personally Identifiable Information
impact: CRITICAL
impactDescription: Prevents PII disclosure and regulatory violations
tags: sanitise, pii, gdpr, privacy, data-protection
---

## Remove All Personally Identifiable Information

**Impact: CRITICAL (prevents PII disclosure and regulatory violations)**

Transmitting personally identifiable information (PII) to a third-party service without a data processing agreement may violate GDPR, HIPAA, and other regulations. Remove all names, email addresses, phone numbers, device IDs, and any other data that can identify an individual.

**Incorrect (contains real PII):**

```json
{
  "question": "Was this login event suspicious?",
  "context": {
    "user_email": "jane.doe@acme.com",
    "user_id": "usr_8472910",
    "ip_address": "203.0.113.47",
    "device": "iPhone 15 Pro — Jane's Phone"
  }
}
```

**Correct (anonymised, context preserved):**

```json
{
  "question": "Was this login event suspicious?",
  "context": {
    "user_email": "[REDACTED]",
    "user_id": "[REDACTED]",
    "ip_address": "[EXTERNAL-IP]",
    "device": "mobile — iOS 17",
    "event_details": "Login from new country, no prior sessions from this region"
  }
}
```

Describe behavioural patterns and event metadata in generic terms. The security question can always be answered without real user data.

Reference: [GDPR Article 4 — Definition of Personal Data](https://gdpr-info.eu/art-4-gdpr/)
