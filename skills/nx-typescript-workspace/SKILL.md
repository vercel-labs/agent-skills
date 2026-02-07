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

- `arch-project-locations` — All code MUST live under apps/, libs/, or tools/
- `arch-library-first` — Product features MUST begin as standalone libraries
- `arch-hexagonal-deps` — Domain libs must not depend on data/api/infra/tool
- `arch-domain-purity` — Domain libs are pure: no I/O, no framework deps
- `arch-apps-thin-shell` — Apps are thin composition roots, no business logic

### 2. Module System (CRITICAL)

- `esm-type-module` — package.json must have "type": "module"
- `esm-import-extensions` — Must include .js extensions in ESM imports
- `esm-no-require` — Never use require/module.exports
- `esm-import-meta-url` — Use import.meta.url, never bare __dirname

### 3. Build (HIGH)

- `build-composite-tsconfig` — Referenced tsconfigs must have composite: true
- `build-rootdir-separation` — Keep vitest.config.ts out of tsconfig.lib.json
- `build-no-circular-refs` — No circular TypeScript project references
- `build-tsconfig-base-locked` — Don't modify tsconfig.base.json without reason

### 4. Linking (HIGH)

- `linking-exports-field` — Lib package.json must have exports with @nx/source
- `linking-consumer-deps` — Consumers must declare workspace dependencies
- `linking-no-file-link` — Never use file:, link:, or relative paths
- `linking-no-path-aliases` — Never use root-level TS path aliases for workspace libs
- `linking-workspaces-coverage` — Root workspaces array must cover all project folders

### 5. Testing (HIGH)

- `testing-vitest-workspace-root` — Set vitest root to workspace root
- `testing-import-meta-url` — Use import.meta.url pattern in vitest.config.ts
- `testing-workspace-relative-include` — Use workspace-relative include paths
- `testing-test-first` — Tests MUST be written before implementation
- `testing-pyramid` — Unit (colocated), Integration (test/integration/), E2E (critical only)
- `testing-deterministic` — No live network calls, controlled time/randomness

### 6. Tags (MEDIUM)

- `tags-required-dimensions` — Every project MUST have scope + type tags
- `tags-hex-constraints` — Tags must obey hexagonal dependency rules

### 7. Boundaries (MEDIUM)

- `boundaries-typed-clients` — External calls must use typed clients with timeouts
- `boundaries-input-validation` — Inputs must be validated at boundaries (Zod)
- `boundaries-no-any` — Public TypeScript surfaces must have explicit types
- `boundaries-structured-errors` — Errors must use stable codes and standard structures

### 8. Observability (MEDIUM)

- `observability-structured-logging` — Logging must be structured JSON
- `observability-otel` — OpenTelemetry is standard for tracing and metrics
- `observability-pii-redaction` — Secrets and tokens must be redacted from logs

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/arch-hexagonal-deps.md
rules/linking-exports-field.md
rules/testing-vitest-workspace-root.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Additional Resources

- For detailed error troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
