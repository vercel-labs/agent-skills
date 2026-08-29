---
name: paperzilla
description: Chat with your agent about projects, recommendations, and canonical papers in Paperzilla. Use when users ask for recent project recommendations, canonical paper details, markdown-based summaries, recommendation feedback, feed export, or Atom feed URLs.
license: MIT
metadata:
  author: Paperzilla Inc
  version: "0.2.2"
---

# Paperzilla

Use this skill when you want to chat with your agent about projects, recommendations, and canonical papers in Paperzilla.

## What you can ask

- "Give me the latest recommendations from project X."
- "Open recommendation Y and explain why it matters."
- "Fetch canonical paper Z as markdown and summarize it."
- "Tell me how this paper is relevant to my research."
- "Show me the feed for project X."
- "Leave feedback on a recommendation."
- "Export this paper, recommendation, or feed as JSON."

This is the core Paperzilla skill. It gives your agent direct access to Paperzilla data, but it does not impose a workflow or external delivery integration.

## Access method

Most current profiles in this repo use the `pz` CLI.

If the current profile ships extra agent-specific instructions, follow those as well.

## Install

### macOS
```bash
brew install paperzilla-ai/tap/pz
```

### Windows (Scoop)
```bash
scoop bucket add paperzilla-ai https://github.com/paperzilla-ai/scoop-bucket
scoop install pz
```

### Linux
Use the official Linux install guide:

- https://docs.paperzilla.ai/guides/cli-getting-started

### Build from source (Go 1.23+)
See the CLI repository for source builds:

- https://github.com/paperzilla-ai/pz

## Update

Check whether your CLI is up to date and get install-specific upgrade steps:

```bash
pz update
```

If detection is ambiguous, override it explicitly:

```bash
pz update --install-method homebrew
pz update --install-method scoop
pz update --install-method release
pz update --install-method source
```

Supported values are `auto`, `homebrew`, `scoop`, `release`, and `source`.

## Authentication

```bash
pz login
```

## CLI reference

### Projects
```bash
pz project list
pz project <project-id>
```

### Recommendations and feeds
```bash
pz feed <project-id> --limit 20
pz feed <project-id> --json
pz rec <project-paper-id>
pz rec <project-paper-id> --json
pz rec <project-paper-id> --markdown
```

Use `pz rec` for project-specific recommendations from a feed. Feed items may display feedback markers like `[↑]`, `[↓]`, and `[★]`.

### Canonical papers
```bash
pz paper <paper-id>
pz paper <paper-id> --json
pz paper <paper-id> --markdown
pz paper <paper-id> --project <project-id>
```

Use `pz paper` for canonical Paperzilla papers. This command is not limited to one project's feed.

### Feedback
```bash
pz feedback <project-paper-id> up
pz feedback <project-paper-id> down
pz feedback <project-paper-id> star
```

Use feedback when the user explicitly wants to rate or triage a recommendation.

### Atom URLs
```bash
pz atom <project-id>
```

### JSON export
```bash
pz feed <project-id> --json
pz rec <project-paper-id> --json
pz paper <paper-id> --json
```

Prefer JSON when the agent needs structured fields instead of conversational browsing.

