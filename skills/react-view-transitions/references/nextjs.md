# View Transitions in Next.js

## Table of Contents

1. [Setup](#setup)
2. [Basic Route Transitions](#basic-route-transitions)
3. [Layout-Level ViewTransition](#layout-level-viewtransition)
4. [The transitionTypes Prop on next/link](#the-transitiontypes-prop-on-nextlink)
5. [Programmatic Navigation with Transitions](#programmatic-navigation-with-transitions)
6. [Transition Types for Navigation Direction](#transition-types-for-navigation-direction)
7. [Shared Elements Across Routes](#shared-elements-across-routes)
8. [Combining with Suspense and Loading States](#combining-with-suspense-and-loading-states)
9. [Server Components Considerations](#server-components-considerations)

---

## Setup

Enable the experimental flag in `next.config.js` (or `next.config.ts`):

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
- Without this flag, only `Suspense`-triggered and `startTransition`-triggered transitions fire.

The `<ViewTransition>` component itself is available from `react` in canary/experimental channels or React 19.2+.

Install React canary if you're not yet on 19.2+:

```bash
npm install react@canary react-dom@canary
```

---

## Basic Route Transitions

The simplest approach is wrapping your page content in `<ViewTransition>` inside a layout:

```tsx
// app/layout.tsx
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

When users navigate between routes using `<Link>`, Next.js triggers a transition internally. The `<ViewTransition>` wrapping `{children}` detects the content swap and animates it with the default cross-fade.

> **Warning:** This is an either/or choice with per-page animations. If your pages already have their own `<ViewTransition>` components (Suspense reveals, item reorder, shared elements), a layout-level VT on `{children}` produces double-animation — the layout cross-fades the entire old page while the new page's own entrance animations run simultaneously. Both levels get independent `view-transition-name`s, and the browser animates them in parallel, not sequentially.
>
> Use this pattern only in apps where pages have **no** per-page view transitions. Otherwise, either remove the layout-level VT or set `default="none"` on it.

---

## Layout-Level ViewTransition

For more control, place `<ViewTransition>` at different levels of the layout hierarchy:

```tsx
// app/dashboard/layout.tsx
import { ViewTransition } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <ViewTransition enter="slide-up" exit="fade-out">
        <main>{children}</main>
      </ViewTransition>
    </div>
  );
}
```

Only the `<main>` content animates when navigating between dashboard sub-routes. The sidebar stays static.

> **Caution:** The same composition rule applies here — if the pages rendered inside `{children}` have their own `<ViewTransition>` components (Suspense boundaries, item animations), both levels will fire simultaneously. Use `default="none"` on the layout VT and only activate it for specific `transitionTypes` to avoid conflicts.

---

## The `transitionTypes` Prop on `next/link`

As of Next.js 16.2+, `next/link` supports a native `transitionTypes` prop. This eliminates the need for custom wrapper components that intercept navigation with `onNavigate` + `startTransition` + `addTransitionType` + `router.push()`.

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

A common pattern is to animate differently for forward vs. backward navigation.

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

Configure `<ViewTransition>` to respond to these types. Use `default="none"` so the layout VT stays silent during per-page Suspense transitions and only fires for explicit navigation types:

```tsx
// app/layout.tsx
import { ViewTransition } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ViewTransition
          default="none"
          enter={{
            'navigation-forward': 'slide-in-from-right',
            'navigation-back': 'slide-in-from-left',
            default: 'none',
          }}
          exit={{
            'navigation-forward': 'slide-out-to-left',
            'navigation-back': 'slide-out-to-right',
            default: 'none',
          }}
        >
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}
```

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

## Combining with Suspense and Loading States

Next.js `loading.tsx` files create `<Suspense>` boundaries. Wrap them with `<ViewTransition>` for smooth fallback-to-content reveals:

```tsx
// app/dashboard/layout.tsx
import { ViewTransition } from 'react';
import { Suspense } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <ViewTransition>
        <Suspense fallback={<DashboardSkeleton />}>
          {children}
        </Suspense>
      </ViewTransition>
    </div>
  );
}
```

The skeleton cross-fades into the actual content once it loads.

> **Important:** If you also have a layout-level `<ViewTransition>` wrapping `{children}` with `default="auto"`, it will fire simultaneously with this Suspense VT on every navigation, producing a double-animation. Either remove the layout-level VT, or set `default="none"` on it so it only responds to explicit `transitionTypes`.

---

## Server Components Considerations

- `<ViewTransition>` can be used in both Server and Client Components — it renders no DOM of its own.
- `<Link>` with `transitionTypes` works in Server Components — no `'use client'` directive needed for link-based transitions.
- `addTransitionType` must be called from a Client Component (inside an event handler with `startTransition`).
- `startTransition` for programmatic navigation must be called from a Client Component.
- Navigation via `<Link>` from `next/link` triggers transitions automatically when the experimental flag is enabled.
- Prefer `transitionTypes` on `<Link>` over custom wrapper components. Only use manual `startTransition` + `addTransitionType` + `router.push()` for non-link interactions (buttons, form submissions, etc.).
