---
name: list-skills
description: List all installed Claude Code skills with their descriptions and usage. Use when the user says "list skills", "show skills", "what skills do I have", or "available skills".
license: MIT
metadata:
  author: user
  version: "1.0.0"
---

# List Skills

Lists all installed Claude Code skills with their functionality and how to use them.

## How It Works

1. Scans ~/.claude/skills/ directory for installed skills
2. Reads each skill's SKILL.md to extract name and description
3. Presents a formatted summary of all available skills

## Usage

```bash
bash ~/.claude/skills/list-skills/scripts/list-skills.sh
```

## Present Results to User

After running the script, present the skills in this format:

### Installed Skills

For each skill found, display:

**{skill-name}**
- Description: {description from SKILL.md}
- Invoke with: `/{skill-name}`

### Example Output

**development**
- Description: Autonomous feature development using structured phases, parallel subagents, task system coordination, and backpressure-driven implementation. Auto-installs damage-control hooks for safety. Includes TDD mode, security review, and hierarchical agent spawning.
- Invoke with: `/development`
- Key features: 9-phase workflow, task dependency graphs, parallel sub-agents, damage control integration

**damage-control**
- Description: Defense-in-depth protection system. Blocks dangerous commands (rm -rf, git reset --hard, AWS/GCP destructive ops) and protects sensitive files via PreToolUse hooks.
- Invoke with: `/damage-control`
- Key features: Command pattern blocking, path protection (zeroAccess, readOnly, noDelete), ask confirmations

**paper-to-code**
- Description: Transforms research papers (PDFs, URLs, arXiv links) into production-ready Python code implementations with tests and documentation.
- Invoke with: `/paper-to-code`
- Key features: Paper analysis, algorithm extraction, code generation, comprehensive tests

**python-quality**
- Description: Enforces Python code quality guidelines including algorithmic efficiency, type hints, docstrings, proper error handling, and security best practices.
- Invoke with: `/python-quality`
- Key features: Uses uv, polars, ruff, mypy, and pytest

**jean-zay**
- Description: Run projects on Jean Zay supercomputer (IDRIS). Sync code, generate Slurm scripts, submit training jobs, monitor status, and pull results. Supports Ray Tune on V100, A100, and H100 GPUs.
- Invoke with: `/jean-zay [sync|submit|status|pull|generate|package]`
- Key features: Slurm templates, rsync helpers, job monitoring, multi-node Ray support

**vercel-deploy-claimable**
- Description: Build and deploy web UI projects (React, Vue, Svelte, Next.js) to Vercel cloud or locally.
- Invoke with: `/vercel-deploy-claimable`
- Key features: Framework auto-detection, cloud deployment, local dev serving

**list-skills**
- Description: Lists all installed Claude Code skills with descriptions and usage.
- Invoke with: `/list-skills`

## Skill Relationships

```
development ──depends on──▶ damage-control (auto-installs if missing)
     │
     └── Uses: code-explorer, code-architect, test-generator,
               test-runner, code-reviewer, security-reviewer agents
```

## Notes

- Skills are installed in ~/.claude/skills/
- Each skill has a SKILL.md file with its full documentation
- Use `/{skill-name}` to invoke any skill
- Read individual SKILL.md files for detailed usage instructions
- Some skills have sub-commands (e.g., `/jean-zay sync`)
