# Scripts — Anti-Leak Guardrail

This skill (`tdd-classicist`) is **language-agnostic doctrine**. It does not
contain executable scripts, templates, or framework-specific code.

## Where to Find Scripts

For language-specific audit scripts and enforcement tooling, see the
corresponding language organization skill:

| Language | Skill | Scripts |
|----------|-------|---------|
| TypeScript / JavaScript | `typescript-testing-organization` | `audit-test-doubles.sh`, `audit-test-layout.sh`, `audit-test-import-boundaries.sh` |
| Go | (future) `go-testing-organization` | TBD |

## Why This Directory Exists

This `scripts/` directory and README serve as an explicit guardrail: if
someone tries to add a language-specific script here, this file signals that
it belongs in the language organization skill instead.

Do NOT add scripts to this directory. Route to the appropriate language skill.
