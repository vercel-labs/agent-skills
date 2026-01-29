---
title: Use useId for Stable Hydration-Safe Identifiers
impact: MEDIUM
impactDescription: prevents hydration mismatches from random IDs
tags: rendering, hydration, ssr, accessibility
---

## Use useId for Stable Hydration-Safe Identifiers

**Impact: MEDIUM (prevents hydration mismatches from random IDs)**

When generating unique IDs for accessibility attributes (like `id`, `htmlFor`, `aria-labelledby`), use React's `useId()` hook instead of random values. Random values like `Math.random()` or `Date.now()` generate different IDs on server and client, causing hydration mismatches.

**Incorrect (hydration mismatch):**

```tsx
function TextField({ label }: { label: string }) {
  // Generates different values on server vs client
  const id = `input-${Math.random().toString(36).slice(2)}`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  )
}
```

The server renders with one random ID, the client hydrates with a different one, causing a hydration error and broken accessibility.

**Incorrect (counter-based IDs):**

```tsx
let counter = 0

function TextField({ label }: { label: string }) {
  // Counter may differ between server and client renders
  const id = `input-${++counter}`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  )
}
```

Module-level counters can produce different values depending on render order, component mount/unmount cycles, or Strict Mode.

**Correct (useId hook):**

```tsx
import { useId } from 'react'

function TextField({ label }: { label: string }) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  )
}
```

`useId()` generates stable identifiers that match between server and client renders, ensuring no hydration mismatch.

**Correct (multiple related IDs):**

```tsx
import { useId } from 'react'

function FormField({ label, hint }: { label: string; hint: string }) {
  const id = useId()

  return (
    <div>
      <label htmlFor={`${id}-input`}>{label}</label>
      <input
        id={`${id}-input`}
        aria-describedby={`${id}-hint`}
        type="text"
      />
      <p id={`${id}-hint`}>{hint}</p>
    </div>
  )
}
```

Use a single `useId()` call and derive related IDs with suffixes to keep related elements connected.

Reference: [React useId](https://react.dev/reference/react/useId)
