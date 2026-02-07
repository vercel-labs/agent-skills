---
title: Errors Must Use Stable Codes and Standard Structures
impact: MEDIUM
impactDescription: enables programmatic error handling and debugging
tags: boundaries, errors, structured, domain
---

## Errors Must Use Stable Codes and Standard Structures

**Impact: MEDIUM (enables programmatic error handling and debugging)**

Errors MUST be structured with stable `code` fields. Domain errors use
machine-readable codes, HTTP failures use standard error response structures.
Never throw generic `Error` with just a message string — consumers need stable
codes to handle errors programmatically.

**Incorrect (unstructured errors):**

```typescript
// ❌ Generic error with message only
throw new Error('Event validation failed');

// ❌ HTTP response with string message only
res.status(400).json({ error: 'Something went wrong' });

// ❌ Inconsistent error shapes
throw new Error('DUPLICATE_EVENT'); // code in message
res.status(409).json({ message: 'duplicate', reason: 'hash_match' }); // different shape
```

Consumers can't programmatically distinguish error types or handle them
appropriately.

**Correct (structured domain errors):**

```typescript
// libs/guard/ingestion/domain/src/errors.ts
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

// Usage in domain
throw new DomainError(
  'EVENT_VALIDATION_FAILED',
  'Event payload missing required fields',
  { missingFields: ['environmentId', 'timestamp'] }
);

throw new DomainError(
  'DUPLICATE_EVENT',
  'Event with identical hash already exists',
  { hash: existingHash }
);
```

**Correct (standard HTTP error responses):**

```typescript
// apps/guard-api/src/middleware/error-handler.ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof DomainError) {
    const statusMap: Record<string, number> = {
      'EVENT_VALIDATION_FAILED': 400,
      'DUPLICATE_EVENT': 409,
      'EVENT_NOT_FOUND': 404,
    };

    return res.status(statusMap[err.code] ?? 500).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  // Unknown errors — don't leak internals
  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
});
```

**Rules:**
- Domain errors always have a stable `code` field
- HTTP responses use consistent `{ code, message, details? }` shape
- Never expose internal error details (stack traces, SQL) to clients
- Map domain error codes to HTTP status codes at the app layer

Reference: [RFC 7807 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc7807)
