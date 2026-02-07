# `.spec` vs `.test` — Semantic Distinction

This reference explains why this convention uses `.spec.ts` as the standard
test file suffix, and when `.test.ts` might appear in legacy or external
contexts.

---

## The Convention

All runnable test files in this convention use **`.spec.ts`** (or `.spec.tsx`).

The tier is encoded as a prefix to `.spec`:
- `*.spec.ts` — unit (default)
- `*.int.spec.ts` — integration
- `*.func.spec.ts` — functional
- `*.contract.spec.ts` — contract
- `*.e2e.spec.ts` — E2E / system

---

## Why `.spec`?

### Historical lineage

- **xUnit / TDD tradition** standardized "test" as the unit of automation.
  JUnit, pytest, Go's `_test.go` — all use "test."
- **BDD tradition** (RSpec, Jasmine, Mocha) reframed tests as "specifications"
  — executable examples of behavior. Hence "spec."

### The semantic split

| Suffix | Semantic intent |
|--------|----------------|
| `.test` | "Runnable verification check" — xUnit lineage, emphasis on automation |
| `.spec` | "Executable specification" — BDD lineage, emphasis on behavior description |

### Why this convention chose `.spec`

1. **Signal intent:** `.spec` signals "this file specifies behavior" rather
   than "this file contains checks." The naming encourages writing tests that
   read like specifications of what the system should do.

2. **Reserve "test" for the concept:** "Test" remains the general concept
   (unit test, integration test, test pyramid). The file suffix `.spec` avoids
   overloading the word in the filesystem.

3. **Consistency with ecosystem:** Jasmine, Angular, and many TS/JS projects
   default to `.spec`. Adopting `.spec` reduces friction in those ecosystems.

4. **Non-test specification artifacts stay distinct:** Schemas (OpenAPI,
   AsyncAPI), contract documents, and other specification artifacts use their
   own suffixes (`.yaml`, `.json`, `.proto`). `.spec.ts` is unambiguously
   "runnable specification code."

---

## Runner Mechanics

Modern JS/TS test runners (Vitest, Jest) treat `.test.*` and `.spec.*` as
equivalent for discovery purposes. The choice is **semantic and
organizational**, not a runner constraint.

Configure your runner to match this convention:

```typescript
// vitest.config.ts (example)
export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts?(x)', 'test/**/*.spec.ts'],
  },
});
```

---

## When `.test` May Appear

- **Legacy codebases** that standardized on `.test` before this convention.
  Prefer standardizing to one suffix per project to avoid ambiguity.
- **External dependencies** or generated code that uses `.test`. Leave as-is
  for third-party code.
- **Other languages** (Go uses `_test.go`; Python uses `test_*.py`). This
  convention is TypeScript-specific.

## Optional Alternative: If You Adopt Both Suffixes

If you ever decide to use both `.test` and `.spec` in the same repository,
make it **mechanically enforceable** by binding suffix to tier, not to
“spec-ness”:

- Verification tiers (unit/integration/property): `*.test.ts`
- Scenario tiers (functional/contract/e2e): `*.spec.ts`

This is NOT the convention encoded by `suffixes-and-layout.md` in this skill
today (which standardizes on `.spec` for all runnable tests). If you adopt the
dual-suffix policy, you MUST update:

- `references/suffixes-and-layout.md`
- `assets/templates/`
- `scripts/audit-test-layout.sh`

---

## Migration Guidance

If migrating from `.test.ts` to `.spec.ts`:

1. Update the test runner include patterns.
2. Rename files in bulk (use a script or IDE refactoring).
3. Update any CI globs that reference `.test.ts`.
4. Do it in one PR per project/package to avoid a mixed state.

---

## See Also

- [suffixes-and-layout.md](suffixes-and-layout.md) — the full suffix + directory policy
