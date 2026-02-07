---
name: typescript-testing-organization
description:
  TypeScript test file suffixes, directory layout, tier targeting, and
  mechanical enforcement. Encodes the .spec tier-suffix policy
  (*.spec.ts, *.int.spec.ts, *.func.spec.ts, *.contract.spec.ts,
  *.e2e.spec.ts), test/_support/ conventions (builders/seeds/fakes/stubs/
  spies/msw), and audit scripts. Use when naming TS test files, organizing
  test directories, setting up test helpers, or enforcing layout invariants.
  Do NOT use for testing doctrine (see tdd-classicist), test-runner config
  (see vitest-monorepo), or framework-specific APIs.
---

# TypeScript Testing Organization

File suffixes, directory layout, support code conventions, and mechanical
enforcement for TypeScript test suites. This skill implements the
language-specific layer of the `tdd-classicist` doctrine.

## Applicability Gate

Apply this skill when ALL of the following are true:

- The project uses TypeScript (or JavaScript with TS-like tooling)
- You need to decide: test file suffix, test file location, test helper
  naming, or directory structure for a specific test tier
- OR you need to audit/enforce layout invariants

Do NOT apply when:

- Deciding which **test tier** a test belongs to, or which **double type** to
  use → route to `tdd-classicist`
- Configuring **test runners** (`vitest.config.ts`, `jest.config.ts`) → route
  to `vitest-monorepo` or framework-specific skill
- Setting up **CI pipelines or coverage thresholds**
- Working in this skills repository itself

## Routing Table

| Question | Route to |
|----------|----------|
| "What suffix / where does this TS test file go?" | [suffixes-and-layout](references/suffixes-and-layout.md) |
| "How do I organize test helpers?" | [support-code](references/support-code.md) |
| "Why .spec and not .test?" | [spec-vs-test](references/spec-vs-test.md) |
| "Should I use test() or it()? Can I use 'should'?" | [style-guidance](references/style-guidance.md) |
| "What tier should this test be?" | → **tdd-classicist** skill |
| "Should I mock or stub this?" | → **tdd-classicist** skill |
| Test file boilerplate (any tier) | `assets/templates/` |
| Audit test layout invariants | `scripts/audit-test-layout.sh` |
| Audit import boundaries | `scripts/audit-test-import-boundaries.sh` |
| Audit test double usage | `scripts/audit-test-doubles.sh` |
| Audit tier-aligned style | `scripts/audit-test-style.sh` |
| Audit multi-boundary integration (heuristic) | `scripts/audit-multi-boundary-integration.sh` |

## Procedure

1. **Identify the test tier** using `tdd-classicist` (or the user already
   knows the tier).
2. **Look up the suffix and location** in
   [suffixes-and-layout](references/suffixes-and-layout.md).
3. **Copy the template** from `assets/templates/` for the tier.
4. **Organize helpers** following
   [support-code](references/support-code.md).
5. **Run audit scripts** to verify layout invariants.

## Confirmation Policy

Do NOT apply changes derived from these rules without explicit user
confirmation. Present proposed file renames, moves, or template instantiations
as diffs and wait for approval.

## Related Skills

- **tdd-classicist** — Testing doctrine (tier roles, doubles taxonomy,
  assertions, TDD cycle)
- **vitest-monorepo** — Vitest runner configuration and workspace setup
- **esm-typescript** — ESM module patterns for `import.meta.url` in tests
