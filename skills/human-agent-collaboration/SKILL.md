---
name: human-agent-collaboration
description: Extract insights for HUMANS on how to work effectively with AI agents. Analyzes interaction patterns to produce guides on what works, what doesn't, and how to set agents up for success. Use when asked "how do I work better with agents", "what have we learned about collaboration", or to produce human-readable documentation about agent interaction patterns.
---

# Human-Agent Collaboration Insights (For Human Audience)

Analyze session history to extract what YOU (the human) can learn about working effectively with AI agents. Output is written for humans to understand and apply.

## Audience

**Primary:** Humans working with AI agents
**Purpose:** Improve human-AI collaboration, set agents up for success, understand agent limitations

## State Tracking

**State file:** `memory/human-collaboration-state.json`

```json
{
  "lastRun": "2026-02-02",
  "lastOutputPath": "memory/changelog/human/2026-02-02.md",
  "totalRuns": 1
}
```

## Output Location

`memory/changelog/human/YYYY-MM-DD.md` (or configure via state file)

## Pattern Extraction

Focus on:
- **What worked** — Interactions that led to good outcomes
- **What didn't work** — Communication patterns that failed
- **Agent limitations** — Where agents consistently struggle
- **Effective techniques** — How human got agent to perform better
- **Meta-insights** — How agents think, process, remember

## Output Format

```markdown
# Working with AI Agents: Insights from [Date Range]

> **Previous:** [[YYYY-MM-DD]]
> **Coverage:** [date range]

## Key Insights This Period

### What Works

| Technique | Why It Works | Example |
|-----------|--------------|---------|
| Explicit failure tracking | Creates strong behavioral signal | "4x failure" changed behavior |

### What Doesn't Work

| Pattern | Why It Fails | Better Approach |
|---------|--------------|-----------------|
| Assuming agent remembers | Sessions are isolated | Write to files |

---

## Detailed Insights

### [Category]: [Insight Title]

**The pattern:** What you might naturally do
**Why it fails/works:** Agent cognition explanation  
**Better approach:** What to do instead
**Evidence:** Quote or example from sessions

---

## Agent Limitations to Know

- [Limitation and how to work around it]

## Effective Communication Patterns

- [Pattern: When to use, how to phrase]

## Recommendations

### Setting Agents Up for Success
1. [Actionable recommendation]

### Avoiding Common Frustrations
1. [What causes frustration → how to avoid]
```

## Process

1. Read state file for last run date (create if doesn't exist)
2. Scan memory files and session history since last run
3. Look for:
   - Successful collaboration patterns
   - Points of friction/frustration
   - Moments of insight about agent behavior
   - Techniques human used that worked
4. Reframe from agent-centric to human-centric
5. Write changelog in human-friendly voice
6. Update state file

## Voice Guidelines

**Don't say:** "I need to test in browser before reporting done"
**Do say:** "Agents may test via API and miss browser bugs — ask for browser verification explicitly"

**Don't say:** "I failed to include links 4 times"  
**Do say:** "Agents consistently forget to include clickable links — use explicit failure tracking to fix persistent issues"

The human shouldn't have to translate agent-speak. Write for someone learning to work with agents.

## Key Patterns to Surface

### Agent Cognition
- Context window attention is weighted (beginning/end > middle)
- Identity statements ("I am...") stick better than instructions ("Remember to...")
- Sessions are isolated — nothing persists unless written to files
- Task absorption causes instruction "forgetting" during complex work

### Common Agent Limitations
- Verification shortcuts (API vs browser testing)
- Link formatting blindness
- Memory optimism ("got it" without persisting)
- Platform awareness gaps

### Effective Human Techniques
- Explicit failure counting ("4x failure")
- Multi-location documentation (SOUL + TOOLS + MEMORY)
- Identity framing for critical behaviors
- Checkpoints during complex tasks
