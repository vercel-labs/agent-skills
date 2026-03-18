---
title: Include Affected Component Names and Version Ranges
impact: MEDIUM-HIGH
impactDescription: Enables accurate patch path identification and upgrade planning
tags: vuln, components, versions, remediation, packages
---

## Include Affected Component Names and Version Ranges

**Impact: MEDIUM-HIGH (enables accurate patch path identification and upgrade planning)**

Vulnerability remediation guidance is only actionable when it targets specific component versions. Cybercentry uses component name and version to identify the exact patch path, available safe versions, and whether a workaround exists when an upgrade is not immediately possible.

**Incorrect (component identified but version missing):**

```json
{
  "question": "How do we fix the OpenSSL vulnerability?",
  "context": {
    "component": "OpenSSL"
  }
}
```

**Correct (component name, current version, and version range provided):**

```json
{
  "question": "Provide remediation path for these vulnerable components",
  "context": {
    "affected_components": [
      {
        "name": "OpenSSL",
        "current_version": "1.1.1t",
        "vulnerable_range": "< 3.0.0",
        "deployment": "base Docker image (ubuntu:20.04)",
        "can_upgrade_immediately": false,
        "upgrade_blocker": "OS vendor pin"
      },
      {
        "name": "express",
        "current_version": "4.17.1",
        "vulnerable_range": "< 4.18.2",
        "deployment": "npm dependency",
        "can_upgrade_immediately": true
      }
    ],
    "environment": "production",
    "change_freeze": false
  }
}
```

Including `can_upgrade_immediately` and blockers allows Cybercentry to recommend workarounds or compensating controls when a direct patch is not feasible.

Reference: [NIST NVD CPE Dictionary](https://nvd.nist.gov/products/cpe)
