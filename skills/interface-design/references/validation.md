# Memory Management

When and how to update `.interface-design/system.md`.

---

## When to Add Patterns

Add to system.md when:
- Component used 2+ times
- Pattern is reusable across the project
- Has specific measurements worth remembering

## Pattern Format

```markdown
### Button Primary
- Height: 36px
- Padding: 12px 16px
- Radius: 6px
- Font: 14px, 500 weight
- Usage: Primary actions, form submissions
```

## Don't Document

- One-off components
- Temporary experiments
- Variations better handled with props

## Pattern Reuse

Before creating a component, check system.md:
- Pattern exists? Use it.
- Need variation? Extend, don't create new.

Memory compounds: each pattern saved makes future work faster and more consistent.

---

# Validation Checks

When system.md defines specific values, verify consistency:

**Spacing** — All values multiples of the defined base?

**Depth** — Using the declared strategy throughout? (borders-only means no shadows)

**Colors** — Using defined palette, not random hex codes?

**Patterns** — Reusing documented patterns instead of creating new?

---

# When to Update system.md

**Add patterns when:**
- You've built a new reusable component
- You've established a new token or value
- The user confirms they want to keep a pattern

**Update patterns when:**
- Requirements change and user confirms
- You discover the pattern needs refinement

**Don't update when:**
- Building a one-off component
- Experimenting with alternatives
- The user hasn't confirmed the direction

---

# Auditing Existing Code

When reviewing code against system.md:

1. **Token compliance** — Are all colors, spacing values, and radii from the system?
2. **Pattern compliance** — Do components match documented patterns?
3. **Depth consistency** — Is the depth strategy applied uniformly?
4. **State coverage** — Do interactive elements have all required states?

Report violations specifically:
```
Line 45: Uses 14px padding, system defines 16px
Line 72: Uses #3b82f6, should use var(--accent)
Line 103: Card missing hover state
```

---

# Extracting Patterns from Existing Code

When building system.md from existing code:

1. **Identify repeated values** — What spacing, colors, radii appear multiple times?
2. **Find the system** — Is there an implicit base unit? A color palette?
3. **Document what exists** — Don't invent new patterns, capture current ones
4. **Note inconsistencies** — Flag where the code deviates from its own patterns

The goal is to make implicit decisions explicit, not to impose new ones.
