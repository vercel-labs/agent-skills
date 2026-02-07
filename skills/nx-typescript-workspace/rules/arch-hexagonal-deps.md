---
title: Domain Libs Must Not Depend on Data/API/Infra/Tool
impact: CRITICAL
impactDescription: prevents circular dependencies and maintains clean architecture
tags: architecture, hexagonal, dependencies, module-boundaries
---

## Domain Libs Must Not Depend on Data/API/Infra/Tool

**Impact: CRITICAL (prevents circular dependencies and maintains clean architecture)**

Strict hexagonal/clean architecture: domain libs define interfaces (ports) and
contain pure business logic. Data libs implement those interfaces (adapters).
Apps compose everything together.

```
type:api (app)  →  type:domain (lib)  ←  type:data (lib)
                         ↑
                   type:util (shared)
```

| Layer | May depend on | MUST NOT depend on |
|-------|---------------|--------------------|
| `type:domain` | pure shared (`type:util`) only | data, api, infra, tool |
| `type:data` | domain, shared | apps, other bounded contexts |
| `type:api` (app) | domain, data, shared | — |
| `type:tool` | libs (any) | — (never depended upon by apps/libs) |
| `type:util` (shared) | nothing or other shared | domain-specific libs |

**Incorrect (domain imports from data layer):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
// ❌ Domain importing infrastructure
import { KyselyRawEventsRepo } from '@turbi/guard-ingestion-data';

export function ingestEvent(input: EventInput) {
  const repo = new KyselyRawEventsRepo(); // ❌ concrete infra in domain
  return repo.create(input);
}
```

**Correct (domain defines interface, data implements it):**

```typescript
// libs/guard/ingestion/domain/src/ports/event-repository.port.ts
// ✅ Domain defines the port (interface)
export interface EventRepository {
  create(event: BufferedEvent): Promise<void>;
}

// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
// ✅ Domain depends only on its own interface
export function ingestEvent(
  input: EventInput,
  deps: { repo: EventRepository; clock: Clock }
): Promise<void> {
  const buffered = bufferEvent(input, deps.clock.now());
  return deps.repo.create(buffered);
}

// libs/guard/ingestion/data/src/raw-events.repository.ts
// ✅ Data layer implements the domain port
import type { EventRepository } from '@turbi/guard-ingestion-domain';

export class KyselyRawEventsRepo implements EventRepository {
  async create(event: BufferedEvent): Promise<void> { /* Kysely insert */ }
}
```

Reference: [Nx Module Boundary Rules](https://nx.dev/features/enforce-module-boundaries)
