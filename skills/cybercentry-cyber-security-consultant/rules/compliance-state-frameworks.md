---
title: Name Target Frameworks in the Requirements Field
impact: MEDIUM
impactDescription: Focuses compliance gap analysis on relevant regulatory obligations
tags: compliance, frameworks, gdpr, soc2, iso27001, pci-dss, hipaa, iasme
---

## Name Target Frameworks in the Requirements Field

**Impact: MEDIUM (focuses compliance gap analysis on relevant regulatory obligations)**

Cybercentry supports gap analysis across GDPR, SOC2, ISO 27001, PCI-DSS, HIPAA, and IASME Cyber Baseline. Always specify which frameworks apply to your organisation. Requesting analysis against all frameworks simultaneously produces an unfocused response; naming your specific obligations produces a targeted, actionable gap analysis.

**Incorrect (no frameworks specified):**

```json
{
  "question": "Are we compliant?",
  "context": {
    "industry": "healthcare",
    "environment": "production"
  }
}
```

**Correct (specific frameworks named):**

```json
{
  "question": "Provide a compliance gap analysis for our cloud infrastructure",
  "context": {
    "compliance_requirements": ["HIPAA", "SOC2 Type II"],
    "industry": "healthcare",
    "data_types": ["protected_health_information", "billing_records"],
    "environment": "production",
    "cloud_provider": "AWS",
    "deployment_model": "multi-tenant SaaS"
  }
}
```

Each recommendation in the response will include a `compliance_impact` field mapping the action to specific control requirements within your named frameworks.

Reference: [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
