---
title: Secrets and Tokens Must Be Redacted from Logs
impact: MEDIUM
impactDescription: prevents credential leakage and compliance violations
tags: observability, security, pii, redaction
---

## Secrets and Tokens Must Be Redacted from Logs

**Impact: MEDIUM (prevents credential leakage and compliance violations)**

Secrets, tokens, passwords, API keys, and PII MUST be redacted from all logs
and telemetry. Logging raw request/response bodies that may contain credentials
is a security vulnerability and compliance risk.

**Incorrect (logging sensitive data):**

```typescript
// ❌ Logging raw request with auth headers
logger.info({ headers: req.headers }, 'Incoming request');
// Logs: { "headers": { "authorization": "Bearer eyJhbGci..." } }

// ❌ Logging full user object with PII
logger.info({ user }, 'User authenticated');
// Logs: { "user": { "email": "john@example.com", "ssn": "123-45-6789" } }

// ❌ Logging database connection string
logger.info({ connectionString: process.env.DATABASE_URL }, 'DB connected');
// Logs: { "connectionString": "postgres://user:password@host/db" }
```

**Correct (redacted logging):**

```typescript
// ✅ Log only safe fields from headers
logger.info(
  { contentType: req.headers['content-type'], method: req.method, path: req.path },
  'Incoming request'
);

// ✅ Log only non-PII user identifiers
logger.info({ userId: user.id, role: user.role }, 'User authenticated');

// ✅ Never log connection strings or secrets
logger.info({ database: 'guard-db', host: 'db.internal' }, 'DB connected');
```

**Use a redaction serializer:**

```typescript
import pino from 'pino';

const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'secret',
      'token',
      '*.password',
      '*.secret',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});
```

**Rules:**
- Never log `authorization`, `cookie`, or `set-cookie` headers
- Never log passwords, tokens, API keys, or connection strings
- Never log PII (email, SSN, phone) without explicit redaction
- Use logger redaction config to catch accidental leaks
- OTel span attributes must also be sanitized

Reference: [Pino — Redaction](https://getpino.io/#/docs/redaction)
