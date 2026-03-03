# Tool Runner Template

Use this template when the skill centers on executing scripts or commands,
with decision logic for what to run based on context.

---

```markdown
---
name: SKILL_NAME
description: >-
  WHAT_IT_DOES. SECONDARY_CAPABILITY. Use when TRIGGER_1, TRIGGER_2,
  or the DOWNSTREAM_SKILL needs DATA_TYPE.
license: MIT
compatibility:
  - PREREQUISITE_1 (e.g., jq installed)
  - PREREQUISITE_2 (e.g., Docker running)
metadata:
  domain: DOMAIN
  framework: FRAMEWORK
  project: PROJECT
---

# SKILL_TITLE

Reference: `PATH_TO_ADR_OR_DESIGN_DOC` (if applicable)

## When to use this skill

- TRIGGER_SCENARIO_1
- TRIGGER_SCENARIO_2
- When the `DOWNSTREAM_SKILL` needs DATA_TYPE
- Before creating a commit or PR, to VERIFY_WHAT

## Decision table

Map INPUT_TYPE to ACTION:

| Input pattern | Action |
|---|---|
| `PATTERN_1` | COMMAND_OR_TIER_1 |
| `PATTERN_2` | COMMAND_OR_TIER_2 |
| `PATTERN_3` | COMMAND_1 + COMMAND_2 |
| Multiple patterns | MINIMUM_SET (+ extras if CONDITION) |

The `scripts/DETECT_SCRIPT.sh` automates this mapping:

\`\`\`bash
INPUT_COMMAND | scripts/DETECT_SCRIPT.sh
\`\`\`

## Delegation guidance

**Delegate** (use subagent) when:
- Output exceeds ~50 lines
- Long-running command (minutes)
- Parent agent is mid-task and needs results without losing context

**Use directly** (no subagent) when:
- Running a single targeted command
- Reading existing output files
- User explicitly asks to see raw output

## Output contract

When reporting results, use this format:

\`\`\`markdown
## REPORT_TITLE

- **Input:** WHAT_WAS_ANALYZED
- **Actions run:** ACTION_1, ACTION_2
- **Prerequisites:** SKIPPED_ITEMS_IF_ANY

### Results
| Action | Status | Detail |
|--------|--------|--------|
| ACTION_1 | PASS/FAIL | SUMMARY |
\`\`\`

## Composition with other skills

| Downstream skill | How to use together |
|---|---|
| `SKILL_1` | PASTE_WHAT_WHERE |
| `SKILL_2` | USE_AS_SIGNAL_FOR_WHAT |

## Utility scripts

All scripts live in [scripts/](scripts/) and are self-contained.

| Script | Purpose | Usage |
|--------|---------|-------|
| `SCRIPT_1.sh` | PURPOSE | `scripts/SCRIPT_1.sh ARG1 ARG2` |
| `SCRIPT_2.sh` | PURPOSE | `INPUT \| scripts/SCRIPT_2.sh` |

## Additional resources

- REFERENCE_1: [assets/ASSET.md](assets/ASSET.md)
- DESIGN_DOC: `path/to/doc.md`
```

---

## Guidance

- The decision table is the core of this template. It maps the space of
  possible inputs to concrete actions.
- Scripts should output JSON for structured consumption by the agent.
- The output contract is critical when other skills consume this skill's
  results (composition table).
- Delegation guidance is a Cursor-specific pattern — include it when scripts
  produce verbose output.
