---
title: Don't Modify tsconfig.base.json Without Reason
impact: HIGH
impactDescription: prevents workspace-wide compilation breakage
tags: build, tsconfig, configuration, workspace
---

## Don't Modify tsconfig.base.json Without Reason

**Impact: HIGH (prevents workspace-wide compilation breakage)**

`tsconfig.base.json` at the workspace root defines shared compiler settings
inherited by all projects. Changes here affect the entire workspace. Do not
modify it without a clear reason and team agreement.

**Expected settings (do not change):**

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "es2022",
    "customConditions": ["@nx/source"]
  }
}
```

Key settings and why they're locked:

| Setting | Value | Why |
|---------|-------|-----|
| `composite` | `true` | Required for project references |
| `module` | `nodenext` | ESM-first workspace |
| `moduleResolution` | `nodenext` | Matches module setting |
| `target` | `es2022` | Node.js 18+ baseline |
| `customConditions` | `["@nx/source"]` | Source-level resolution during dev/test |

**Incorrect (modifying base config for one project):**

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "module": "commonjs",   // ❌ breaks all ESM projects
    "paths": {
      "@turbi/*": ["libs/*/src"]  // ❌ use npm workspaces instead
    }
  }
}
```

**Correct (override in project-level tsconfig):**

```json
// libs/special-case/tsconfig.lib.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "es2020"  // ✅ override only in this project if needed
  }
}
```

Project-specific overrides go in `tsconfig.lib.json` or `tsconfig.spec.json`.
Base config changes require an RFC or team discussion.

Reference: [Nx — TypeScript Project Linking](https://nx.dev/docs/concepts/typescript-project-linking)
