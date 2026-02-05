---
name: create-pr
description: Creates GitHub pull requests with properly formatted titles. Use when creating PRs, submitting changes for review, or when the user says /pr or asks to create a pull request. Analyzes changes on the current branch and uses the pull request template from .github folder.
---

# Create Pull Request

Creates GitHub pull requests with properly formatted titles using the project's PR template.

## Workflow

### Step 1: Check for staged changes

If there are staged changes, use the `git-commit` skill to commit them first:

```bash
git status
```

If staged changes exist, invoke the git-commit skill.

### Step 2: Analyze current branch state

Run these commands to understand the changes:

```bash
git status
git diff --stat
git log origin/master..HEAD --oneline
```

Note: The base branch may be `main` or `master` - check which exists.

### Step 3: Determine PR title

Analyze the commits to create a properly formatted PR title:

- Use **imperative present tense**: "Add" not "Added"
- **Capitalize the first letter**
- **No period at the end**
- **No ticket IDs** (e.g., MGX-1234)

Examples:
- "Add user authentication flow"
- "Fix memory leak in worker process"
- "Update API endpoint documentation"

### Step 4: Push changes

Push the current branch to origin. Do not use `--force`. If the push fails, stop and return control to the user.

```bash
git push -u origin HEAD
```

### Step 5: Create PR using gh CLI

Check if a PR template exists at `.github/pull_request_template.md` or `.github/PULL_REQUEST_TEMPLATE.md`.

If a template exists, read it and use it as the PR body.

Create the PR:

```bash
gh pr create --title "<PR_TITLE>" --body "<PR_BODY>"
```

If no template exists, create a PR with a basic body summarizing the changes.
