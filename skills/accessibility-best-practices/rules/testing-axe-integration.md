---
title: Integrate axe-core in Development and CI
impact: MEDIUM-HIGH
impactDescription: Automated testing catches 30-50% of accessibility issues before they reach production
tags: testing, axe, automated, ci, deque
wcag: "N/A"
---

## Integrate axe-core in Development and CI

**Impact: MEDIUM-HIGH (Automated testing catches 30-50% of accessibility issues before they reach production)**

Use axe-core for automated accessibility testing during development and in CI pipelines. It catches missing labels, broken ARIA, contrast issues, and structural problems. Integrate it at three levels: dev overlay, unit tests, and CI.

**Development overlay with @axe-core/react:**

```tsx
// components/axe-helper.tsx — must be a Client Component
'use client'

import { useEffect } from 'react'

export function AxeHelper() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react').then((axe) => {
        const React = require('react')
        const ReactDOM = require('react-dom/client')
        axe.default(React, ReactDOM, 1000)
      })
    }
  }, [])
  return null
}

// app/layout.tsx — render conditionally
import { AxeHelper } from '@/components/axe-helper'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <AxeHelper />}
      </body>
    </html>
  )
}
```

**Unit/component tests with jest-axe:**

```tsx
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('LoginForm has no accessibility violations', async () => {
  const { container } = render(<LoginForm />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

**E2E tests with @axe-core/playwright:**

```tsx
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home page has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

Automated testing catches structural issues but cannot verify subjective things like alt text quality, logical reading order, or cognitive clarity. Combine with manual testing.

Reference: [axe-core on GitHub](https://github.com/dequelabs/axe-core)
