# Contributing to Agent Skills

Thank you for contributing! This guide covers how to add new skills and update existing ones.

## Adding a New Skill

1. Create a directory under `skills/<your-skill-name>/`
2. Add a `SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: your-skill-name
   description: Short description of what the skill does
   ---
   ```
3. Add any supporting rule files, scripts, or resources
4. Update the root `README.md` to list your skill
5. Open a PR with the title: `feat: add <skill-name> skill`

## Updating an Existing Skill

### Patch Changes (bug fixes, typo corrections)
- Edit the relevant file(s) directly
- PR title: `fix(<skill-name>): <short description>`
- No version bump needed

### Minor Changes (new rules, expanded guidance)
- Add new rule files or extend existing ones
- PR title: `feat(<skill-name>): <short description>`
- Update the skill's `SKILL.md` description if scope changed

### Breaking Changes (restructuring, removed rules)
- Document what changed and why in the PR description
- Update any cross-references in `SKILL.md`
- PR title: `refactor(<skill-name>): <short description>`

## Skill Versioning

Skills follow **semantic versioning** (`MAJOR.MINOR.PATCH`) tracked in each skill's `metadata.json`:

| Change type | Version bump | Example |
|---|---|---|
| Bug fix, typo, clarification | `PATCH` | `1.0.0` → `1.0.1` |
| New rules, expanded guidance | `MINOR` | `1.0.0` → `1.1.0` |
| Restructured, removed rules, breaking | `MAJOR` | `1.0.0` → `2.0.0` |

**Rules:**
1. Every skill directory **must** have a `metadata.json` with a `version` field.
2. If the `SKILL.md` frontmatter has a `version:` field, it must match `metadata.json`.
3. CI enforces both of the above — PRs will fail if versions are missing or mismatched.

**Releasing a new version:**
1. Update the version in `metadata.json`
2. If `SKILL.md` frontmatter has `version:`, update it too
3. Add a `## Changelog` entry to the skill's `README.md`
4. CI will validate the format on PR

**Consumers** should pin to a commit SHA for stability, or use `main` for latest.

## PR Checklist

- [ ] `SKILL.md` has accurate `name` and `description` frontmatter
- [ ] No secrets or personal data in skill files
- [ ] Rules are actionable and specific (not vague guidance)
- [ ] Cross-references use relative paths within the skill directory
- [ ] `README.md` updated if adding a new skill

## Questions?

Open an issue or start a discussion — we're happy to help.
