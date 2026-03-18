---
title: Remove Internal URLs, IPs, and Production Endpoints
impact: CRITICAL
impactDescription: Prevents infrastructure topology disclosure
tags: sanitise, endpoints, urls, ip-addresses, infrastructure
---

## Remove Internal URLs, IPs, and Production Endpoints

**Impact: CRITICAL (prevents infrastructure topology disclosure)**

Internal hostnames, IP addresses, and production endpoint URLs reveal your network topology. This information is valuable to attackers and should never leave your environment.

**Incorrect (exposes real infrastructure):**

```json
{
  "question": "Is my API gateway configuration secure?",
  "context": {
    "gateway_url": "https://api-internal.acme-corp.com:8443",
    "upstream": "http://10.0.4.22:3000/v2/users",
    "admin_panel": "http://192.168.1.1/admin"
  }
}
```

**Correct (generic placeholders, structure preserved):**

```json
{
  "question": "Is my API gateway configuration secure?",
  "context": {
    "gateway_url": "https://[INTERNAL-GATEWAY]/",
    "upstream": "http://[INTERNAL-SERVICE]/v2/users",
    "admin_panel": "http://[ADMIN-HOST]/admin",
    "stack": "Kong Gateway 3.4, Node.js upstream, private VPC"
  }
}
```

Use bracketed placeholders like `[INTERNAL-GATEWAY]` to preserve structural context without disclosing real addresses. Describing the technology stack (e.g., "Kong Gateway", "private VPC") is sufficient for Cybercentry to provide accurate guidance.
