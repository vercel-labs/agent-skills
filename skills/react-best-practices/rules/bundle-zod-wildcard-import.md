---
title: Use Wildcard Imports for Zod
impact: MEDIUM
impactDescription: better tree-shaking with Webpack/Next.js
tags: bundle, tree-shaking, zod, imports, validation
---

## Use Wildcard Imports for Zod

Use wildcard imports (`import * as z from "zod"`) instead of named imports for better tree-shaking with Webpack (Next.js) and esbuild. Named imports prevent proper tree-shaking in these bundlers, causing unused Zod code to be included in your bundle.

**Incorrect (not tree-shakable by Webpack and esbuild):**

```tsx
import { z } from 'zod'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
})
```

**Correct (tree-shakable across all bundlers):**

```tsx
import * as z from 'zod'

const userSchema = z.object({
  name: z.string(),
  email: z.string().email()
})
```

**Why it matters:**

- Webpack (including Next.js) and esbuild cannot tree-shake named Zod imports effectively
- Wildcard exports have wide support for tree-shaking across bundlers
- Unused Zod validators, locales, and internal utilities are properly excluded from the bundle
- Rollup handles both styles well, but Webpack/esbuild require the wildcard pattern

**Additional context:**

Zod has made internal improvements to improve tree-shaking (marking regexes as `@__PURE__`, restructuring locale loading), but the import style still matters. Using wildcard imports ensures you get the full benefit of these optimizations.

Reference: [Zod PR #4569 - Tree-shaking improvements](https://github.com/colinhacks/zod/pull/4569)
