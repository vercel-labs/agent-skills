---
title: Set Vitest Root to Workspace Root
impact: HIGH
impactDescription: prevents module resolution failures in npm workspaces
tags: testing, vitest, configuration, workspaces
---

## Set Vitest Root to Workspace Root

**Impact: HIGH (prevents module resolution failures in npm workspaces)**

In npm workspaces, `node_modules` lives at the workspace root, not inside each
package. If Vitest's `root` defaults to the package directory, module resolution
breaks in surprising ways — tests may show `(0)` tests or fail with
`Cannot read properties of undefined`.

Always set `root` to the workspace root and scope `test.include` to the project.

**Incorrect (root defaults to package dir):**

```typescript
// libs/guard/ingestion/domain/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ❌ root defaults to this file's directory
  test: {
    include: ['src/**/*.spec.ts'],  // resolves relative to package dir
  },
});
```

**Correct (workspace-root-based config, depth=4 lib):**

```typescript
// libs/guard/ingestion/domain/vitest.config.ts
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../../../..');

export default defineConfig({
  root: workspaceRoot,  // ✅ workspace root
  test: {
    include: [
      'libs/guard/ingestion/domain/src/**/*.spec.ts',
      'libs/guard/ingestion/domain/src/**/*.test.ts',
    ],
    environment: 'node',
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage/libs/guard/ingestion/domain',
    },
  },
});
```

**Correct (depth=2 app):**

```typescript
// apps/guard-api/vitest.config.ts
const workspaceRoot = path.resolve(__dirname, '../..');

export default defineConfig({
  root: workspaceRoot,
  test: {
    include: [
      'apps/guard-api/src/**/*.spec.ts',
      'apps/guard-api/src/**/*.test.ts',
    ],
  },
});
```

The `..` count matches the project's depth from the workspace root.

Reference: [Vitest Configuration](https://vitest.dev/config/)
