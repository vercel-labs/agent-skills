---
title: Use the use() Hook for Unwrapping Promises in Sync Components
impact: MEDIUM
impactDescription: enables promise handling without async/await
tags: advanced, async, promises, suspense
---

## Use the use() Hook for Unwrapping Promises in Sync Components

**Impact: MEDIUM (enables promise handling without async/await)**

React's `use()` hook allows synchronous components to read the value of a Promise by integrating with Suspense. This is useful when you receive a Promise as a prop but can't make the component async.

**Incorrect (cannot use await in sync component):**

```tsx
type Props = { dataPromise: Promise<Data> }

// This won't work - can't use await without async
function DataDisplay({ dataPromise }: Props) {
  const data = await dataPromise // SyntaxError!
  return <div>{data.title}</div>
}
```

You cannot use `await` in a synchronous component function.

**Incorrect (useEffect with state):**

```tsx
type Props = { dataPromise: Promise<Data> }

function DataDisplay({ dataPromise }: Props) {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    dataPromise.then(setData)
  }, [dataPromise])

  if (!data) return <div>Loading...</div>
  return <div>{data.title}</div>
}
```

This works but requires managing loading state manually and doesn't integrate with Suspense boundaries.

**Correct (use() hook):**

```tsx
import { use } from 'react'

type Props = { dataPromise: Promise<Data> }

function DataDisplay({ dataPromise }: Props) {
  const data = use(dataPromise)
  return <div>{data.title}</div>
}

// Parent component with Suspense
function Page() {
  const dataPromise = fetchData() // Returns Promise<Data>

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataDisplay dataPromise={dataPromise} />
    </Suspense>
  )
}
```

The `use()` hook suspends the component until the Promise resolves, working seamlessly with Suspense boundaries.

**Correct (with context):**

```tsx
import { use } from 'react'

const ThemeContext = createContext<Theme | null>(null)

function Button() {
  // use() also works with Context (alternative to useContext)
  const theme = use(ThemeContext)
  return <button style={{ color: theme?.color }}>Click</button>
}
```

Unlike other hooks, `use()` can be called conditionally and works with both Promises and Context.

**Key differences from other hooks:**

- Can be called inside loops and conditionals
- Works with Promises (suspends until resolved)
- Works with Context (like `useContext`)
- The Promise must be created outside the component or cached to avoid re-creating on every render

Reference: [React use](https://react.dev/reference/react/use)
