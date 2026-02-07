---
title: Product Features MUST Begin as Standalone Libraries
impact: CRITICAL
impactDescription: ensures modularity and testability
tags: architecture, library-first, modularity
---

## Product Features MUST Begin as Standalone Libraries

**Impact: CRITICAL (ensures modularity and testability)**

Every product feature (domain rules, use cases, API behavior beyond wiring, data
modeling) MUST begin its existence as a standalone library in `libs/`. No product
feature shall be implemented directly within application code without first being
abstracted into a reusable library component.

Apps wire domain + data + shared libs — they do NOT contain business logic.

**Incorrect (business logic in app code):**

```typescript
// apps/guard-api/src/routes/events.ts
// ❌ Business logic implemented directly in the route handler
import { Router } from 'express';
import { db } from '../db.js';

const router = Router();
router.put('/events/:id', async (req, res) => {
  // Validation, hashing, dedup logic all inline
  const hash = computeHash(req.body);
  const exists = await db.query('SELECT 1 FROM events WHERE hash = $1', [hash]);
  if (exists.rows.length) return res.status(409).json({ error: 'duplicate' });
  await db.query('INSERT INTO events ...', [req.body]);
  res.status(201).json({ ok: true });
});
```

**Correct (feature in lib, app is thin shell):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
// ✅ Business logic in a domain library
export function ingestEvent(input: EventInput, deps: IngestDeps): IngestResult {
  const hash = computeEventHash(input);
  return { ...input, hash, bufferedAt: deps.clock.now() };
}
```

For how the consuming app should wire this, see
[arch-apps-thin-shell](arch-apps-thin-shell.md).

**Exception:** CI/CD and build/release plumbing is exempt, but reusable logic
within it MUST live in `tools/` or `libs/` and be tested.

Reference: [Nx Library-First Approach](https://nx.dev/concepts/more-concepts/library-types)
