# Cybercentry Cyber Security Consultant

A structured skill for delivering expert-level cyber security advisory via @cybercentry on the Virtuals Protocol Agent Commerce Protocol (ACP).

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files
- `src/` - Build scripts and utilities
- `metadata.json` - Document metadata (version, organisation, abstract)
- **`AGENTS.md`** - Compiled output (generated)
- **`SKILL.md`** - Agent skill definition (frontmatter + rules)
- **`test-cases.json`** - Test cases for LLM evaluation (generated)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Build AGENTS.md from rules:
   ```bash
   pnpm build
   ```

3. Validate rule files:
   ```bash
   pnpm validate
   ```

4. Extract test cases:
   ```bash
   pnpm extract-tests
   ```

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `sanitise-` for Sanitise Before Submitting (Section 1)
   - `verify-` for Wallet Verification (Section 2)
   - `threat-` for Threat Assessment (Section 3)
   - `incident-` for Incident Response (Section 4)
   - `vuln-` for Vulnerability Prioritisation (Section 5)
   - `compliance-` for Compliance Guidance (Section 6)
   - `arch-` for Security Architecture (Section 7)
   - `workflow-` for Automated Workflows (Section 8)
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations
5. Run `pnpm build` to regenerate AGENTS.md and test-cases.json

## Rule File Structure

Each rule file should follow this structure:

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional description
tags: tag1, tag2, tag3
---

## Rule Title Here

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

```json
// Bad example
```

**Correct (description of what's right):**

```json
// Good example
```

Optional explanatory text after examples.

Reference: [Link](https://example.com)
```

## File Naming Convention

- Files starting with `_` are special (excluded from build)
- Rule files: `area-description.md` (e.g., `sanitise-strip-credentials.md`)
- Section is automatically inferred from filename prefix
- Rules are sorted alphabetically by title within each section
- IDs (e.g., 1.1, 1.2) are auto-generated during build

## Impact Levels

- `CRITICAL` - Highest priority, must be applied before every job submission
- `HIGH` - Significant security improvements
- `MEDIUM-HIGH` - Moderate-high risk reduction
- `MEDIUM` - Moderate security improvements
- `LOW-MEDIUM` - Low-medium gains
- `LOW` - Incremental or operational improvements

## Scripts

- `pnpm build` - Compile rules into AGENTS.md
- `pnpm validate` - Validate all rule files
- `pnpm extract-tests` - Extract test cases for LLM evaluation
- `pnpm dev` - Build and validate

## Contributing

When adding or modifying rules:

1. Use the correct filename prefix for your section
2. Follow the `_template.md` structure
3. Include clear bad/good examples with explanations
4. Add appropriate tags
5. Run `pnpm build` to regenerate AGENTS.md and test-cases.json
6. Rules are automatically sorted by title — no need to manage numbers

## Acknowledgments

Originally created by [Cybercentry](https://x.com/cybercentry).
