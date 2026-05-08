---
title: Use Landmark Elements for Page Structure
impact: CRITICAL
impactDescription: Screen reader users navigate by landmarks — missing landmarks means no structural navigation
tags: semantic, landmarks, navigation, screen-reader
wcag: "1.3.1 Level A"
---

## Use Landmark Elements for Page Structure

**Impact: CRITICAL (Screen reader users navigate by landmarks — missing landmarks means no structural navigation)**

Landmark elements (`<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<section>`) allow screen reader users to jump directly to regions of the page. Without them, users must traverse every element linearly.

**Incorrect (div-soup with no landmarks):**

```tsx
function Layout({ children }) {
  return (
    <div className="app">
      <div className="top-bar">
        <div className="logo">My App</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </div>
      </div>
      <div className="content">{children}</div>
      <div className="bottom">© 2026</div>
    </div>
  )
}
```

**Correct (semantic landmarks):**

```tsx
function Layout({ children }) {
  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">My App</div>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer className="bottom">© 2026</footer>
    </div>
  )
}
```

When you have multiple `<nav>` or `<aside>` elements, give each a unique `aria-label` so screen reader users can distinguish between them.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
