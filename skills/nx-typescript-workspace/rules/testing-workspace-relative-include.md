---
title: Use Workspace-Relative Include Paths
impact: HIGH
impactDescription: ensures correct test discovery when root is workspace root
tags: testing, vitest, include, configuration
---

## Use Workspace-Relative Include Paths

**Impact: HIGH (ensures correct test discovery when root is workspace root)**

Since `root` is set to the workspace root, the `include` patterns must be
workspace-relative paths (e.g., `libs/guard/ingestion/domain/src/**/*.spec.ts`),
not paths relative to the config file directory.

**Incorrect (relative to config dir):**

```typescript
// libs/guard/ingestion/domain/vitest.config.ts
export default defineConfig({
  root: workspaceRoot,
  test: {
    include: ['src/**/*.spec.ts'],  // ❌ resolves to <workspace>/src/**
  },
});
```

This looks for tests at `<workspace-root>/src/**/*.spec.ts` instead of
`<workspace-root>/libs/guard/ingestion/domain/src/**/*.spec.ts`.

**Incorrect (stepping out with ../):**

```typescript
export default defineConfig({
  root: workspaceRoot,
  test: {
    include: ['../../src/**/*.spec.ts'],  // ❌ confusing and fragile
  },
});
```

**Correct (workspace-relative paths):**

```typescript
// libs/guard/ingestion/domain/vitest.config.ts
export default defineConfig({
  root: workspaceRoot,
  test: {
    include: [
      'libs/guard/ingestion/domain/src/**/*.spec.ts',
      'libs/guard/ingestion/domain/src/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/libs/guard/ingestion/domain',
    },
  },
});
```

The `reportsDirectory` should also use the workspace-relative project path to
match what Nx expects for caching.

Reference: [Vitest — Configuring Vitest](https://vitest.dev/config/#include)
