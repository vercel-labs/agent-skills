---
title: Communicate Loading States Accessibly
impact: MEDIUM-HIGH
impactDescription: Screen reader users don't know content is loading without explicit announcements
tags: dynamic, loading, spinner, aria-busy, screen-reader
wcag: "4.1.3 Level AA"
---

## Communicate Loading States Accessibly

**Impact: MEDIUM-HIGH (Screen reader users don't know content is loading without explicit announcements)**

Visual loading indicators (spinners, skeletons, progress bars) must be communicated to screen readers. Use `aria-busy`, `aria-live`, `role="status"`, or `role="progressbar"` to convey loading state.

**Incorrect (visual spinner with no accessible indication):**

```tsx
function DataTable({ isLoading, data }) {
  return (
    <div>
      {isLoading ? (
        // Spinner is purely visual — screen reader sees nothing
        <div className="spinner animate-spin" />
      ) : (
        <table>{/* data rows */}</table>
      )}
    </div>
  )
}
```

**Correct (loading state communicated to assistive tech):**

```tsx
function DataTable({ isLoading, data }) {
  return (
    <div aria-busy={isLoading}>
      {isLoading && (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading data, please wait...</span>
          <div className="spinner animate-spin" aria-hidden="true" />
        </div>
      )}
      {!isLoading && (
        <div aria-live="polite">
          <span className="sr-only">{data.length} rows loaded</span>
          <table>{/* data rows */}</table>
        </div>
      )}
    </div>
  )
}
```

Use `aria-busy="true"` on the container being updated to tell assistive technologies to wait before announcing content. Announce when loading completes so users know they can interact.

Reference: [WCAG 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
