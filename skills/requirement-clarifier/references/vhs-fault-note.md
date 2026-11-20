# Showcase Recording Note (vhs 0.11 Fault)

> **Status:** Showcase GIF pending — vhs 0.11 + ttyd 1.7.7 compatibility fault on macOS
> **Date:** 2026-06-23

## Why no GIF?

The `vhs` terminal recorder (v0.11) + `ttyd` (v1.7.7) on macOS (Darwin 25.3.0, arm64) only records the first frame of the PTY stream. This is a known upstream issue.

## What works

- `SKILL.md` is complete and triggerable
- `AGENTS.md` is the agent-readable equivalent
- All 3 sub-modes (`growme-mode/`, `change-mode/`, `improve-mode/`) work independently
- `test-prompts.json` provides 8 live test cases
- `examples/` has 3 anti-pattern samples

## Repro

```bash
# Will produce a GIF with only the first frame visible
vhs assets/demo.tape
# Output: demo.gif (only first frame animated)
```

## Resolution

Pending one of:

- vhs v0.12+ (upstream fix)
- Switch to Asciinema (text-based recording)
- Manual screen recording + ffmpeg conversion

See upstream: https://github.com/charmbracelet/vhs/issues

---

This is an honest fault record, not a missing feature. Skill functionality is unaffected.
