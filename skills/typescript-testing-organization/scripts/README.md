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
