---
title: State Whether Systems Are Customer-Facing or Internal
impact: MEDIUM-HIGH
impactDescription: Adjusts vulnerability priority based on actual attack surface exposure
tags: vuln, business-impact, customer-facing, attack-surface, risk
---

## State Whether Systems Are Customer-Facing or Internal

**Impact: MEDIUM-HIGH (adjusts vulnerability priority based on actual attack surface exposure)**

The same CVE can have radically different priority depending on whether the affected component is reachable from the internet or isolated within a private network. Always include the exposure type of each system in your vulnerability prioritisation query to receive business-adjusted risk ratings rather than raw CVSS scores.

**Incorrect (no exposure context):**

```json
{
  "question": "Prioritise these CVEs",
  "context": {
    "vulnerabilities": [
      { "cve": "CVE-2023-12345", "package": "nginx", "cvss": 8.2 }
    ]
  }
}
```

**Correct (exposure type included per system):**

```json
{
  "question": "Prioritise remediation for these vulnerabilities by business impact",
  "context": {
    "vulnerabilities": [
      {
        "cve": "CVE-2023-12345",
        "package": "nginx",
        "cvss": 8.2,
        "system_exposure": "internet-facing reverse proxy",
        "handles_data": "customer authentication tokens"
      },
      {
        "cve": "CVE-2023-67890",
        "package": "redis",
        "cvss": 7.5,
        "system_exposure": "internal-only session cache",
        "network_access": "restricted to application subnet"
      }
    ],
    "industry": "fintech",
    "compliance_requirements": ["PCI-DSS", "SOC2"]
  }
}
```

Reference: [CISA Vulnerability Management Guidance](https://www.cisa.gov/topics/cyber-threats-and-advisories/vulnerability-management)
