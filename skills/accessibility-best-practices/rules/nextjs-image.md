---
title: Use next/image with Proper Alt Text
impact: HIGH
impactDescription: next/image requires alt but developers often pass empty or generic values
tags: nextjs, image, alt-text, performance, screen-reader
wcag: "1.1.1 Level A"
---

## Use next/image with Proper Alt Text

**Impact: HIGH (next/image requires alt but developers often pass empty or generic values)**

`next/image` requires the `alt` prop (a TypeScript error without it), but developers often pass empty strings or generic text for all images. Use meaningful alt text for informative images and `alt=""` only for truly decorative images.

**Incorrect (generic or meaningless alt text):**

```tsx
import Image from 'next/image'

// Generic alt that doesn't describe the image
<Image src="/hero.jpg" alt="image" width={1200} height={600} />

// Same alt for every product image
<Image src={product.image} alt="product" width={300} height={300} />

// Redundant "picture of"
<Image src="/team.jpg" alt="Picture of the team" width={800} height={400} />
```

**Correct (descriptive, context-appropriate alt text):**

```tsx
import Image from 'next/image'

// Describes the hero image content
<Image
  src="/hero.jpg"
  alt="Developer working at a standing desk with dual monitors showing code"
  width={1200}
  height={600}
  priority // Above-fold hero image should use priority
/>

// Product-specific alt text
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
/>

// Decorative background — empty alt is correct here
<Image
  src="/pattern-bg.png"
  alt=""
  fill
  className="object-cover -z-10"
/>
```

Use `priority` on above-the-fold images (hero, LCP) for performance. Combine `fill` with `sizes` for responsive images to generate optimal srcsets.

Reference: [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
