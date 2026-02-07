---
name: development
description: Autonomous feature development using structured phases, parallel subagents, task system coordination, and backpressure-driven implementation. Auto-installs damage-control hooks for safety. Combines guided feature development with the Ralph methodology for context-efficient, self-correcting development loops. Use when implementing features, fixing bugs, or making significant code changes.
license: MIT
metadata:
  author: vercel
  version: "2.0.0"
  dependencies:
    - damage-control
---

# Development

A comprehensive development methodology that combines structured feature development with autonomous loop-based implementation. Uses parallel subagents for exploration, atomic task execution, task system coordination for agent swarms, and backpressure through tests/builds for self-correction.

**Safety**: Auto-installs damage-control hooks on first run to protect against destructive operations (rm -rf, git reset --hard, credential exposure, etc.).

## Core Principles

### From Structured Feature Development
- **Ask clarifying questions**: Identify all ambiguities before implementation
- **Understand before acting**: Study existing code patterns deeply
- **Use specialized agents**: code-explorer, code-architect, test-generator, test-runner, code-reviewer, security-reviewer, build-error-resolver
- **Track progress**: Use TaskCreate/TaskUpdate throughout all phases

### From Ralph Methodology
- **"Study" not "read"**: Achieve deep comprehension, not surface scanning
- **Don't assume not implemented**: Always verify before creating new code
- **One task = one commit**: Atomic, focused changes
- **Backpressure steering**: Tests, builds, and lints guide self-correction
- **Context efficiency**: Parallel subagents for reading, single agent for builds
- **Capture the why**: Document reasoning alongside implementation

### From Task System / Agent Swarms
- **Tasks as coordination layer**: Not just todos—a way to orchestrate multiple agents with shared state
- **Dependency graphs**: Use `blockedBy`/`blocks` to enforce execution order externally, not in memory
- **Parallel sub-agents**: Spawn 7-10 agents simultaneously for independent tasks
- **Fresh context per agent**: Each sub-agent gets isolated 200k token context window
- **Persistence**: Tasks survive /clear, session restarts, and terminal closes
- **Hierarchical execution**: Agents can spawn their own sub-agents for complex subtasks

---

## Task System Fundamentals

The task system is a **coordination layer for hierarchical multi-agent systems**. It externalizes the plan into a structure that survives context compaction, session restarts, and coming back to a project days later.

### Why This Matters

Without tasks, Claude holds the entire plan in working memory. For complex work:
- The plan degrades as context fills up
- Running `/clear` loses everything
- You re-explain what's done, what's left, what depends on what

With tasks, the dependency graph exists **outside** Claude's context window. There's nothing to forget.

### Task Structure

```json
{
  "subject": "Implement JWT authentication",
  "description": "Add JWT token generation and validation",
  "activeForm": "Implementing JWT authentication",
  "addBlockedBy": ["1", "2"]
}
```

- **subject**: Imperative form ("Run tests", "Fix auth bug")
- **description**: Full context another agent needs to execute
- **activeForm**: Present continuous shown in spinner ("Running tests")
- **blockedBy**: Task IDs that must complete first—**enforced by the system**

### Parallel Execution

Tasks without dependencies spawn **simultaneously**:

```
Task 1: Setup database schema
Task 2: Create API routes (blockedBy: [1])
Task 3: Write unit tests (blockedBy: [1])
Task 4: Add integration tests (blockedBy: [2, 3])
```

Tasks 2 and 3 run in parallel after Task 1 completes. Task 4 waits for both.

**Key insight**: Each sub-agent gets a fresh 200k token context window, completely isolated. Agent working on auth isn't polluted by agent working on database queries.

### Model Selection for Sub-agents

Use the `model` parameter when spawning Task agents:
- **haiku**: Quick searches, simple lookups, file listing
- **sonnet**: Implementation work, code changes, moderate complexity
- **opus**: Heavy reasoning, architecture decisions, complex debugging

### Persistence

For multi-session projects, set:
```bash
export CLAUDE_CODE_TASK_LIST_ID="my-project"
```

Tasks persist to `~/.claude/tasks/my-project/`. Different terminals, different days—same task graph.

### Hierarchical Spawning

Sub-agents can create their own tasks. For a codebase refactor:

**Layer 1** (Main agent): Break into subsystems—auth, database, API, frontend, tests

**Layer 2** (Auth agent): Break auth into—login, logout, sessions, password reset, tokens

**Layer 3** (Login agent): Break login into—form validation, API call, error handling, redirect

The architecture has no built-in ceiling. Constraints are context and cost, not capability.

---

## Phase 0: Requirements Definition & Codebase Indexing

**Goal**: Establish clear Jobs to Be Done (JTBD) and build a searchable codebase index

### Pre-flight: Safety Check
1. Verify damage control hooks are installed:
   ```bash
   # Check if hooks exist
   ls ~/.claude/hooks/damage-control/patterns.yaml 2>/dev/null || echo "NOT INSTALLED"
   ```
2. **If not installed, auto-install**:
   - Invoke the damage-control skill: Use the Skill tool with `skill: "damage-control"`
   - Guide user through installation (Global recommended)
   - Wait for installation to complete before proceeding
3. If installed, optionally review `patterns.yaml` for project-specific needs:
   - Add sensitive paths created by this project to `zeroAccessPaths`
   - Add project config files to `noDeletePaths`

**Auto-install Logic**:
```
IF ~/.claude/hooks/damage-control/patterns.yaml does NOT exist:
    THEN invoke Skill tool: damage-control
    WAIT for installation to complete
    VERIFY hooks are now installed
    THEN continue with Phase 0
```

### Pre-flight: Codebase Indexing

**ALWAYS run indexing at the start of a session in any repo.** This builds a searchable map of the entire codebase — files, symbols, and dependency graph — so you can search instead of reading every file.

1. **Run the indexer** (indexes full repo path + all tracked/untracked files):
   ```bash
   bash "$(find ~/.claude -path '*/development/scripts/index-repo.sh' -type f 2>/dev/null | head -1)" "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
   ```
   Falls back to `pwd` if not in a git repo. Indexes:
   - **file-tree.txt**: Every file with size and full path
   - **dir-tree.txt**: Directory structure (4 levels deep)
   - **symbols.txt**: All functions, classes, types, interfaces, exports with file:line
   - **dependencies.txt**: Import/require map between files

2. **Read the summary** to orient yourself:
   ```
   Read .claude/repo-index/SUMMARY.md
   ```

3. **Re-index when needed**: After major file additions/deletions or at the start of each new session.

### Using the Index During Development

The index replaces blind file reading. Instead of exploring every directory:

| Want to find... | Search command |
|-----------------|---------------|
| A function by name | `grep 'functionName' .claude/repo-index/symbols.txt` |
| Files in a directory | `grep 'dirname/' .claude/repo-index/file-tree.txt` |
| Who imports a module | `grep 'module-name' .claude/repo-index/dependencies.txt` |
| All React components | `grep 'FUNC.*\.tsx' .claude/repo-index/symbols.txt` |
| All type definitions | `grep '^TYPE\|^IFACE' .claude/repo-index/symbols.txt` |
| All exports from a file | `grep 'filename.ts' .claude/repo-index/symbols.txt` |
| Files by extension | `grep '\.py$' .claude/repo-index/file-tree.txt` |
| Large files (potential targets) | Sort file-tree.txt by size column |

**Context efficiency**: Searching the index uses ~100 tokens. Reading a file uses ~2000+ tokens. For a 20-file exploration, that's **95% token savings**.

**Rule**: Always search the index BEFORE using Glob/Grep on the actual codebase. Only read files you've confirmed are relevant via the index.

### Requirements Definition

**Actions**:
1. Discuss the feature/task with the user
2. Identify specific Jobs to Be Done
3. Break complex features into topics of concern
4. For each topic, establish:
   - What problem it solves
   - Success criteria
   - Constraints and boundaries
5. Document requirements (can be informal or in specs/ files for large projects)

**One Sentence Test**: Each topic should be describable in one sentence without using "and" to conjoin unrelated capabilities.

---

## Phase 1: Discovery

**Goal**: Deep understanding of what needs to be built

**Actions**:
1. **Create task graph** with all phases using TaskCreate:
   - Create one task per phase with clear dependencies
   - Use `blockedBy` to enforce phase ordering
   - Each task description should contain enough context for a sub-agent to execute independently

2. **Study** (not just read) the feature request:
   - What problem is being solved?
   - Who benefits and how?
   - What are the boundaries?
3. If unclear, ask user for clarification
4. Summarize understanding and confirm with user

**Critical**: Use "study" mindset - achieve comprehension, not just awareness.

---

## Phase 2: Codebase Exploration

**Goal**: Comprehensive understanding of relevant existing code

**Actions**:
1. **Search the index first** (before launching agents):
   - Search `symbols.txt` for functions/types related to the feature
   - Search `dependencies.txt` to trace the import graph
   - Search `file-tree.txt` to identify relevant directories
   - This gives you a targeted file list in seconds, saving agent context

2. Launch 2-3 code-explorer agents **in parallel**. Each agent should:
   - **Study** the code comprehensively (trace through abstractions, architecture, control flow)
   - Target different aspects (similar features, architecture, user experience)
   - **Start by reading `.claude/repo-index/symbols.txt`** to orient themselves
   - Return a list of 5-10 key files to read

   **Example agent prompts**:
   - "Read .claude/repo-index/symbols.txt first, then study features similar to [feature], tracing through their complete implementation"
   - "Read .claude/repo-index/dependencies.txt, then map the architecture and abstractions for [area]"
   - "Search .claude/repo-index/symbols.txt for [keyword], then analyze how [existing feature] works end-to-end"

3. **Read all files identified by agents** to build deep understanding

4. **Critical Guard**: Don't assume something isn't implemented. Always verify:
   - Search `symbols.txt` for existing implementations before creating new ones
   - Search `dependencies.txt` for utilities and helpers already in the codebase
   - Check for partial implementations that can be extended

5. Present comprehensive summary of findings

---

## Phase 3: Planning Mode (Gap Analysis)

**Goal**: Create a prioritized implementation plan with atomic tasks and dependency graph

**Actions**:
1. Analyze the gap between requirements and current codebase
2. Generate implementation tasks using TaskCreate:
   - Each task is **atomic**: completable in one focused session
   - Each task produces **one commit**
   - Use `blockedBy` to define dependencies explicitly

3. Task creation pattern:
   ```
   TaskCreate:
     subject: "Implement user session storage"
     description: |
       Why: Sessions needed before auth can work
       Files: src/auth/session.ts, src/types/session.ts
       Validation: Unit tests pass, session persists across requests
       Context: Uses Redis adapter from src/lib/redis.ts
     activeForm: "Implementing user session storage"

   TaskUpdate:
     taskId: "2"
     addBlockedBy: ["1"]  # Blocked by task 1
   ```

4. Order tasks by:
   - Dependencies (blockers first)
   - Risk (high-risk items early for faster feedback)
   - Value (high-value items early)
   - **Parallelizability** (group independent tasks to run simultaneously)

5. Review the dependency graph:
   - Use TaskList to see all tasks and their blocked status
   - Identify tasks that can run in parallel (no shared blockedBy)
   - Ensure no circular dependencies

**Note**: The plan is disposable. Regenerate if it becomes stale rather than forcing adherence to outdated guidance. The task graph persists—regenerating just means creating new tasks.

---

## Phase 4: Clarifying Questions

**Goal**: Resolve all ambiguities before implementation

**CRITICAL**: Do not skip this phase.

**Actions**:
1. Review codebase findings and original request
2. Identify underspecified aspects:
   - Edge cases and error handling
   - Integration points
   - Scope boundaries
   - Design preferences
   - Backward compatibility
   - Performance requirements

3. **Present all questions in a clear, organized list**
4. **Wait for answers before proceeding**

If user says "whatever you think is best", provide your recommendation and get explicit confirmation.

---

## Phase 5: Architecture Design

**Goal**: Design implementation approaches with clear trade-offs

**Actions**:
1. Launch 2-3 code-architect agents **in parallel** with different focuses:
   - **Minimal changes**: Smallest change, maximum reuse of existing code
   - **Clean architecture**: Optimal maintainability, elegant abstractions
   - **Pragmatic balance**: Speed + quality trade-off

2. Review all approaches and form your opinion on best fit

3. Present to user:
   - Brief summary of each approach
   - Trade-offs comparison
   - **Your recommendation with reasoning**
   - Concrete implementation differences

4. **Ask user which approach they prefer**

---

## Phase 6: Building Mode

**Goal**: Implement features through atomic, self-correcting tasks with parallel execution

**DO NOT START WITHOUT USER APPROVAL**

**Actions**:
1. Wait for explicit user approval of architecture
2. Check TaskList for unblocked tasks ready to execute
3. **Spawn parallel sub-agents** for independent tasks:
   - Use Task tool with appropriate `model` (haiku/sonnet/opus)
   - Each agent works in isolation with fresh context
   - Agents update their task status via TaskUpdate

4. For each task (whether parallel or sequential):
   a. `TaskUpdate` → status: "in_progress"
   b. Read all relevant files from task description
   c. Implement following chosen architecture
   d. **Self-correct against backpressure**:
      - Run tests after changes
      - Run build/type checks
      - Run lints
      - If failures occur, spawn **build-error-resolver** agent
   e. **Capture the why**: Add comments for non-obvious decisions
   f. `TaskUpdate` → status: "completed"
   g. Commit changes (one task = one commit)

5. **Build Error Resolver** (when backpressure fails):
   ```
   Task tool:
     subagent_type: "hc:test-runner"  # or general-purpose
     prompt: |
       Build/type check failed with error: [error]
       Analyze the failure, identify root cause, and provide specific fix.
       Files involved: [files]
     model: "sonnet"
   ```

6. **Verification Checkpoint** after each task completes:
   - Confirm tests still pass
   - Confirm build succeeds
   - If regression detected, fix before proceeding
   - Use TaskList to see what unblocked

7. Follow codebase conventions strictly

**Backpressure Loop**: Failing checks are steering signals. The build-error-resolver agent specializes in diagnosing and fixing these failures quickly.

### Operational Safety (Damage Control Integration)

When executing commands during Building Mode:

1. **Expect blocks**: Damage control hooks may block destructive operations (rm -rf, git reset --hard, etc.)
2. **Don't bypass**: If a command is blocked, this is intentional protection—find a safer alternative
3. **Ask patterns**: Some operations trigger confirmation dialogs (git checkout ., git stash drop)—explain why before confirming
4. **Protected paths**: Operations on zeroAccessPaths (credentials, .env) will fail—this is correct behavior
5. **If legitimately needed**:
   - For one-time ops, user can manually run the command
   - For repeated needs, update `patterns.yaml` to add an `ask: true` pattern

### Parallel Execution Pattern

When multiple tasks have no dependencies on each other:

```
# Check what's ready
TaskList → Shows tasks 2, 3, 4 are unblocked

# Spawn all three in parallel (single message, multiple Task calls)
Task: agent for task 2 (model: sonnet)
Task: agent for task 3 (model: sonnet)
Task: agent for task 4 (model: haiku)

# Each agent:
# - Updates its task to in_progress
# - Executes the work
# - Runs verification
# - Updates task to completed
```

This gives 3x speedup for independent work.

---

## Phase 7: Testing

**Goal**: Comprehensive test coverage with all tests passing

**Actions**:
1. **Generate Tests**: Launch 2 test-generator agents **in parallel**:
   - Unit tests: Individual functions, edge cases, error handling
   - Integration tests: Component interactions, data flow, API contracts

   Each agent provides:
   - Test cases with full implementation
   - Priority ranking (critical/important/nice-to-have)
   - Required mocks and fixtures

2. **Review and prioritize** generated tests
3. **Implement** approved test cases
4. **Run tests**: Use **single test-runner agent** (not parallel - for controlled backpressure):
   - Execute full test suite
   - Analyze failures with root cause diagnosis
   - Provide specific fixes

5. **Fix and iterate** until all tests pass
6. **Do not proceed until all tests pass**

---

## Phase 8: Quality Review

**Goal**: Ensure code quality, security, simplicity, and correctness

**Actions**:
1. Launch 4 reviewer agents **in parallel**:

   ```
   # Code quality reviewers
   Task: code-reviewer (simplicity, DRY, elegance)
   Task: code-reviewer (bugs, functional correctness)
   Task: code-reviewer (project conventions, proper abstractions)

   # Security reviewer
   Task: security-reviewer
   ```

2. **Security Reviewer** specifically checks:
   - OWASP Top 10 vulnerabilities (injection, XSS, CSRF, etc.)
   - Hardcoded secrets or credentials
   - Input validation and sanitization
   - Authentication/authorization flaws
   - Insecure data exposure
   - Security misconfigurations

3. **Operational Security Review** (Damage Control awareness):
   - Check for commands that would be blocked by damage control patterns
   - Identify new sensitive files that should be added to `zeroAccessPaths`
   - Flag operations on protected paths that might fail at runtime
   - Recommend `noDeletePaths` additions for critical new files (configs, migrations)

3. Consolidate findings by severity:
   - **Critical**: Security vulnerabilities, data loss risks
   - **High**: Bugs that break functionality
   - **Medium**: Code quality, maintainability issues
   - **Low**: Style, minor improvements

4. **Present findings to user** with recommendations
5. Address issues based on user decision
6. If significant changes made, **re-run tests and verification loop**

---

## Phase 9: Project Documentation

**Goal**: Ensure every project has complete, up-to-date documentation

Every project MUST have these four files in the project root. Create them if missing, update them if stale.

### 9a: README.md

**Purpose**: Describes what the project does and its key functionality.

**Template structure**:
```markdown
# Project Name

One-paragraph description of what this project does and the problem it solves.

## Features

- Feature 1: Brief description
- Feature 2: Brief description

## Architecture

High-level overview of how the system works (components, data flow, key technologies).
Include a diagram if the system has 3+ interacting components.

## Usage

How to run and use the project after installation. Key commands, endpoints, or UI entry points.

## Ports / Services (if applicable)

| Port | Service | Required |
|------|---------|----------|
| 8080 | Main server | Yes |

## Configuration

Environment variables, config files, and their purposes.

## License
```

**Rules**:
- Focus on WHAT and WHY, not HOW to install (that's INSTALLATION.md)
- Don't duplicate the installation steps
- Keep it concise — link to other docs for details
- Include actual feature list, not aspirational features

### 9b: INSTALLATION.md

**Purpose**: Step-by-step guide to get the project running from a fresh clone.

**Always prefer uv** for Python dependency management. Structure:

```markdown
# Installation

## Prerequisites

List exact versions required (Python 3.11+, Node 18+, etc.)

## Quick Start with uv

### 1. Install uv

\```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# Or: brew install uv
\```

### 2. Clone and setup

\```bash
git clone <repo-url>
cd <project-name>
uv venv --python 3.11
source .venv/bin/activate
uv pip install <dependencies>
\```

### 3. Start

\```bash
./start.sh  # or whatever the entry point is
\```

## All-in-one install (copy-paste)

Single block the user can paste to go from zero to running.

## Component Details

For each optional component/service, show how to start it independently.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| ... | ... | ... |

## Running Tests

Exact commands to run the test suite. Include single-test examples.

## Troubleshooting

Common issues and their fixes (kill stuck processes, reset databases, etc.)
```

**Rules**:
- Every dependency must be explicitly listed with its install command
- Include a copy-pasteable all-in-one block
- Use `uv pip install` not `pip install`
- Use `uv venv --python 3.11` not `python -m venv`
- Test the instructions mentally — would a new developer succeed on first try?

### 9c: METHODS.md

**Purpose**: Explains the algorithms, methods, and technical approaches used in the project.

**Template structure**:
```markdown
# Methods & Algorithms

## Overview

Brief description of the technical approach and why these methods were chosen.

## [Method/Algorithm 1 Name]

### Purpose
What problem this method solves.

### How It Works
Step-by-step explanation of the algorithm. Include pseudocode or key code
references (file:line) for complex logic.

### Parameters / Configuration
Tunable parameters and their effects.

### Trade-offs
Why this approach was chosen over alternatives. Performance characteristics.

## [Method/Algorithm 2 Name]
...

## Data Flow

How data moves through the system. Key transformations and storage points.

## Key Design Decisions

| Decision | Chosen Approach | Alternatives Considered | Rationale |
|----------|----------------|------------------------|-----------|
| ... | ... | ... | ... |
```

**Rules**:
- Focus on NON-OBVIOUS technical decisions — don't document standard CRUD
- Reference actual code locations (file:line) for key implementations
- Explain the WHY behind algorithm choices
- Include complexity analysis (O(n), etc.) for performance-critical algorithms
- If using external papers/references, cite them
- Update when algorithms change

### 9d: TODO.md

**Purpose**: Living document of outstanding issues, tracked automatically and manually.

The `SessionEnd` hook automatically appends outstanding issues from each Claude Code session. During the documentation phase, also:

1. **Review existing TODO.md** — remove items that have been completed
2. **Add any known issues** discovered during development that weren't captured
3. **Organize by priority** if the file has grown large
4. **Cross-reference** with the task system (TaskList) to ensure consistency

**Format**:
```markdown
# TODO

Outstanding issues and planned work.

## High Priority
- [ ] Critical bug or feature

## Medium Priority
- [ ] Enhancement or improvement

## Low Priority
- [ ] Nice-to-have or cleanup

## Session History
(Auto-appended by SessionEnd hook — do not edit this section manually)
```

**Rules**:
- Keep the manually-curated sections at the top
- Let the SessionEnd hook manage the "Session History" section at the bottom
- Remove completed items promptly — TODO.md should reflect CURRENT state
- Don't duplicate items between manual and auto-generated sections

### Documentation Checklist

Before marking Phase 9 complete, verify:
- [ ] README.md exists and accurately describes the project
- [ ] INSTALLATION.md exists with uv-based setup and works from a fresh clone
- [ ] METHODS.md exists and documents non-trivial algorithms/approaches
- [ ] TODO.md exists and reflects current outstanding issues
- [ ] No stale or incorrect information in any doc
- [ ] All docs reference actual file paths, not guessed ones

---

## Phase 10: Summary

**Goal**: Document accomplishments and next steps

**Actions**:
1. Mark all todos complete
2. Summarize:
   - What was built
   - Key decisions made and **why**
   - Files modified
   - Test coverage achieved
   - Any technical debt introduced
   - Suggested next steps

---

---

## Optional: TDD Mode

**When to use**: When test coverage is critical, or when requirements are well-defined but implementation approach is unclear.

**TDD Loop** (replaces standard Phase 6-7 flow):

1. **Red**: Write a failing test first
   ```
   TaskCreate:
     subject: "Write failing test for [feature]"
     description: "Create test that defines expected behavior. Test MUST fail initially."
     activeForm: "Writing failing test"
   ```

2. **Green**: Write minimal code to pass
   ```
   TaskCreate:
     subject: "Implement [feature] to pass test"
     description: "Write minimum code to make the test pass. No more."
     addBlockedBy: ["<red-task-id>"]
     activeForm: "Implementing to pass test"
   ```

3. **Refactor**: Clean up while keeping tests green
   ```
   TaskCreate:
     subject: "Refactor [feature] implementation"
     description: "Improve code quality. Tests must stay green."
     addBlockedBy: ["<green-task-id>"]
     activeForm: "Refactoring implementation"
   ```

4. Repeat for each feature/behavior

**Benefits**:
- Tests define the spec before implementation
- Prevents over-engineering (only write what's needed to pass)
- Immediate feedback loop
- Higher confidence in code correctness

---

## Context Efficiency Guidelines

To maximize effective use of context window:

1. **Index-first search**: Always search `.claude/repo-index/` before Glob/Grep on actual files. Index searches cost ~100 tokens vs ~2000+ for file reads. This alone saves 90%+ tokens on exploration.
2. **Parallel subagents for reading**: Launch multiple explorers simultaneously
3. **Single subagent for builds/tests**: Controlled backpressure, clear signal
4. **Atomic tasks**: One task per focused session prevents context bloat
5. **Progressive disclosure**: Load detailed docs only when needed
6. **File lists from agents**: Have agents return key files, then read them yourself
7. **Task descriptions as context**: Put full context in task description so sub-agents don't need conversation history
8. **Externalize the plan**: The task graph holds the plan, not your working memory
9. **Model selection**: Use haiku for simple tasks, save opus for complex reasoning
10. **Re-index after major changes**: Run the indexer again after adding/removing many files to keep the search accurate

## Self-Correction Patterns

When things go wrong:

1. **Failing tests**: Spawn build-error-resolver agent, don't skip or mark complete
2. **Build errors**: Resolve before proceeding, they're steering signals
3. **Stale plan**: Create new tasks rather than forcing adherence to outdated ones
4. **Circular implementation**: Step back, re-analyze the problem
5. **Missing context**: Launch another explorer agent, don't guess
6. **Task blocked unexpectedly**: Check TaskList for what's blocking, resolve blockers first
7. **Context overflow**: Use TaskCreate to break work into sub-tasks with their own agents
8. **Lost progress after /clear**: Task graph persists—use TaskList to see where you left off
9. **Parallel agent conflict**: Ensure tasks working on same files have proper blockedBy dependencies

## Anti-Patterns to Avoid

- Reading without studying (surface-level understanding)
- Assuming something isn't implemented
- Batching multiple changes into one commit
- Skipping clarifying questions
- Proceeding despite failing tests
- Over-engineering beyond requirements
- Creating abstractions for one-time operations
- **Holding the plan in memory** instead of externalizing to task graph
- **Marking tasks complete when they failed** (tests not passing, build broken)
- **Sequential execution of independent tasks** when they could run in parallel
- **Skipping dependencies** by not using blockedBy properly
- **Vague task descriptions** that require re-reading the conversation
- **Using opus for everything** when haiku/sonnet would suffice

### Indexing Anti-Patterns
- **Guessing class/function names** instead of grepping for `class ` or `def ` — names are often abbreviated or differ from what you'd expect (e.g., `KanbanHandler` not `KanbanHTTPRequestHandler`)
- **Estimating LOC** instead of using `wc -l` — always use actual counts
- **Listing a file with only LOC** but no classes/methods — every indexed file should have its public API documented
- **Assuming feature flags or constants are in the current file** — they may have moved to a disabled/old version of the file
- **Not verifying the index** — always run verification agents after generating an index; unverified indexes propagate errors to all future work
- **Rounding counts** (e.g., "19 agent types" when there are 20) — always count precisely

---

## Quick Reference: Task Commands

| Action | Tool | Example |
|--------|------|---------|
| Create task | TaskCreate | `subject: "Fix auth bug", description: "...", activeForm: "Fixing auth bug"` |
| Start task | TaskUpdate | `taskId: "1", status: "in_progress"` |
| Complete task | TaskUpdate | `taskId: "1", status: "completed"` |
| Add dependency | TaskUpdate | `taskId: "2", addBlockedBy: ["1"]` |
| View all tasks | TaskList | Shows status, blockers, owners |
| Get task details | TaskGet | `taskId: "1"` → full description |

## Quick Reference: Agent Types for Tasks

| Agent | Use For | Model |
|-------|---------|-------|
| code-explorer | Codebase analysis, finding patterns | haiku/sonnet |
| code-architect | Design decisions, architecture | sonnet/opus |
| test-generator | Creating test cases | sonnet |
| test-runner (hc:test-runner) | Running tests, diagnosing failures | sonnet |
| code-reviewer (hc:code-reviewer) | Quality review, bug detection | sonnet |
| security-reviewer | Vulnerability analysis | sonnet |
| build-error-resolver | Compilation/type errors | sonnet |
| Explore | Quick codebase searches | haiku |

## Quick Reference: Damage Control Integration

| Action | Command/Location |
|--------|------------------|
| Install hooks | `/damage-control` |
| Check if installed | `ls ~/.claude/hooks/damage-control/patterns.yaml` |
| Test hooks | `/damage-control` → "test damage control" |
| View blocked patterns | `~/.claude/hooks/damage-control/patterns.yaml` |
| Add protected path | Edit `zeroAccessPaths` in patterns.yaml |
| Add read-only path | Edit `readOnlyPaths` in patterns.yaml |
| Add no-delete path | Edit `noDeletePaths` in patterns.yaml |
| Add ask confirmation | Add `ask: true` to pattern in patterns.yaml |

### Common Damage Control Blocks During Development

| Blocked Command | Why | Safe Alternative |
|-----------------|-----|------------------|
| `rm -rf node_modules` | Recursive force delete | `rm -r node_modules` (no -f) |
| `git reset --hard` | Destroys uncommitted work | `git stash` then reset |
| `git push --force` | Rewrites remote history | `git push --force-with-lease` |
| `git clean -fd` | Deletes untracked files | `git clean -n` (dry run first) |
| Operations on `.env` | Credentials exposure | Use `.env.example` for templates |

### If a Legitimate Operation is Blocked

1. **One-time exception**: User runs command manually outside Claude
2. **Repeated need**: Add `ask: true` pattern to get confirmation dialog
3. **False positive**: Remove pattern from `bashToolPatterns` in patterns.yaml

---

## Data Backup Guidelines

**CRITICAL**: Always backup data before destructive operations. Data loss is often irreversible.

### When to Backup

| Operation | Backup Required | Why |
|-----------|-----------------|-----|
| Database reset/clear | **YES** | All data will be lost |
| Schema migrations | **YES** | May corrupt or lose data |
| Testing with production data | **YES** | Tests may modify data |
| Major refactors | Recommended | Code changes may have side effects |
| Before experiments | **YES** | Experiments often fail |

### Backup Commands

#### SQLite Databases
```bash
# Simple copy (database must not be in use, or use WAL mode)
cp /path/to/database.db /path/to/database.db.backup.$(date +%Y%m%d_%H%M%S)

# Safe backup with sqlite3 (works even if db is in use)
sqlite3 /path/to/database.db ".backup '/path/to/database.db.backup.$(date +%Y%m%d_%H%M%S)'"

# Dump to SQL (portable, can restore to different SQLite version)
sqlite3 /path/to/database.db .dump > /path/to/database.sql.backup.$(date +%Y%m%d_%H%M%S)
```

#### PostgreSQL
```bash
pg_dump dbname > backup_$(date +%Y%m%d_%H%M%S).sql
pg_dump -Fc dbname > backup_$(date +%Y%m%d_%H%M%S).dump  # Custom format, compressed
```

#### MongoDB
```bash
mongodump --db dbname --out backup_$(date +%Y%m%d_%H%M%S)
```

#### Generic Files/Directories
```bash
# Timestamped copy
cp -r /path/to/data /path/to/data.backup.$(date +%Y%m%d_%H%M%S)

# Compressed archive
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz /path/to/data
```

### Auto-Backup Before Destructive Operations

**Before any of these operations, CREATE A BACKUP FIRST:**

1. **Database resets** (`DELETE FROM`, `DROP TABLE`, `TRUNCATE`)
2. **API calls to `/reset` endpoints**
3. **Migration rollbacks**
4. **Data imports that replace existing data**
5. **Testing new extraction/processing logic**

### Backup Verification

After creating a backup, verify it:
```bash
# Check file exists and has size
ls -la /path/to/backup.db

# For SQLite, verify integrity
sqlite3 /path/to/backup.db "PRAGMA integrity_check;"

# Count records to verify data
sqlite3 /path/to/backup.db "SELECT COUNT(*) FROM main_table;"
```

### Restore Commands

```bash
# SQLite - restore from copy
cp /path/to/backup.db /path/to/database.db

# SQLite - restore from SQL dump
sqlite3 /path/to/database.db < /path/to/backup.sql

# PostgreSQL
psql dbname < backup.sql
pg_restore -d dbname backup.dump
```

### Quick Reference: Backup Before Destructive Ops

| Destructive Operation | Backup Command |
|-----------------------|----------------|
| `curl -X POST /api/reset` | `sqlite3 $DB ".backup '$DB.bak.$(date +%s)'"` |
| `DELETE FROM table` | `sqlite3 $DB ".backup '$DB.bak.$(date +%s)'"` |
| Schema migration | `sqlite3 $DB .dump > schema_backup.sql` |
| Fresh import | `cp $DB $DB.pre_import.$(date +%s)` |

### Environment Variable for Database Path

To make backups easier, know your database path:
```bash
# Check .env files for database location
grep -r "DB_PATH\|DATABASE\|SQLITE" .env*

# Common locations:
# - MEMORY_DB_PATH (this project)
# - DATABASE_URL
# - SQLITE_PATH
```

**Remember**: It takes seconds to backup, hours to re-process lost data.
