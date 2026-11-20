---
title: Maintain Logical Tab Order, Avoid Positive tabIndex
impact: CRITICAL
impactDescription: Incorrect tab order disorients users who navigate sequentially
tags: keyboard, tab-order, tabindex, navigation
wcag: "2.4.3 Level A"
---

## Maintain Logical Tab Order, Avoid Positive tabIndex

**Impact: CRITICAL (Incorrect tab order disorients users who navigate sequentially)**

Tab order should follow the visual and logical reading order of the page. Never use `tabIndex` values greater than 0 — they override the natural DOM order and create unpredictable navigation. Use `tabIndex={0}` to make non-interactive elements focusable, and `tabIndex={-1}` for programmatic focus only.

**Incorrect (positive tabIndex creates confusing order):**

```tsx
function Form() {
  return (
    <form>
      {/* tabIndex values create order: Submit(1) → Name(2) → Email(3) */}
      <input tabIndex={2} name="name" />
      <input tabIndex={3} name="email" />
      <button tabIndex={1}>Submit</button>
    </form>
  )
}
```

**Correct (natural DOM order, no positive tabIndex):**

```tsx
function Form() {
  return (
    <form>
      {/* Tab order follows DOM: Name → Email → Submit */}
      <input name="name" />
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

If visual layout differs from DOM order (e.g., CSS grid reordering), restructure the DOM to match the visual order rather than using `tabIndex` to compensate.

Reference: [WCAG 2.4.3 Focus Order](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
