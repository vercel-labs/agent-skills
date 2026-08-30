---
title: Hide Decorative Elements from Assistive Technology
impact: MEDIUM
impactDescription: Decorative content clutters screen reader output and slows navigation
tags: aria, hidden, decorative, screen-reader, noise
wcag: "1.1.1 Level A"
---

## Hide Decorative Elements from Assistive Technology

**Impact: MEDIUM (Decorative content clutters screen reader output and slows navigation)**

Decorative images, icons, dividers, and visual embellishments that don't convey information should be hidden from assistive technologies using `aria-hidden="true"`, `role="presentation"`, or `alt=""`.

**Incorrect (decorative elements announced by screen reader):**

```tsx
<div className="hero">
  <img src="/decorative-swirl.svg" /> {/* "decorative-swirl.svg, image" */}
  <span className="divider">•••</span> {/* "bullet bullet bullet" */}
  <StarIcon /> {/* "star, image" */}
  <h1>Welcome</h1>
</div>
```

**Correct (decorative elements hidden):**

```tsx
<div className="hero">
  <img src="/decorative-swirl.svg" alt="" />
  <span className="divider" aria-hidden="true">•••</span>
  <StarIcon aria-hidden="true" />
  <h1>Welcome</h1>
</div>
```

Never use `aria-hidden="true"` on focusable elements or elements containing focusable children — this creates a confusing state where focus enters an invisible region.

Reference: [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
