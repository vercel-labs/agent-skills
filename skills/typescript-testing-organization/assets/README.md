# Assets — TypeScript Test Templates

This directory contains ready-to-use TypeScript test templates aligned with
the tier-suffix and directory conventions in
[suffixes-and-layout.md](../references/suffixes-and-layout.md).

## Usage

1. Identify the test tier (use `tdd-classicist` decision tree if unsure).
2. Copy the template for that tier into the correct location.
3. Rename following the suffix convention (`*.spec.ts`, `*.int.spec.ts`, etc.).
4. Replace placeholder comments with real test logic.
5. Follow tier-aligned style constraints from
   [style-guidance.md](../references/style-guidance.md).

## Templates

### Test Files

| Template | Tier | Suffix | Placement |
|----------|------|--------|-----------|
| [unit.spec.ts](templates/unit.spec.ts) | Unit | `*.spec.ts` | `src/**/<module>.spec.ts` |
| [integration.int.spec.ts](templates/integration.int.spec.ts) | Boundary integration | `*.int.spec.ts` | `test/integration/` |
| [functional.func.spec.ts](templates/functional.func.spec.ts) | Functional | `*.func.spec.ts` | `test/functional/` |
| [contract.contract.spec.ts](templates/contract.contract.spec.ts) | Contract | `*.contract.spec.ts` | `test/contract/` |
| [e2e.e2e.spec.ts](templates/e2e.e2e.spec.ts) | E2E | `*.e2e.spec.ts` | `test/e2e/` |

### Support Code

| Template | Purpose | Placement |
|----------|---------|-----------|
| [example.builder.ts](templates/_support/example.builder.ts) | Builder pattern for domain objects | `test/_support/builders/` |
| [example.fake.ts](templates/_support/example.fake.ts) | Fake implementation of an interface | `test/_support/fakes/` |
| [example.msw.ts](templates/_support/example.msw.ts) | MSW HTTP handler (stub/fake) | `test/_support/msw/` |
