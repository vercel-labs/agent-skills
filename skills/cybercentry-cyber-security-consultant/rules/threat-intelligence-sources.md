---
title: Results Cite NIST NVD, CISA KEV, and Vendor Advisories
impact: HIGH
impactDescription: Enables downstream verification and audit trail for threat findings
tags: threat, intelligence, nvd, cisa, advisories, sources
---

## Results Cite NIST NVD, CISA KEV, and Vendor Advisories

**Impact: HIGH (enables downstream verification and audit trail for threat findings)**

Every threat assessment returned by Cybercentry cites its source data. The `threat_intelligence_sources` array in the response identifies which feeds informed the analysis. Your downstream tooling or audit process should validate critical findings against these sources before taking remediation action.

**Example response to inspect:**

```json
{
  "current_threats": [
    {
      "threat": "Critical RCE in jsonwebtoken versions < 9.0.0 via malformed JWT",
      "severity": "critical",
      "affected_versions": "jsonwebtoken < 9.0.0",
      "cve": "CVE-2022-23529"
    }
  ],
  "threat_intelligence_sources": [
    "NIST NVD",
    "CISA KEV",
    "GitHub Security Advisory GHSA-hjrf-2m68-5959"
  ]
}
```

**Correct downstream validation:**

```bash
# Independently confirm CISA KEV findings
curl -s "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json" \
  | jq '.vulnerabilities[] | select(.cveID == "CVE-2022-23529")'

# Confirm NVD score
curl -s "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2022-23529" \
  | jq '.vulnerabilities[0].cve.metrics'
```

Always treat findings with `CISA KEV` as a source as actively exploited in the wild and prioritise immediately.

Reference: [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
