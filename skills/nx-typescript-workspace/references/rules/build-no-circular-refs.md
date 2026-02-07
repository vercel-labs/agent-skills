---
title: No Circular TypeScript Project References
impact: HIGH
impactDescription: prevents infinite compilation loops
tags: build, tsconfig, circular-dependencies, project-references
---

## No Circular TypeScript Project References

**Impact: HIGH (prevents infinite compilation loops)**

TypeScript project references do not allow circular dependencies. If Project A
references Project B, then Project B MUST NOT reference Project A (directly or
transitively). The `tsc -b` build will fail with a circular reference error.

**Incorrect (circular references):**

```
libs/guard/ingestion/domain/tsconfig.lib.json
  → references libs/guard/ingestion/data/tsconfig.lib.json

libs/guard/ingestion/data/tsconfig.lib.json
  → references libs/guard/ingestion/domain/tsconfig.lib.json   ❌ circular!
```

```json
// libs/guard/ingestion/domain/tsconfig.lib.json
{
  "references": [
    { "path": "../data/tsconfig.lib.json" }  // ❌ domain → data
  ]
}

// libs/guard/ingestion/data/tsconfig.lib.json
{
  "references": [
    { "path": "../domain/tsconfig.lib.json" }  // ❌ data → domain (circular!)
  ]
}
```

**Correct (unidirectional references):**

```
libs/guard/ingestion/data/tsconfig.lib.json
  → references libs/guard/ingestion/domain/tsconfig.lib.json   ✅ one-way
```

```json
// libs/guard/ingestion/domain/tsconfig.lib.json
{
  "references": []  // ✅ domain has no project references (it's the leaf)
}

// libs/guard/ingestion/data/tsconfig.lib.json
{
  "references": [
    { "path": "../domain/tsconfig.lib.json" }  // ✅ data → domain only
  ]
}
```

If two packages need to share code, extract the shared code into a third package
(e.g., `libs/shared/types`) that both can reference.

Reference: [TypeScript — Project References](https://www.typescriptlang.org/docs/handbook/project-references.html#overall-structure)
