# Tier Matrix — Quick Reference

Derived from [taxonomy-test-tiers.md](../../references/taxonomy-test-tiers.md).

| Tier | Purpose | Audience | Scope | Boundaries | Doubles | Assertions |
|------|---------|----------|-------|------------|---------|------------|
| **Unit** | Verify one unit's contract | Unit owner | In-process, IO-free, deterministic | No infra, no network, no time/random | Stubs/fakes preferred; mocks rare | State/output/invariants |
| **Integration** | Verify one real boundary | Boundary/adapter team | One real boundary at a time | DB, queue, HTTP, filesystem | Boundary real; others stubbed/faked | Observable effects across boundary |
| **Functional** | Verify user-story slice | Product + engineering | Cross-unit, controlled env | No real third parties in CI | External services faked; internals real | User-observable outcomes |
| **Contract** | Verify stubs match reality | Integration/platform team | Provider/consumer assumptions | Schema/API compliance | Stubs/fakes being validated | Schema conformance |
| **Regression** | Pin a fixed bug | Bug fixer + maintainers | Lowest tier that reproduces | Same as chosen tier | Same as chosen tier | "Would have failed before fix" |
| **E2E/System** | Verify critical user paths | Product, QA, on-call | Full-stack, minimal count | No real third parties in CI | Fakes for third parties only | User-observable outcomes |
