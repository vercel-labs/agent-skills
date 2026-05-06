# react-named-effects

A skill for AI coding agents that teaches naming `useEffect`, `useCallback`, and `useMemo` callbacks with function expressions instead of anonymous arrows.

## What It Covers

- **Core pattern**: Replace `useEffect(() => { ... })` with `useEffect(function descriptiveName() { ... })`
- **Diagnostics**: How naming reveals effects that should be split, eliminated, or extracted
- **Conventions**: Naming vocabulary, cleanup functions, other hooks, custom hook integration
- **Tooling**: ESLint enforcement, stack trace behavior, React DevTools facts

## Structure

- `SKILL.md` — Entry point with core pattern and quick reference
- `AGENTS.md` — Full compiled guide with all references expanded
- `references/diagnostics.md` — Anti-pattern detection framework
- `references/conventions.md` — Naming vocabulary and tooling

## Installation

**Claude Code:**
```bash
cp -r skills/react-named-effects ~/.claude/skills/
```

**claude.ai:**
Add the skill to project knowledge or paste SKILL.md contents.

## Based On

- [Start naming your useEffect functions](https://neciudan.dev/name-your-effects) by Neciu Dan
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) — React docs
- [useEncapsulation](https://kyleshevlin.com/use-encapsulation/) by Kyle Shevlin
