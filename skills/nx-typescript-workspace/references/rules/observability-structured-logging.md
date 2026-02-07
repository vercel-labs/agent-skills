---
title: Logging Must Be Structured JSON
impact: MEDIUM
impactDescription: enables machine parsing, filtering, and alerting
tags: observability, logging, json, structured
---

## Logging Must Be Structured JSON

**Impact: MEDIUM (enables machine parsing, filtering, and alerting)**

All logging MUST be structured (JSON format). Unstructured string logs are
impossible to parse, filter, or alert on at scale. **Pino** is the standard
logger in this workspace. Include contextual fields with every log entry.

**Incorrect (unstructured string logging):**

```typescript
// ❌ String concatenation — not parseable
console.log('Processing event ' + eventId + ' for env ' + envId);

// ❌ Template literal — still a flat string
console.log(`Error: ${error.message} at ${new Date().toISOString()}`);

// ❌ console.error with stack trace dump
console.error('Failed to process:', error);
```

These produce flat strings that can't be queried in log aggregation tools
(Cloud Logging, Datadog, etc.).

**Correct (structured JSON logging):**

```typescript
import { logger } from '@turbi/shared-observability';

// ✅ Structured with contextual fields
logger.info({ eventId, environmentId }, 'Processing event');

// ✅ Error with structured context
logger.error(
  { err: error, eventId, operation: 'ingestEvent' },
  'Failed to process event'
);

// ✅ Request-scoped logger with correlation ID
const reqLogger = logger.child({ requestId, traceId });
reqLogger.info({ path: req.path, method: req.method }, 'Request received');
```

**Output format:**

```json
{
  "level": "info",
  "time": "2026-01-15T10:30:00.000Z",
  "msg": "Processing event",
  "eventId": "evt-123",
  "environmentId": "env-456",
  "traceId": "abc-def-ghi"
}
```

Reference: [Pino — Node.js Logger](https://getpino.io/)
