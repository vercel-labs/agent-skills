---
title: Use Metadata API for Accessible Page Titles
impact: HIGH
impactDescription: Screen readers announce page titles on navigation — missing titles leave users disoriented
tags: nextjs, metadata, title, screen-reader, navigation
wcag: "2.4.2 Level A"
---

## Use Metadata API for Accessible Page Titles

**Impact: HIGH (Screen readers announce page titles on navigation — missing titles leave users disoriented)**

Every page must have a unique, descriptive `<title>` that identifies the page content and site. In Next.js App Router, use the `metadata` export or `generateMetadata` function. The page title is the first thing screen readers announce and is critical for users with multiple tabs open.

**Incorrect (missing or generic titles):**

```tsx
// app/products/[id]/page.tsx
// No metadata export — page has default or no title
export default function ProductPage({ params }) {
  return <div>...</div>
}

// Generic title that doesn't identify the page
export const metadata = {
  title: 'Page',
}
```

**Correct (unique, descriptive titles):**

```tsx
// app/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)
  return {
    title: `${product.name} | Acme Store`,
    description: product.summary,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>...</div>
}

// app/layout.tsx — template for consistent title suffix
export const metadata = {
  title: {
    template: '%s | Acme Store',
    default: 'Acme Store — Premium Products',
  },
}
```

Use the `title.template` pattern in the root layout to ensure consistent site-name suffixing. The `%s` is replaced by child page titles. The `default` is used when a child page doesn't set a title.

Reference: [WCAG 2.4.2 Page Titled](https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html)
