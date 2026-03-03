---
name: skill-registry
description: >-
  Manage the agent-skills registry: import skills from project repos, deploy
  (sync) skills to global or project targets, list installed skills with
  version drift, and bump skill versions. Use when the user says import a
  skill, sync skills, deploy skills, list skills, bump skill version, or
  mentions skill-registry.
---

# Skill Registry Manager

Central tool for versioning and deploying Agent Skills across Cursor,
Claude, and project workspaces.

## Applicability Gate

Use this skill when ANY of the following are true:

- Importing a skill from a project's `.cursor/skills/` into this repo
- Deploying/syncing skills to `~/.cursor/skills/`, `~/.agents/skills/`, etc.
- Listing skills and checking version drift between repo and installed copies
- Bumping a skill's version (patch, minor, major)
- Adding a new skill entry to the registry

## Key Files

| File | Purpose |
|------|---------|
| `skill-registry.json` | Central manifest — every skill's version, author, scope, targets |
| `scripts/skill-sync.sh` | Deploy skills to target paths |
| `scripts/skill-version.sh` | Bump version in registry + metadata.json + SKILL.md |
| `scripts/skill-import.sh` | Import a skill from an external project |

## Commands

### /skill-ls — List skills and deploy status

Shows all registered skills, their versions, and whether the installed
copies are up-to-date, outdated, or missing.

```bash
bash scripts/skill-sync.sh --list
```

To filter:
```bash
bash scripts/skill-sync.sh --list --scope=global
bash scripts/skill-sync.sh --list --target=cursor
```

### /skill-sync — Deploy skills to targets

Deploys skills from `skills/` to their configured target paths
(`~/.cursor/skills/`, `~/.agents/skills/`, etc.).

```bash
# Deploy all skills
bash scripts/skill-sync.sh

# Deploy a single skill
bash scripts/skill-sync.sh --skill=tdd-classicist

# Preview what would happen
bash scripts/skill-sync.sh --dry-run

# Force redeploy even if versions match
bash scripts/skill-sync.sh --skill=commit-hygiene --force
```

Each skill in `skill-registry.json` declares:
- **scope**: `global` (deploy to home dirs) or `project` (deploy to project `.cursor/skills/`)
- **targets**: array of `cursor`, `agents`, `claude` — mapped to paths in `targetPaths`

The sync uses `rsync` to copy skill files. It excludes `rules/` (build
source) and `README.md` (repo-only docs) from the deployed copy.

### /skill-import — Import a skill from a project

Copies a skill from a project's `.cursor/skills/<name>/` into this repo's
`skills/<name>/`, creates `metadata.json` if missing, and registers it in
`skill-registry.json`.

```bash
bash scripts/skill-import.sh <project-path> <skill-name> [options]
```

**Options:**
- `--author=NAME` — author field (default: felipeblassioli)
- `--scope=SCOPE` — global or project (default: global)
- `--targets=LIST` — comma-separated: cursor,agents,claude (default: cursor)
- `--tags=LIST` — comma-separated tags for categorization
- `--force` — overwrite if skill already exists in repo
- `--dry-run` — preview only

**Example:**
```bash
bash scripts/skill-import.sh ~/dev/tmp/tguard-riskEngineV2 commit-hygiene \
  --tags=git,conventions,pr
```

**After importing:**
1. Review the imported files in `skills/<name>/`
2. Verify/edit `metadata.json` (version, abstract, references)
3. Deploy: `bash scripts/skill-sync.sh --skill=<name>`
4. Commit: `git add skills/<name> skill-registry.json`

### /skill-version — Bump a skill version

Increments the version in three places: `skill-registry.json`,
`metadata.json`, and the SKILL.md frontmatter.

```bash
bash scripts/skill-version.sh <skill-name> [patch|minor|major]
```

Defaults to `patch` if no bump type is given.

**Example:**
```bash
bash scripts/skill-version.sh firebase-functions-node minor
# 1.0.0 -> 1.1.0
```

## Workflow: Import from Project → Repo → Deploy

The typical flow for extracting a project-local skill into the registry:

1. **Import**: `bash scripts/skill-import.sh ~/dev/project skill-name --tags=...`
2. **Review**: Check `skills/skill-name/` — edit metadata.json if needed
3. **Commit**: `git add skills/skill-name skill-registry.json && git commit -m "feat(skills): import skill-name"`
4. **Deploy**: `bash scripts/skill-sync.sh --skill=skill-name`
5. **Verify**: Open a new Cursor window — the skill should appear in the agent's available skills

## Workflow: Update an Existing Skill

1. Edit the skill files in `skills/<name>/`
2. Bump version: `bash scripts/skill-version.sh <name> patch`
3. Commit the changes
4. Deploy: `bash scripts/skill-sync.sh --skill=<name>`

## Registry Schema

Each entry in `skill-registry.json`:

```json
{
  "skill-name": {
    "version": "1.0.0",
    "author": "felipeblassioli",
    "scope": "global",
    "targets": ["cursor", "agents"],
    "tags": ["testing", "tdd"],
    "description": "Short description for humans",
    "path": "optional/custom/path"
  }
}
```

- **path**: Optional. Overrides the default `skills/<name>` location. Used for
  nested skills like `claude.ai/vercel-deploy-claimable`.
- **targets**: Must be keys in the `targetPaths` map at the root of the registry.

## Confirmation Policy

- `/skill-sync` with `--dry-run` is safe and can run without confirmation
- `/skill-sync` without `--dry-run` overwrites files — confirm before running
- `/skill-import --force` overwrites an existing skill in the repo — confirm before running
- `/skill-version` modifies three files — show the diff after running
