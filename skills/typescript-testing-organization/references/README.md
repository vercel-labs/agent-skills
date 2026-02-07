# References — TypeScript Testing Organization

This directory contains the normative conventions for TypeScript test file
naming, directory layout, and support code organization.

## Policy

- Reference files are the **single source of truth** for TS testing conventions.
- Each file uses normative language: **MUST**, **SHOULD**, **MAY**.
- These references implement the language-specific layer of the
  `tdd-classicist` doctrine. For tier definitions, doubles taxonomy, and
  assertion strategy, see `tdd-classicist/references/`.

## Index

| File | Topic |
|------|-------|
| [suffixes-and-layout.md](suffixes-and-layout.md) | Tier-encoded file suffixes, directory structure, regression tagging |
| [support-code.md](support-code.md) | `test/_support/` conventions: builders, seeds, fakes, stubs, spies, MSW |
| [spec-vs-test.md](spec-vs-test.md) | Why `.spec` (not `.test`): semantic distinction and runner mechanics |
| [style-guidance.md](style-guidance.md) | Tier-aligned style constraints (`test()` vs `it()`, “should” wording) |
