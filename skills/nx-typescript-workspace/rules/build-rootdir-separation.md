---
title: Keep vitest.config.ts Out of tsconfig.lib.json
impact: HIGH
impactDescription: prevents "File is not under rootDir" compilation errors
tags: build, tsconfig, rootdir, vitest
---

## Keep vitest.config.ts Out of tsconfig.lib.json

**Impact: HIGH (prevents "File is not under rootDir" compilation errors)**

When `composite` is enabled, TypeScript enforces that all included files fall
under `rootDir`. Since `tsconfig.lib.json` sets `rootDir: "./src"`, including
files outside `src/` (like `vitest.config.ts`) triggers a compilation error.

The fix: `vitest.config.ts` belongs in `tsconfig.spec.json` only.

**Incorrect (vitest.config.ts in build tsconfig):**

```json
// tsconfig.lib.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*.ts",
    "vitest.config.ts"  // ❌ outside rootDir ("./src")
  ]
}
// Error: File 'vitest.config.ts' is not under 'rootDir' './src'
```

**Correct (separated concerns):**

```json
// tsconfig.lib.json — build only
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts", "src/**/*.test.ts"]
}
```

```json
// tsconfig.spec.json — tests + config
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./out-tsc/vitest",
    "types": ["vitest", "node"]
  },
  "include": [
    "vitest.config.ts",      // ✅ here, not in lib config
    "src/**/*.test.ts",
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ],
  "references": [{ "path": "./tsconfig.lib.json" }]
}
```

This pattern also ensures `import.meta.url` is recognized in `vitest.config.ts`
(since it's included in a tsconfig).

Reference: [Nx — TypeScript Project References](https://nx.dev/blog/typescript-project-references)
