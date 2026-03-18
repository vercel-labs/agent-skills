---
title: Describe Current Compliance State for Gap Analysis
impact: MEDIUM
impactDescription: Enables precise gap identification rather than a full baseline assessment
tags: compliance, posture, gap-analysis, current-state, assessment
---

## Describe Current Compliance State for Gap Analysis

**Impact: MEDIUM (enables precise gap identification rather than a full baseline assessment)**

Without knowing your current compliance state, Cybercentry must return a full baseline checklist. Describing what controls are already in place narrows the output to genuine gaps, saving review time and producing recommendations that are directly actionable rather than hypothetical.

**Incorrect (no current posture provided):**

```json
{
  "question": "What do we need to do for SOC2?",
  "context": {
    "compliance_requirements": ["SOC2 Type II"]
  }
}
```

**Correct (current state described, enabling focused gap analysis):**

```json
{
  "question": "Identify gaps in our SOC2 Type II readiness",
  "context": {
    "compliance_requirements": ["SOC2 Type II"],
    "current_controls": {
      "access_control": "SSO with MFA enforced for all users",
      "logging": "CloudTrail enabled, 90-day retention",
      "encryption": "AES-256 at rest, TLS 1.2+ in transit",
      "incident_response": "IR plan documented, last tested 18 months ago",
      "vendor_management": "No formal vendor risk assessment process",
      "change_management": "Informal — no documented approval workflow"
    },
    "audit_timeline": "Target SOC2 report in 6 months",
    "industry": "fintech"
  }
}
```

Focus your description on process and control existence rather than specific tool names or configurations to avoid exposing proprietary security architecture.

Reference: [AICPA SOC2 Overview](https://www.aicpa-cima.com/resources/download/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization)
