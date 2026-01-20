---
title: Use useActionState for Form State Management
impact: MEDIUM-HIGH
impactDescription: 60-70% less form boilerplate
tags: forms, server-actions, state-management, react19, progressive-enhancement
---

## Use useActionState for Form State Management

`useActionState` replaces `useFormState` and simplifies form handling by combining state management, pending status, and action results into a single hook. It eliminates manual state setup, try-catch blocks, and makes forms work before JavaScript hydration.

**Incorrect (manual state management):**

```tsx
"use client"
import { useState } from "react"
import { submitPayment } from "@/actions/payment"

function PaymentForm() {
  const [state, setState] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setIsPending(true)
    setError(null)
    try {
      const result = await submitPayment(formData)
      setState(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit(new FormData(e.target))
    }}>
      <input name="cardNumber" required />
      {error && <div className="error">{error}</div>}
      {state?.success && <div className="success">Payment successful!</div>}
      <button disabled={isPending} type="submit">
        {isPending ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  )
}
```

**Correct (using useActionState):**

```tsx
"use client"
import { useActionState } from "react"
import { submitPayment } from "@/actions/payment"

function PaymentForm() {
  const [state, formAction, isPending] = useActionState(submitPayment, {})

  return (
    <form action={formAction}>
      <input name="cardNumber" required />
      {state?.error && <div className="error">{state.error}</div>}
      {state?.success && <div className="success">Payment successful!</div>}
      <button disabled={isPending} type="submit">
        {isPending ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  )
}
```

**Server Action:**

```tsx
"use server"
import { z } from "zod"

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Invalid card number")
})

export async function submitPayment(previousState, formData) {
  try {
    const data = {
      cardNumber: formData.get("cardNumber")
    }

    const validated = paymentSchema.parse(data)
    const result = await processPayment(validated)

    return {
      success: true,
      message: "Payment processed!",
      orderId: result.orderId
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
```

**Why this matters:**

- **70% less boilerplate** - No manual useState for state, isPending, error
- **Progressive enhancement** - Forms work before JS hydration with Server Actions
- **Built-in pending state** - isPending automatically tracks loading
- **Type-safe errors** - Server validation errors flow naturally into state
- **Single hook** - Combines all form concerns (state, pending, actions)
- **Works with `<form action>`** - Modern HTML form semantics

**Use useActionState when:**

- Handling form submissions with Server Actions
- Need to display validation errors or success messages
- Want automatic loading state with `isPending`
- Building forms that should work with progressive enhancement
- Managing form state with server-side validation

**When to avoid:**

- Managing non-form component state (use `useState` instead)
- Client-side only validation without Server Actions (combine with `useState`)
- Complex multi-step forms (consider extracting sub-components)

Reference: [React 19 useActionState](https://react.dev/reference/react/useActionState)
