---
title: Referenced tsconfigs Must Have composite — true
impact: HIGH
impactDescription: prevents TS project reference compilation failures
tags: build, tsconfig, composite, project-references
---

## Referenced tsconfigs Must Have composite: true

**Impact: HIGH (prevents TS project reference compilation failures)**

TypeScript project references require that any tsconfig referenced by another
MUST have `"composite": true`. This is "viral" — once one config uses it, all
referenced configs must too. In this workspace, `tsconfig.base.json` already
sets `composite: true`, so extending it inherits the setting.

**Incorrect (missing composite in referenced config):**

```json
// libs/guard/ingestion/domain/tsconfig.lib.json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "composite": false,  // ❌ or omitted — breaks references
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

```json
// tsconfig.spec.json references tsconfig.lib.json
{
  "references": [{ "path": "./tsconfig.lib.json" }]
}
// ❌ Error: Referenced project must have setting "composite": true
```

**Correct (composite inherited from base):**

```json
// libs/guard/ingestion/domain/tsconfig.lib.json
{
  "extends": "../../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
// ✅ composite: true is inherited from tsconfig.base.json
```

If you create a custom tsconfig that does NOT extend `tsconfig.base.json`, you
MUST explicitly set `"composite": true`.

Reference: [TypeScript — Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
