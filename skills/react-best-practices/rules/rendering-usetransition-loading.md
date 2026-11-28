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
  const latestQuery = useRef('')

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately
    latestQuery.current = value

    startTransition(async () => {
      const data = await fetchResults(value)
      // An older, slower request can resolve after a newer one: drop it
      if (latestQuery.current !== value) return
      // Updates after `await` are not Transitions unless wrapped again
      startTransition(() => {
        setResults(data)
      })
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
- **Transitions are not cancelled.** Multiple ongoing Transitions are batched together, and async results can arrive out of order, so a slow earlier request can overwrite a newer one. Guard against stale responses (as above), or let a data library handle ordering.
- **Errors go to the nearest error boundary.** A function passed to `startTransition` that throws shows the error boundary, so catch errors inside the action if you want an inline error message.

Reference: [useTransition](https://react.dev/reference/react/useTransition)
