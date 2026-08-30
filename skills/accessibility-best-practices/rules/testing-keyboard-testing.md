---
title: Include Keyboard Navigation in Test Suites
impact: MEDIUM
impactDescription: Keyboard regressions are easy to introduce and hard to catch without dedicated tests
tags: testing, keyboard, e2e, playwright, regression
wcag: "2.1.1 Level A"
---

## Include Keyboard Navigation in Test Suites

**Impact: MEDIUM (Keyboard regressions are easy to introduce and hard to catch without dedicated tests)**

Write explicit tests for keyboard navigation: Tab order, Enter/Space activation, Escape to dismiss, arrow key navigation within widgets. These catch regressions from CSS changes (display:none breaking focus), refactors, and new components.

**Key keyboard interactions to test:**

```tsx
import { test, expect } from '@playwright/test'

test('modal keyboard interaction', async ({ page }) => {
  await page.goto('/dashboard')

  // Open modal with keyboard
  await page.getByRole('button', { name: 'Add item' }).press('Enter')

  // Verify focus moved into modal
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  // First focusable element in modal should be focused
  const closeButton = dialog.getByRole('button', { name: 'Close' })
  await expect(closeButton).toBeFocused()

  // Tab should cycle within modal (not escape to background)
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  // Should wrap back to first focusable element
  await expect(closeButton).toBeFocused()

  // Escape closes modal
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()

  // Focus returns to trigger button
  await expect(page.getByRole('button', { name: 'Add item' })).toBeFocused()
})

test('navigation menu keyboard interaction', async ({ page }) => {
  await page.goto('/')

  // Tab to skip link
  await page.keyboard.press('Tab')
  await expect(page.getByText('Skip to main content')).toBeFocused()

  // Activate skip link
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})
```

Include keyboard tests for every interactive component: modals, dropdowns, tabs, accordions, and form flows.

Reference: [Playwright Keyboard API](https://playwright.dev/docs/api/class-keyboard)
