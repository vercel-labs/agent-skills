---
title: Domain Libs Are Pure — No I/O, No Framework Deps
impact: CRITICAL
impactDescription: ensures testability and portability of business logic
tags: architecture, domain, purity, hexagonal
---

## Domain Libs Are Pure — No I/O, No Framework Deps

**Impact: CRITICAL (ensures testability and portability of business logic)**

Domain libraries (`type:domain`) contain pure business logic only. They MUST NOT
have I/O operations (database, HTTP, file system) or framework dependencies
(Express, Kysely, pg). Only `tslib` and pure utility libraries are allowed.

For the full dependency matrix (which layers may depend on which), see
[arch-hexagonal-deps](arch-hexagonal-deps.md).

This ensures domain logic is:
- Testable with simple unit tests (no mocks for infrastructure)
- Portable across different infrastructure implementations
- Free of side effects and external coupling

**Incorrect (domain lib with infrastructure dependencies):**

```json
// libs/guard/ingestion/domain/package.json
{
  "name": "@turbi/guard-ingestion-domain",
  "dependencies": {
    "kysely": "^0.27.0",     // ❌ database framework in domain
    "express": "^4.18.0",    // ❌ web framework in domain
    "pg": "^8.12.0"          // ❌ database driver in domain
  }
}
```

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
import { Kysely } from 'kysely';  // ❌ infra import in domain
import { Pool } from 'pg';         // ❌ infra import in domain

export function ingestEvent(db: Kysely<any>, input: EventInput) {
  return db.insertInto('events').values(input).execute();
}
```

**Correct (pure domain with injected dependencies):**

```json
// libs/guard/ingestion/domain/package.json
{
  "name": "@turbi/guard-ingestion-domain",
  "dependencies": {
    "tslib": "^2.6.0"  // ✅ only pure utilities allowed
  }
}
```

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
// ✅ No infrastructure imports — only domain types and pure logic
import type { EventRepository } from './ports/event-repository.port.js';

export function ingestEvent(
  input: EventInput,
  deps: { repo: EventRepository; clock: Clock }
): IngestResult {
  const hash = computeEventHash(input);
  return { ...input, hash, bufferedAt: deps.clock.now() };
}
```

Reference: [Clean Architecture — Domain Layer](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
