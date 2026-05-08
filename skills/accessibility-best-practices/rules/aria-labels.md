---
title: Provide Accessible Names for All Interactive Elements
impact: HIGH
impactDescription: Elements without accessible names are announced as "button" or "link" with no context
tags: aria, labels, accessible-name, screen-reader
wcag: "1.3.1 Level A"
---

## Provide Accessible Names for All Interactive Elements

**Impact: HIGH (Elements without accessible names are announced as "button" or "link" with no context)**

Every interactive element must have a discernible accessible name. This can come from visible text content, `aria-label`, `aria-labelledby`, or an associated `<label>`. Icon-only buttons are the most common offenders.

**Incorrect (icon buttons with no accessible name):**

```tsx
<button onClick={onClose}>
  <XIcon />
</button>

<button onClick={toggleSidebar}>
  <HamburgerIcon />
</button>

<a href="/settings">
  <GearIcon />
</a>
```

**Correct (accessible names provided):**

```tsx
<button onClick={onClose} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

<button onClick={toggleSidebar} aria-label="Toggle navigation menu">
  <HamburgerIcon aria-hidden="true" />
</button>

<a href="/settings" aria-label="Settings">
  <GearIcon aria-hidden="true" />
</a>
```

Prefer visible text over `aria-label` when possible — it benefits all users. Use `aria-label` only when visible text isn't feasible. Mark decorative icons as `aria-hidden="true"` so they aren't announced alongside the label.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
