---
title: Query for CVEs Affecting Specific Dependency Versions
impact: HIGH
impactDescription: Maximises relevance of threat intelligence by scoping to exact versions
tags: threat, cve, dependencies, versions, nvd
---

## Query for CVEs Affecting Specific Dependency Versions

**Impact: HIGH (maximises relevance of threat intelligence by scoping to exact versions)**

Generic questions about whether a technology is "secure" return generic answers. Providing exact package names and version numbers allows Cybercentry to query NIST NVD and vendor advisories for CVEs that specifically affect your deployment, filtering out noise from patched or unrelated issues.

**Incorrect (too vague to return actionable results):**

```json
{
  "question": "Is our Node.js application secure?",
  "context": {
    "technology": "Node.js",
    "environment": "production"
  }
}
```

**Correct (version-specific, produces targeted CVE results):**

```json
{
  "question": "What CVEs affect these dependency versions and what is their exploitability in a containerised fintech environment?",
  "context": {
    "dependencies": [
      { "name": "express", "version": "4.18.2" },
      { "name": "jsonwebtoken", "version": "8.5.1" },
      { "name": "axios", "version": "1.4.0" }
    ],
    "environment": "production",
    "deployment": "kubernetes",
    "industry": "fintech"
  }
}
```

Include all direct dependencies from your lock file for the most complete analysis.

Reference: [NIST NVD](https://nvd.nist.gov)
