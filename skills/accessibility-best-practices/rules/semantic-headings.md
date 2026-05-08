---
title: Maintain Proper Heading Hierarchy
impact: CRITICAL
impactDescription: Headings are the primary way screen reader users scan and navigate pages
tags: semantic, headings, navigation, screen-reader, structure
wcag: "1.3.1 Level A"
---

## Maintain Proper Heading Hierarchy

**Impact: CRITICAL (Headings are the primary way screen reader users scan and navigate pages)**

Headings (`h1`–`h6`) must follow a logical hierarchy without skipping levels. Screen reader users rely on headings to understand page structure and jump between sections. Most screen readers have a shortcut to list all headings on a page.

**Incorrect (skipped heading levels, styled divs instead of headings):**

```tsx
function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      {/* Skipped h2, jumped to h4 */}
      <h4>Product Details</h4>
      <p>{product.description}</p>
      {/* Styled div instead of heading */}
      <div className="text-2xl font-bold">Reviews</div>
      <h5>Customer Ratings</h5>
    </div>
  )
}
```

**Correct (logical heading hierarchy):**

```tsx
function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <h2>Product Details</h2>
      <p>{product.description}</p>
      <h2>Reviews</h2>
      <h3>Customer Ratings</h3>
    </div>
  )
}
```

Every page should have exactly one `h1`. Use CSS classes to control visual size independently of heading level — heading level communicates structure, not appearance.

Reference: [WCAG 1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
