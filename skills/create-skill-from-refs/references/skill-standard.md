# Cursor Agent Skills — Standard Reference

Condensed from the official Cursor documentation. Only what matters for
authoring skills is included here.

## Required frontmatter

```yaml
---
name: my-skill          # lowercase, hyphens, max 64 chars, MUST match folder name
description: >-         # max 1024 chars, non-empty
  What the skill does. When to use it.
---
```

## Optional frontmatter

| Field | Type | Purpose |
|---|---|---|
| `license` | string | License name or reference to bundled LICENSE file |
| `compatibility` | list | Prerequisites: system packages, network, runtimes |
| `metadata` | map | Arbitrary key-value pairs (domain, framework, project) |
| `disable-model-invocation` | bool | `true` → slash-command only, never auto-invoked |

## Discovery mechanism

Cursor reads skill descriptions at startup and presents them to the agent.
The agent decides relevance based on the `description` field — this is the
**only** text the agent sees before deciding to load the skill.

Auto-discovery paths (checked in order):

| Location | Scope |
|---|---|
| `.agents/skills/` | Project |
| `.cursor/skills/` | Project |
| `~/.cursor/skills/` | Global (all projects) |

Compatibility aliases: `.claude/skills/`, `.codex/skills/` and their `~/` variants.

## Directory conventions

```
skill-name/
├── SKILL.md          # Required — main instructions
├── references/       # On-demand docs the agent reads when needed
├── assets/           # Static resources: templates, data, checklists
└── scripts/          # Executable code the agent can run
```

Only create directories that will contain files.

## Progressive disclosure

- `SKILL.md` is loaded when the skill is invoked. Keep it under **500 lines**.
- Files in `references/` and `assets/` are loaded **on demand** — only when
  the agent follows a link from SKILL.md.
- Keep references **one link deep** from SKILL.md. The routing table in
  SKILL.md should provide direct paths to every reference file. Deeply nested
  chains (SKILL → ref-A → ref-B) risk partial reads.

## Description rules

1. **Third person** — the description is injected into the system prompt.
   - Yes: "Deploys the application to staging environments."
   - No: "I can deploy..." or "You can use this to deploy..."
2. **WHAT + WHEN** — state capabilities AND trigger scenarios.
3. **Specific trigger terms** — include keywords the user would say.

Formula: `<verb-phrase of capabilities>. Use when <trigger 1>, <trigger 2>.`

## Name rules

- Lowercase letters, numbers, hyphens only
- Max 64 characters
- Must match the parent folder name exactly
- Must be descriptive: `processing-pdfs`, not `helper`

## Scripts

- Any language (bash, python, JS) supported by the agent's runtime
- Referenced in SKILL.md via relative paths from the skill root
- The agent reads instructions in SKILL.md and executes referenced scripts
- Make clear whether the agent should **execute** or **read** a script
