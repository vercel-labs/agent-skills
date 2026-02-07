---
title: Apps Are Thin Composition Roots — No Business Logic
impact: CRITICAL
impactDescription: prevents monolithic apps and ensures reusability
tags: architecture, composition-root, apps, hexagonal
---

## Apps Are Thin Composition Roots — No Business Logic

**Impact: CRITICAL (prevents monolithic apps and ensures reusability)**

Apps (`type:api`) are thin deployable shells that compose domain and data libs.
They wire dependencies together, configure middleware, and define routes — but
they MUST NOT contain business logic, domain rules, or data access code.

**Incorrect (business logic in app):**

```typescript
// apps/guard-api/src/routes/events.ts
// ❌ Validation, domain logic, and DB access all in the route handler
router.put('/events/:id', async (req, res) => {
  // Domain validation — should be in domain lib
  if (!req.body.environmentId) {
    return res.status(400).json({ code: 'MISSING_ENV_ID' });
  }
  // Business rule — should be in domain lib
  const hash = crypto.createHash('sha256')
    .update(JSON.stringify(req.body))
    .digest('hex');
  // DB access — should be in data lib
  const result = await pool.query(
    'INSERT INTO events (id, hash, payload) VALUES ($1, $2, $3)',
    [req.params.id, hash, req.body]
  );
  res.status(201).json({ id: req.params.id });
});
```

**Correct (app wires libs together):**

```typescript
// apps/guard-api/src/ingestion/event-ingestion.routes.ts
// ✅ App only wires dependencies and handles HTTP concerns
import { ingestEvent } from '@turbi/guard-ingestion-domain';
import { KyselyRawEventsRepo } from '@turbi/guard-ingestion-data';

export function createEventRoutes(deps: { repo: KyselyRawEventsRepo }) {
  const router = Router();

  router.put('/events/:id', async (req, res) => {
    const validated = validateRequest(req); // HTTP-layer concern only
    const result = await ingestEvent(validated, {
      repo: deps.repo,
      clock: systemClock,
    });
    res.status(201).json(result);
  });

  return router;
}
```

The app's `main.ts` constructs concrete implementations and passes them to route
factories. This is the only place where concrete classes are instantiated.

Reference: [Composition Root pattern](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
