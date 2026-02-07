---
title: All Code MUST Live Under apps/, libs/, or tools/
impact: CRITICAL
impactDescription: prevents orphaned projects and broken Nx graph
tags: architecture, monorepo, nx, project-structure
---

## All Code MUST Live Under apps/, libs/, or tools/

**Impact: CRITICAL (prevents orphaned projects and broken Nx graph)**

The Nx project graph is the canonical map of the system. All code must live as
TypeScript projects under `apps/`, `libs/`, or `tools/`. New `package.json` or
`project.json` files outside these directories require an RFC.

| Directory | Role | Tag | Example |
|-----------|------|-----|---------|
| `apps/` | Thin deployable shells (composition roots) | `type:api` | `apps/guard-api` |
| `libs/` | Business logic, data access, shared utilities | `type:domain`, `type:data`, `type:util` | `libs/guard/ingestion/domain` |
| `tools/` | Dev-time tooling only (CLIs, generators) | `type:tool` | `tools/gcp-dev` |

**Incorrect (package.json in arbitrary location):**

```
project-root/
├── scripts/
│   └── package.json    ← NOT under apps/, libs/, or tools/
├── helpers/
│   └── package.json    ← NOT under apps/, libs/, or tools/
└── apps/
    └── guard-api/
```

**Correct (all projects under standard directories):**

```
project-root/
├── apps/
│   └── guard-api/          ← type:api
├── libs/
│   ├── guard/ingestion/
│   │   ├── domain/         ← type:domain
│   │   └── data/           ← type:data
│   └── shared/
│       └── observability/  ← type:util
└── tools/
    └── pg-external/        ← type:tool
```

Tools are for **dev-time only**: `type:tool` projects (CLIs, build helpers, code
generators) live in `tools/`. Tools MAY depend on `libs/` but `apps/` and
`libs/` MUST NOT depend on `type:tool` projects.

Reference: [Nx Project Graph](https://nx.dev/concepts/mental-model#the-project-graph)
