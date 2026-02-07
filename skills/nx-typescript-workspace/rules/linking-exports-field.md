---
title: Lib package.json Must Have exports with @nx/source
impact: HIGH
impactDescription: enables source-level resolution during dev/test
tags: linking, exports, package-json, nx-source
---

## Lib package.json Must Have exports with @nx/source

**Impact: HIGH (enables source-level resolution during dev/test)**

Every library's `package.json` MUST have an `exports` field with the
`@nx/source` condition. This enables TypeScript to resolve imports directly to
source files during development and testing, bypassing the need to build `dist/`
first.

**Incorrect (missing exports field):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/src/index.js"
}
```

Without `exports`, Node.js ESM resolution may fail, and `@nx/source` dev
resolution won't work.

**Incorrect (missing @nx/source condition):**

```json
{
  "exports": {
    ".": {
      "import": "./dist/src/index.js",
      "default": "./dist/src/index.js"
    }
  }
}
```

Development/test will require building every dependency first.

**Correct (full exports map):**

```json
{
  "name": "@turbi/guard-ingestion-domain",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/src/index.js",
  "types": "./dist/src/index.d.ts",
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "@nx/source": "./src/index.ts",
      "types": "./dist/src/index.d.ts",
      "import": "./dist/src/index.js",
      "default": "./dist/src/index.js"
    }
  }
}
```

**Key rules:**

- `"@nx/source": "./src/index.ts"` — enables source-level resolution
- `"./package.json": "./package.json"` — allows package.json self-reference
- Subpath exports MUST match what consumers actually import
- Condition order matters: `@nx/source` before `types` before `import`

Reference: [Nx — TypeScript Project Linking](https://nx.dev/docs/concepts/typescript-project-linking)
