---
title: Use import.meta.url — Never Bare __dirname
impact: CRITICAL
impactDescription: prevents ReferenceError in ESM modules
tags: esm, import-meta, dirname, configuration
---

## Use import.meta.url — Never Bare __dirname

**Impact: CRITICAL (prevents ReferenceError in ESM modules)**

ESM modules do not have `__dirname` or `__filename` globals. These are CJS-only.
Use `import.meta.url` with `fileURLToPath` to derive directory and file paths.

This is particularly critical in `vitest.config.ts` where you need to compute
the workspace root path.

**Incorrect (CJS globals in ESM):**

```typescript
// vitest.config.ts
// ❌ __dirname is not defined in ESM
const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  root: workspaceRoot,
  // ...
});
```

Runtime error: `ReferenceError: __dirname is not defined in ES module scope`.

**Correct (import.meta.url pattern):**

```typescript
// vitest.config.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// ✅ Derive __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  root: workspaceRoot,
  // ...
});
```

**Critical:** `vitest.config.ts` MUST be included in `tsconfig.spec.json`'s
`include` array for TypeScript to recognize `import.meta.url`:

```json
{
  "include": [
    "vitest.config.ts",
    "src/**/*.test.ts",
    "src/**/*.spec.ts"
  ]
}
```

Reference: [Node.js — import.meta.url](https://nodejs.org/api/esm.html#importmetaurl)
