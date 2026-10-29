---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.1.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read the bundled guidelines at [references/command.md](references/command.md)
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

The rules are bundled with this skill in the [references/command.md](references/command.md) file. Read that file before each review. Do not fetch rules from the network.

The snapshot is pinned to a specific upstream commit:

Source: https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md

SHA-256: `d246b026f4f29b5823a9cc857f9edf3d2507002e055e32040cadeaf3b38e0234`

The file contains all the rules and output format instructions.
Where it says `$ARGUMENTS`, use the files or pattern the user asked to review.

## Updating the Guidelines

To update the snapshot to a newer upstream version:

1. Get the latest commit SHA: `gh api repos/vercel-labs/web-interface-guidelines/commits/main --jq .sha`
2. Download it: `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/<SHA>/command.md -o references/command.md`
3. Review the changes, then update the Source URL and SHA-256 above (`shasum -a 256 references/command.md`)

## Usage

When a user provides a file or pattern argument:
1. Read [references/command.md](references/command.md)
2. Read the specified files
3. Apply all rules from the guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
