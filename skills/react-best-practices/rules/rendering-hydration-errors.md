---
title: Common Hydration Error Patterns and Fixes
impact: HIGH
impactDescription: prevents hydration mismatches in SSR applications
tags: rendering, hydration, ssr, debugging
---

## Common Hydration Error Patterns and Fixes

**Impact: HIGH (prevents hydration mismatches in SSR applications)**

Hydration errors occur when the server-rendered HTML doesn't match what React expects on the client. These errors cause visual glitches, broken interactivity, and performance issues.

### 1. Browser-Only APIs

Code using `window`, `document`, `localStorage`, or other browser APIs renders differently on server vs client.

**Incorrect (throws on server):**

```tsx
function UserGreeting() {
  // window is undefined on server - throws error
  const width = window.innerWidth
  return <div>{width > 768 ? 'Desktop' : 'Mobile'}</div>
}
```

**Incorrect (hydration mismatch):**

```tsx
function UserGreeting() {
  // Returns different values on server vs client
  const name = localStorage.getItem('userName') || 'Guest'
  return <div>Hello, {name}</div>
}
```

**Correct (mounted check pattern):**

```tsx
'use client'

function UserGreeting() {
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('Guest')

  useEffect(() => {
    setMounted(true)
    setName(localStorage.getItem('userName') || 'Guest')
  }, [])

  // Render consistent content until mounted
  if (!mounted) return <div>Hello, Guest</div>
  return <div>Hello, {name}</div>
}
```

### 2. Date/Time Rendering

Server and client may have different timezones, causing mismatches.

**Incorrect (timezone mismatch):**

```tsx
function Timestamp({ date }: { date: Date }) {
  // Server timezone may differ from client
  return <time>{date.toLocaleString()}</time>
}
```

**Correct (format on client only):**

```tsx
'use client'

function Timestamp({ date }: { date: Date }) {
  const [formatted, setFormatted] = useState<string>()

  useEffect(() => {
    setFormatted(date.toLocaleString())
  }, [date])

  // Show ISO format during SSR, localized format after hydration
  return <time>{formatted ?? date.toISOString()}</time>
}
```

**Alternative (use suppressHydrationWarning for timestamps):**

```tsx
function Timestamp({ date }: { date: Date }) {
  return (
    <time suppressHydrationWarning>
      {date.toLocaleString()}
    </time>
  )
}
```

### 3. Invalid HTML Nesting

Invalid DOM nesting causes browsers to "fix" the HTML differently than React expects.

**Incorrect (invalid nesting):**

```tsx
function Card() {
  return (
    <p>
      <div>This is invalid - div cannot be inside p</div>
    </p>
  )
}

function List() {
  return (
    <p>
      <p>Nested paragraphs are invalid</p>
    </p>
  )
}
```

**Correct (valid nesting):**

```tsx
function Card() {
  return (
    <div>
      <div>Use div or span instead of p for wrappers</div>
    </div>
  )
}

function List() {
  return (
    <div>
      <p>Use div as wrapper, p for text content</p>
    </div>
  )
}
```

Common invalid nestings to avoid:
- `<p>` inside `<p>`
- `<div>` inside `<p>`
- `<h1-h6>` inside `<p>`
- `<ul>/<ol>` inside `<p>`
- Interactive elements inside `<button>` or `<a>`

### 4. Browser Extensions

Browser extensions may modify the DOM before React hydrates.

**Mitigation (use sparingly):**

```tsx
function App({ children }: { children: ReactNode }) {
  return (
    <body suppressHydrationWarning>
      {children}
    </body>
  )
}
```

Only use `suppressHydrationWarning` when:
- You understand the mismatch is harmless (browser extensions, timestamps)
- You cannot fix the root cause
- It's on a leaf element, not a container with many children

### 5. Conditional Rendering Based on Client State

**Incorrect (renders different content):**

```tsx
function AuthButton() {
  // Check runs on every render, different on server
  const isLoggedIn = typeof window !== 'undefined' &&
    document.cookie.includes('session')

  return isLoggedIn ? <LogoutButton /> : <LoginButton />
}
```

**Correct (consistent initial render):**

```tsx
'use client'

function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('session'))
  }, [])

  // Always render LoginButton on server, update after hydration
  return isLoggedIn ? <LogoutButton /> : <LoginButton />
}
```

### 6. When to Use suppressHydrationWarning

For **expected** mismatches that cannot be avoided (timestamps, locale formatting, random IDs), use `suppressHydrationWarning` to silence warnings. Do not use this to hide real bugs.

**Appropriate use (timestamp that will always differ):**

```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

**Rules for suppressHydrationWarning:**
- Only use on leaf elements with known-safe mismatches
- Never use on containers with many children
- Never use to mask bugs you don't understand
- Prefer fixing the root cause when possible

### Debugging Tips

1. **Use React DevTools**: Enable "Highlight updates" to see unexpected re-renders
2. **Check error overlay**: In development, click hydration errors to see server/client diff
3. **Search for browser APIs**: Look for `window`, `document`, `localStorage`, `navigator` in components
4. **Validate HTML**: Use W3C validator or browser dev tools to check nesting

Reference: [React Hydration Documentation](https://react.dev/reference/react-dom/client/hydrateRoot#handling-different-client-and-server-content)
