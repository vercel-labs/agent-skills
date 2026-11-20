---
title: Use useOptimistic for Instant UI Feedback on Mutations
impact: HIGH
impactDescription: eliminates perceived latency on form submissions
tags: server, server-actions, useOptimistic, forms, mutations
---

## Use useOptimistic for Instant UI Feedback on Mutations

**Impact: HIGH (eliminates perceived latency on form submissions)**

When a Server Action mutates data, use `useOptimistic` to update the UI immediately instead of waiting for the server response. The optimistic state shows instantly and automatically rolls back if the action fails.

**Incorrect (UI freezes until server responds):**

```tsx
'use client'

import { useState } from 'react'
import { addTodo } from './actions'

function TodoList({ todos }: { todos: Todo[] }) {
  const [items, setItems] = useState(todos)

  async function handleAdd(formData: FormData) {
    // User sees nothing until the server responds
    const newTodo = await addTodo(formData)
    setItems(prev => [...prev, newTodo])
  }

  return (
    <form action={handleAdd}>
      <input name="title" />
      <button type="submit">Add</button>
      <ul>
        {items.map(todo => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </form>
  )
}
```

**Correct (UI updates instantly, rolls back on error):**

```tsx
'use client'

import { useOptimistic } from 'react'
import { addTodo } from './actions'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTitle: string) => [
      ...state,
      { id: crypto.randomUUID(), title: newTitle, pending: true }
    ]
  )

  async function handleAdd(formData: FormData) {
    const title = formData.get('title') as string
    addOptimisticTodo(title)
    await addTodo(formData)
  }

  return (
    <form action={handleAdd}>
      <input name="title" />
      <button type="submit">Add</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.pending ? 0.6 : 1 }}>
            {todo.title}
          </li>
        ))}
      </ul>
    </form>
  )
}
```

The new item appears immediately with a pending visual indicator. If the Server Action fails, React automatically reverts to the previous state on the next render.

**When to use:**

- Adding, updating, or deleting items in a list
- Toggling states (like/unlike, follow/unfollow)
- Any mutation where the expected outcome is predictable

**Note:** `useOptimistic` resets to the server state when the parent component re-renders with new props. Pair it with `revalidatePath` or `revalidateTag` in your Server Action so the server state flows back after the mutation.

Reference: [React useOptimistic](https://react.dev/reference/react/useOptimistic)
