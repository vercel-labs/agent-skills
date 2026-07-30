---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read the vendored guidelines from `references/guidelines.md` in this skill's directory
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in `references/guidelines.md`
4. Output findings in the terse `file:line` format

## Guidelines Source

Read the local, pinned copy — do not fetch from the network:

```
references/guidelines.md
```

`references/guidelines.md` is a vendored copy of `vercel-labs/web-interface-guidelines`'s `command.md`, pinned to a specific commit (see the header of the file for the exact SHA and date). Vendoring removes the supply-chain risk of live-fetching instructions from a remote URL on every invocation. The file contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Read `references/guidelines.md` in this skill's directory
2. Read the specified files
3. Apply all rules from `references/guidelines.md`
4. Output findings using the format specified in `references/guidelines.md`

If no files specified, ask the user which files to review.

## Updating the pinned guidelines

`references/guidelines.md` is a point-in-time snapshot and will drift from upstream over time. To refresh it:

1. Fetch the current `command.md` at the commit you want to pin to: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/<COMMIT_SHA>/command.md` (substitute the target commit SHA, or `main` for the latest).
2. Replace the content of `references/guidelines.md` below its header note, keeping the same header format.
3. Update the header's commit SHA and date to the new pin.
