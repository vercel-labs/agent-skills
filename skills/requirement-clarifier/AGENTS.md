# AGENTS.md · Requirement Clarifier (Three-Mode Triage)

> **Version 3.0.0** · yingzhengzhang06-sys · June 2026
>
> **Note:** This document is mainly for agents and LLMs to follow when handling ambiguous user requests. Humans may also find it useful, but guidance here is optimized for automated triage and routing.

---

## Abstract

Three-mode triage station for ambiguous requests. This skill does not write code, write articles, or make decisions — it does one thing: triage. It dispatches user input to one of three sub-modes based on the question type, then routes the result to a specific execution skill.

### Three Sub-Modes

1. **growme-mode** — turn vague intent into a requirement spec (clarification)
2. **change-mode** — turn a task pile into a routed execution plan (triage)
3. **improve-mode** — audit an existing plan into an improvement checklist (review)

The router does not execute. After clarification/triage/review, it points to another skill.

---

## When to Trigger

### Strong Triggers (call directly)

| User phrase | Route to |
|---|---|
| "Help me think this through / how do I start / I have an idea" | growme-mode |
| "How should I prioritize these / which one first / help me triage" | change-mode |
| "How to optimize / what else is missing / review my plan" | improve-mode |

### Weak Triggers (call when context contains uncertainty)

- A one-line request with no acceptance criteria
- A task pile with no stated dependencies
- An existing plan where the user feels "something is off"

### Do NOT Call When

- Information is fully clear → just start
- A single small question → use AskUserQuestion
- Already a specific domain question → route to that domain's skill

---

## How to Use

### Step 1: Detect Mode

Read the user's input. Match against the trigger table above. The mode is `growme`, `change`, or `improve`.

### Step 2: Load Sub-Skill

Load the corresponding `SKILL.md` from the `growme-mode/`, `change-mode/`, or `improve-mode/` directory.

### Step 3: Execute the Sub-Skill Workflow

Each sub-skill has its own 4-5 step workflow with output templates. Follow them strictly.

### Step 4: Route to Execution Skill

The sub-skill's output template ends with a "Next route" section pointing to a specific execution skill (e.g., `original-writing`, `skill-creator`, `coding-agent`).

### Step 5: Hand Off

Hand the user's task over to that execution skill. Do not execute the task yourself.

---

## Output Format

The router itself outputs:

```text
Mode judgment: growme / change / improve (combinable)

[growme] → Load growme-mode/SKILL.md (execute requirement clarification)
[change]  → Load change-mode/SKILL.md (execute task triage)
[improve] → Load improve-mode/SKILL.md (execute structural optimization)

Next route: [specific skill to hand off to / execute directly / clarify further]
```

---

## Boundaries (Will NOT Do)

- ❌ Does not execute — this is a triage station, not an operating room
- ❌ Does not "use for the sake of using" — when info is clear, just start
- ❌ Does not assume any domain — works for frontend, backend, content, business
- ❌ Does not route back to itself — triage must point to another skill

---

## When to Stop and Ask User

- Information gaps > 5 → ask in batches
- Task dependencies unclear → ask user to confirm
- Improvement checklist > 7 items → ask user to pick the highest-leverage ones

---

## Cross-Runtime Compatibility

Compatible with:

- Claude Code (Skill tool)
- Codex (codex exec)
- OpenCode (provider call)
- OpenClaw (openclaw run-agent)
- Hermes (hermes-agent CLI)

---

## License

MIT License. See `LICENSE` file.

---

## Credits

Methodology and polishing: Luban Workshop (luban) 8-step polishing workflow. Score: 90/100 on Luban 9-dimension rubric (3 independent-agent live replays + 1 cross-mode serial test).
