---
title: Make SVGs Accessible with Role and Title
impact: MEDIUM-HIGH
impactDescription: Inline SVGs are invisible to screen readers without explicit accessible names
tags: media, svg, icons, screen-reader, accessible-name
wcag: "1.1.1 Level A"
---

## Make SVGs Accessible with Role and Title

**Impact: MEDIUM-HIGH (Inline SVGs are invisible to screen readers without explicit accessible names)**

Inline SVGs need explicit accessibility markup to be announced by screen readers. For meaningful SVGs, add `role="img"` and a `<title>` element. For decorative SVGs, use `aria-hidden="true"`.

**Incorrect (SVG with no accessible name):**

```tsx
// Screen reader ignores or reads each path element
function Logo() {
  return (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" />
      <text x="50" y="55" textAnchor="middle">A</text>
    </svg>
  )
}
```

**Correct (meaningful SVG with accessible name):**

```tsx
function Logo() {
  return (
    <svg role="img" aria-labelledby="logo-title" viewBox="0 0 100 100">
      <title id="logo-title">Acme Company Logo</title>
      <circle cx="50" cy="50" r="40" />
      <text x="50" y="55" textAnchor="middle">A</text>
    </svg>
  )
}

// Decorative SVG — hidden from assistive tech
function DecorativeDivider() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 2">
      <line x1="0" y1="1" x2="200" y2="1" stroke="currentColor" />
    </svg>
  )
}
```

For SVGs used as icon buttons, the `aria-label` on the `<button>` is sufficient — hide the SVG with `aria-hidden="true"` to avoid double announcements.

Reference: [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
