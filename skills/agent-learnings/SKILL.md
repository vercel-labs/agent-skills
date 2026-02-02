---
name: agent-learnings
description: Extract agent self-improvement insights from session history. For AGENT audience — what I did wrong, what to do differently, behavioral corrections. Creates dated changelog of agent learnings. Use when reflecting on failures, updating agent behaviors, or improving agent performance.
---

# Agent Learnings (For Agent Self-Improvement)

Analyze session history to extract what I (the agent) need to do differently. Output is written for future agent instances to learn from.

## Audience

**Primary:** Future versions of me (agent instances)
**Purpose:** Self-correction, behavioral improvement, avoiding repeated mistakes

## State Tracking

**State file:** `memory/agent-learnings-state.json`

```json
{
  "lastRun": "2026-02-02",
  "lastOutputPath": "memory/changelog/agent/2026-02-02.md",
  "totalRuns": 1
}
```

## Output Location

`memory/changelog/agent/YYYY-MM-DD.md` (or configure via state file)

## Pattern Extraction

Focus on:
- **Corrections received** — What human had to fix
- **Repeated mistakes** — Patterns that keep failing
- **Explicit rules** — "Always do X" / "Never do Y"
- **Failure counts** — Tracked failures with numbers

## Output Format

```markdown
# Agent Self-Improvement Log: YYYY-MM-DD

> **Previous:** [[YYYY-MM-DD]]
> **Coverage:** [date range]

## Corrections This Period

| What I Did Wrong | What To Do Instead | Frequency |
|------------------|-------------------|-----------|
| Tested via curl only | Browser test required | 30x reminded |

## Detailed Corrections

### [Category]: [Issue]

**My mistake:** What I was doing
**Human signal:** Quote showing frustration/correction
**Correct behavior:** What to do instead
**Where documented:** MEMORY.md / TOOLS.md / SOUL.md

## Updated Behaviors

- [ ] Behavior change committed to [file]
- [ ] Failure tracker updated

## Reminders for Next Session

(Critical items to surface at session start)
```

## Process

1. Read state file for last run date (create if doesn't exist)
2. Scan memory files and session history since last run
3. Look for correction signals:
   - "No, I meant..."
   - "That's not right..."
   - "I've told you X times..."
   - Repeated instructions on same topic
4. Extract agent mistakes and correct behaviors
5. Write changelog in agent-focused voice
6. Update MEMORY.md, TOOLS.md with behavioral changes
7. Update state file

## Example Signals to Extract

**Frustration indicators:**
- "Why did you..."
- "I already said..."
- "???" (confusion markers)
- Short, curt responses after agent output

**Explicit feedback:**
- "Always do X"
- "Never do Y"
- Direct statements about preferences

**Success patterns** (to reinforce):
- "Perfect", "Great", "Exactly"
- Long productive sessions without correction
