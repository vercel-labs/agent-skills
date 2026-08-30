---
title: Provide Accessible Inline Validation Feedback
impact: HIGH
impactDescription: Users with cognitive disabilities need clear, immediate, and specific error guidance
tags: form, validation, errors, cognitive, screen-reader
wcag: "3.3.1 Level A, 3.3.3 Level AA"
---

## Provide Accessible Inline Validation Feedback

**Impact: HIGH (Users with cognitive disabilities need clear, immediate, and specific error guidance)**

Validation messages should be specific (not just "Invalid"), appear inline next to the relevant field, and be announced to screen readers. After form submission with errors, move focus to the first error or provide an error summary.

**Incorrect (generic alert on submit, no inline feedback):**

```tsx
function Form() {
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!isValid()) {
      setError('There are errors in the form') // Vague, not inline
      window.alert('Fix the errors') // Alert is disruptive
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

**Correct (specific inline errors with focus management):**

```tsx
function Form() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const firstErrorRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors = validate(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      // Focus the first field with an error
      firstErrorRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          ref={errors.email ? firstErrorRef : undefined}
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
```

Use `noValidate` on the form to disable browser default validation when providing custom accessible validation. Provide specific messages like "Please enter an email address in the format name@example.com" rather than "Invalid email".

Reference: [WCAG 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)
