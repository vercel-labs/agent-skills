---
title: Don't Add ARIA Roles That Duplicate Native Semantics
impact: HIGH
impactDescription: Redundant ARIA adds noise and can cause double announcements in screen readers
tags: aria, roles, semantic, redundant
wcag: "1.3.1 Level A"
---

## Don't Add ARIA Roles That Duplicate Native Semantics

**Impact: HIGH (Redundant ARIA adds noise and can cause double announcements in screen readers)**

Native HTML elements already have implicit ARIA roles. Adding explicit roles that match the native semantics is redundant and can cause issues. The first rule of ARIA: don't use ARIA if you can use native HTML.

**Incorrect (redundant ARIA roles):**

```tsx
<button role="button">Submit</button>
<a href="/home" role="link">Home</a>
<nav role="navigation">...</nav>
<input type="checkbox" role="checkbox" />
<h1 role="heading" aria-level={1}>Title</h1>
```

**Correct (native elements with implicit roles):**

```tsx
<button>Submit</button>
<a href="/home">Home</a>
<nav>...</nav>
<input type="checkbox" />
<h1>Title</h1>
```

Only use ARIA when native HTML cannot express the semantics you need — for example, `role="tablist"`, `role="dialog"`, or `role="combobox"` where no native equivalent exists.

Reference: [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
