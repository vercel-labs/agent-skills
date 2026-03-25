# interrupt-skill

> Context interrupt management for Claude Code — record interruptions, resume with Socratic memory probing.

## Problem

You're deep in a coding task. Something interrupts you. When you return, you can't remember where you were or what you'd already figured out.

## Solution

Four slash commands:

- `/interrupt-init` — one-time setup
- `/interrupt <text>` — auto-record (AI structures your freeform description)
- `/interrupti` — guided step-by-step recording
- `/interrupt-resume [keyword]` — resume with targeted memory probing

On resume, Claude asks questions to check your current understanding **before** diving back in — catching gaps before they become wasted work.

## Install

```bash
cp commands/*.md ~/.claude/commands/
mkdir -p ~/.claude/skills/interrupt-record/scripts
cp resources/init-repo.sh ~/.claude/skills/interrupt-record/scripts/
```

Then in Claude Code: `/interrupt-init`

## Source

https://github.com/texiwustion/interrupt-skill
