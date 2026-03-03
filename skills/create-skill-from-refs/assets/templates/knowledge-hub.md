# Knowledge Hub Template

Use this template when the skill is primarily reference material, taxonomies,
decision trees, or domain knowledge that the agent dispatches to on demand.

---

```markdown
---
name: SKILL_NAME
description: >-
  WHAT_IT_DOES. SECONDARY_CAPABILITY. Use when TRIGGER_1, TRIGGER_2,
  or TRIGGER_3. Do NOT use for EXCLUSION_1 (see OTHER_SKILL).
---

# SKILL_TITLE

ONE_LINE_PURPOSE_STATEMENT.

## Applicability Gate

Apply this skill when ANY of the following are true:

- CONDITION_1
- CONDITION_2
- CONDITION_3

Do NOT apply when:

- EXCLUSION_1 → route to **OTHER_SKILL_NAME**
- EXCLUSION_2 → route to **OTHER_SKILL_NAME**

## Routing Table

| Question | Route to |
|----------|----------|
| "QUESTION_1?" | [references/REF_1.md](references/REF_1.md) |
| "QUESTION_2?" | [references/REF_2.md](references/REF_2.md) |
| "QUESTION_3?" | [assets/quickref/LOOKUP.md](assets/quickref/LOOKUP.md) |
| "QUESTION_4?" | [assets/decision-trees/DECIDE.md](assets/decision-trees/DECIDE.md) |
| "QUESTION_5?" | [assets/checklists/CHECK.md](assets/checklists/CHECK.md) |

## Procedure

1. **Identify the task type.** What is the user trying to do?
2. **Route to the right reference.** Use the routing table above.
   Read only the reference file(s) needed — do not load all.
3. **Apply the methodology.** Follow the normative rules from the
   loaded reference.
4. ADDITIONAL_STEP_IF_NEEDED.

## Confirmation Policy

Do NOT apply changes derived from these rules without explicit user
confirmation. Present proposed changes as diffs and wait for approval.

## Related Skills

- **OTHER_SKILL_1** — HOW_IT_RELATES
- **OTHER_SKILL_2** — HOW_IT_RELATES
```

---

## Guidance

- The routing table is the core of this template. Every reference file must
  appear in the routing table.
- Questions in the routing table should use the user's natural language
  ("How do I...?", "What should I...?").
- The procedure section should be short (3-6 steps). The real depth lives in
  the reference files.
- If the skill has >10 routing entries, group them with subheadings.
