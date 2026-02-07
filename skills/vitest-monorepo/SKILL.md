---
name: vitest-monorepo
description:
  Configure Vitest in monorepo workspaces with correct workspace root,
  import.meta.url pattern, and workspace-relative include paths. Use when
  Vitest shows 0 tests, test discovery fails, or setting up vitest.config.ts
  in npm/yarn/pnpm workspaces.
compatibility:
  files: ["vitest.config.ts"]
---

# Vitest Monorepo

Configuration rules for Vitest in monorepo workspaces. Contains 3 rules covering
workspace-root config patterns, `import.meta.url` pattern, and
workspace-relative include paths.

## When to Apply

Reference these guidelines when:

- Vitest reports "0 tests" or "No test suite found"
- Setting up or troubleshooting `vitest.config.ts` in a monorepo
- Configuring test coverage paths or include patterns

## When NOT to Apply

Do NOT reference these guidelines when:

- The project uses Jest or another test runner (not Vitest)
- The project is not a monorepo (single-package vitest works differently)
- You are working in this skills repository itself
- Deciding **which test tier** a test belongs to → see **tdd-classicist**
- Deciding **test file suffixes or directory layout** → see
  **typescript-testing-organization**
- Following the **TDD cycle** or choosing **test doubles** → see
  **tdd-classicist**

## Quick Reference

- [testing-vitest-workspace-root](references/rules/testing-vitest-workspace-root.md) — Set vitest root to workspace root
- [testing-import-meta-url](references/rules/testing-import-meta-url.md) — Use `import.meta.url` pattern in `vitest.config.ts`
- [testing-workspace-relative-include](references/rules/testing-workspace-relative-include.md) — Use workspace-relative include paths

## Vitest workspaceRoot Depth Formula

Count directory segments from workspace root to the `vitest.config.ts` file.
Use that many `..` segments.

Example: `libs/guard/ingestion/domain/` = 4 segments →
`path.resolve(__dirname, '../../../..')`.

## How to Use

**For automated checks** — validate vitest configs:

```
bash scripts/check-vitest-config.sh [WORKSPACE_ROOT]
```

The script checks for `import.meta.url` pattern, workspace root setting,
workspace-relative includes, and tsconfig.spec.json inclusion. Outputs JSON.

**For a specific topic** — read the relevant rule from the Quick Reference
above. Each file is self-contained with incorrect/correct examples.

**Important:** Do NOT apply changes derived from these rules without explicit
user confirmation. Present proposed changes as diffs and wait for approval.

## Related Skills

- **tdd-classicist** — Testing doctrine: test tiers, doubles taxonomy,
  assertions, TDD cycle (language-agnostic)
- **typescript-testing-organization** — TS test file suffixes, directory layout,
  templates, and audit scripts
- **esm-typescript** — ESM `import.meta.url` details beyond vitest.config.ts
- **nx-monorepo** — `tsconfig.spec.json` patterns (`build-rootdir-separation`)
