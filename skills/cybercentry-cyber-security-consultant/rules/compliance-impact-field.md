---
title: Each Recommendation Includes a compliance_impact Field
impact: MEDIUM
impactDescription: Links remediation actions directly to regulatory control requirements
tags: compliance, impact, recommendations, controls, audit
---

## Each Recommendation Includes a compliance_impact Field

**Impact: MEDIUM (links remediation actions directly to regulatory control requirements)**

Every recommendation in a Cybercentry compliance response includes a `compliance_impact` field that maps the action to specific control requirements within the frameworks you specified. Use this field to directly populate your compliance management tooling, audit evidence, or risk register — avoiding the manual mapping step.

**Example response showing compliance_impact field:**

```json
{
  "recommendations": [
    {
      "priority": "immediate",
      "action": "Enable MFA for all administrative accounts",
      "implementation": "Enforce MFA at IdP level with phishing-resistant methods (FIDO2 preferred)",
      "estimated_effort": "1-2 days",
      "compliance_impact": "PCI-DSS Req 8.4.2, SOC2 CC6.1, ISO 27001 A.9.4.2, HIPAA 164.312(d)"
    },
    {
      "priority": "high",
      "action": "Implement encryption for data at rest",
      "implementation": "AES-256 encryption for all database volumes and object storage buckets",
      "estimated_effort": "1 week",
      "compliance_impact": "PCI-DSS Req 3.5, HIPAA 164.312(a)(2)(iv), GDPR Art. 32(1)(a), SOC2 CC6.7"
    }
  ]
}
```

**Correct usage for audit evidence generation:**

```javascript
const recommendations = response.recommendations;

// Generate audit evidence mapping
const auditMap = recommendations.map(rec => ({
  action: rec.action,
  controls: rec.compliance_impact,
  status: 'pending',
  evidence: null
}));

await updateComplianceRegister(auditMap);
```

Reference: [NIST SP 800-53 Security Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
