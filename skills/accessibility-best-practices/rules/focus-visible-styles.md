---
title: Style :focus-visible, Never Remove Outlines
impact: CRITICAL
impactDescription: Removing focus outlines makes keyboard navigation impossible
tags: focus, focus-visible, outline, keyboard, css
wcag: "2.4.7 Level AA"
---

## Style :focus-visible, Never Remove Outlines

**Impact: CRITICAL (Removing focus outlines makes keyboard navigation impossible)**

Never use `outline: none` or `outline: 0` without providing a visible alternative. Use `:focus-visible` to show focus rings only for keyboard navigation (not mouse clicks), giving both mouse and keyboard users a good experience.

**Incorrect (outline removed globally):**

```css
/* This is the #1 most common accessibility violation */
*:focus {
  outline: none;
}

/* Or hiding it on specific elements without replacement */
button:focus {
  outline: none;
}

a:focus {
  outline: 0;
}
```

**Correct (custom focus-visible styles):**

```css
/* Remove default outline only when providing focus-visible alternative */
button:focus:not(:focus-visible) {
  outline: none;
}

/* Visible focus ring for keyboard navigation */
button:focus-visible {
  outline: 2px solid var(--focus-color, #2563eb);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Global focus-visible styles as a baseline */
:focus-visible {
  outline: 2px solid var(--focus-color, #2563eb);
  outline-offset: 2px;
}
```

If your CSS reset removes outlines (many do), add `:focus-visible` styles globally as the very next step. This is non-negotiable for keyboard accessibility.

Reference: [WCAG 2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
