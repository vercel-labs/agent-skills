---
title: Describe the Current Architecture Pattern Generically
impact: MEDIUM
impactDescription: Enables relevant security recommendations without exposing proprietary design
tags: arch, architecture, pattern, generic, zero-trust
---

## Describe the Current Architecture Pattern Generically

**Impact: MEDIUM (enables relevant security recommendations without exposing proprietary design)**

Security architecture reviews require understanding the structural pattern of a system — not its internal component names, IP addresses, or vendor-specific configurations. Describing your architecture using standard patterns (monolith, microservices, event-driven, multi-tier) and interaction models provides sufficient context for actionable guidance.

**Incorrect (exposes internal architecture details):**

```json
{
  "question": "Review our architecture security",
  "context": {
    "components": [
      "nginx-prod-01 → auth-service-k8s → postgres-rds-primary",
      "Internal CIDR: 10.0.0.0/16"
    ]
  }
}
```

**Correct (generic pattern description):**

```json
{
  "question": "Review the security of our multi-agent system architecture",
  "context": {
    "architecture_pattern": "microservices",
    "components": [
      { "role": "API gateway", "public_facing": true, "handles": "authentication, rate limiting" },
      { "role": "orchestrator agent", "public_facing": false, "handles": "workflow coordination" },
      { "role": "worker agents (4)", "public_facing": false, "handles": "task execution, tool calls" },
      { "role": "relational database", "public_facing": false, "handles": "state persistence" }
    ],
    "inter_service_auth": "JWT bearer tokens",
    "deployment": "Kubernetes",
    "industry": "fintech",
    "compliance_requirements": ["SOC2", "PCI-DSS"]
  }
}
```

Reference: [NIST Zero Trust Architecture SP 800-207](https://csrc.nist.gov/publications/detail/sp/800-207/final)
