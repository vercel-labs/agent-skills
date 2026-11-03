---
title: Defer Non-Critical Third-Party Libraries
impact: MEDIUM
impactDescription: loads after hydration
tags: bundle, third-party, analytics, defer
---

## Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load them after hydration.

**Incorrect (blocks initial bundle):**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Correct (loads after hydration):**

```tsx
// components/analytics-provider.tsx
'use client'

import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export function AnalyticsProvider() {
  return <Analytics />
}
```

```tsx
// app/layout.tsx — remains a Server Component
import { AnalyticsProvider } from '@/components/analytics-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  )
}
```
