# Repo to NotebookLM

Convert any GitHub repository into a focused, NotebookLM-ready markdown document.

## What it does

Given a GitHub repo URL or `owner/repo`, this skill fetches the README, package manifest, docs, and example files, then produces a single structured markdown document designed for deep understanding and Q&A in [NotebookLM](https://notebooklm.google.com).

## Output document structure

1. **Overview** — What the project is and why it exists
2. **When to use this** — Concrete use cases and anti-cases
3. **Installation & Setup** — Commands, env vars, prerequisites
4. **Quick Start** — Copy-pasteable minimal working example
5. **Core Concepts** — Key abstractions and architecture in plain prose
6. **Key Features & Capabilities** — What it can do, with code snippets
7. **API / Usage Guide** — Functions, classes, CLI commands
8. **Real-world Examples** — 2–3 complete realistic scenarios
9. **Limitations & Gotchas** — Known constraints and common mistakes

## Usage

> "Turn anthropics/anthropic-sdk-python into a NotebookLM document"
> "帮我把 tiangolo/fastapi 转成 NotebookLM 文件"
> "Summarize this GitHub repo: owner/repo"

Produces `<repo-name>-notebooklm.md` — drag it into the NotebookLM Sources panel.

## How to activate

Mention converting, summarizing, or documenting a GitHub repository for reading or Q&A purposes.
