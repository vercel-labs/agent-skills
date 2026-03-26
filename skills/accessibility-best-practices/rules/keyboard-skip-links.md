---
title: Add Skip Navigation Links
impact: HIGH
impactDescription: Keyboard users must otherwise tab through entire header/nav on every page
tags: keyboard, skip-link, navigation, efficiency
wcag: "2.4.1 Level A"
---

## Add Skip Navigation Links

**Impact: HIGH (Keyboard users must otherwise tab through entire header/nav on every page)**

Provide a "Skip to main content" link as the first focusable element on the page. This lets keyboard and screen reader users bypass repetitive navigation and jump directly to the primary content.

**Incorrect (no skip link — user must tab through all nav items):**

```tsx
function Layout({ children }) {
  return (
    <>
      <header>
        <nav>
          {/* 15 navigation links the user must tab through on every page */}
          <a href="/">Home</a>
          <a href="/products">Products</a>
          {/* ... many more */}
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}
```

**Correct (skip link as first focusable element):**

```tsx
function Layout({ children }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:text-black"
      >
        Skip to main content
      </a>
      <header>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/products">Products</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}
```

The skip link should be visually hidden by default and become visible on focus. The `tabIndex={-1}` on `<main>` ensures focus moves to the content when the skip link is activated. Use `sr-only` (Tailwind) or equivalent visually-hidden class.

Reference: [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
