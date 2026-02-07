---
title: Root Workspaces Array Must Cover All Project Folders
impact: HIGH
impactDescription: prevents missing symlinks and "Cannot find module" errors
tags: linking, workspaces, package-json, configuration
---

## Root Workspaces Array Must Cover All Project Folders

**Impact: HIGH (prevents missing symlinks and "Cannot find module" errors)**

The root `package.json` `workspaces` array must include a glob pattern covering
every folder that contains a project `package.json`. If a project folder is not
covered, `npm install` won't create a symlink for it, and consumers will get
"Cannot find module" errors.

**Incorrect (new lib not covered by workspaces):**

```json
// root package.json
{
  "workspaces": [
    "apps/*",
    "libs/guard/ingestion/*"
  ]
}
```

```
libs/
├── guard/ingestion/domain/  ← ✅ covered by libs/guard/ingestion/*
├── guard/ingestion/data/    ← ✅ covered
└── shared/observability/    ← ❌ NOT covered by any glob
```

**Correct (all project directories covered):**

```json
// root package.json
{
  "type": "module",
  "workspaces": [
    "apps/*",
    "libs/*",
    "libs/guard/ingestion/*",
    "libs/shared/*",
    "libs/testkit/*",
    "tools/*"
  ]
}
```

**After adding a new workspace package:**

```bash
# Always run npm install to regenerate symlinks
npm install

# Verify the symlink was created
ls -la node_modules/@turbi/<new-lib>
```

**Diagnostic — if import fails:**

```
Import fails for @turbi/foo
├── Does node_modules/@turbi/foo symlink exist?
│   ├── No → Is foo's folder in root workspaces array?
│   │   ├── No → Add glob to root package.json, run npm install
│   │   └── Yes → Run npm install
│   └── Yes → Check exports field and consumer dependency
```

Reference: [npm Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
