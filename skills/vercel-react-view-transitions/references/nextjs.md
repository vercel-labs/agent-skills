# View Transitions in Next.js

## Setup

`<ViewTransition>` works out of the box — the bundled React canary ships it, and every `<Link>` navigation runs inside `React.startTransition`, so react-dom starts a view transition whenever affected `<ViewTransition>` components exist. Set the documented flag:

```js
// next.config.js
const nextConfig = {
  experimental: { viewTransition: true },
};
module.exports = nextConfig;
```

(Historically the flag switched React to the experimental channel — required before `ViewTransition` reached canary. It no longer does; the experimental channel is only needed for `useSwipeTransition` gestures and `parentEnter`/`parentExit`, selected by other flags like `gestureTransition`.)

Because every link click is a transition, any VT with `default="auto"` fires on **every** navigation — use `default="none"` to prevent competing animations.

Do **not** install `react@canary` — see [Availability](../SKILL.md#availability) for details.

---

## Next.js Implementation Additions

When following [implementation.md](implementation.md), apply these additions:

**After Step 2:** Enable the experimental flag above.

**Step 4:** Use `transitionTypes` on `<Link>` — see [The `transitionTypes` Prop](#the-transitiontypes-prop-on-nextlink) for usage and availability.

**After Step 6:** For same-route dynamic segments (e.g., `/collection/[slug]`), use the `key` + `name` + `share` pattern — see [Same-Route Dynamic Segment Transitions](#same-route-dynamic-segment-transitions).

---

## Layout-Level ViewTransition

**Do NOT add a layout-level VT wrapping `{children}` if pages have their own VTs.** Nested VTs never fire enter/exit when inside a parent VT — page-level enter/exit will silently not work. Remove the layout VT entirely.

A bare `<ViewTransition>` in layout works only if pages have **no** VTs of their own.

**Layouts persist across navigations** — `enter`/`exit` only fire on initial mount, not on route changes. Don't use type-keyed maps in layouts. Because layouts persist, chrome hosted in one (nav, sidebar, player) keeps its state across navigations for free — no `Activity` needed. Reserve `Activity` for in-page show/hide (see [Composing with Activity](patterns.md#composing-with-activity)).

---

## The `transitionTypes` Prop on `next/link`

No wrapper component needed, works in Server Components:

```tsx
<Link href="/products/1" transitionTypes={['transition-to-detail']}>View Product</Link>
```

Replaces the manual pattern of `onNavigate` + `startTransition` + `addTransitionType` + `router.push()`. Reserve manual `startTransition` for non-link interactions (buttons, forms).

**Availability:** `transitionTypes` shipped in **Next.js 16.2.0** (it is not gated on the `experimental.viewTransition` flag). If unavailable, use `startTransition` + `addTransitionType` + `router.push()` (see [Programmatic Navigation](#programmatic-navigation)). To check: `grep -r "transitionTypes" node_modules/next/dist/` — if no results, fall back to programmatic navigation.

---

## Programmatic Navigation

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition, addTransitionType } from 'react';

function DetailButton({ href }: { href: string }) {
  const router = useRouter();

  function handleNavigate() {
    startTransition(() => {
      addTransitionType('nav-forward');
      router.push(href);
    });
  }

  return <button onClick={handleNavigate}>Open</button>;
}
```

---

## Server-Side Filtering with `router.replace`

For search/sort/filter that re-renders on the server (via URL params), use `startTransition` + `router.replace`. VTs activate because the state update is inside `startTransition`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';

function handleSort(sort: string) {
  const router = useRouter();
  startTransition(() => {
    router.replace(`?sort=${sort}`);
  });
}
```

List items wrapped in `<ViewTransition key={item.id}>` will animate reorder. This is the server-component alternative to the client-side [Searchable Grid](patterns.md#searchable-grid-with-usedeferredvalue) pattern.

---

## Routing-Driven Tabs

The generalized sliding indicator ([Sliding Indicator](patterns.md#sliding-indicator-tabs)) driven by navigation instead of local state: tabs are `<Link>`s, `active` comes from the URL (a server prop), and `useOptimistic` slides the indicator instantly while the route commits. Key the mounted indicator to committed `active` so the bar lands where navigation actually settles.

```tsx
'use client';
import Link from 'next/link';
import { useOptimistic, useTransition, ViewTransition } from 'react';

export function Tabs({ tabs, active, indicatorName = 'tab-indicator' }) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [, startTransition] = useTransition();
  return (
    <nav>
      {tabs.map(t => (
        <Link key={t.value} href={t.href} scroll={false}
          aria-current={optimisticActive === t.value ? 'page' : undefined}
          onNavigate={() => startTransition(() => setOptimisticActive(t.value))}>
          <span>{t.label}</span>
          {active === t.value && (
            <ViewTransition name={indicatorName} share="tab-underline">
              <span className="active-underline" aria-hidden />
            </ViewTransition>
          )}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Two-Layer Pattern (Directional + Suspense)

Directional slides + Suspense reveals coexist because they fire at different moments. Place the directional VT in the **page component** (not layout):

```tsx
<ViewTransition
  enter={{ "nav-forward": "slide-from-right", default: "none" }}
  exit={{ "nav-forward": "slide-to-left", default: "none" }}
  default="none"
>
  <div>
    <Suspense fallback={<ViewTransition exit="slide-down"><Skeleton /></ViewTransition>}>
      <ViewTransition enter="slide-up" default="none"><Content /></ViewTransition>
    </Suspense>
  </div>
</ViewTransition>
```

---

## `loading.tsx` as Suspense Boundary

Next.js `loading.tsx` is an implicit `<Suspense>` boundary. Wrap the skeleton in `<ViewTransition exit="...">` in `loading.tsx`, and the content in `<ViewTransition enter="..." default="none">` in the page:

```tsx
// loading.tsx
<ViewTransition exit="slide-down"><PhotoGridSkeleton /></ViewTransition>

// page.tsx
<ViewTransition enter="slide-up" default="none"><PhotoGrid photos={photos} /></ViewTransition>
```

Same rules as explicit `<Suspense>`: use simple string props (not type maps) since Suspense reveals fire without transition types.

---

## Shared Elements Across Routes

```tsx
// List page
{products.map((product) => (
  <Link key={product.id} href={`/products/${product.id}`} transitionTypes={['nav-forward']}>
    <ViewTransition name={`product-${product.id}`}>
      <Image src={product.image} alt={product.name} width={400} height={300} />
    </ViewTransition>
  </Link>
))}

// Detail page — same name
<ViewTransition name={`product-${product.id}`}>
  <Image src={product.image} alt={product.name} width={800} height={600} />
</ViewTransition>
```

If the pair's `share` is type-keyed (or classed via CSS that expects a type), every `<Link>` between the two views must carry the type via `transitionTypes` — a plain link click resolves the share map's `default`, and if that's `none` the morph silently never fires.

---

## Same-Route Dynamic Segment Transitions

When navigating between dynamic segments of the same route (e.g., `/collection/[slug]`), the router swaps subtrees keyed by the segment value rather than doing a plain unmount/mount — enter/exit don't fire reliably. Use `key` + `name` + `share`:

```tsx
<Suspense fallback={<Skeleton />}>
  <ViewTransition key={slug} name={`collection-${slug}`} share="auto" default="none">
    <Content slug={slug} />
  </ViewTransition>
</Suspense>
```

- `key={slug}` forces unmount/remount on change
- `name` + `share="auto"` creates a shared element crossfade
- VT inside `<Suspense>` (without keying Suspense) keeps old content visible during loading

---

## Nested enter/exit — `parentEnter` / `parentExit` (experimental)

Lifts the "nested VTs don't fire enter/exit inside a parent" rule: a nested VT can animate when its **parent** enters/exits (`parentEnter`/`parentExit`, `onParentEnter`/`onParentExit`; `parentEnter="none"` stops propagation). Experimental-channel only today; SSR support landed in React PR #36917 ([commit](https://github.com/facebook/react/commit/83840902c890f0eb85decda239ef6b1b14945779)). Verify it's in the React your app runs: `grep -c "parentEnter" node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.production.js` — 0 means unavailable (Next uses the experimental channel only when `gestureTransition`/`blockingSSR`/`taint`/`transitionIndicator` is set).

## Server Components

- `<ViewTransition>` works in both Server and Client Components
- `<Link transitionTypes>` works in Server Components — no `'use client'` needed
- `addTransitionType` and `startTransition` for programmatic nav require Client Components
