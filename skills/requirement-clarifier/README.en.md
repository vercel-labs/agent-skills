# Requirement Clarifier · Three-Mode Triage

> **One-liner hook:** *Before you start, answer three questions — what does the user actually want, how complex is it, and where should you cut in.*

A three-mode triage station for ambiguous requests. It does not write code, write articles, or make decisions for you. It turns fuzzy intent into an executable spec, a task pile into a routed execution order, and an existing plan into an improvement checklist. Then it points to the next skill. It does not pick up the work itself.

This skill is a **router** that dispatches to three sub-skills:

- `growme-mode` — clarify vague intent into a spec
- `change-mode` — triage a task pile into a routed execution plan
- `improve-mode` — audit an existing plan into an improvement checklist

---

## What problem it solves

A request comes in: *"I want to make an AI teaching skill."*

90% of agents start working immediately. They then spend **three hours redoing what three minutes of clarification would have settled**.

Or: *"I have 8 skills to polish, which first?"* You do them in filename order. Skill 8 turns out to be P0 — the first seven were wasted.

Or: a written spec gets sent to a colleague, who asks *"what do you actually want?"* — and you can't answer either.

This skill does not write code, write articles, or make decisions. It does **one thing**: triage. Turn vague, piled-up, and unclear requests into **executable specs first**, then route to concrete execution skills.

It is composed of three sub-modes, auto-routed by your question type:

- **`growme-mode`** — turn vague intent into a spec
- **`change-mode`** — turn a task pile into a routed execution plan
- **`improve-mode`** — turn an existing plan into an improvement checklist

This is a **suite**, not a single SKILL.md. The three sub-modes each have their own SKILL.md and references, and can be used independently.

---

## Quick start

```bash
# One-line install (to be published)
npx skills add yingzhengzhang06-sys/requirement-clarifier
```

Then ask the agent:

```text
Use requirement-clarifier to triage "I want to build a 21-day AI writing bootcamp" and tell me how to start.
```

Claude Code plugin marketplace dual channel:

```json
{
  "plugin": "requirement-clarifier",
  "source": "yingzhengzhang06-sys/requirement-clarifier"
}
```

---

## When to use it

**Strong triggers (call directly):**
- "Help me think this through / how do I start / I have an idea" → `growme-mode`
- "How should I prioritize these / which one first / help me triage" → `change-mode`
- "How to optimize / what else is missing / review my plan" → `improve-mode`

**Weak triggers (call when context contains "uncertainty"):**
- A one-line request with no acceptance criteria
- A task pile with no stated dependencies
- An existing plan where the user feels "something is off"
- Multiple people describing the same goal inconsistently

**Do not use:**
- Information is fully clear → just start
- A single small question → use `AskUserQuestion`
- It is already a specific domain question → route to a domain skill

---

## What it does NOT do

- ❌ Does not execute — this is a triage station, not an operating room
- ❌ Does not "use for the sake of using" — when information is clear, just start
- ❌ Does not assume any domain — works for frontend, backend, content, business
- ❌ Does not route back to itself — triage must point to another skill

**When it stops to ask the user:**
- Information gaps > 5 → ask in batches
- Task dependencies unclear → ask user to confirm
- Improvement checklist > 7 items → ask user to pick the highest-leverage ones

---

## Sample outputs

### Sample 1: growme mode (clarification)

**Input:**
> User: I want to build an AI teaching skill

**Output** (excerpt):
```text
[Requirement Spec]

🎯 Goal: Build 1 AI teaching skill case for 35-45 year-old career-changers in 3 months

👥 Audience: 35-45 year-old career-changers, alarmed by AI replacement risk, want to ship quickly

⛓ Constraints: 3-month timeline; budget under ¥10K; zero technical background

📥 Input materials: Topic only, no draft

✅ Acceptance: DAU 100 + at least 1 paid conversion

🚫 Boundary (v1 will not): No paid bootcamp / no multi-platform distribution

⚠️ Risk: Audience definition unclear → fallback: 1 real user interview to lock down

📌 Key assumption: Target users are willing to pay for "case work"

[Next route]
- Task pile unclear → load `change-mode` to prioritize
- Task clear → route to `skill-creator`
```

### Sample 2: change mode (triage)

**Input:**
> User: Today I need to do 5 things: write a WeChat post, write a Xiaohongshu post, polish a SKILL.md, take a meeting with an investor, clear my desk

**Output** (excerpt):
```text
| # | Task | Complexity | Impact | Urgency | Uncertainty | Priority | Route to |
|---|------|------------|--------|---------|-------------|----------|----------|
| 1 | Investor meeting | Small | High | High | Medium | P0 | Just do it |
| 2 | Polish the most critical SKILL.md | Large | Medium | Low | High | P0 | `skill-creator` (high uncertainty → prioritize) |
| 3 | Write WeChat post | Medium | High | Medium | Low | P1 | `original-writing` |
| 4 | Write Xiaohongshu post | Medium | High | Medium | Medium | P1 | `ad-copywriting` |
| 5 | Clear desk | Small | Low | Low | Low | P3 | Cut / weekend |

Total: 3 days (vs. 5 days serial)
```

### Sample 3: improve mode (audit)

**Input:**
> User: Take a look at this SKILL.md — is it written right?

**Output** (excerpt):
```text
[Improvement checklist] sorted by leverage

🔴 P0 (must fix):
1. Frontmatter missing negative trigger list
   → Add "do not use" section to description
   → Cost: 15 min | Acceptance: description contains "do not use" section

2. Workflow Step 3 too coarse
   → Break 3 steps into 6, each with a specific action
   → Cost: 30 min

🟡 P1 (should fix):
1. Missing Gotchas section → add 5 anti-patterns
2. Missing test-prompts.json → create 6 live samples

Do you want me to fix this directly, or do it yourself?
```

More anti-pattern samples in [`examples/`](examples/).

---

## How it differs from similar skills

| Dimension | Similar (mattpocock / obra / addyosmani) | This skill |
|---|---|---|
| Mode | Single clarification (grill-me / brainstorming) | **Three-mode unified** (growme + change + improve) |
| Routing | Direct to plan / write code | **Routes to specific execution skills** (30+ skill routing table) |
| Language | English-first | **Native Chinese scenarios**, cross-runtime neutral |
| Form | Single SKILL.md | **Suite**: 3 independent sub-skills + router |
| Output | Free-form text | **Structured output templates** (spec / triage table / improvement list) |
| Verification | Missing | **8 test-prompts.json live samples** + 5 self-checks |

**Key differentiator**: This skill publishes a **30+ skill routing table** — installing it is installing a "full skill routing map."

---

## File structure

```
requirement-clarifier/                  ← Suite root
├── SKILL.md                            ← Router main entry
├── growme-mode/                        ← Sub-mode 1: clarification
│   ├── SKILL.md
│   └── references/
│       ├── seven-dimensions.md         ← 7 questioning dimensions
│       ├── ask-question-toolkit.md     ← AskUserQuestion usage
│       └── red-flags.md                ← Fake-clarification anti-patterns
├── change-mode/                        ← Sub-mode 2: triage
│   ├── SKILL.md
│   └── references/
│       ├── complexity-rubric.md        ← Complexity ruler
│       ├── priority-matrix.md          ← P0/P1/P2/P3 matrix
│       ├── routing-table.md            ← 30+ skill routing table
│       ├── parallel-dependency.md      ← Dependencies and parallelism
│       └── red-flags.md                ← Fake-triage anti-patterns
├── improve-mode/                       ← Sub-mode 3: improvement
│   ├── SKILL.md
│   └── references/
│       ├── seven-leverage-points.md    ← 7 improvement categories
│       ├── smart-criteria.md           ← SMART principle
│       └── red-flags.md                ← Fake-improvement anti-patterns
├── examples/                           ← Anti-pattern samples
│   ├── fake-clarification.md
│   ├── fake-triage.md
│   └── fake-improve.md
├── test-prompts.json                   ← 8 live test samples
├── README.md                           ← This file
├── LICENSE                             ← MIT
└── .claude-plugin/
    └── marketplace.json                ← Plugin dual channel
```

---

## Verification & tests

Run 8 live test prompts:

```bash
# TC-01: growme fuzzy request → must ask ≤ 5 questions, not give plan directly
# TC-02: change multi-task → must sort by P0/P1/P2/P3, each routed to a specific skill
# TC-03: improve audit → must give ≤ 7 SMART improvements sorted by leverage
# TC-04: Serial mode → growme → change serial
# TC-05: Boundary → do not call when info is clear
# TC-06: Full triage sample → verify output format
# TC-07: Suite routing → router should dispatch to sub-skill
# TC-08: Three-mode anti-pattern → must identify at least 1 fake-mode each
```

See `test-prompts.json` for details.

---

## Compatibility

Cross-runtime neutral:

- Claude Code (Skill tool)
- Codex (codex exec)
- OpenCode (provider call)
- OpenClaw (openclaw run-agent)
- Hermes (hermes-agent CLI)

---

## Safety boundaries

**Will not do:**
- ❌ Does not execute — this is a triage station, not an operating room
- ❌ Does not "use for the sake of using" — when info is clear, just start
- ❌ Does not assume any domain
- ❌ Does not route back to itself

**Will stop to ask the user:**
- Information gaps > 5 → ask in batches
- Task dependencies unclear → ask user to confirm
- Improvement checklist > 7 items → ask user to pick the highest-leverage ones

---

## Credits

- **Methodology source**: [Luban Workshop](https://github.com/yingzhengzhang06-sys) (luban) eight-step polishing workflow
- **Core references**:
  - [mattpocock/skills — grill-me](https://github.com/mattpocock/skills) — Minimal frontmatter + recommended answers
  - [addyosmani/agent-skills — interview-me](https://github.com/addyosmani/agent-skills) — "Echo user verbatim" termination condition
  - [obra/superpowers — brainstorming](https://github.com/obra/superpowers) — Anti-Pattern golden lines
  - [garrytan/gstack — office-hours](https://github.com/garrytan/gstack) — Auto/manual decision split

---

## License

[MIT](LICENSE)

---

<div align="center">

*Workshop rule: check material first, then act; visit the market first, then talk differentiation; measure first, then decide what to keep.*

</div>
