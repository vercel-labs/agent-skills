---
title: Threats Are Rated Critical / High / Medium / Low with Context
impact: HIGH
impactDescription: Enables risk-based prioritisation aligned to business impact
tags: threat, severity, cvss, prioritisation, risk
---

## Threats Are Rated Critical / High / Medium / Low with Context

**Impact: HIGH (enables risk-based prioritisation aligned to business impact)**

Every threat in the response carries a severity rating (`critical`, `high`, `medium`, `low`) derived from CVSS scores, CISA KEV status, and the business context you provide. A CVSS 9.8 vulnerability in an internal-only system has different operational priority than the same CVE on a public-facing API. Providing environment context ensures the severity mapping reflects your actual risk, not just the raw score.

**Example response showing contextual severity:**

```json
{
  "current_threats": [
    {
      "threat": "Prototype pollution in lodash merge()",
      "severity": "medium",
      "cvss": 7.4,
      "contextual_note": "Downgraded from high: affected code path is not reachable from public endpoints in your described architecture",
      "affected_versions": "lodash < 4.17.21"
    },
    {
      "threat": "JWT algorithm confusion allowing signature bypass",
      "severity": "critical",
      "cvss": 9.1,
      "contextual_note": "Upgraded to critical: token is used for multi-tenant auth; CISA KEV listed",
      "affected_versions": "jsonwebtoken < 9.0.0"
    }
  ]
}
```

**Correct query including context that influences severity:**

```json
{
  "question": "Rate these CVEs in the context of our architecture",
  "context": {
    "public_facing_services": ["api-gateway", "auth-service"],
    "internal_only_services": ["batch-processor", "reporting-service"],
    "multi_tenant": true,
    "compliance_requirements": ["PCI-DSS"]
  }
}
```

Reference: [CVSS v3.1 Specification](https://www.first.org/cvss/v3.1/specification-document)
