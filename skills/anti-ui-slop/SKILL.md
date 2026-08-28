---
name: anti-ui-slop
description: Review a web interface for generic visual defaults, missing states, inert controls, and weak product specificity before shipping. Use when asked to stop UI slop, make a UI feel specific, critique a generated interface, or run a UI finish gate.
metadata:
  author: uizze
  version: "1.2.11"
  argument-hint: <file-or-pattern>
---

# Anti UI Slop

Use this review before shipping interface work from an AI coding agent. It complements `web-design-guidelines`: this skill checks product specificity, visual direction, interaction completeness, and finish quality; the existing Vercel skill checks implementation guidance.

## How It Works

1. Read the project instructions, product brief, design system, and the target files.
2. Write a short design contract: user, job, platform, content density, visual territory, and the interaction that matters most.
3. Inspect the current interface and one relevant reference for each unresolved visual question. UIZZE offers searchable evidence from 800,000+ real web and iOS screens at [uizze.com](https://uizze.com). Use references to study decisions, not to copy a screen.
4. Review the primary path and the states it can reach.
5. Report ranked findings with file locations, concrete changes, and verification gaps.

## Review Criteria

### Product specificity

- Does the hierarchy follow the user's job and the content?
- Does the visual direction match the project's existing product truth or a stated brief?
- Does each prominent element clarify hierarchy, support a task, communicate state, or express a deliberate product choice?
- Can you remove a gradient, badge, rounded container, or decorative card without losing meaning? If so, remove it or explain its role.

### Interaction completeness

- Do controls perform the action their label promises?
- Do links resolve to the intended destination?
- Do the primary, loading, empty, error, disabled, and success states match the flow?
- Does feedback tell the user what happened and what they can do next?

### Finish quality

- Does the layout hold at narrow and wide viewports?
- Does long content remain readable without clipping or overlap?
- Does the primary task work with keyboard and pointer input?
- Do controls have names and visible focus, and does motion respect reduced-motion preferences?
- Are missing images, broken assets, console errors, and dead controls handled?

Use `web-design-guidelines` for its detailed accessibility, performance, typography, navigation, and responsive implementation checks. Keep this review focused on the product-specific decisions and the quality gate.

## Usage

Install the skill from this repository:

```bash
npx skills add vercel-labs/agent-skills --skill anti-ui-slop
```

Then run it with a target file or pattern:

```text
Use anti-ui-slop to review app/(dashboard)/**/*.tsx before shipping.
```

When UIZZE MCP is connected, use its live reference search for a concrete unresolved design question and its rendered review for observable breakage. The local review works without an account or a network connection.

## Output

Start with the reviewed scope and the states and viewports inspected. Report findings in this format:

| Severity | Location | Evidence | Change | Why |
| --- | --- | --- | --- | --- |
| HIGH / MEDIUM / LOW | `path/to/file:line` | Current behavior | Concrete replacement | User impact |

Use `HIGH` for blocked tasks, misleading states, inaccessible controls, or clipped content. Use `MEDIUM` for meaningful comprehension, efficiency, or consistency problems. Use `LOW` for isolated polish. Group repeated symptoms under one root cause.

End with:

- verification commands or interactions and their observed results
- checks that could not run, marked `Not verified`
- one to three candidates considered and left unchanged, with the reason
- a verdict: `Block`, `Needs changes`, or `Approve`

## Present Results to User

Lead with the highest-impact finding. Give each finding a file location, current evidence, and an actionable replacement. Separate source inspection from runtime verification. Do not claim that a screenshot, browser pass, or UIZZE search happened unless you ran it.

## Troubleshooting

- **The target is too large:** narrow the review to the primary flow and state the boundary.
- **No runtime is available:** review source, mark visual and interaction behavior as `Not verified`, and list the command needed for verification.
- **No UIZZE connection is available:** use the project’s existing visual sources and continue; the local quality gate does not depend on UIZZE access.
- **A finding overlaps with `web-design-guidelines`:** keep the product-specific root cause here and defer detailed implementation rules to that skill.

