---
name: git-commit
description: Generate concise, descriptive git commit messages following best practices. Use when creating git commits from staged changes, crafting commit messages, or reviewing commit message quality.
---

# Git Commit

Generate concise and descriptive git commit messages based on staged code changes.

## Commit Message Format

```
<Subject>

<Description>

<Tags and External References>
```

## Best Practices

### 1. Capitalization and Punctuation
- Capitalize the first word of the subject line
- Do NOT end the subject line with punctuation

### 2. Imperative Mood
Use imperative mood in the subject line—give the tone of giving an order or request.

**Good:**
- Add fix for dark mode toggle state
- Update API authentication flow
- Remove deprecated database fields

**Bad:**
- Added fix for dark mode toggle state
- Updating API authentication flow
- Removing deprecated database fields

### 3. Length Limits
- Subject line: Maximum 50 characters
- Body lines: Maximum 72 characters

### 4. Content Style
Be direct and concise. Eliminate filler words and phrases such as:
- "though"
- "maybe"
- "I think"
- "kind of"
- "just"
- "simply"

Think like a journalist—state what was done clearly and directly.

## Analysis Framework

To craft thoughtful commit messages, consider:

1. **Why** were these changes made?
2. **What** effect do the changes have?
3. **Why** was the change needed?
4. **What** are the changes in reference to (issue numbers, PRs, tickets)?

## Examples

**Simple bug fix:**
```
Fix authentication timeout

Increase session timeout from 30 to 60 minutes to prevent
frequent re-authentication for active users.

Fixes #123
```

**Feature addition:**
```
Add dark mode support

Implement system-wide dark mode using CSS custom properties.
Users can toggle between light and dark themes via new
settings menu option.

Refs #456
```

**Refactoring:**
```
Extract payment processing module

Move payment-related logic into dedicated module to improve
testability and reduce controller complexity.
```

**Breaking change:**
```
Remove deprecated user endpoints

Delete /users/legacy endpoints which were marked for removal
in v2.0. Clients must use /v2/users endpoints instead.

BREAKING CHANGE: Migrate to v2 endpoints before upgrading
```

## Workflow

1. Run `git status` to see staged changes
2. Run `git diff --staged` to review the actual changes
3. Run `git log -5 --oneline` to understand recent commit message style
4. Analyze changes to understand the "why" and "what"
5. Draft the commit message following the format and practices above
6. Verify: subject under 50 chars, imperative mood, no trailing punctuation
