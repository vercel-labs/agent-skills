---
title: Use aria-live for Dynamic Content Updates
impact: HIGH
impactDescription: Screen reader users miss dynamically inserted content without live region announcements
tags: aria, live, dynamic, announcements, screen-reader
wcag: "4.1.3 Level AA"
---

## Use aria-live for Dynamic Content Updates

**Impact: HIGH (Screen reader users miss dynamically inserted content without live region announcements)**

When content updates dynamically (search results, form validation, status changes), use `aria-live` regions to announce changes to screen readers. The live region must exist in the DOM before the content changes — dynamically adding a live region with content won't trigger an announcement.

**Incorrect (dynamic content with no announcement):**

```tsx
function SearchResults({ query, results }) {
  return (
    <div>
      {/* Screen reader users don't know results have updated */}
      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  )
}
```

**Correct (live region announces update):**

```tsx
function SearchResults({ query, results }) {
  return (
    <div>
      {/* This live region is always in the DOM; updating its text triggers announcement */}
      <div aria-live="polite" className="sr-only">
        {results.length} results found for "{query}"
      </div>
      <ul>
        {results.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

Use `aria-live="polite"` for non-urgent updates (search results, status changes). Use `aria-live="assertive"` only for critical, time-sensitive information (errors, alerts). Over-using `assertive` is disruptive.

Reference: [WCAG 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
