---
title: Never Use Root-Level TS Path Aliases for Workspace Libs
impact: HIGH
impactDescription: prevents TS/runtime resolution mismatch
tags: linking, paths, tsconfig, anti-pattern
---

## Never Use Root-Level TS Path Aliases for Workspace Libs

**Impact: HIGH (prevents TS/runtime resolution mismatch)**

Do not use `paths` in `tsconfig.base.json` to map workspace package names. This
creates a mismatch: TypeScript resolves via `paths` but Node.js resolves via
`node_modules` and `exports`. Instead, rely on npm workspaces + `@nx/source`
custom condition.

**Incorrect (paths aliases for workspace libs):**

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "paths": {
      "@turbi/guard-ingestion-domain": ["libs/guard/ingestion/domain/src/index.ts"],
      "@turbi/guard-ingestion-data": ["libs/guard/ingestion/data/src/index.ts"],
      "@turbi/*": ["libs/*/src"]
    }
  }
}
```

TypeScript is happy, but Node.js at runtime doesn't know about `paths`. You'd
need a runtime transformer (like `tsconfig-paths`) which adds complexity and
fragility.

**Correct (npm workspaces + @nx/source):**

```json
// tsconfig.base.json — NO paths for workspace libs
{
  "compilerOptions": {
    "customConditions": ["@nx/source"]
  }
}
```

```json
// libs/guard/ingestion/domain/package.json
{
  "exports": {
    ".": {
      "@nx/source": "./src/index.ts",
      "import": "./dist/src/index.js"
    }
  }
}
```

This works because:
1. npm workspaces creates a symlink `node_modules/@turbi/domain` → `libs/.../domain`
2. `@nx/source` condition resolves to `./src/index.ts` during dev/test
3. At production runtime, `import` condition resolves to `./dist/src/index.js`

Both TypeScript and Node.js use the same resolution mechanism.

Reference: [Nx — Testing Without Building Dependencies](https://nx.dev/docs/technologies/test-tools/vitest/guides/testing-without-building-dependencies)
