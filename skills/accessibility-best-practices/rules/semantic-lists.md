---
title: Use Proper List Markup for List Content
impact: HIGH
impactDescription: Screen readers announce list length and position, aiding comprehension
tags: semantic, lists, screen-reader, structure
wcag: "1.3.1 Level A"
---

## Use Proper List Markup for List Content

**Impact: HIGH (Screen readers announce list length and position, aiding comprehension)**

When content is logically a list (navigation links, feature lists, search results), use `<ul>`, `<ol>`, or `<dl>`. Screen readers announce "list, 5 items" and let users skip entire lists, which is impossible with plain divs.

**Incorrect (divs styled to look like a list):**

```tsx
function FeatureList({ features }) {
  return (
    <div className="features">
      {features.map((f) => (
        <div key={f.id} className="feature-item">
          {f.name}
        </div>
      ))}
    </div>
  )
}
```

**Correct (semantic list):**

```tsx
function FeatureList({ features }) {
  return (
    <ul className="features">
      {features.map((f) => (
        <li key={f.id} className="feature-item">
          {f.name}
        </li>
      ))}
    </ul>
  )
}
```

Use `<ol>` for ordered/ranked content (steps, rankings). Use `<dl>` for key-value pairs (definitions, metadata).

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
