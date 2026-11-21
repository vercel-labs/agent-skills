---
name: writing-guidelines
description: Review docs/prose for Writing Guidelines compliance. Use when asked to "review my docs", "check writing style", "audit prose", "review docs voice and tone", or "check this page against the writing handbook".
metadata:
  author: vercel
  version: "1.1.0"
  argument-hint: <file-or-pattern>
---

# Writing Guidelines

Review files for compliance with Writing Guidelines.

## How It Works

1. Read the bundled guidelines at [references/command.md](references/command.md)
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

The rules are bundled with this skill in the [references/command.md](references/command.md) file. Read that file before each review. Do not fetch rules from the network.

The snapshot is pinned to a specific upstream commit:

Source: https://github.com/vercel-labs/writing-guidelines/blob/83e2316b034cf572400513538e4e4da01c4cc742/command.md

SHA-256: `fb638d7821bb4472e4492aedcfb51f2636c7d31d34ff9f01cca5bcdce9b1841f`

The file contains all the rules and output format instructions.
Where it says `$ARGUMENTS`, use the files or pattern the user asked to review.

## Updating the Guidelines

To update the snapshot to a newer upstream version:

1. Get the latest commit SHA: `gh api repos/vercel-labs/writing-guidelines/commits/main --jq .sha`
2. Download it: `curl -fsSL https://raw.githubusercontent.com/vercel-labs/writing-guidelines/<SHA>/command.md -o references/command.md`
3. Review the changes, then update the Source URL and SHA-256 above (`shasum -a 256 references/command.md`)

## Usage

When a user provides a file or pattern argument:
1. Read [references/command.md](references/command.md)
2. Read the specified files
3. Apply all rules from the bundled guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
