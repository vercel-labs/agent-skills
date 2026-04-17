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

Skills in this repo follow **date-based versioning** implicit in git history. There is no explicit version field — consumers pin to a commit SHA or use `main` for latest.

If you need to signal a breaking change:
1. Note it prominently in the PR description
2. Add a `## Changelog` section to the skill's `README.md` (or create one)
3. Tag the commit if appropriate: `git tag skills/<skill-name>/v2`

## PR Checklist

- [ ] `SKILL.md` has accurate `name` and `description` frontmatter
- [ ] No secrets or personal data in skill files
- [ ] Rules are actionable and specific (not vague guidance)
- [ ] Cross-references use relative paths within the skill directory
- [ ] `README.md` updated if adding a new skill

## Questions?

Open an issue or start a discussion — we're happy to help.
