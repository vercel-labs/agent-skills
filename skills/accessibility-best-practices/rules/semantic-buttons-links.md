---
title: Use Button for Actions, Anchor for Navigation
impact: CRITICAL
impactDescription: Incorrect element choice breaks keyboard behavior and screen reader announcements
tags: semantic, buttons, links, keyboard, screen-reader
wcag: "1.3.1 Level A"
---

## Use Button for Actions, Anchor for Navigation

**Impact: CRITICAL (Incorrect element choice breaks keyboard behavior and screen reader announcements)**

Use `<button>` for actions (submit, toggle, open dialog) and `<a>` for navigation (go to a URL). Never use `<div>` or `<span>` as clickable elements — they have no keyboard support, no role, and no focus by default.

**Incorrect (div as button, anchor as action):**

```tsx
// div with onClick — not keyboard accessible, no button role
<div className="btn" onClick={handleSubmit}>
  Submit
</div>

// anchor that doesn't navigate — confuses screen readers
<a href="#" onClick={(e) => { e.preventDefault(); toggleMenu() }}>
  Menu
</a>

// span as clickable — invisible to assistive tech
<span onClick={handleDelete} className="clickable">Delete</span>
```

**Correct (proper semantic elements):**

```tsx
// button for actions
<button type="button" onClick={handleSubmit}>
  Submit
</button>

// button for toggles (not anchor)
<button type="button" onClick={toggleMenu} aria-expanded={isOpen}>
  Menu
</button>

// anchor for actual navigation
<a href="/settings">Settings</a>
```

If you must use a non-semantic element (extremely rare), add `role="button"`, `tabIndex={0}`, and both `onClick` and `onKeyDown` (Enter and Space) handlers. But native `<button>` gives you all of this for free.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
