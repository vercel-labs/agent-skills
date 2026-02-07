---
title: Tags Must Obey Hexagonal Dependency Rules
impact: MEDIUM
impactDescription: prevents architectural erosion via lint enforcement
tags: tags, nx, hexagonal, module-boundaries
---

## Tags Must Obey Hexagonal Dependency Rules

**Impact: MEDIUM (prevents architectural erosion via lint enforcement)**

The `@nx/enforce-module-boundaries` lint rule uses tags to enforce hexagonal
architecture constraints at lint time. The dependency matrix must be configured
in `.eslintrc.json` (or `eslint.config.*`) at the workspace root.

**Dependency matrix:**

| Source tag | Can depend on | MUST NOT depend on |
|------------|---------------|--------------------|
| `type:domain` | `type:util` | `type:data`, `type:api`, `type:tool` |
| `type:data` | `type:domain`, `type:util` | `type:api`, `type:tool` |
| `type:api` | `type:domain`, `type:data`, `type:util` | `type:tool` |
| `type:tool` | `type:domain`, `type:data`, `type:util` | — |
| `type:util` | `type:util` | `type:domain`, `type:data`, `type:api` |

**Incorrect (domain depending on data — lint should catch):**

```typescript
// libs/guard/ingestion/domain/src/event-ingestion.usecase.ts
// ❌ Importing from data layer in domain — violates hexagonal rules
import { KyselyRawEventsRepo } from '@turbi/guard-ingestion-data';
```

```
nx lint guard-ingestion-domain
  ✖ A project tagged with "type:domain" can only depend on libs tagged with "type:util"
```

**Correct (eslint config enforcing boundaries):**

```json
{
  "@nx/enforce-module-boundaries": [
    "error",
    {
      "depConstraints": [
        {
          "sourceTag": "type:domain",
          "onlyDependOnLibsWithTags": ["type:util"]
        },
        {
          "sourceTag": "type:data",
          "onlyDependOnLibsWithTags": ["type:domain", "type:util"]
        },
        {
          "sourceTag": "type:api",
          "onlyDependOnLibsWithTags": ["type:domain", "type:data", "type:util"]
        }
      ]
    }
  ]
}
```

Run `nx lint <project>` to verify compliance. This is a CI quality gate.

Reference: [Nx — Enforce Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
