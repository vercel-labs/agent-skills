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

1. Fetch the reviewed guidelines snapshot from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch the pinned guidelines snapshot before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/4e799d45c17aec1498c269287a83b9dba22b966b/command.md
```

Use WebFetch to retrieve the rules. The URL is pinned to commit `4e799d45c17aec1498c269287a83b9dba22b966b` so the same version of this skill applies the same reviewed guidance on every invocation. Update the commit through a reviewed change when the upstream guidelines are intentionally refreshed. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the pinned source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
