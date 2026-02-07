# Troubleshooting: Nx + TypeScript + Vitest + npm Workspaces

Categorized error catalog for the ESM-only + TS Project References + Vitest + Nx stack.

---

## 1. "Tests Not Found" / "0 Tests Passed"

**Symptoms:** `nx test mylib` reports "Ran 0 tests" or "No test suite found".

| Cause | Fix |
|-------|-----|
| Misconfigured `include` patterns | Check `vitest.config.ts`. If config is at `packages/mylib/test/unit/`, the pattern `include: ['src/**/*.spec.ts']` resolves relative to that dir. Use workspace-root-based paths instead. |
| Nx inferred target conflict | If you manually defined `"test"` in `project.json` but `nx.json` also infers `"test"`, Nx might run the inferred one. Rename your manual target or disable inference for that project. |
| Default excludes | Vitest excludes `node_modules` and `dist` by default. If tests are inside a folder Vitest considers output (like `build/`), they are ignored. |
| Vitest root set to package dir (npm workspaces) | In npm workspaces, `node_modules` lives at the workspace root. Setting `root` to a package dir breaks resolution. **Fix:** set `root: <workspaceRoot>` and scope `include` to the project. |

**Diagnostic:**
```bash
# Check what Vitest resolves
npx vitest list --config <project>/vitest.config.ts
```

---

## 2. ESM & Module Resolution Errors

**Symptoms:** `Error: require() of ES module...`, `ERR_REQUIRE_ESM`, `Directory import is not supported`.

| Cause | Fix |
|-------|-----|
| Importing a directory without index.js | In native ESM, `import { foo } from './utils'` fails. You MUST include extensions: `import { foo } from './utils/index.js'`. |
| Mixing CJS and ESM | Ensure `package.json` has `"type": "module"`. All config files should be `.ts` or `.mjs`. For CJS-only deps, use default import: `import pkg from 'cjs-lib'; const { foo } = pkg;`. |
| Vitest config in CJS format | `vitest.config.ts` MUST use ESM: `export default defineConfig(...)`. Never `module.exports`. |
| `__dirname` used directly | ESM does not define `__dirname`. Use `fileURLToPath(import.meta.url)` pattern. |

---

## 3. TypeScript Project Reference Errors

**Symptoms:** `Referenced project must have "composite": true` or `File is not under 'rootDir'`.

| Cause | Fix |
|-------|-----|
| `composite: true` is viral | Any tsconfig referenced by another MUST have `"composite": true`. `tsconfig.base.json` already sets this. |
| `rootDir` enforcement | When `composite` is on, TS enforces all files match `rootDir`. If `tsconfig.lib.json` includes files outside `src` (like `vitest.config.ts`), it breaks. **Fix:** keep `vitest.config.ts` out of `tsconfig.lib.json`, only include in `tsconfig.spec.json`. |
| Circular references | Project A refs B, B refs A. Illegal in TS project refs. Refactor shared code into a third package. |

---

## 4. Dependency & Workspace Linking Issues

**Symptoms:** `Cannot find module '@turbi/mylib'` even though it exists.

| Cause | Fix |
|-------|-----|
| Missing `exports` in lib `package.json` | Native ESM requires `exports`. Ensure the lib has the full exports map with `@nx/source` condition. |
| Stale workspace symlinks | Run `npm install` again. Verify `node_modules/@turbi/mylib` is a symlink. |
| TS happy but Node fails | TS found sources via `references`, but Node uses `exports`. Ensure `exports` paths match what you import. |
| Consumer missing dependency declaration | If project imports `@turbi/foo`, its `package.json` MUST list `"@turbi/foo": "*"`. |
| Project folder not in workspaces array | Root `package.json` `workspaces` must include a glob covering the project folder. |
| Using `file:` or `link:` | **Disallowed.** Use `"*"` version for workspace deps. |

**Diagnostic:**
```bash
# Check symlink exists
ls -la node_modules/@turbi/<lib>

# Verify exports resolution
node -e "import('@turbi/<lib>').then(m => console.log(Object.keys(m)))"
```

---

## 5. Vitest Typechecking Errors

**Symptoms:** `vitest --typecheck` fails or reports errors in untouched files.

| Cause | Fix |
|-------|-----|
| Checking the whole graph | If `typecheck.tsconfig` points to root `tsconfig.json`, Vitest checks everything. Point to the specific test tsconfig. |
| Missing `.d.ts` for libs | If Project A depends on Project B but B hasn't been built (no `.d.ts`), typechecking fails. Run `nx build <dep>` first or rely on `@nx/source` condition for dev resolution. |

---

## 6. Coverage Reports Empty

**Symptoms:** Tests pass but coverage is 0%.

| Cause | Fix |
|-------|-----|
| Source maps mismatch | Verify `test.coverage.include` in `vitest.config.ts`. Ensure tests run against `src/`, not `dist/`. |
| Nx caching path mismatch | Ensure `outputs` in `project.json` matches where Vitest writes coverage: `{workspaceRoot}/coverage/<project-path>`. |

---

## 7. IDE IntelliSense Issues

**Symptoms:** VS Code shows red squiggles but `tsc` passes.

| Cause | Fix |
|-------|-----|
| Orphaned file | Every file must be included in at least one tsconfig referenced by the root. If a file is not matched by any `include`, VS Code treats it as isolated. |

**Diagnostic:** Use "TypeScript: Go to Project Configuration" in VS Code to see which tsconfig owns the open file.

---

## 8. Build Order / Cache Issues

**Symptoms:** `nx build <app>` fails because a dep lib hasn't been built.

| Cause | Fix |
|-------|-----|
| Missing `dependsOn: ["^build"]` | The `@nx/js:tsc` target default in `nx.json` sets `dependsOn: ["^build"]`. Verify it's not overridden in `project.json`. |
| Stale cache | Run `nx reset` to clear the Nx cache, then rebuild. |

**Diagnostic:**
```bash
nx graph --focus=<project>  # Visualize dependency graph
nx build <project> --verbose # See build order
```

---

## Decision Tree: "My import doesn't resolve"

```
Import fails for @turbi/foo
├── Does node_modules/@turbi/foo symlink exist?
│   ├── No → Is foo's folder in root workspaces array?
│   │   ├── No → Add glob to root package.json, run npm install
│   │   └── Yes → Run npm install
│   └── Yes → Does foo's package.json have "exports" with "@nx/source"?
│       ├── No → Add exports field
│       └── Yes → Does consumer's package.json declare "@turbi/foo": "*"?
│           ├── No → Add dependency declaration
│           └── Yes → Is the import path correct (no deep imports)?
│               ├── No → Use @turbi/foo (root), not @turbi/foo/src/...
│               └── Yes → Check tsconfig includes and module resolution
```
