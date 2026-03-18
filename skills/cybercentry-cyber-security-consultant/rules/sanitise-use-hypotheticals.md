---
title: Replace Real System Details with Generic Equivalents
impact: CRITICAL
impactDescription: Preserves analytical value while eliminating reconnaissance risk
tags: sanitise, hypotheticals, anonymisation, opsec
---

## Replace Real System Details with Generic Equivalents

**Impact: CRITICAL (preserves analytical value while eliminating reconnaissance risk)**

Security questions rarely require real system names, real company names, or real infrastructure identifiers. Replace specifics with generic equivalents before submission — the quality of the consultation is unaffected.

**Incorrect (names real internal systems):**

```json
{
  "question": "Is our microservice architecture secure?",
  "context": {
    "services": ["acme-auth-service", "acme-payments-v2", "acme-user-profile"],
    "company": "Acme Corp",
    "data_store": "acme-prod-postgres-us-east-1"
  }
}
```

**Correct (generic equivalents, structure preserved):**

```json
{
  "question": "Is our microservice architecture secure?",
  "context": {
    "services": ["auth-service", "payments-service", "profile-service"],
    "industry": "fintech",
    "data_store": "PostgreSQL on managed cloud (AWS RDS equivalent)",
    "service_count": 3,
    "inter_service_auth": "mTLS"
  }
}
```

Generic names like `auth-service`, industry labels, and technology descriptions give Cybercentry everything needed for an accurate assessment. Real names provide no analytical value and only increase exposure.
