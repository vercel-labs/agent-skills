---
title: Inputs Must Be Validated at Boundaries (Zod)
impact: MEDIUM
impactDescription: prevents invalid data from entering the domain
tags: boundaries, validation, zod, input
---

## Inputs Must Be Validated at Boundaries (Zod)

**Impact: MEDIUM (prevents invalid data from entering the domain)**

Inputs from external systems (HTTP requests, queue messages, file uploads) MUST
be validated at the boundary using schema validation (Zod or similar). Never
trust external input — validate and parse before passing to domain logic.

**Incorrect (trusting raw input):**

```typescript
// apps/guard-api/src/routes/events.ts
// ❌ Directly using request body without validation
router.put('/events/:id', async (req, res) => {
  const event = req.body; // Could be anything!
  const result = await ingestEvent(event, deps);
  res.json(result);
});
```

If `req.body` contains unexpected fields, missing required fields, or wrong
types, the domain layer will receive garbage data. Errors may surface deep in
business logic rather than at the boundary.

**Correct (Zod validation at boundary):**

```typescript
import { z } from 'zod';

// Define schema at the boundary
const EventInputSchema = z.object({
  environmentId: z.string().uuid(),
  eventId: z.string().uuid(),
  payload: z.record(z.unknown()),
  timestamp: z.string().datetime(),
});

type EventInput = z.infer<typeof EventInputSchema>;

// Validate in route handler
router.put('/events/:id', async (req, res) => {
  const parsed = EventInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  // ✅ parsed.data is fully typed and validated
  const result = await ingestEvent(parsed.data, deps);
  res.status(201).json(result);
});
```

**Rules:**
- Validate at the boundary (route handlers, queue consumers, API gateways)
- Use `safeParse` for graceful error handling (not `parse` which throws)
- Return structured validation errors with field-level detail
- Domain functions receive already-validated, typed data

Reference: [Zod Documentation](https://zod.dev/)
