---
title: Use useTransition Over Manual Loading States
impact: LOW
impactDescription: reduces re-renders and improves code clarity
tags: rendering, transitions, useTransition, loading, state
---

## Use useTransition Over Manual Loading States

Use `useTransition` instead of manual `useState` for loading states. This provides built-in `isPending` state and automatically manages transitions.

**Incorrect (manual loading state):**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Correct (useTransition with built-in pending state):**

```tsx
import { useRef, useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()
  const controllerRef = useRef<AbortController | null>(null)

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    // Cancel the previous request so it can't overwrite this one
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    startTransition(async () => {
      try {
        const data = await fetchResults(value, controller.signal) // pass signal to fetch()
        // Updates after `await` are not Transitions unless wrapped again
        startTransition(() => {
          setResults(data)
        })
      } catch (e) {
        if ((e as Error).name !== 'AbortError') throw e
      }
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Benefits:**

- **Automatic pending state**: No need to manually manage `setIsLoading(true/false)`
- **Better responsiveness**: Keeps the UI responsive during updates

**Caveats (from the React docs):**

- **State updates after `await` are not Transitions.** Wrap each one in another `startTransition`, as above.
- **Async Actions are not ordered or cancelled.** "Actions within a Transition do not guarantee execution order", so a slow earlier request can overwrite a newer one. Ongoing Transitions are also batched: the newest results and `isPending` wait for every request still in flight. Aborting the previous request (as above) fixes both. `useActionState` and `<form>` actions handle ordering for you.
- **Errors go to the nearest error boundary.** A function passed to `startTransition` that throws shows the error boundary. The example rethrows everything except `AbortError`; catch inside the action if you want an inline error message.

Reference: [useTransition](https://react.dev/reference/react/useTransition)
