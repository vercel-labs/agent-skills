---
title: Never Use require/module.exports — Always ESM
impact: CRITICAL
impactDescription: prevents CJS/ESM mixing and ERR_REQUIRE_ESM
tags: esm, require, module-system, imports
---

## Never Use require/module.exports — Always ESM

**Impact: CRITICAL (prevents CJS/ESM mixing and ERR_REQUIRE_ESM)**

This workspace is ESM-only. All source files and config files must use ESM
syntax (`import`/`export`). Never use `require()` or `module.exports`.

**Incorrect (CJS syntax):**

```typescript
// ❌ CJS require
const express = require('express');
const { Router } = require('express');

// ❌ CJS exports
module.exports = { createApp };
module.exports.handler = handler;

// ❌ CJS in config files
// vitest.config.js
module.exports = defineConfig({ /* ... */ });
```

**Correct (ESM syntax):**

```typescript
// ✅ ESM imports
import express from 'express';
import { Router } from 'express';

// ✅ ESM exports
export { createApp };
export default handler;

// ✅ ESM in config files
// vitest.config.ts
export default defineConfig({ /* ... */ });
```

**For CJS-only dependencies** that don't support named ESM imports:

```typescript
// ❌ Named import from CJS-only package may fail
import { specificFunction } from 'cjs-only-lib';

// ✅ Default import + destructure
import pkg from 'cjs-only-lib';
const { specificFunction } = pkg;
```

Config files (`.ts` or `.mjs`) must also use ESM. Avoid `.js` config files if
there's any ambiguity, though `"type": "module"` in `package.json` handles it.

Reference: [Node.js — Differences between ES modules and CommonJS](https://nodejs.org/api/esm.html#differences-between-es-modules-and-commonjs)
