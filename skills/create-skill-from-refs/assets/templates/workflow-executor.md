# Workflow Executor Template

Use this template when the skill is a sequential process the agent follows
end-to-end, with inline guidance at each step.

---

```markdown
---
name: SKILL_NAME
description: >-
  WHAT_IT_DOES. SECONDARY_CAPABILITY. Use when TRIGGER_1, TRIGGER_2,
  or TRIGGER_3.
compatibility:
  - PREREQUISITE_1
  - PREREQUISITE_2
---

# SKILL_TITLE

## Principles

- INVARIANT_1 (e.g., "All output in Brazilian Portuguese")
- INVARIANT_2 (e.g., "Preserve template markers exactly")
- INVARIANT_3 (e.g., "Use --body-file to avoid shell escaping")
- INVARIANT_4 (e.g., "Staged files are never deleted")

## Workflow

### 1. FIRST_STEP_NAME

DESCRIPTION_OF_WHAT_TO_DO.

\`\`\`bash
COMMAND_EXAMPLE
\`\`\`

### 2. SECOND_STEP_NAME

DESCRIPTION_OF_WHAT_TO_DO.

Run in parallel to gather context:

\`\`\`bash
COMMAND_1
COMMAND_2
COMMAND_3
\`\`\`

### 3. THIRD_STEP_NAME

DESCRIPTION_OF_WHAT_TO_DO.

#### Sub-section guidelines

Adapt depth to the situation:

| Situation | Guideline |
|-----------|-----------|
| Small / trivial | BRIEF_APPROACH |
| Medium | STANDARD_APPROACH |
| Complex / high-risk | THOROUGH_APPROACH |

Good patterns:
- PATTERN_1
- PATTERN_2
- PATTERN_3

### 4. FOURTH_STEP_NAME

\`\`\`bash
MAIN_COMMAND \
  --flag1 "VALUE" \
  --flag2 VALUE
\`\`\`

### 5. FIFTH_STEP_NAME (optional post-action)

POST_ACTION_DESCRIPTION.

## Complete example

File: `OUTPUT_PATH/EXAMPLE_FILE`

\`\`\`markdown
FULL_CONCRETE_EXAMPLE_OF_THE_WORKFLOW_OUTPUT
\`\`\`

## Quick reference

| Action | Command |
|--------|---------|
| ACTION_1 | `COMMAND_1` |
| ACTION_2 | `COMMAND_2` |
| ACTION_3 | `COMMAND_3` |
```

---

## Guidance

- The principles section sets invariants the agent must not violate. Keep it
  to 3-5 bullet points.
- Each workflow step should have a concrete code/command example.
- The complete example is high-value — a real, filled-in output the agent can
  pattern-match against. Invest effort here.
- The quick reference table is a cheat sheet for the agent to avoid re-reading
  the full workflow for common actions.
- If a step has conditional paths, use a sub-section with a situation table.
- If the workflow touches assets (templates, config files), store them in
  `assets/` and reference from the relevant step.
