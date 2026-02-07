---
title: Use import.meta.url Pattern in vitest.config.ts
impact: HIGH
impactDescription: required for ESM path resolution in config files
tags: testing, vitest, esm, import-meta
---

## Use import.meta.url Pattern in vitest.config.ts

**Impact: HIGH (required for ESM path resolution in config files)**

Every `vitest.config.ts` must use the `import.meta.url` pattern to compute the
workspace root. This is the standard ESM way to derive directory paths and is
required because `__dirname` is not available in ESM modules.

**Incorrect (no workspace root computation):**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ❌ No root specified — defaults to config file directory
  test: {
    include: ['src/**/*.spec.ts'],
  },
});
```

**Incorrect (hardcoded path):**

```typescript
export default defineConfig({
  root: '/Users/dev/projects/turbi-guard',  // ❌ hardcoded absolute path
  test: { /* ... */ },
});
```

**Correct (import.meta.url pattern):**

```typescript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../..');

export default defineConfig({
  root: workspaceRoot,
  test: {
    include: ['libs/guard/ingestion/domain/src/**/*.spec.ts'],
    environment: 'node',
    reporters: ['default'],
  },
});
```

**Reminder:** `vitest.config.ts` MUST be in `tsconfig.spec.json`'s `include`
array — see [build-rootdir-separation](build-rootdir-separation.md) for the
full tsconfig pattern.

Reference: [Vitest Configuration](https://vitest.dev/config/)
