---
name: create-skill-from-refs
description: >-
  Create Cursor Agent Skills from user-provided reference material (documents,
  code, examples, URLs). Guides through intake, archetype selection, scaffolding,
  and reference distillation into a well-structured skill package. Use when the
  user asks to create a skill, write a SKILL.md, or package domain knowledge
  into a reusable skill — especially when they provide reference documents or
  code as context. Invoke explicitly via /create-skill-from-refs.
disable-model-invocation: true
---

# Create Skill from References

Transform user-provided reference material into well-structured Cursor Agent
Skills. This skill enforces progressive disclosure, archetype-aware templates,
and a quality gate — producing skills that are precise, minimal, and effective.

## Phase 1 — Intake

Collect and classify every piece of reference material the user provides.

### Material classification

| Material type | Classification | Destination |
|---|---|---|
| Domain knowledge, specs, methodology | Core knowledge | `references/` |
| Lookup tables, matrices, glossaries | Quick reference | `assets/quickref/` |
| Decision procedures, flowcharts | Decision tree | `assets/decision-trees/` |
| Output format examples, templates | Templates | `assets/` |
| Checklists, review guides | Checklists | `assets/checklists/` |
| Executable automation, validators | Scripts | `scripts/` |
| Code examples (illustration only) | Inline | Embed in relevant `references/*.md` |

### Reading provided material

1. Read each piece fully.
2. Classify using the table above.
3. **Distill** — extract high-signal content; strip boilerplate, redundancy,
   and anything the agent already knows.
4. Note cross-references between pieces.

Present the intake summary:

```markdown
## Intake Summary

| # | Source | Classification | Key content | Destination |
|---|--------|---------------|-------------|-------------|
| 1 | @requirements.md | Core knowledge | Auth flow spec | references/auth-flow.md |
| 2 | @scripts/deploy.sh | Script | Deploy pipeline | scripts/deploy.sh |
```

**PAUSE — Wait for user confirmation before proceeding.**

## Phase 2 — Archetype Selection

Choose the archetype that best fits the classified material.

| Archetype | Signal | SKILL.md role |
|---|---|---|
| **Knowledge Hub** | Mostly references, taxonomies, decision trees | Dispatcher — routing table maps questions to reference files |
| **Tool Runner** | Centered on scripts/commands with decision logic | Controller — decision table maps inputs to script invocations |
| **Workflow Executor** | Sequential steps the agent follows end-to-end | Playbook — numbered steps with inline guidance |
| **Hybrid** | Mix of the above | Start from dominant archetype, incorporate patterns from others |

For detailed patterns and real examples:
[references/archetype-patterns.md](references/archetype-patterns.md)

**PAUSE — Present archetype recommendation with rationale. Wait for confirmation.**

## Phase 3 — Scaffolding

### 3.1 Name and location

- Name: lowercase, hyphens only, max 64 chars, descriptive (never `helper`, `utils`, `tools`)
- Default location: `.cursor/skills/<name>/` (project) — ask if global (`~/.cursor/skills/`) is preferred
- The `name` frontmatter field MUST match the folder name

### 3.2 Directory structure

Create only directories that will have content:

```bash
mkdir -p "<skill-path>"
# Add subdirectories per classified material — never create empty dirs
```

### 3.3 Write SKILL.md

Load the archetype template from [assets/templates/](assets/templates/):

- Knowledge Hub → [assets/templates/knowledge-hub.md](assets/templates/knowledge-hub.md)
- Tool Runner → [assets/templates/tool-runner.md](assets/templates/tool-runner.md)
- Workflow Executor → [assets/templates/workflow-executor.md](assets/templates/workflow-executor.md)

Fill in every section. Key rules:

**Frontmatter**
- `description`: MUST include WHAT (capabilities) + WHEN (trigger scenarios). Third person. Specific trigger terms.
- Optional fields: `license`, `compatibility` (prerequisites), `metadata` (domain, framework).
- Set `disable-model-invocation: true` for slash-command-only skills.

**Description formula**: `<verb-phrase of what it does>. <verb-phrase of secondary capability>. Use when <trigger scenario 1>, <trigger scenario 2>, or <trigger scenario 3>.`

**Body** — follow the archetype template. Key sections vary by archetype:

| Section | Knowledge Hub | Tool Runner | Workflow Executor |
|---|:---:|:---:|:---:|
| Applicability gate | ✓ | ✓ | — |
| Routing table | ✓ | — | — |
| Decision table | — | ✓ | — |
| Numbered workflow | — | — | ✓ |
| Procedure | ✓ | ✓ | implicit |
| Output contract | optional | ✓ | optional |
| Composition table | optional | ✓ | optional |
| Confirmation policy | ✓ | optional | ✓ |
| Quick reference | optional | ✓ | ✓ |

### 3.4 Write supporting files

For each classified piece of material:

1. **Distill** — high-value, precise content only. If the agent already knows
   it (general programming, well-known APIs), omit it.
2. **Structure** — headers, tables, code blocks. Match the archetype style.
3. **Cross-reference** — add "See Also" linking related files within the skill.
4. **Size** — each file should be focused. Split at ~300 lines.

### 3.5 Write scripts (if applicable)

Scripts MUST be:

- Self-contained (bash + standard tools: jq, rg, yq)
- Have a usage comment block at the top
- Handle errors with explicit messages
- Output structured data (JSON preferred) for agent consumption

```bash
#!/usr/bin/env bash
# Usage: scripts/example.sh <arg1> [arg2]
# Description: One-line purpose
set -euo pipefail
```

Mark executable: `chmod +x scripts/*.sh`

## Phase 4 — Quality Gate

Run the validation script against the new skill:

```bash
bash "<this-skill-path>/scripts/validate-skill.sh" "<new-skill-path>"
```

Then verify the full checklist:
[references/quality-checklist.md](references/quality-checklist.md)

For the condensed Cursor skill standard (field constraints, directory rules):
[references/skill-standard.md](references/skill-standard.md)

**PAUSE — Present the complete skill for final review.**

## Confirmation Points

| Phase | Present to user | Wait for |
|---|---|---|
| After intake | Intake summary table | Material classification approval |
| After archetype | Archetype + rationale | Archetype approval |
| After scaffolding | Complete file tree + SKILL.md draft | Content approval |
| After quality gate | Validation results + checklist | Final sign-off |

Do NOT write files until the corresponding phase is approved.
