---
title: Associate Error Messages with Inputs Using aria-describedby
impact: HIGH
impactDescription: Screen reader users won't know an input has an error without programmatic association
tags: form, errors, validation, aria-describedby, screen-reader
wcag: "3.3.1 Level A"
---

## Associate Error Messages with Inputs Using aria-describedby

**Impact: HIGH (Screen reader users won't know an input has an error without programmatic association)**

When an input has a validation error, the error message must be programmatically associated with the input via `aria-describedby`. Also mark the input with `aria-invalid="true"`. Visual color changes alone are not sufficient.

**Incorrect (error shown visually but not associated):**

```tsx
function EmailField({ error }) {
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" className={error ? 'border-red' : ''} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
```

**Correct (error associated with input):**

```tsx
function EmailField({ error }) {
  const errorId = useId()
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
```

When the input receives focus, screen readers will announce: "Email, invalid entry, edit text, Please enter a valid email address." Use `role="alert"` on the error message for immediate announcement when it appears.

Reference: [WCAG 3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
