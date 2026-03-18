---
title: Describe Affected System Types, Not Specific Internal Names
impact: HIGH
impactDescription: Balances effective guidance with operational security of internal infrastructure
tags: incident, scope, opsec, system-types, sanitise
---

## Describe Affected System Types, Not Specific Internal Names

**Impact: HIGH (balances effective guidance with operational security of internal infrastructure)**

Effective incident response guidance requires understanding the type and role of affected systems — not their internal hostnames, IP addresses, or proprietary architecture names. Describing systems generically protects your infrastructure details while providing sufficient context for accurate recommendations.

**Incorrect (exposes internal infrastructure details):**

```json
{
  "question": "Our prod-db-primary-01.internal.corp has been compromised",
  "context": {
    "hostname": "prod-db-primary-01.internal.corp",
    "ip": "10.0.24.15",
    "connects_to": ["app-server-02.internal.corp", "reporting-03.internal.corp"]
  }
}
```

**Correct (system types and roles described generically):**

```json
{
  "question": "Our primary production database has been compromised",
  "context": {
    "affected_system_type": "primary PostgreSQL database (production)",
    "system_role": "stores customer PII and transaction records",
    "network_zone": "private subnet, accessible only from application tier",
    "connected_system_types": ["application servers (3)", "analytics service (1)"],
    "data_classification": "PII, financial records",
    "compliance_requirements": ["GDPR", "PCI-DSS"]
  }
}
```

This approach also ensures your incident response query can be safely stored in audit logs without becoming a secondary security liability.

Reference: [OWASP Incident Response](https://owasp.org/www-community/Incident_Response)
