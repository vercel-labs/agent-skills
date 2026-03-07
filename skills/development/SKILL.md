---
name: development
description: Autonomous feature development using structured phases, parallel subagents, task system coordination, and backpressure-driven implementation. Auto-installs damage-control hooks for safety. Combines guided feature development with the Ralph methodology for context-efficient, self-correcting development loops. Use when implementing features, fixing bugs, or making significant code changes.
---

# Development

Structured feature development with parallel subagents, task system coordination, and backpressure-driven self-correction.

## Core Principles

- **Study, don't skim**: Achieve deep comprehension before acting
- **Don't assume not implemented**: Always search the index and codebase before creating new code
- **One task = one commit**: Atomic, focused changes
- **Backpressure steers**: Tests, builds, lints are steering signals — fix failures, don't skip them
- **Surgical changes only**: Touch only what the request requires. Don't improve adjacent code
- **Push back when warranted**: If a request seems counterproductive or over-scoped, say so
- **Externalize the plan**: The task graph holds the plan, not your working memory

## Task System

Tasks are a coordination layer for multi-agent work. They survive `/clear`, session restarts, and context compaction.

```json
{
  "subject": "Implement JWT authentication",
  "description": "Full context another agent needs to execute independently",
  "activeForm": "Implementing JWT authentication",
  "addBlockedBy": ["1", "2"]
}
```

- Use `blockedBy` to enforce execution order
- Tasks without dependencies spawn simultaneously as parallel sub-agents
- Each sub-agent gets a fresh 200k token context window
- Model selection: **haiku** for searches/lookups, **sonnet** for implementation, **opus** for architecture/debugging

---

## Phase 0: Setup & Codebase Indexing

### Safety Check

```bash
ls ~/.claude/hooks/damage-control/patterns.yaml 2>/dev/null || echo "NOT INSTALLED"
```

If not installed, invoke the damage-control skill first: `skill: "damage-control"`.

### Codebase Indexing

Run at the start of every session in any repo:

```bash
bash "$(find ~/.claude -path '*/development/scripts/index-repo.sh' -type f 2>/dev/null | head -1)" "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
```

Then read `.claude/repo-index/SUMMARY.md` to orient yourself.

### Searching the Index

Use the **Grep tool** (not shell grep) to search index files — it's the built-in tool for content search:

| Want to find... | Grep tool search |
|-----------------|------------------|
| A function by name | Grep for `functionName` in `.claude/repo-index/symbols.txt` |
| Files in a directory | Grep for `dirname/` in `.claude/repo-index/file-tree.txt` |
| Who imports a module | Grep for `module-name` in `.claude/repo-index/dependencies.txt` |
| All type definitions | Grep for `^TYPE\|^IFACE` in `.claude/repo-index/symbols.txt` |
| Files by extension | Grep for `\.py$` in `.claude/repo-index/file-tree.txt` |

**Rule**: Always search the index BEFORE reading actual files. Index search costs ~100 tokens vs ~2000+ for a file read — 95% savings on exploration.

### Requirements Definition

1. Discuss the feature/task with the user
2. Break into topics of concern — each describable in one sentence
3. Establish success criteria and constraints for each

---

## Phase 1: Discovery & Exploration

1. **Create task graph** with TaskCreate — one task per phase, `blockedBy` to enforce ordering
2. **Search the index first**: symbols.txt for related functions, dependencies.txt for import graph, file-tree.txt for relevant directories
3. **Launch 2-3 code-explorer agents in parallel**, each targeting different aspects. Instruct them to read `.claude/repo-index/symbols.txt` first
4. **Read files identified by agents** to build deep understanding
5. **Critical Guard**: Search symbols.txt for existing implementations before creating new ones

---

## Phase 2: Planning & Clarifying Questions

### Gap Analysis
1. Generate atomic implementation tasks with TaskCreate (one task = one commit)
2. Use `blockedBy` for dependencies, group independent tasks for parallel execution
3. Order by: dependencies → risk → value → parallelizability

### Clarifying Questions (do not skip)
1. Identify underspecified aspects: edge cases, integration points, scope boundaries, design preferences
2. Present all questions in a clear list
3. **Wait for answers before proceeding**

---

## Phase 3: Architecture Design

1. Launch 2-3 code-architect agents in parallel with different focuses (minimal changes, clean architecture, pragmatic balance)
2. Present trade-offs comparison with your recommendation
3. **Ask user which approach they prefer**

---

## Phase 4: Building

**DO NOT START WITHOUT USER APPROVAL**

1. Check TaskList for unblocked tasks
2. Spawn parallel sub-agents for independent tasks
3. For each task:
   - TaskUpdate → in_progress
   - Read relevant files, implement following chosen architecture
   - **Self-correct against backpressure**: run tests, build checks, lints after changes
   - If failures: spawn build-error-resolver agent
   - TaskUpdate → completed
   - Commit (one task = one commit)

### Coding Discipline

Every changed line must trace directly to the user's request:

1. **Scope**: Only modify files and code paths required by the task. Don't "improve" adjacent code, comments, or formatting
2. **Simplicity**: Write the minimum code that solves the problem. No speculative flexibility, no abstractions for single-use code. If 200 lines could be 50, rewrite. Ask: "Would a senior engineer say this is overcomplicated?"
3. **Dead code**: Remove imports, variables, and functions that YOUR changes made unused. Don't remove pre-existing dead code unless asked
4. **Style**: Match existing codebase conventions exactly. Don't introduce new patterns unless the task requires it
5. **Goal framing**: Before implementing, restate the task as a verifiable goal:
   - "Add validation" → "Write tests for invalid inputs, then make them pass"
   - "Fix the bug" → "Write a test that reproduces it, then make it pass"
6. **No speculative code**: Don't add error handling for impossible scenarios, feature flags, backwards-compat shims, or "in case we need it later" abstractions
7. **Comments**: Only where the logic isn't self-evident. Don't add docstrings to code you didn't change

### Operational Safety

- Damage control hooks may block destructive operations — find safer alternatives, don't bypass
- Operations on protected paths (.env, credentials) will fail by design
- For legitimate blocked ops: user runs manually, or add `ask: true` pattern to `patterns.yaml`

---

## Phase 5: Testing

1. Launch 2 test-generator agents in parallel (unit tests + integration tests)
2. Run tests with single test-runner agent (controlled backpressure)
3. Fix and iterate until all tests pass — **do not proceed with failures**

---

## Phase 6: Quality Review

1. Launch reviewers in parallel: code quality, correctness, conventions, security
2. Security check: OWASP Top 10, hardcoded secrets, input validation, auth flaws
3. Consolidate by severity (Critical → Low), present to user
4. If significant changes made, re-run tests

---

## Phase 7: Documentation & Summary

Read `references/project-documentation.md` for templates. Ensure README.md, INSTALLATION.md, METHODS.md, TODO.md exist and are current.

Summarize: what was built, key decisions and why, files modified, test coverage, technical debt, next steps.

---

## Optional Modes

- **TDD Mode**: Read `references/tdd-mode.md` — Red/Green/Refactor loop replacing Phases 4-5
- **Data Backup**: Read `references/data-backup.md` before any destructive database operations

## Context Efficiency

1. **Index-first**: Always search `.claude/repo-index/` with the Grep tool before Glob/Grep on actual files
2. **Parallel subagents for reading**, single subagent for builds/tests
3. **Atomic tasks**: One task per focused session prevents context bloat
4. **Task descriptions carry context**: Sub-agents don't need conversation history
5. **Re-index after major changes**: Run the indexer again after adding/removing many files

## Anti-Patterns

- Reading without studying (surface-level understanding)
- Assuming something isn't implemented without searching
- Proceeding despite failing tests
- Holding the plan in memory instead of task graph
- Sequential execution of independent tasks
- Touching code unrelated to the current task
- Adding speculative error handling or abstractions
- Guessing symbol names instead of grepping symbols.txt

## Quick Reference

| Agent Type | Use For | Model |
|------------|---------|-------|
| code-explorer | Codebase analysis | haiku/sonnet |
| code-architect | Design decisions | sonnet/opus |
| test-generator | Creating test cases | sonnet |
| test-runner | Running tests, diagnosing failures | sonnet |
| code-reviewer | Quality review | sonnet |
| security-reviewer | Vulnerability analysis | sonnet |
| build-error-resolver | Build/type errors | sonnet |

| Task Action | Tool |
|-------------|------|
| Create task | TaskCreate |
| Start task | TaskUpdate: status "in_progress" |
| Complete task | TaskUpdate: status "completed" |
| Add dependency | TaskUpdate: addBlockedBy |
| View all tasks | TaskList |
