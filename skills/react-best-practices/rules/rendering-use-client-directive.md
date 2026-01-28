---
title: Understanding 'use client' Directive
impact: HIGH
impactDescription: prevents architectural mistakes in React Server Components
tags: rendering, rsc, server-components, client-components, architecture
---

## Understanding 'use client' Directive

**Impact: HIGH (prevents architectural mistakes in React Server Components)**

**Common misconception**: `'use client'` means the code runs only in the browser.

**Reality**: Client Components still render on the server (SSR), then hydrate on the client. The directive marks the boundary between Server Components and Client Components, not between server and browser execution.

**Incorrect (accessing window without guard):**

```tsx
'use client'

function Sidebar() {
  // WRONG: window is undefined during SSR
  const width = window.innerWidth
  return <nav style={{ width: width > 768 ? 250 : '100%' }}>...</nav>
}
```

This crashes during server rendering because `window` doesn't exist on the server.

**Correct (guard browser APIs with typeof check or useEffect):**

```tsx
'use client'

function Sidebar() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Safe: only runs in browser after hydration
    setWidth(window.innerWidth)
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <nav style={{ width: width > 768 ? 250 : '100%' }}>...</nav>
}
```

**Incorrect (adding 'use client' to entire page):**

```tsx
'use client'

export default function Page() {
  const [state, setState] = useState()
  // Everything here ships to client, even static content
  return (
    <div>
      <h1>Welcome</h1>
      <p>Static content that could stay on server...</p>
      <InteractiveWidget state={state} />
    </div>
  )
}
```

Making the entire page a Client Component ships unnecessary JavaScript and prevents server-side data fetching.

**Correct (push 'use client' down the tree):**

```tsx
// Page stays as Server Component
export default async function Page() {
  const data = await fetchData() // Can fetch data directly
  return (
    <div>
      <h1>Welcome</h1>
      <p>Static content stays on server</p>
      <InteractiveWidget initialData={data} /> {/* Only this needs 'use client' */}
    </div>
  )
}

// Separate file: InteractiveWidget.tsx
'use client'

export function InteractiveWidget({ initialData }) {
  const [state, setState] = useState(initialData)
  return <button onClick={() => setState(...)}>Click</button>
}
```

### When to Use 'use client'

Add `'use client'` when you need:
- React hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (after hydration)
- Class components with lifecycle methods

### When NOT to Use 'use client'

Keep components as Server Components when:
- Only displaying data (no interactivity)
- Fetching and passing data to children
- Using server-only features (database, file system)

### Common Mistake: Thinking 'use client' Skips SSR

**Incorrect (assuming no server render):**

```tsx
'use client'

function Timer() {
  // WRONG assumption: "This won't run on server"
  // REALITY: This WILL run on server during SSR
  const now = new Date()
  return <div>{now.toLocaleString()}</div>
}
```

This causes hydration mismatch because the date differs between server and client.

**Correct (handle client-only values properly):**

```tsx
'use client'

function Timer() {
  const [now, setNow] = useState<Date>()

  useEffect(() => {
    setNow(new Date())
  }, [])

  return <div>{now?.toLocaleString() ?? 'Loading...'}</div>
}
```

Reference: [React Server Components](https://react.dev/reference/rsc/server-components)
