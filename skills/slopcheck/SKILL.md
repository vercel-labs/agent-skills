---
name: slopcheck
description: Validate npm package references in markdown, YAML, and config files against the live npm registry before installing or using them. Catches hallucinated and slopsquatted package names. Use for "check packages", "validate dependencies", "slopsquatting", "hallucinated packages", "phantom packages", "verify npm install".
---

# slopcheck

Scan files for `npm install`, `npx`, `pnpm add`, `yarn add`, `bun add`, and `bunx` commands, extract package names, and validate each against the live npm registry. Packages that don't exist are reported as phantom packages (hallucinations). Packages with HTTP 451 responses are flagged as security holds (removed for malware).

Zero runtime dependencies. Uses only Node.js built-in APIs.

## When to use

- Before installing packages from any AI-generated file (SKILL.md, AGENTS.md, .cursorrules, README.md)
- Before committing markdown or config files that reference npm packages
- When reviewing pull requests that add new package references in documentation
- After generating code or documentation that includes install commands

## Commands

```bash
# Scan specific files
npx slopcheck SKILL.md README.md

# Scan a directory recursively (.md, .yml, .yaml, .json, .cursorrules)
npx slopcheck .

# Scan with JSON output for programmatic use
npx slopcheck --json .

# Ignore known-good internal packages
npx slopcheck --ignore my-internal-pkg,another-known-pkg .

# Control registry check concurrency
npx slopcheck --concurrency 5 .
```

## Interpreting output

```
slopcheck v0.1.2 — scanning 3 files for phantom packages

✗ react-codeshift — not found on npm
  └─ AGENTS.md:14  npx react-codeshift --transform ...
  └─ SKILL.md:8    npm install react-codeshift

⚠ suspicious-pkg — security hold (HTTP 451)
  └─ .cursorrules:19  npm install suspicious-pkg

✓ 12 packages verified, 1 not found, 1 security hold

Found 1 phantom package. Exit code 1.
```

- **not found on npm** — the package name does not exist in the npm registry. Likely an AI hallucination. Do not install it. An attacker may register the name as malware (slopsquatting).
- **security hold (HTTP 451)** — npm has removed this package, typically for malware. Do not install it under any circumstances.
- **Exit code 0** — all packages verified as existing on npm.
- **Exit code 1** — one or more phantom packages found.

## JSON output format

When using `--json`, output is an array of findings:

```json
[
  {
    "file": "AGENTS.md",
    "line": 14,
    "command": "npx react-codeshift --transform ...",
    "packages": ["react-codeshift"],
    "results": {
      "react-codeshift": { "exists": false, "status": 404 }
    }
  }
]
```

## What slopcheck does NOT do

- Does not scan package.json or lock files — use Socket.dev or Snyk for that
- Does not check if an existing package is malicious — existing only means not hallucinated
- Does not validate package versions or compatibility

## Scanned file types

`.md`, `.yml`, `.yaml`, `.json`, `.cursorrules`

Directories named `node_modules`, `.git`, `dist`, and `build` are always skipped.
