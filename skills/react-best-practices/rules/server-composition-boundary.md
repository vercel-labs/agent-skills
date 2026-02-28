---
title: Pass Server Components as Children to Client Wrappers
impact: HIGH
impactDescription: prevents unintended client-side bundling of server-rendered subtrees
tags: server, rsc, use-client, children, composition, providers
---

## Pass Server Components as Children to Client Wrappers

**Impact: HIGH (prevents unintended client-side bundling of server-rendered subtrees)**

Importing a Server Component inside a `'use client'` file forces it — and everything it imports — into the client bundle. Instead, accept `children` and let a Server Component compose both.

**Incorrect (Server Component imported inside Client Component):**

```tsx
'use client'
// providers.tsx
import { useState, createContext } from 'react'
import { ServerDashboard } from './server-dashboard'

const ThemeContext = createContext('light')

export function Providers() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <ServerDashboard />  {/* ❌ forced into client bundle */}
    </ThemeContext.Provider>
  )
}
```

**Correct (Server Component passed as children):**

```tsx
'use client'
// providers.tsx
import { useState, createContext, type ReactNode } from 'react'

const ThemeContext = createContext('light')

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
```

```tsx
// layout.tsx — Server Component orchestrates composition
import { Providers } from './providers'
import { ServerDashboard } from './server-dashboard'

export default function RootLayout() {
  return (
    <Providers>
      <ServerDashboard />  {/* ✅ stays a Server Component */}
    </Providers>
  )
}
```

The Server Component is evaluated on the server and its output (RSC Payload) is passed through the `children` slot. The Client Component never sees the source — only the serialized result.

Reference: [Composition Patterns – Next.js Docs](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#supported-pattern-passing-server-components-to-client-components-as-props)
