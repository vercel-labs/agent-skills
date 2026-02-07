---
name: nx-typescript-workspace
description:
  Configure, scaffold, and troubleshoot Nx TypeScript projects with ESM builds,
  npm workspaces linking, Vitest testing, hexagonal architecture constraints, and
  project tags. Use when creating new Nx apps/libs/tools, fixing build/test/link
  errors, adding workspace dependencies, setting up Vitest configs, deciding
  where new code should live, or enforcing module boundary rules in this
  monorepo.
---

# Nx TypeScript Workspace

Comprehensive rules for an ESM-first TypeScript Nx monorepo with hexagonal
architecture, npm workspaces linking, Vitest testing, and strict module
boundaries. Contains 33 rules across 8 categories.

## When to Apply

Reference these guidelines when:

- Creating new Nx apps, libs, or tools
- Configuring TypeScript builds (tsconfig, project references)
- Setting up or troubleshooting Vitest test configs
- Adding workspace dependencies between packages
- Deciding where new code should live (apps vs libs vs tools)
- Enforcing hexagonal architecture and module boundary rules
- Fixing "Cannot find module", ESM, or build errors
- Reviewing PRs for architectural compliance

## When NOT to Apply

Do NOT reference these guidelines when:

- The workspace does NOT use Nx as the monorepo tool
- The project uses CommonJS (no `"type": "module"` in package.json)
- The workspace uses yarn workspaces or pnpm workspaces (linking rules differ)
- The project is a single-package repo (not a monorepo)
- The framework is not TypeScript-first (e.g., plain JavaScript projects)
- You are working in this skills repository itself (these rules target the consumer monorepo)

## Stack Summary

| Concern | Tool / Config | Key File |
|---------|---------------|----------|
| Monorepo | Nx 22 + npm workspaces | `nx.json`, root `package.json` |
| Language | TypeScript 5.x, ESM (`"type": "module"`) | `tsconfig.base.json` |
| Module system | `module: "nodenext"`, `moduleResolution: "nodenext"` | `tsconfig.base.json` |
| Build | `@nx/js:tsc` | per-project `project.json` |
| Test | Vitest via `@nx/vitest:test` | per-project `vitest.config.ts` |
| Linking | npm workspaces + `@nx/source` custom condition | root `package.json`, lib `exports` |
| Boundaries | Nx tags + `@nx/enforce-module-boundaries` | `project.json` tags |

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Architecture | CRITICAL | `arch-` | 5 |
| 2 | Module System | CRITICAL | `esm-` | 4 |
| 3 | Build | HIGH | `build-` | 4 |
| 4 | Linking | HIGH | `linking-` | 5 |
| 5 | Testing | HIGH | `testing-` | 6 |
| 6 | Tags | MEDIUM | `tags-` | 2 |
| 7 | Boundaries | MEDIUM | `boundaries-` | 4 |
| 8 | Observability | MEDIUM | `observability-` | 3 |

## Quick Reference

### 1. Architecture (CRITICAL)

- [arch-project-locations](references/rules/arch-project-locations.md) — All code MUST live under apps/, libs/, or tools/
- [arch-library-first](references/rules/arch-library-first.md) — Product features MUST begin as standalone libraries
- [arch-hexagonal-deps](references/rules/arch-hexagonal-deps.md) — Domain libs must not depend on data/api/infra/tool
- [arch-domain-purity](references/rules/arch-domain-purity.md) — Domain libs are pure: no I/O, no framework deps
- [arch-apps-thin-shell](references/rules/arch-apps-thin-shell.md) — Apps are thin composition roots, no business logic

### 2. Module System (CRITICAL)

- [esm-type-module](references/rules/esm-type-module.md) — package.json must have "type": "module"
- [esm-import-extensions](references/rules/esm-import-extensions.md) — Must include .js extensions in ESM imports
- [esm-no-require](references/rules/esm-no-require.md) — Never use require/module.exports
- [esm-import-meta-url](references/rules/esm-import-meta-url.md) — Use import.meta.url, never bare __dirname

### 3. Build (HIGH)

- [build-composite-tsconfig](references/rules/build-composite-tsconfig.md) — Referenced tsconfigs must have composite: true
- [build-rootdir-separation](references/rules/build-rootdir-separation.md) — Keep vitest.config.ts out of tsconfig.lib.json
- [build-no-circular-refs](references/rules/build-no-circular-refs.md) — No circular TypeScript project references
- [build-tsconfig-base-locked](references/rules/build-tsconfig-base-locked.md) — Don't modify tsconfig.base.json without reason

### 4. Linking (HIGH)

- [linking-exports-field](references/rules/linking-exports-field.md) — Lib package.json must have exports with @nx/source
- [linking-consumer-deps](references/rules/linking-consumer-deps.md) — Consumers must declare workspace dependencies
- [linking-no-file-link](references/rules/linking-no-file-link.md) — Never use file:, link:, or relative paths
- [linking-no-path-aliases](references/rules/linking-no-path-aliases.md) — Never use root-level TS path aliases for workspace libs
- [linking-workspaces-coverage](references/rules/linking-workspaces-coverage.md) — Root workspaces array must cover all project folders

### 5. Testing (HIGH)

- [testing-vitest-workspace-root](references/rules/testing-vitest-workspace-root.md) — Set vitest root to workspace root
- [testing-import-meta-url](references/rules/testing-import-meta-url.md) — Use import.meta.url pattern in vitest.config.ts
- [testing-workspace-relative-include](references/rules/testing-workspace-relative-include.md) — Use workspace-relative include paths
- [testing-test-first](references/rules/testing-test-first.md) — Tests MUST be written before implementation
- [testing-pyramid](references/rules/testing-pyramid.md) — Unit (colocated), Integration (test/integration/), E2E (critical only)
- [testing-deterministic](references/rules/testing-deterministic.md) — No live network calls, controlled time/randomness

### 6. Tags (MEDIUM)

- [tags-required-dimensions](references/rules/tags-required-dimensions.md) — Every project MUST have scope + type tags
- [tags-hex-constraints](references/rules/tags-hex-constraints.md) — Tags must obey hexagonal dependency rules

### 7. Boundaries (MEDIUM)

- [boundaries-typed-clients](references/rules/boundaries-typed-clients.md) — External calls must use typed clients with timeouts
- [boundaries-input-validation](references/rules/boundaries-input-validation.md) — Inputs must be validated at boundaries (Zod)
- [boundaries-no-any](references/rules/boundaries-no-any.md) — Public TypeScript surfaces must have explicit types
- [boundaries-structured-errors](references/rules/boundaries-structured-errors.md) — Errors must use stable codes and standard structures

### 8. Observability (MEDIUM)

- [observability-structured-logging](references/rules/observability-structured-logging.md) — Logging must be structured JSON
- [observability-otel](references/rules/observability-otel.md) — OpenTelemetry is standard for tracing and metrics
- [observability-pii-redaction](references/rules/observability-pii-redaction.md) — Secrets and tokens must be redacted from logs

## Common Errors Quick Lookup

| Error / Symptom | Start Here |
|-----------------|------------|
| `ERR_MODULE_NOT_FOUND` / missing `.js` extension | [esm-import-extensions](references/rules/esm-import-extensions.md) |
| `ERR_REQUIRE_ESM` / CJS/ESM conflict | [esm-no-require](references/rules/esm-no-require.md), [esm-type-module](references/rules/esm-type-module.md) |
| `Cannot find module '@turbi/...'` | [linking-consumer-deps](references/rules/linking-consumer-deps.md), [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) §4 |
| `File is not under 'rootDir'` | [build-rootdir-separation](references/rules/build-rootdir-separation.md) |
| `Referenced project must have composite: true` | [build-composite-tsconfig](references/rules/build-composite-tsconfig.md) |
| `ReferenceError: __dirname is not defined` | [esm-import-meta-url](references/rules/esm-import-meta-url.md) |
| 0 tests found / tests not discovered | [testing-vitest-workspace-root](references/rules/testing-vitest-workspace-root.md), [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) §1 |

## How to Use

**For automated checks** — run the relevant script before reading rule files:

| Symptom area | Script | Rules covered |
|-------------|--------|---------------|
| Linking / ESM package.json | `bash scripts/check-package-json.sh` | 4 rules |
| Vitest configuration | `bash scripts/check-vitest-config.sh` | 4 rules |
| TypeScript / tsconfig | `bash scripts/check-tsconfig.sh` | 4 rules |
| Project tags | `bash scripts/check-project-tags.sh` | 2 rules |
| Import violations | `bash scripts/check-imports.sh` | 4 rules |

Scripts output JSON. Fix reported violations; only open rule files if you need
to understand the rationale.

**For a specific topic** — read the relevant rule from the Quick Reference
above. Each file is self-contained with incorrect/correct examples.

**For a comprehensive workspace-wide review** — load
[compiled-rules.md](references/compiled-rules.md) (all 33 rules in one
document, ~2100 lines). Do NOT load this for single-topic lookups. This file is
**generated** — if missing, run `bash scripts/compile-rules.sh` first.

**Vitest workspaceRoot depth formula:** count directory segments from workspace
root to the `vitest.config.ts` file. Use that many `..` segments.
Example: `libs/guard/ingestion/domain/` = 4 segments →
`path.resolve(__dirname, '../../../..')`.

**Important:** Do NOT apply changes derived from these rules without explicit
user confirmation. Present proposed changes as diffs and wait for approval.

## Additional Resources

- For detailed error troubleshooting, see [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md)
- To regenerate the compiled document: `bash scripts/compile-rules.sh`

### Authoring

- Rule template: [assets/authoring/rule-template.md](assets/authoring/rule-template.md)
- Section definitions: [assets/authoring/sections.md](assets/authoring/sections.md)
