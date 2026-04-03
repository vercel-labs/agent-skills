---
title: Manage Focus on Client-Side Route Changes
impact: HIGH
impactDescription: SPA route changes leave screen reader users stranded at the previous location
tags: focus, routing, spa, screen-reader, navigation
wcag: "2.4.3 Level A"
---

## Manage Focus on Client-Side Route Changes

**Impact: HIGH (SPA route changes leave screen reader users stranded at the previous location)**

In single-page applications, client-side navigation doesn't trigger a full page load, so screen readers don't automatically announce the new page. Move focus to the main content area or the new page heading after route changes, and announce the new page title.

**Incorrect (no focus management on route change):**

```tsx
// User clicks link, URL changes, content updates,
// but focus stays on the link they clicked and
// screen reader announces nothing about the new page
function NavLink({ href, children }) {
  return <Link href={href}>{children}</Link>
}
```

**Correct (focus moves to new content on route change):**

```tsx
'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function MainContent({ children }) {
  const pathname = usePathname()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Move focus to main content area on route change
    mainRef.current?.focus()
  }, [pathname])

  return (
    <main ref={mainRef} tabIndex={-1} className="outline-none">
      {children}
    </main>
  )
}
```

Next.js has a built-in route announcer that announces page title changes to screen readers. Ensure every page has a unique, descriptive `<title>` via the metadata API for this to work correctly. The focus management above is complementary to the built-in announcer.

Reference: [Next.js Accessibility - Route Announcements](https://nextjs.org/docs/architecture/accessibility)
