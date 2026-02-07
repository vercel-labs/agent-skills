# Tier Matrix — Quick Reference

Derived from [taxonomy-test-tiers.md](../../references/taxonomy-test-tiers.md).

| Tier | Real boundary count | SUT boundary | Primary proof | Doubles | Assertions |
|------|-------------------:|-------------|---------------|---------|------------|
| **Unit** | 0 | Single unit (+ chosen in-process collaborators) | Invariants + outputs | Stubs/fakes preferred; mocks rare | State/output/invariants |
| **Boundary integration** | 1 | Adapter + exactly one real boundary | Boundary semantics | Boundary real; others stubbed/faked | Observable effects across boundary |
| **Functional** | 0 | Use-case slice across units (bounded context) | Acceptance criteria at service interface | External services faked; internals real | User-observable outcomes |
| **Contract** | 0 (usually) | Producer/consumer contract (schema + compatibility) | Compatibility + schema fidelity | Stubs/fakes being validated | Schema conformance |
| **Regression** | (inherits) | (inherits) | “Would have failed before fix” | (inherits) | (inherits) |
| **E2E/System** | many | Multiple deployed components wired together | Wiring/config + critical paths | Fakes for third parties only (in CI) | User-observable outcomes |
