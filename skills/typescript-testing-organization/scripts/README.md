# Scripts — TypeScript Test Enforcement

Automated audit scripts that check TypeScript test layout invariants and
produce compact JSON output for agent consumption.

## Usage

```bash
bash scripts/<script-name>.sh [PROJECT_ROOT]
```

Defaults `PROJECT_ROOT` to the current working directory.

## Output Contract

All scripts write:
- **Status messages** to stderr
- **Machine-readable JSON** to stdout

## Available Scripts

### audit-test-layout.sh

Checks suffix + path invariants:
- No `*.int.spec.*` under `src/`
- No `*.func.spec.*` under `src/`
- No `*.contract.spec.*` under `src/`
- No `*.e2e.spec.*` under `src/`
- All test files use `.spec.ts(x)` suffix (not `.test.ts(x)`)

### audit-test-import-boundaries.sh

Checks import boundary invariants:
- No imports from `test/**` inside `src/**`
- No infrastructure imports (testcontainers, server start) in unit test files

### audit-test-doubles.sh

Scans test files for mock/spy/fake usage patterns (Vitest + Jest) and flags
overuse.

**Flag values:**
- `"ok"` — 0-2 doubles per file (normal)
- `"review"` — 3-5 doubles per file (worth checking)
- `"warning"` — 6+ doubles per file (likely mock overuse)

### audit-test-style.sh

Enforces tier-aligned style constraints (non-classifying):
- Unit + boundary integration MUST use `test()` (not `it()`)
- Unit + boundary integration test titles MUST NOT start with “should”

### audit-multi-boundary-integration.sh

Heuristically flags boundary integration tests that appear to touch multiple
real boundary categories (DB + HTTP, DB + filesystem, etc.). Outputs candidates
for review (not a perfect classifier).
