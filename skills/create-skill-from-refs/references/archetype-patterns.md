# Skill Archetypes — Patterns from Real Skills

Three archetypes extracted from production skills. Each section shows the
directory layout, the key structural patterns, and when to choose it.

---

## 1. Knowledge Hub

**Exemplar:** `tdd-classicist` (classicist TDD methodology)

### Directory layout

```
tdd-classicist/
├── SKILL.md                          # ~97 lines — pure dispatcher
├── references/                       # 6 deep reference documents
│   ├── taxonomy-test-doubles.md
│   ├── taxonomy-test-tiers.md
│   ├── methodology-red-green-refactor.md
│   ├── assertions-and-contracts.md
│   ├── classical-vs-mockist.md
│   └── suite-health.md
└── assets/
    ├── quickref/                     # lookup tables
    │   ├── tier-matrix.md
    │   ├── doubles-matrix.md
    │   └── glossary.md
    ├── decision-trees/               # procedural guides
    │   ├── choose-tier.md
    │   └── choose-double.md
    └── checklists/                   # review/audit lists
        ├── test-review.md
        ├── regression-fix.md
        └── suite-health.md
```

### Key patterns

**Routing table** — SKILL.md acts as an index. Each question maps to exactly
one reference file. The agent reads only what it needs:

```markdown
| Question | Route to |
|----------|----------|
| "What tier should this test be?" | assets/decision-trees/choose-tier.md |
| "Should I mock/stub/fake this?" | references/taxonomy-test-doubles.md |
| "Is my test suite healthy?" | references/suite-health.md |
```

**Applicability gate** — explicit "Apply when" AND "Do NOT apply when" with
redirect to other skills:

```markdown
## Applicability Gate

Apply this skill when ANY of the following are true:
- You need to decide which test tier a test belongs to
- You need to choose a test double type

Do NOT apply when:
- Deciding file suffixes or naming → typescript-testing-organization
- Configuring test runners → vitest-monorepo
```

**Procedure section** — numbered steps the agent follows after routing:

```markdown
## Procedure
1. Identify the task type.
2. Route to the right reference (use the routing table).
3. Apply the methodology from the loaded reference.
```

**Confirmation policy** — declares when to pause:

```markdown
## Confirmation Policy
Do NOT apply changes without explicit user confirmation.
Present proposed code as diffs and wait for approval.
```

### When to choose Knowledge Hub

- The skill is primarily **reference material** (taxonomies, specs, guides)
- Users will ask different questions at different times
- The agent needs to load only the relevant subset
- Material volume is large (>500 lines total across all references)

---

## 2. Tool Runner

**Exemplar:** `test-verifier` (multi-tier test runner)

### Directory layout

```
test-verifier/
├── SKILL.md                          # ~182 lines — logic + output contract
├── scripts/
│   ├── detect-tiers.sh               # maps changed files → tiers
│   ├── run-tier.sh                   # runs a single test tier
│   └── parse-jest-results.sh         # extracts results from Jest JSON
└── assets/
    └── tier-command-matrix.md
```

### Key patterns

**Rich frontmatter** — uses optional fields for discoverability:

```yaml
license: MIT
compatibility:
  - jq installed
  - Node.js and npm
  - Docker (required only for integration tier)
metadata:
  domain: testing
  framework: jest
  project: turbi-guard
```

**Decision table** — maps input patterns to actions:

```markdown
| Changed path pattern | Tiers to run |
|---|---|
| `domain/services/*.js` | unit |
| `domain/repositories/*.js` | unit + integration |
| Multiple layers touched | unit + functional (minimum) |
```

**Delegation guidance** — when to use a subagent vs run directly. This is a
Cursor-specific pattern not in the standard:

```markdown
**Delegate** (use the subagent) when:
- Running a full tier or multiple tiers (output exceeds ~50 lines)
- Running coverage (long-running, verbose)

**Use directly** when:
- Running a single targeted test file
- Reading an existing coverage report
```

**Output contract** — a markdown template defining the exact output format:

```markdown
## Verification Report
- **Changed files:** file1.js, file2.js
- **Tiers run:** unit, functional

### Results
| Tier | Passed | Failed | Duration |
|------|--------|--------|----------|
| unit | 47 | 0 | 4.2s |
```

**Composition table** — how this skill feeds into other skills:

```markdown
| Downstream skill | How to use together |
|---|---|
| gh-pr-creator | Paste Results into "Validação executada" |
| commit-hygiene | Use report as go/no-go before committing |
```

### When to choose Tool Runner

- The skill centers on **executing scripts or commands**
- There is decision logic for **what to run** based on context
- Output needs a **structured format** for downstream consumption
- Scripts are the core value, not just supplementary

---

## 3. Workflow Executor

**Exemplar:** `gh-pr-creator` (GitHub PR workflow)

### Directory layout

```
gh-pr-creator/
├── SKILL.md                          # ~238 lines — full workflow inline
└── assets/
    └── pull_request_template.md
```

### Key patterns

**Principles section** — core invariants stated upfront, before any steps:

```markdown
## Principles
- All PR content in Brazilian Portuguese.
- PR body must follow the repo template exactly, preserving comment markers.
- PR body files staged in .work/ (never deleted — serve as history).
- Use gh pr create --body-file to avoid shell escaping issues.
```

**Numbered workflow** — sequential steps, each with code examples:

```markdown
### 1. Discover repo and template
### 2. Gather context
### 3. Draft the body in .work/
### 4. Section guidelines
### 5. Create or update the PR
### 6. Add proof comments
```

**Section guidelines with sizing table** — adapts depth to situation:

```markdown
| PR size | Guideline |
|---------|-----------|
| Small / trivial | 1–3 sentences |
| Medium | 1 paragraph + optional context table |
| Complex / high-risk | Up to ~15 lines; include threat tables |
```

**Complete example** — a full, concrete output that the agent can reference:

```markdown
## Body file example
File: .work/body-pr-seed-safety.md
(complete filled-in template follows)
```

**Quick reference table** — cheat sheet at the bottom:

```markdown
| Action | Command |
|--------|---------|
| Create PR | gh pr create --title "..." --body-file ... |
| Update PR | gh pr edit <N> --body-file ... |
```

### When to choose Workflow Executor

- The skill is a **sequential process** the agent follows end-to-end
- Steps are mostly **inline** (not dispatched to separate files)
- A complete worked example provides more value than reference documents
- The workflow is relatively **stable** (steps don't change often)

---

## Hybrid Skills

When material spans archetypes, pick the dominant one as the base structure
and incorporate specific patterns from others:

| Dominant | Borrow from | Pattern to borrow |
|---|---|---|
| Knowledge Hub | Tool Runner | Add an output contract section |
| Knowledge Hub | Workflow Executor | Add a numbered procedure (already natural) |
| Tool Runner | Knowledge Hub | Add a routing table for reference material |
| Tool Runner | Workflow Executor | Number the decision-table + execution steps |
| Workflow Executor | Knowledge Hub | Move deep reference material to `references/` |
| Workflow Executor | Tool Runner | Add scripts for automatable steps |

The key constraint: **SKILL.md stays under 500 lines.** If adding borrowed
patterns pushes it over, move content to supporting files.
