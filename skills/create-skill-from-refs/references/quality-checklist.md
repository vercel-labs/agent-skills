# Quality Checklist for Agent Skills

Run through this checklist after scaffolding a skill. Every item must pass
before presenting the skill for final review.

---

## Structural checks

- [ ] `SKILL.md` exists at skill root
- [ ] `SKILL.md` has YAML frontmatter with `---` delimiters
- [ ] `name` field: lowercase, hyphens only, max 64 chars
- [ ] `name` field matches the parent folder name exactly
- [ ] `description` field: non-empty, max 1024 chars
- [ ] `SKILL.md` body is under 500 lines
- [ ] No empty directories (every dir has at least one file)
- [ ] No Windows-style paths (`\`) — use `/` everywhere

## Description quality

- [ ] Written in **third person** (not "I can..." or "You can...")
- [ ] Includes **WHAT** — specific capabilities, not vague
- [ ] Includes **WHEN** — trigger scenarios with concrete terms
- [ ] Contains keywords a user would actually say
- [ ] Does NOT include time-sensitive language ("before August 2025...")

## Content quality

- [ ] Only includes information the agent **doesn't already know**
  - General programming knowledge → omit
  - Well-documented public APIs → omit or summarize
  - Domain-specific rules, conventions, decisions → include
- [ ] Consistent terminology throughout (one term per concept)
- [ ] Tables used for structured data (not prose lists)
- [ ] Code examples are concrete and runnable, not abstract pseudocode
- [ ] No verbose explanations of obvious concepts

## Progressive disclosure

- [ ] SKILL.md is a **dispatcher**, not a dump — it routes to supporting files
- [ ] Every reference file is linked **directly** from SKILL.md (routing table
  or inline link) — no multi-hop chains
- [ ] Supporting files are focused: each covers one topic, under ~300 lines
- [ ] Supporting files have "See Also" cross-references where relevant

## Archetype compliance

### Knowledge Hub
- [ ] Routing table maps questions → reference file paths
- [ ] Applicability gate with "Apply when" and "Do NOT apply when"
- [ ] Procedure section with numbered steps
- [ ] Confirmation policy defined

### Tool Runner
- [ ] Decision table maps input patterns → script invocations
- [ ] Output contract defines the expected output format
- [ ] Composition table shows how this skill feeds into others
- [ ] Delegation guidance (when subagent vs direct) if output can be verbose

### Workflow Executor
- [ ] Steps are numbered and sequential
- [ ] Each step has concrete code/command examples
- [ ] At least one complete worked example
- [ ] Quick reference table at the bottom

## Scripts (if present)

- [ ] Each script has a usage comment block at the top
- [ ] Scripts are self-contained (bash + standard tools)
- [ ] Scripts handle errors explicitly (`set -euo pipefail` or equivalent)
- [ ] Scripts output structured data (JSON preferred)
- [ ] Scripts are marked executable
- [ ] SKILL.md makes clear whether to **execute** or **read** each script

## Anti-patterns to reject

| Anti-pattern | What to do instead |
|---|---|
| Name is `helper`, `utils`, `tools` | Use a descriptive name: `processing-pdfs` |
| Description says "Helps with..." | State what it does: "Processes PDF files..." |
| SKILL.md > 500 lines | Move content to references/assets |
| Multiple tools offered without a default | Pick one default, mention alternatives as escape hatch |
| Explaining what LLMs already know | Remove — only include domain-specific knowledge |
| Deeply nested references (A → B → C) | Flatten — link directly from SKILL.md |
| Empty directories in the tree | Remove them |
| Generic code examples with `foo`/`bar` | Use realistic examples from the user's domain |
