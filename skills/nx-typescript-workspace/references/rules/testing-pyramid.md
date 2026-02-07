---
title: Testing Pyramid — Unit, Integration, E2E
impact: HIGH
impactDescription: ensures appropriate test coverage at each layer
tags: testing, pyramid, unit, integration, e2e
---

## Testing Pyramid — Unit, Integration, E2E

**Impact: HIGH (ensures appropriate test coverage at each layer)**

Follow the testing pyramid with three layers. Unit tests form the base (fast,
many), integration tests in the middle (real infrastructure, fewer), and E2E
tests at the top (critical flows only).

| Layer | Location | Runner | Coverage |
|-------|----------|--------|----------|
| Unit | Colocated `*.test.ts` next to source | `nx test <project>` | Pure logic, use cases, entities |
| Integration | `test/integration/*.integration.test.ts` | `nx run <project>:test-integration` | Controller → usecase → real DB (Testcontainers) |
| E2E | Separate project or `test/e2e/` | Dedicated target | Critical user flows only |

**Incorrect (only E2E tests):**

```
apps/guard-api/
├── src/
│   ├── main.ts
│   └── routes/events.ts
└── test/
    └── e2e/
        └── events.e2e.test.ts    ← ❌ Only E2E, no unit or integration
```

**Correct (testing pyramid):**

```
libs/guard/ingestion/domain/
├── src/
│   ├── event-ingestion.usecase.ts
│   └── event-ingestion.usecase.test.ts    ← ✅ Unit test (colocated)

libs/guard/ingestion/data/
├── src/
│   ├── raw-events.repository.ts
│   └── raw-events.repository.test.ts      ← ✅ Unit test (colocated)

apps/guard-api/
├── test/
│   └── integration/
│       ├── vitest.config.ts               ← ✅ Separate config
│       └── event-ingestion.controller.integration.test.ts  ← ✅ Integration
```

**Integration test target in project.json:**

```json
{
  "test-integration": {
    "executor": "@nx/vitest:test",
    "outputs": ["{workspaceRoot}/coverage/apps/guard-api-integration"],
    "options": {
      "configFile": "apps/guard-api/test/integration/vitest.config.ts",
      "reportsDirectory": "coverage/apps/guard-api-integration",
      "passWithNoTests": false
    }
  }
}
```

Vitest is the standard runner. No Jest for Nx projects.

Reference: [Martin Fowler — Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
