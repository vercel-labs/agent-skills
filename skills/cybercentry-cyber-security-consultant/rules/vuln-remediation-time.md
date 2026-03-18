---
title: Response Includes Estimated Remediation Time per Gap
impact: MEDIUM-HIGH
impactDescription: Enables sprint planning and resource allocation for security remediation
tags: vuln, remediation-time, planning, gap-analysis, effort
---

## Response Includes Estimated Remediation Time per Gap

**Impact: MEDIUM-HIGH (enables sprint planning and resource allocation for security remediation)**

Every vulnerability prioritisation response from Cybercentry includes `gap_analysis.estimated_remediation_time` for the overall posture, and each recommendation includes effort context. Use these estimates for sprint planning, stakeholder reporting, and resource allocation decisions.

**Example response to parse:**

```json
{
  "gap_analysis": {
    "current_posture": "high",
    "critical_gaps": 2,
    "high_gaps": 5,
    "estimated_remediation_time": "3-4 weeks with dedicated security sprint"
  },
  "recommendations": [
    {
      "priority": "immediate",
      "action": "Upgrade jsonwebtoken to >= 9.0.0",
      "implementation": "npm install jsonwebtoken@latest && run test suite",
      "estimated_effort": "2-4 hours",
      "compliance_impact": "Resolves PCI-DSS Req 6.3.3 finding"
    },
    {
      "priority": "high",
      "action": "Rotate all JWT signing secrets",
      "implementation": "Generate new RS256 key pair, update secret manager, deploy with rolling restart",
      "estimated_effort": "1 day",
      "compliance_impact": "Addresses SOC2 CC6.1"
    }
  ]
}
```

**Correct usage in automated planning:**

```javascript
const gaps = response.gap_analysis;
const immediateItems = response.recommendations.filter(r => r.priority === 'immediate');

// Report to project management tooling
await createSprintTickets(immediateItems.map(item => ({
  title: item.action,
  effort: item.estimated_effort,
  compliance: item.compliance_impact
})));
```

Reference: [NIST SP 800-40 Guide to Enterprise Patch Management](https://csrc.nist.gov/publications/detail/sp/800-40/rev-4/final)
