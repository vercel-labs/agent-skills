---
name: pr-description-generator
description: >
  Generates comprehensive, structured PR (Pull Request) descriptions by deeply analyzing
  the diff and codebase. Produces sections covering: issue being solved, impacted areas,
  data flow before/after the change, code quality score, architecture score, test coverage
  score, testing scenarios, and improvement suggestions. Use when the user asks to
  "generate a PR description", "write PR notes", "document this pull request", "create
  PR summary", or any variant of describing/documenting a code change for review.
---

# PR Description Generator

Generate thorough, reviewer-friendly PR descriptions that surface the full context of a change.

## Workflow

### 1. Gather context

Collect the following before writing anything:

- **Diff**: Run `git diff main...HEAD` (or the appropriate base branch) to get all changed files and lines.
- **Commit messages**: Run `git log main...HEAD --oneline` for a summary of commits.
- **Linked issue**: Ask the user if there is a linked issue/ticket number, or scan commit messages for references (e.g., `#123`, `JIRA-456`).
- **Test files**: Identify new or modified test files in the diff.

If the diff is large (>500 lines), read changed files selectively - focus on entry points, interfaces, and core logic rather than generated or lock files.

### 2. Analyze the change

Before writing, reason through:

- **What problem does this solve?** Map commits + issue context to a clear problem statement.
- **What areas are touched?** Group changed files by layer (UI, API, service, DB, config, tests, infra).
- **Data flow delta**: Trace how data moved through the system before vs. after (e.g., request path, state transitions, DB queries).
- **Risk surface**: Which changes are most likely to introduce regressions?

### 3. Score the PR

Assign three integer scores (1-10) with brief rationale. See [references/scoring-rubric.md](references/scoring-rubric.md) for detailed criteria.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Quality | x/10 | readability, DRY, error handling, naming |
| Architecture | x/10 | separation of concerns, coupling, extensibility |
| Test Coverage | x/10 | coverage breadth, edge cases, meaningful assertions |

### 4. Write the PR description

Use the template in [references/pr-template.md](references/pr-template.md). Populate every section - do not leave placeholders.

### 5. Suggest improvements

After the description, append a **Suggestions** section listing concrete, actionable improvements you noticed in the diff that are out of scope for this PR. Prioritize by impact (high/medium/low).

## Guidelines

- Be specific: reference file names, function names, and line ranges when relevant.
- Data flow diagrams should use simple ASCII or markdown code blocks - no external tools needed.
- Scores must be honest. A PR with no tests should score 1-3 on Test Coverage.
- Keep the description skimmable: use bullet points and headers, not walls of text.
- If the user asks to regenerate or refine any section, update only that section without rewriting the rest.
