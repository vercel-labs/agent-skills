---
title: Every Project MUST Have scope + type Tags
impact: MEDIUM
impactDescription: enables module boundary enforcement
tags: tags, nx, module-boundaries, configuration
---

## Every Project MUST Have scope + type Tags

**Impact: MEDIUM (enables module boundary enforcement)**

Every Nx project MUST be tagged with at least `scope:*` and `type:*` dimensions
in its `project.json`. These tags drive the `@nx/enforce-module-boundaries` lint
rule, which prevents illegal cross-layer dependencies.

| Dimension | Examples | Purpose |
|-----------|----------|---------|
| `scope:<x>` | `scope:guard`, `scope:shared`, `scope:testkit` | Product/domain boundary |
| `type:<x>` | `type:domain`, `type:data`, `type:api`, `type:util`, `type:tool` | Architectural layer |
| `bc:<x>` | `bc:ingestion`, `bc:risk` | Bounded context (for scoped libs) |
| `release:<x>` | `release:app`, `release:package` | Release grouping |

**Incorrect (missing tags):**

```json
// project.json
{
  "name": "guard-ingestion-domain",
  "tags": []  // ❌ no tags — module boundaries not enforced
}
```

**Incorrect (incomplete tags):**

```json
{
  "name": "guard-ingestion-domain",
  "tags": ["type:domain"]  // ❌ missing scope
}
```

**Correct (full tags):**

```json
// Domain lib
{ "tags": ["npm:private", "scope:guard", "bc:ingestion", "type:domain"] }

// Data lib
{ "tags": ["npm:private", "scope:guard", "bc:ingestion", "type:data"] }

// App
{ "tags": ["scope:guard", "type:api", "release:app"] }

// Shared utility
{ "tags": ["npm:private", "scope:shared", "type:util"] }

// Dev-time tooling
{ "tags": ["scope:shared", "type:tool"] }
```

Reference: [Nx — Enforce Module Boundaries](https://nx.dev/features/enforce-module-boundaries)
