# View Transitions in Next.js

## Table of Contents

1. [Setup](#setup)
2. [Layout-Level ViewTransition](#layout-level-viewtransition)
3. [The transitionTypes Prop on next/link](#the-transitiontypes-prop-on-nextlink)
4. [Programmatic Navigation with Transitions](#programmatic-navigation-with-transitions)
5. [Transition Types for Navigation Direction](#transition-types-for-navigation-direction)
6. [Shared Elements Across Routes](#shared-elements-across-routes)
7. [Same-Route Dynamic Segment Transitions](#same-route-dynamic-segment-transitions)
8. [Combining with Suspense and Loading States](#combining-with-suspense-and-loading-states)
9. [Server Components Considerations](#server-components-considerations)

---

## Setup

`<ViewTransition>` works in Next.js out of the box for `startTransition`- and `Suspense`-triggered updates — no config flag is needed for those.

To also animate `<Link>` navigations, enable the experimental flag in `next.config.js` (or `next.config.ts`):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};
module.exports = nextConfig;
```

**What this flag does at runtime:** It wraps every `<Link>` navigation in `document.startViewTransition`. This means all mounted `<ViewTransition>` components in the tree participate in every link navigation — not just transitions triggered by `startTransition` or `Suspense`.

Implications:
- Any `<ViewTransition>` with `default="auto"` (the implicit default) fires the browser's cross-fade on **every** `<Link>` navigation.
- Combined with per-page `<ViewTransition>` components (Suspense reveals, item animations), this produces competing animations.
- Without this flag, `<ViewTransition>` still works for all `startTransition`- and `Suspense`-triggered updates — only `<Link>` navigations won't participate.

---

## Layout-Level ViewTransition

**If your pages already have `<ViewTransition>` components (Suspense reveals, item reorder, shared elements), do NOT add a layout-level `<ViewTransition>` wrapping `{children}` with `default="auto"`.** Both levels fire simultaneously inside a single `document.startViewTransition` — the layout cross-fades the entire old page while the new page's own animations run at the same time. The result is competing, broken-looking animations.

This is the most common view transition mistake in Next.js. Every developer tries this first:

```tsx
// app/layout.tsx — ONLY use this if pages have NO per-page ViewTransitions
import { ViewTransition } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>{/* navigation links */}</nav>
        <ViewTransition>
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}
```

This works for simple apps where pages have **no** `<ViewTransition>` components of their own. The layout detects the content swap on navigation and applies the default cross-fade.

**But the moment any page adds its own `<ViewTransition>` (a Suspense slide-up, an item reorder, a shared element), remove the layout-level one or set `default="none"` on it.** Otherwise both levels animate in parallel, not sequentially.

**Layouts persist across navigations — they never unmount/remount.** `enter`/`exit` props on a `<ViewTransition>` inside a layout only fire when the layout itself first mounts, not on subsequent route changes. Do not use type-keyed `enter`/`exit` maps in a layout for directional navigation — they won't fire.

If you need the layout to stay silent while pages manage their own animations, use `default="none"`:

```tsx
// app/[section]/layout.tsx — prevents layout from interfering with per-page VTs
import { ViewTransition } from 'react';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>{/* persistent navigation */}</nav>
      <main>
        <ViewTransition default="none">
          {children}
        </ViewTransition>
      </main>
    </div>
  );
}
```

This ensures the layout doesn't fire the default cross-fade on every navigation, while still allowing per-page `<ViewTransition>` components to work independently.

---

## The `transitionTypes` Prop on `next/link`

`next/link` supports a native `transitionTypes` prop. This eliminates the need for custom wrapper components that intercept navigation with `onNavigate` + `startTransition` + `addTransitionType` + `router.push()`.

### Before (manual wrapper, requires `'use client'`)

```tsx
'use client';

import { addTransitionType, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function TransitionLink({ type, ...props }: { type: string } & React.ComponentProps<typeof Link>) {
  const router = useRouter();

  return (
    <Link
      onNavigate={(event) => {
        event.preventDefault();
        startTransition(() => {
          addTransitionType(type);
          router.push(props.href as string);
        });
      }}
      {...props}
    />
  );
}
```

### After (native prop, no wrapper needed, works in Server Components)

```tsx
import Link from 'next/link';

<Link href="/products/1" transitionTypes={['transition-to-detail']}>
  View Product
</Link>
```

The `transitionTypes` prop accepts an array of strings. These types are passed to the View Transition system the same way `addTransitionType` would. `<ViewTransition>` components in the tree respond to these types identically.

This is the recommended approach for link-based navigation transitions. Reserve manual `startTransition` + `addTransitionType` for programmatic navigation (buttons, form submissions, etc.) where `next/link` isn't used.

---

## Programmatic Navigation with Transitions

Use `startTransition` with Next.js's `router.push()` to trigger view transitions from code:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition, addTransitionType } from 'react';

export function NavigateButton({ href }: { href: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          addTransitionType('navigation-forward');
          router.push(href);
        });
      }}
    >
      Go to {href}
    </button>
  );
}
```

Wrapping `router.push()` in `startTransition` is what activates the `<ViewTransition>` boundaries in the tree.

---

## Transition Types for Navigation Direction

Directional transitions animate forward/backward navigation with horizontal slides. They can coexist with Suspense reveals on the same page when properly isolated — see the two-layer pattern below.

### Using `transitionTypes` on `next/link` (preferred)

```tsx
import Link from 'next/link';

// Forward navigation
<Link href="/products/1" transitionTypes={['transition-forwards']}>
  Next →
</Link>

// Backward navigation
<Link href="/products" transitionTypes={['transition-backwards']}>
  ← Back
</Link>
```

### Using `startTransition` + `addTransitionType` (for programmatic navigation)

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition, addTransitionType } from 'react';

export function NavigateButton({
  href,
  direction = 'forward',
  children,
}: {
  href: string;
  direction?: 'forward' | 'back';
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          addTransitionType(`navigation-${direction}`);
          router.push(href);
        });
      }}
    >
      {children}
    </button>
  );
}
```

Place a `<ViewTransition>` with type-keyed `enter`/`exit` on each **page** (not in a layout — layouts persist and don't trigger enter/exit on navigation):

```tsx
// In each page component — NOT in layout.tsx
<ViewTransition
  default="none"
  enter={{
    'transition-forwards': 'slide-in-from-right',
    'transition-backwards': 'slide-in-from-left',
    default: 'none',
  }}
  exit={{
    'transition-forwards': 'slide-out-to-left',
    'transition-backwards': 'slide-out-to-right',
    default: 'none',
  }}
>
  <PageContent />
</ViewTransition>
```

### Two-Layer Pattern: Directional Nav + Suspense Reveals

Directional nav slides and Suspense content reveals can coexist on the same page because they fire at **different moments**: the nav slide fires during navigation (when the `transitionTypes` type is present), and the Suspense reveal fires later when streamed data loads (a separate transition with no type). `default="none"` on both layers prevents cross-interference:

```tsx
export default function DetailPage() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "slide-from-right", default: "none" }}
      exit={{ "nav-forward": "slide-to-left", default: "none" }}
      default="none"
    >
      <div>
        <Suspense fallback={
          <ViewTransition exit="slide-down"><HeaderSkeleton /></ViewTransition>
        }>
          <ViewTransition enter="slide-up" default="none">
            <Header />
          </ViewTransition>
        </Suspense>
        <Suspense fallback={
          <ViewTransition exit="slide-down"><ContentSkeleton /></ViewTransition>
        }>
          <ViewTransition enter="slide-up" default="none">
            <Content />
          </ViewTransition>
        </Suspense>
      </div>
    </ViewTransition>
  );
}
```

The outer `<ViewTransition>` only fires when `nav-forward` is present — it stays silent during Suspense resolves (no type, `default: "none"`). The inner `<ViewTransition>`s use simple string props — they fire on Suspense resolve regardless of type.

Place the outer wrapper in each **page component**, not in `layout.tsx` (layouts persist, enter/exit won't fire).

---

## Shared Elements Across Routes

Animate a thumbnail expanding into a full image across route transitions. Use `transitionTypes` on the link to tag the navigation direction:

```tsx
// app/products/page.tsx (list page)
import { ViewTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          transitionTypes={['transition-to-detail']}
        >
          <ViewTransition name={`product-${product.id}`}>
            <Image src={product.image} alt={product.name} width={400} height={300} />
          </ViewTransition>
          <p>{product.name}</p>
        </Link>
      ))}
    </div>
  );
}
```

```tsx
// app/products/[id]/page.tsx (detail page)
import { ViewTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetail({ product }) {
  return (
    <article>
      <Link href="/products" transitionTypes={['transition-to-list']}>
        ← Back to Products
      </Link>
      <ViewTransition name={`product-${product.id}`}>
        <Image src={product.image} alt={product.name} width={800} height={600} />
      </ViewTransition>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </article>
  );
}
```

Only one `<ViewTransition>` with a given name can be mounted at a time. Since Next.js unmounts the old page and mounts the new page within the same transition, the two `product-${product.id}` boundaries form a shared element pair and the image morphs from its thumbnail size to its full size.

---

## Same-Route Dynamic Segment Transitions

When navigating between dynamic segments of the same route (e.g., `/collection/[slug]`), the page component stays mounted — enter/exit never fire. The `key` + `name` + `share` pattern forces a shared element transition between old and new content:

```tsx
<Suspense fallback={<Skeleton />}>
  <ViewTransition key={slug} name={`content-${slug}`} share="auto" default="none">
    <Content slug={slug} />
  </ViewTransition>
</Suspense>
```

How it works:
- `key={slug}` forces unmount/remount on segment change, triggering exit + enter
- `name` + `share="auto"` pairs old and new into a shared element transition (cross-fade)
- `default="none"` prevents animation on Suspense reveals and other unrelated transitions
- Placing the `<ViewTransition>` inside `<Suspense>` (without keying `Suspense`) lets React keep old content visible during loading, then cross-fade directly to new content — no skeleton flash

Compare with `Suspense key={slug}` (keying Suspense instead), which remounts the Suspense boundary and shows the skeleton fallback on every segment change. Use that approach when a loading state is acceptable.

---

## Combining with Suspense and Loading States

Next.js `loading.tsx` files create `<Suspense>` boundaries. Wrap them with `<ViewTransition>` for smooth fallback-to-content reveals. Place the Suspense `<ViewTransition>` in the page, not alongside a layout-level one:

```tsx
// In a page or page-level component — NOT in a layout that also has a ViewTransition on {children}
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <PageSkeleton />
    </ViewTransition>
  }
>
  <ViewTransition default="none" enter="slide-up">
    <PageContent />
  </ViewTransition>
</Suspense>
```

The skeleton slides out, then the content slides in. `default="none"` on the content prevents it from re-animating on unrelated transitions.

**Do not combine this with a layout-level `<ViewTransition>` that has `default="auto"`.** Both fire during the same transition — the layout cross-fades while the Suspense boundary slides up, producing competing animations. Use `default="none"` on layout-level `<ViewTransition>`s, or remove them entirely.

Directional navigation transitions (via `transitionTypes`) can coexist with Suspense reveals when placed as an outer wrapper in the page component with `default="none"` and type-keyed enter/exit — they fire at different moments (see "Two-Layer Pattern" in Transition Types for Navigation Direction).

---

## Server Components Considerations

- `<ViewTransition>` can be used in both Server and Client Components — it renders no DOM of its own.
- `<Link>` with `transitionTypes` works in Server Components — no `'use client'` directive needed for link-based transitions.
- `addTransitionType` must be called from a Client Component (inside an event handler with `startTransition`).
- `startTransition` for programmatic navigation must be called from a Client Component.
- Navigation via `<Link>` from `next/link` triggers transitions automatically when the experimental flag is enabled.
- Prefer `transitionTypes` on `<Link>` over custom wrapper components. Only use manual `startTransition` + `addTransitionType` + `router.push()` for non-link interactions (buttons, form submissions, etc.).
