---
title: Ensure Visible Focus Indicators Meet Contrast Requirements
impact: HIGH
impactDescription: Invisible or low-contrast focus indicators strand keyboard users
tags: color, focus, focus-visible, keyboard, contrast
wcag: "2.4.7 Level AA, 2.4.12 Level AA"
---

## Ensure Visible Focus Indicators Meet Contrast Requirements

**Impact: HIGH (Invisible or low-contrast focus indicators strand keyboard users)**

Focus indicators must be clearly visible against both the element and its surrounding background. WCAG 2.4.7 requires focus to be visible, and WCAG 2.4.12 (new in 2.2, Level AA) requires that focused elements are not entirely obscured by other content. Use a 2px solid outline with sufficient contrast as a reliable baseline.

**Incorrect (removed or invisible focus styles):**

```css
/* NEVER do this — removes all focus indication */
*:focus {
  outline: none;
}

/* Thin, low-contrast focus ring */
button:focus {
  outline: 1px dotted #ccc;
}

/* Focus ring that blends into background */
.dark-section button:focus {
  outline: 2px solid #333;
}
```

**Correct (visible, high-contrast focus indicators):**

```css
/* Use :focus-visible for keyboard-only focus styles */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Adapt focus color to context */
.dark-section button:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 2px;
}

/* For custom focus styles, ensure sufficient contrast */
.card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
}
```

Use `:focus-visible` instead of `:focus` to show focus rings only for keyboard navigation (not mouse clicks). Never remove the outline without providing an equivalent or better alternative.

Reference: [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
