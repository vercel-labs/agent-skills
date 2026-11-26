---
name: cloudscape-design-system
description: AWS Cloudscape Design System reference — components, patterns, foundation guidance, and usage guidelines. Use when building, reviewing, or refactoring UIs that follow Cloudscape conventions, when picking the right Cloudscape component for a task, or when writing code that imports from @cloudscape-design/components. Covers props, accessibility notes, do/don't guidance, and related patterns for ~60 components and ~30 patterns.
license: MIT
metadata:
  author: r33drichards
  version: "0.1.0"
  source: "https://cloudscape.design/"
  upstream_license: "Apache-2.0 (component source); docs ©AWS, excerpted for reference"
---

# Cloudscape Design System

[Cloudscape](https://cloudscape.design/) is an open-source design system for the cloud authored by AWS. It ships React components (`@cloudscape-design/components`), design tokens, and a large corpus of usage guidance. This skill bundles the full public documentation as markdown so an agent can ground its answers in the authoritative source.

## How to use this skill

When the user is working on a Cloudscape UI, do the following **before** writing or reviewing code:

1. Open `references/index.md` for a categorized list of everything available.
2. For a specific component (e.g. `AppLayout`, `Table`, `Wizard`), read the corresponding file under `references/components/`. Every file has a `source_url` in its frontmatter — cite it when giving guidance so users can follow up on the canonical page.
3. For a design decision (multi-step flows, error states, form layouts, empty states, etc.), check `references/patterns/` before `references/components/` — patterns encode the *why* and link to the components to use.
4. For cross-cutting concerns (accessibility, internationalization, responsive behavior, theming, testing), see `references/get-started/` and `references/foundation/`.
5. Prefer quoting the documentation verbatim over paraphrasing. Cloudscape guidance is prescriptive; summarizing it often loses the constraint.

## What's in `references/`

- `components/` — one file per component, mirroring `https://cloudscape.design/components/<name>/`.
- `patterns/` — one file per design pattern (general, form, table, flashbar, split-panel, wizard, etc.).
- `foundation/` — visual foundation (typography, color, iconography, layout).
- `get-started/` — developer and designer onboarding, including testing, CSP, i18n, state management, responsive development.
- `guidelines/` — design principles and writing guidelines.
- `examples/` — reference implementations.
- `index.md` — top-level table of contents (generated).

Every page is auto-generated from the upstream `*/index.html.md` files (exposed by cloudscape.design specifically for LLMs). Frontmatter fields: `source_url`, `title`, `section`, `scraped_at`.

## When NOT to use this skill

- If the user isn't working with Cloudscape or AWS console-style UIs, skip it.
- If the user is working on the component source code itself (i.e. contributing to `@cloudscape-design/components`), prefer the upstream repo at https://github.com/cloudscape-design/components.

## Refreshing the content

The `scripts/refresh.py` helper re-downloads every page from cloudscape.design's `llms.txt` index with a polite 2-second gap between requests. Run it only when the upstream docs have been updated; the output is the committed `references/` tree.

```bash
nix-shell -p 'python313.withPackages (ps: with ps; [ httpx pyyaml ])' \
  --run "python scripts/refresh.py"
```

(Or `pip install -r scripts/requirements.txt` + `python scripts/refresh.py` if you prefer a venv.)
