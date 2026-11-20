---
title: Return Error State From Server Actions Instead of Throwing
impact: MEDIUM-HIGH
impactDescription: 60-80% better error UX by keeping forms functional on failure
tags: server, server-actions, error-handling, forms, useActionState
---

## Return Error State From Server Actions Instead of Throwing

**Impact: MEDIUM-HIGH (60-80% better error UX by keeping forms functional on failure)**

When a Server Action encounters a validation or business logic error, return an error object instead of throwing. Thrown errors trigger the nearest `error.tsx` boundary, which replaces the entire UI. Returned errors let you show inline feedback while keeping the form usable.

**Incorrect (throw replaces the form with error.tsx):**

```tsx
'use server'

export async function createAccount(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    // This triggers error.tsx - user loses their form input
    throw new Error('Email already exists')
  }

  await db.user.create({ data: { email } })
  return { success: true }
}
```

**Correct (return error state for inline display):**

```tsx
'use server'

type ActionState = { error?: string; success?: boolean }

export async function createAccount(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    // Form stays intact, error shows inline
    return { error: 'An account with this email already exists.' }
  }

  await db.user.create({ data: { email } })
  return { success: true }
}
```

```tsx
'use client'

import { useActionState } from 'react'
import { createAccount } from './actions'

function SignupForm() {
  const [state, action, isPending] = useActionState(createAccount, {})

  return (
    <form action={action}>
      <input name="email" type="email" />
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  )
}
```

**When to throw vs return:**

- **Return errors** for expected failures: validation, duplicates, rate limits, permissions
- **Throw errors** only for unexpected failures: database connection lost, unrecoverable state. These should hit `error.tsx` because the page genuinely can't function.

Reference: [Next.js Server Action error handling](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#error-handling)
