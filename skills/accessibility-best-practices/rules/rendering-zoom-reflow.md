---
title: Support Content Reflow at 400% Zoom Without Horizontal Scroll
impact: HIGH
impactDescription: Low-vision users who zoom to 400% get broken layouts with horizontal scrolling
tags: rendering, zoom, reflow, responsive, low-vision
wcag: "1.4.10 Level AA"
---

## Support Content Reflow at 400% Zoom Without Horizontal Scroll

**Impact: HIGH (Low-vision users who zoom to 400% get broken layouts with horizontal scrolling)**

Content must reflow into a single column at 400% zoom (equivalent to a 320px viewport) without requiring horizontal scrolling. This is how low-vision users read the web. Fixed-width layouts and horizontal arrangements that don't stack break at high zoom levels.

**Incorrect (fixed widths that cause horizontal scroll at zoom):**

```tsx
// Fixed-width container doesn't reflow
<div className="w-[1200px]">
  <div className="flex gap-8">
    <aside className="w-[300px]">Sidebar</aside>
    <main className="w-[900px]">Content</main>
  </div>
</div>

// Table with fixed column widths — forces horizontal scroll
<table className="w-[800px]">
  <tr>
    <td className="w-[200px]">Name</td>
    <td className="w-[300px]">Description</td>
    <td className="w-[300px]">Details</td>
  </tr>
</table>
```

**Correct (responsive layout that reflows):**

```tsx
// Responsive container with stacking at narrow viewports
<div className="max-w-7xl mx-auto px-4">
  <div className="flex flex-col md:flex-row gap-8">
    <aside className="md:w-1/4">Sidebar</aside>
    <main className="md:w-3/4">Content</main>
  </div>
</div>

// Responsive table that stacks or scrolls within its container
<div className="overflow-x-auto" role="region" aria-label="User data" tabIndex={0}>
  <table className="w-full">
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>Details</td>
    </tr>
  </table>
</div>
```

Test by setting your browser to 400% zoom or resizing the viewport to 320px wide. When wrapping data tables in a scrollable container, add `role="region"`, an `aria-label`, and `tabIndex={0}` so keyboard users can scroll it.

Reference: [WCAG 1.4.10 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
