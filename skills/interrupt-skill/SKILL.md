---
name: interrupt-skill
description: Context interrupt management for Claude Code. Record work interruptions and resume them with Socratic memory probing. Use when the user is interrupted mid-task and needs to save context, or when resuming a previously interrupted task. Activates on phrases like "I need to stop", "save my progress", "resume my task", "where was I", "continue from last time".
license: MIT
metadata:
  author: texiwustion
  version: "1.0.0"
---

# Interrupt Skill — Context Interrupt Management

A system for recording work interruptions and resuming them with targeted memory probing. Prevents lost context when you're pulled away mid-task.

## Commands

This skill provides four slash commands for Claude Code:

| Command | Description |
|---------|-------------|
| `/interrupt-init` | One-time setup: initializes a local git repo at `~/w/interrupts/` to store records |
| `/interrupt <description>` | Record an interruption — write anything, AI extracts structure automatically |
| `/interrupti` | Guided interruption recording with step-by-step prompts |
| `/interrupt-resume [keyword]` | Resume a task with Socratic probing of your current knowledge state |

## Install

### Step 1: Copy command files

```bash
cp commands/*.md ~/.claude/commands/
```

### Step 2: Copy the init script

```bash
mkdir -p ~/.claude/skills/interrupt-skill/scripts
cp resources/init-repo.sh ~/.claude/skills/interrupt-skill/scripts/
```

### Step 3: Initialize the storage repo (run once in Claude Code)

```
/interrupt-init
```

This creates `~/w/interrupts/` with `active/` and `archived/` directories, optionally linked to a git remote.

## Usage

### Recording an interruption (auto mode)

Write anything that describes your current state. The AI extracts structure:

```
/interrupt working on auth refactor, extracted JWT logic to useAuth hook,
the /api/admin routes still use old pattern, need to update route.ts,
middleware.ts, and the test file
```

This saves a structured record:

```markdown
## Auth Middleware Refactor

停在：/api/admin routes still use old pattern

已确认：
- JWT validation extracted to useAuth hook
- New pattern works on /api/user routes

下一步：
1. Update route.ts
2. Update middleware.ts
3. Check test file

激活词：auth; middleware; JWT
```

### Resuming a task

```
/interrupt-resume auth
```

Claude finds the matching record, then probes your memory with 1-3 targeted questions **before** diving in:

> "You stopped at updating the middleware. Do you remember which 3 files needed changes?"

- If you remember → jump straight in
- If you forgot → Claude walks you through the context

This prevents picking up with stale assumptions.

## Storage

Records are stored in `~/w/interrupts/`:
- `active/` — pending interruptions, synced to git remote
- `archived/` — completed/resumed records

File naming: `YYYY-MM-DD-HHMMSS-{slug}.md`

## Design Principles

1. **Capture at interruption time** — context is freshest right when you stop
2. **Probe on resume** — don't assume the user remembers everything
3. **Git-backed** — survives machine restarts, shareable across machines
4. **Language-agnostic** — works for any coding task, in any language

## Source

Full source and installation guide: https://github.com/texiwustion/interrupt-skill
