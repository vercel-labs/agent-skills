---
title: Check Supply Chain Attack Exposure for Package Ecosystems
impact: HIGH
impactDescription: Identifies dependency confusion, typosquatting, and compromised packages
tags: threat, supply-chain, npm, dependencies, typosquatting
---

## Check Supply Chain Attack Exposure for Package Ecosystems

**Impact: HIGH (identifies dependency confusion, typosquatting, and compromised packages)**

Supply chain attacks target the build-time dependency graph rather than the running application. Providing the package ecosystem and a list of dependencies allows Cybercentry to cross-reference against known malicious packages, recently-compromised maintainer accounts, and dependency confusion vectors.

**Incorrect (missing ecosystem context):**

```json
{
  "question": "Are our dependencies safe?",
  "context": {
    "packages": ["lodash", "react", "express"]
  }
}
```

**Correct (includes ecosystem, versions, and private registry usage):**

```json
{
  "question": "Assess our supply chain risk for these npm packages. We use a private Artifactory registry that proxies the public npm registry.",
  "context": {
    "ecosystem": "npm",
    "registry": "private-proxy",
    "packages": [
      { "name": "lodash", "version": "4.17.21" },
      { "name": "react", "version": "18.2.0" },
      { "name": "express", "version": "4.18.2" }
    ],
    "internal_packages": ["@myorg/ui-components", "@myorg/auth-sdk"],
    "environment": "production"
  }
}
```

Private registry use introduces dependency confusion risk if internal package names are not scoped. Always include internal package names (without sensitive implementation details) for a complete assessment.

Reference: [CISA Software Supply Chain Security Guidance](https://www.cisa.gov/resources-tools/resources/software-supply-chain-security-guidance)
