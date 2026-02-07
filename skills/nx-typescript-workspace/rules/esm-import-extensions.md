---
title: Must Include .js Extensions in ESM Imports
impact: CRITICAL
impactDescription: prevents ERR_MODULE_NOT_FOUND at runtime
tags: esm, imports, module-resolution, nodenext
---

## Must Include .js Extensions in ESM Imports

**Impact: CRITICAL (prevents ERR_MODULE_NOT_FOUND at runtime)**

In native ESM with `moduleResolution: "nodenext"`, Node.js requires explicit
file extensions in import specifiers. Directory imports are also not supported —
you must specify `index.js` explicitly.

Even though source files are `.ts`, TypeScript requires you to write `.js`
extensions (it resolves them to the corresponding `.ts` files during
compilation).

**Incorrect (missing extensions):**

```typescript
// ❌ Directory import — fails at runtime
import { foo } from './utils';

// ❌ Missing .js extension — fails at runtime
import { bar } from './helpers/validate';

// ❌ Relative import without extension
import { createRouter } from '../routes/events';
```

Runtime error: `ERR_MODULE_NOT_FOUND` or `Directory import is not supported`.

**Correct (explicit .js extensions):**

```typescript
// ✅ Explicit index.js for directory
import { foo } from './utils/index.js';

// ✅ Explicit .js extension
import { bar } from './helpers/validate.js';

// ✅ All relative imports have .js
import { createRouter } from '../routes/events.js';
```

**Note:** This only applies to relative imports. Package imports (e.g.,
`import { Router } from 'express'`) are resolved via `exports` in the
package's `package.json` and do not need extensions.

Reference: [TypeScript — ECMAScript Modules in Node.js](https://www.typescriptlang.org/docs/handbook/modules/reference.html#node16-nodenext)
