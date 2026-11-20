---
title: Never Use Color Alone to Convey Information
impact: HIGH
impactDescription: Color-blind users (8% of men) cannot distinguish information conveyed only by color
tags: color, color-blind, indicators, patterns
wcag: "1.4.1 Level A"
---

## Never Use Color Alone to Convey Information

**Impact: HIGH (Color-blind users (8% of men) cannot distinguish information conveyed only by color)**

When using color to indicate status, errors, categories, or required fields, always provide a secondary visual indicator: text labels, icons, patterns, or underlines. Approximately 1 in 12 men have some form of color vision deficiency.

**Incorrect (color is the only differentiator):**

```tsx
// Status indicated only by color — red/green indistinguishable for many
function StatusBadge({ status }) {
  return (
    <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
      ●
    </span>
  )
}

// Required fields indicated only by red asterisk color
<label className="text-red-500">* Email</label>

// Link distinguished from text only by color
<p>Read our <span className="text-blue-500" onClick={openTerms}>terms</span></p>
```

**Correct (color plus secondary indicator):**

```tsx
// Status uses color AND text label AND icon
function StatusBadge({ status }) {
  return (
    <span className={status === 'active' ? 'text-green-700' : 'text-red-700'}>
      {status === 'active' ? '✓ Active' : '✗ Inactive'}
    </span>
  )
}

// Required fields use asterisk with explicit "(required)" text
<label>
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input required aria-required="true" />

// Links underlined in addition to color
<p>Read our <a href="/terms" className="text-blue-600 underline">terms</a></p>
```

For charts and graphs, use patterns, labels, or different shapes in addition to colors. For form errors, combine red color with error icons and text messages.

Reference: [WCAG 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
