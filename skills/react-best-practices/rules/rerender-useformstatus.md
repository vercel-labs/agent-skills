---
title: Use useFormStatus for Pending State Without Prop Drilling
impact: MEDIUM
impactDescription: cleaner form components, no manual pending state tracking
tags: rerender, forms, useFormStatus, pending-state, server-actions
---

## Use useFormStatus for Pending State Without Prop Drilling

**Impact: MEDIUM (cleaner form components, no manual pending state tracking)**

Use `useFormStatus` inside a child component of a `<form>` to access the pending state directly. This avoids threading `isPending` through props or lifting state to coordinate between the form and its submit button.

**Incorrect (prop drilling pending state):**

```tsx
'use client'

import { useState } from 'react'
import { submitOrder } from './actions'

function OrderForm() {
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    await submitOrder(formData)
    setIsPending(false)
  }

  return (
    <form action={handleSubmit}>
      <input name="item" />
      <OrderSummary />
      <SubmitButton isPending={isPending} />
    </form>
  )
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <button type="submit" disabled={isPending}>
      {isPending ? 'Placing order...' : 'Place Order'}
    </button>
  )
}
```

**Correct (useFormStatus reads pending state from the form):**

```tsx
import { submitOrder } from './actions'
import { SubmitButton } from './submit-button'

function OrderForm() {
  return (
    <form action={submitOrder}>
      <input name="item" />
      <OrderSummary />
      <SubmitButton />
    </form>
  )
}
```

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Placing order...' : 'Place Order'}
    </button>
  )
}
```

`useFormStatus` reads the status of the parent `<form>`, so the component must be rendered as a child of the form element. It cannot be called in the same component that renders the `<form>`.

**Reuse across forms:**

Because `SubmitButton` doesn't depend on any specific form's props, it works as a shared component across your entire app.

Reference: [React useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
