---
title: package.json Must Have "type" — "module"
impact: CRITICAL
impactDescription: prevents ESM/CJS conflicts and runtime crashes
tags: esm, module-system, package-json, configuration
---

## package.json Must Have "type": "module"

**Impact: CRITICAL (prevents ESM/CJS conflicts and runtime crashes)**

Every `package.json` in the workspace (root and per-project) MUST declare
`"type": "module"`. This ensures Node.js treats `.js` files as ESM by default,
matching the TypeScript `module: "nodenext"` setting.

**Incorrect (missing type field):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/src/index.js"
}
```

Node.js defaults to CJS when `"type"` is missing, causing `ERR_REQUIRE_ESM` at
runtime when importing ESM dependencies.

**Correct (explicit ESM):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts"
}
```

**Also incorrect (explicitly CJS):**

```json
{
  "type": "commonjs"
}
```

This workspace is ESM-only. All projects must use `"type": "module"`.

Reference: [Node.js ESM docs — type field](https://nodejs.org/api/packages.html#type)
