---
title: Every Input Must Have an Associated Label
impact: CRITICAL
impactDescription: Unlabeled inputs are announced as "edit text" — users cannot know what to enter
tags: form, labels, input, screen-reader
wcag: "1.3.1 Level A, 3.3.2 Level A"
---

## Every Input Must Have an Associated Label

**Impact: CRITICAL (Unlabeled inputs are announced as "edit text" — users cannot know what to enter)**

Every form input needs a programmatically associated label. This can be an explicit `<label>` with `htmlFor`, an implicit wrapping `<label>`, or `aria-label`/`aria-labelledby`. Placeholder text is not a label — it disappears when the user starts typing and has insufficient contrast.

**Incorrect (placeholder-only, no label):**

```tsx
function LoginForm() {
  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button type="submit">Log in</button>
    </form>
  )
}
```

**Correct (explicit labels):**

```tsx
function LoginForm() {
  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" />
      </div>
      <button type="submit">Log in</button>
    </form>
  )
}
```

For visually hidden labels (when design doesn't show them), use a visually-hidden class on the `<label>` rather than removing it. The `<label>` also provides a larger click target on mobile.

Reference: [WCAG 3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
