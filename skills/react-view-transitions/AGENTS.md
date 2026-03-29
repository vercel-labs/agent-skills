# React View Transitions — Complete Reference


React's View Transition API lets you animate between UI states using the browser's native `document.startViewTransition` under the hood. React manages the lifecycle automatically — you declare *what* to animate with `<ViewTransition>`, trigger *when* to animate through `startTransition` / `useDeferredValue` / `Suspense`, and control *how* to animate with CSS classes or JavaScript via the Web Animations API.

The API adds ~3KB to your bundle, runs on the browser's compositor thread for 60fps animations, and gracefully falls back to instant state changes in unsupported browsers.

## When to Animate (and When Not To)

Every `<ViewTransition>` should answer: **what spatial relationship or continuity does this animation communicate to the user?** If you can't articulate it, don't add it.

### Hierarchy of Animation Intent

From highest value to lowest — start from the top and only move down if your app doesn't already have animations at that level:

| Priority | Pattern | What it communicates | Example |
|----------|---------|---------------------|---------|
| 1 | **Shared element** (`name`) | "This is the same thing — I'm going deeper" | List thumbnail morphs into detail hero |
| 2 | **Suspense reveal** | "Data loaded, here's the real content" | Skeleton cross-fades into loaded page |
| 3 | **List identity** (per-item `key`) | "Same items, new arrangement" | Cards reorder during sort/filter |
| 4 | **State change** (`enter`/`exit`) | "Something appeared or disappeared" | Panel slides in on toggle |
| 5 | **Route change** (layout-level) | "Going to a new place" | Cross-fade between pages |

Route-level transitions (#5) are the lowest priority because the URL change already signals a context switch. A blanket cross-fade on every navigation says nothing — it's visual noise. Prefer specific, intentional animations (#1–#4) over ambient page transitions.

**Rule of thumb:** at any given moment, only one level of the tree should be visually transitioning. If your pages already manage their own Suspense reveals or shared element morphs, adding a layout-level route transition on top produces double-animation where both levels fight for attention.

---

## Availability

- `<ViewTransition>` and `addTransitionType` shipped in **React 19.2** (stable).
- For older React 19 versions, both are available in `react@canary` and `react@experimental`.
- Browser support: Chromium-based browsers have full support. Firefox and Safari are adding support. The API gracefully degrades — unsupported browsers skip the animation and apply the DOM change instantly.

---

## Core Concepts

### The `<ViewTransition>` Component

Wrap the elements you want to animate:

```jsx
import { ViewTransition } from 'react';

<ViewTransition>
  <Component />
</ViewTransition>
```

React automatically assigns a unique `view-transition-name` to the nearest DOM node inside each `<ViewTransition>`, and calls `document.startViewTransition` behind the scenes. Never call `startViewTransition` yourself — React coordinates all view transitions and will interrupt external ones.

### Animation Triggers

React decides which type of animation to run based on what changed:

| Trigger | When it fires |
|---------|--------------|
| **enter** | A `<ViewTransition>` is first inserted during a Transition |
| **exit** | A `<ViewTransition>` is first removed during a Transition |
| **update** | DOM mutations happen inside a `<ViewTransition>`, or the boundary changes size/position due to an immediate sibling |
| **share** | A named `<ViewTransition>` unmounts and another with the same `name` mounts in the same Transition (shared element transition) |

Only updates wrapped in `startTransition`, `useDeferredValue`, or `Suspense` activate `<ViewTransition>`. Regular `setState` updates immediately and does not animate.

### Critical Placement Rule

`<ViewTransition>` only activates enter/exit if it appears **before any DOM nodes** in the component tree:

```jsx
// Works — ViewTransition is before the DOM node
function Item() {
  return (
    <ViewTransition enter="auto" exit="auto">
      <div>Content</div>
    </ViewTransition>
  );
}

// Broken — a <div> wraps the ViewTransition, preventing enter/exit
function Item() {
  return (
    <div>
      <ViewTransition enter="auto" exit="auto">
        <div>Content</div>
      </ViewTransition>
    </div>
  );
}
```

---

## Styling Animations with View Transition Classes

Rather than using `view-transition-name` in CSS directly, React recommends providing a **View Transition Class** to the activation props. React applies this class to the child elements when the animation activates.

### Props

Each prop controls a different trigger. Values can be:

- `"auto"` — use the browser default cross-fade
- `"none"` — disable this animation type
- `"my-class-name"` — a custom CSS class
- An object `{ [transitionType]: value }` for type-specific animations (see Transition Types below)

```jsx
<ViewTransition
  default="none"          // disable everything not explicitly listed
  enter="slide-in"        // CSS class for enter animations
  exit="slide-out"        // CSS class for exit animations
  update="cross-fade"     // CSS class for update animations
  share="morph"           // CSS class for shared element animations
/>
```

If `default` is `"none"`, all triggers are off unless explicitly listed.

### Defining CSS Animations

Use the view transition pseudo-element selectors with the class name:

```css
::view-transition-old(.slide-in) {
  animation: 300ms ease-out slide-out-to-left;
}
::view-transition-new(.slide-in) {
  animation: 300ms ease-out slide-in-from-right;
}

@keyframes slide-out-to-left {
  to { transform: translateX(-100%); opacity: 0; }
}
@keyframes slide-in-from-right {
  from { transform: translateX(100%); opacity: 0; }
}
```

The pseudo-elements available are:

- `::view-transition-group(.class)` — the container for the transition
- `::view-transition-image-pair(.class)` — contains old and new snapshots
- `::view-transition-old(.class)` — the outgoing snapshot
- `::view-transition-new(.class)` — the incoming snapshot

---

## Transition Types with `addTransitionType`

`addTransitionType` lets you tag a transition with a string label so `<ViewTransition>` can pick different animations based on *what caused* the change. This is essential for directional navigation (forward vs. back) or distinguishing user actions (click vs. swipe vs. keyboard).

### Basic Usage

```jsx
import { startTransition, addTransitionType } from 'react';

function navigate(url, direction) {
  startTransition(() => {
    addTransitionType(`navigation-${direction}`); // "navigation-forward" or "navigation-back"
    setCurrentPage(url);
  });
}
```

You can add multiple types to a single transition, and if multiple transitions are batched, all types are collected.

### Using Types with View Transition Classes

Pass an object instead of a string to any activation prop. Keys are transition type strings, values are CSS class names:

```jsx
<ViewTransition
  enter={{
    'navigation-forward': 'slide-in-from-right',
    'navigation-back': 'slide-in-from-left',
    default: 'fade-in',
  }}
  exit={{
    'navigation-forward': 'slide-out-to-left',
    'navigation-back': 'slide-out-to-right',
    default: 'fade-out',
  }}
>
  <Page />
</ViewTransition>
```

The `default` key inside the object is the fallback when no type matches. If any type has the value `"none"`, the ViewTransition is disabled for that trigger.

### Using Types with CSS `:active-view-transition-type()`

React also adds all transition types as browser view transition types, enabling pure CSS scoping:

```css
:root:active-view-transition-type(navigation-forward) {
  &::view-transition-old(*) {
    animation: 300ms ease-out slide-out-to-left;
  }
  &::view-transition-new(*) {
    animation: 300ms ease-out slide-in-from-right;
  }
}
```

### Using Types with View Transition Events

The `types` array is also available in event callbacks:

```jsx
<ViewTransition
  onEnter={(instance, types) => {
    const duration = types.includes('fast') ? 150 : 500;
    const anim = instance.new.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: 'ease-out' }
    );
    return () => anim.cancel();
  }}
>
```

---

## Shared Element Transitions

Assign the same `name` to two `<ViewTransition>` components — one in the unmounting tree and one in the mounting tree — to animate between them as if they're the same element:

```jsx
const HERO_IMAGE = 'hero-image';

function ListView({ onSelect }) {
  return (
    <ViewTransition name={HERO_IMAGE}>
      <img src="/thumb.jpg" onClick={() => startTransition(() => onSelect())} />
    </ViewTransition>
  );
}

function DetailView() {
  return (
    <ViewTransition name={HERO_IMAGE}>
      <img src="/full.jpg" />
    </ViewTransition>
  );
}
```

Rules for shared element transitions:
- Only one `<ViewTransition>` with a given `name` can be mounted at a time — use globally unique names (namespace with a prefix or module constant).
- The "share" trigger takes precedence over "enter"/"exit".
- If either side is outside the viewport, no pair forms and each side animates independently as enter/exit.
- Use a constant defined in a shared module to avoid name collisions:

```jsx
// shared-names.ts
export const HERO_IMAGE = 'hero-image-detail';
```

---

## View Transition Events (JavaScript Animations)

For imperative control, use the `onEnter`, `onExit`, `onUpdate`, and `onShare` callbacks:

```jsx
<ViewTransition
  onEnter={(instance, types) => {
    const anim = instance.new.animate(
      [{ transform: 'scale(0.8)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: 300, easing: 'ease-out' }
    );
    return () => anim.cancel(); // always return cleanup
  }}
  onExit={(instance, types) => {
    const anim = instance.old.animate(
      [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0.8)', opacity: 0 }],
      { duration: 200, easing: 'ease-in' }
    );
    return () => anim.cancel();
  }}
>
  <Component />
</ViewTransition>
```

The `instance` object provides:
- `instance.old` — the `::view-transition-old` pseudo-element
- `instance.new` — the `::view-transition-new` pseudo-element
- `instance.group` — the `::view-transition-group` pseudo-element
- `instance.imagePair` — the `::view-transition-image-pair` pseudo-element
- `instance.name` — the `view-transition-name` string

Always return a cleanup function that cancels the animation so the browser can properly handle interruptions.

Only one event fires per `<ViewTransition>` per Transition. `onShare` takes precedence over `onEnter` and `onExit`.

---

## Common Patterns

### Animate Enter/Exit of a Component

```jsx
import { ViewTransition, useState, startTransition } from 'react';

function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => startTransition(() => setShow(s => !s))}>
        Toggle
      </button>
      {show && (
        <ViewTransition enter="fade-in" exit="fade-out">
          <Panel />
        </ViewTransition>
      )}
    </>
  );
}
```

### Animate List Reorder

Wrap each item (not a wrapper div) in `<ViewTransition>` with a stable `key`:

```jsx
{items.map(item => (
  <ViewTransition key={item.id}>
    <ItemCard item={item} />
  </ViewTransition>
))}
```

Triggering the reorder inside `startTransition` will smoothly animate each item to its new position. Avoid wrapper `<div>`s between the list and `<ViewTransition>` — they block the reorder animation.

### Animate Suspense Fallback to Content

Wrap `<Suspense>` in `<ViewTransition>` to cross-fade from fallback to loaded content:

```jsx
<ViewTransition>
  <Suspense fallback={<Skeleton />}>
    <AsyncContent />
  </Suspense>
</ViewTransition>
```

For directional motion, give the fallback and content separate VTs with explicit triggers. Use `default="none"` on the content VT to prevent it from re-animating on unrelated transitions:

```jsx
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <Skeleton />
    </ViewTransition>
  }
>
  <ViewTransition default="none" enter="slide-up">
    <AsyncContent />
  </ViewTransition>
</Suspense>
```

### Opt Out of Nested Animations

Wrap children in `<ViewTransition update="none">` to prevent them from animating when a parent changes:

```jsx
<ViewTransition>
  <div className={theme}>
    <ViewTransition update="none">
      {children}
    </ViewTransition>
  </div>
</ViewTransition>
```

### Isolate Floating Elements from Parent Animations

Popovers, tooltips, and dropdowns can get captured in a parent's view transition snapshot, causing them to ghost or animate unexpectedly. Give them their own `viewTransitionName` to isolate them into a separate transition group:

```jsx
<SelectPopover style={{ viewTransitionName: 'popover' }}>
  {options}
</SelectPopover>
```

```css
::view-transition-group(popover) {
  z-index: 100;
}
```

This creates an independent transition group that renders above other transitioning elements. The element won't be included in its parent's old/new snapshot.

### Reusable Animated Collapse

For apps with many expand/collapse interactions, extract a reusable wrapper instead of repeating the conditional-render-with-VT pattern:

```jsx
import { ViewTransition } from 'react';

function AnimatedCollapse({ open, children }) {
  if (!open) return null;
  return (
    <ViewTransition enter="expand-in" exit="collapse-out">
      {children}
    </ViewTransition>
  );
}
```

Use it with `startTransition` on the toggle:

```jsx
<button onClick={() => startTransition(() => setOpen(o => !o))}>Toggle</button>
<AnimatedCollapse open={open}>
  <SectionContent />
</AnimatedCollapse>
```

### Preserve State with Activity

Use `<Activity>` with `<ViewTransition>` to animate show/hide while preserving component state:

```jsx
import { Activity, ViewTransition, startTransition } from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="slide-in" exit="slide-out">
    <Sidebar />
  </ViewTransition>
</Activity>
```

---

## How Multiple ViewTransitions Interact

When a transition fires, **every** `<ViewTransition>` in the tree that matches the trigger participates simultaneously. Each gets its own `view-transition-name`, and the browser animates all of them inside a single `document.startViewTransition` call. They run in parallel, not sequentially.

This means a layout-level VT (whole-page cross-fade) + a page-level VT (Suspense slide-up) + per-item VTs (list reorder) all fire at once. The result is usually competing animations that look broken.

### Use `default="none"` Liberally

Prevent unintended animations by disabling the default trigger on ViewTransitions that should only fire for specific types:

```jsx
// Only animates when 'navigation-forward' or 'navigation-back' types are present.
// Silent on all other transitions (Suspense reveals, state changes, etc.)
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
```

**TypeScript note:** When passing an object to `enter`/`exit`, the `ViewTransitionClassPerType` type requires a `default` key. Always include `default: 'none'` (or `'auto'`) in the object — omitting it causes a type error even if the component-level `default` prop is set.

Without `default="none"`, a `<ViewTransition>` with `default="auto"` (the implicit default) fires the browser's cross-fade on **every** transition — including ones triggered by child Suspense boundaries, `useDeferredValue` updates, or `startTransition` calls within the page.

### Choosing One Level

Pick the level that carries the most meaning for your app:

- **App with per-page Suspense reveals and shared elements:** Don't add a layout-level VT on `{children}`. The pages already manage their own transitions. A layout-level cross-fade on top will double-animate.
- **Simple app with no per-page animations:** A layout-level VT with `default="auto"` on `{children}` gives you free cross-fades between routes.
- **Mixed:** Use `default="none"` at the layout level and only activate it for specific `transitionTypes` (e.g., directional navigation). This way it stays silent during per-page Suspense transitions.

The exception is **shared element transitions** — these intentionally span levels (one side unmounts while the other mounts) and don't conflict with other VTs because the `share` trigger takes precedence over `enter`/`exit`.


---

## Next.js Integration

Next.js supports React View Transitions. Enable it in `next.config.js` (or `next.config.ts`):

```js
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};
module.exports = nextConfig;
```

**What this flag does:** It wraps every `<Link>` navigation in `document.startViewTransition`, which means all mounted `<ViewTransition>` components in the tree participate in every link navigation — not just ones triggered by `startTransition` or Suspense. This is important:

- If you have a layout-level VT with `default: "auto"`, it fires on **every** `<Link>` navigation — even ones you didn't intend to animate.
- Combined with per-page VTs (Suspense reveals, item animations), you get competing animations.
- Without this flag, only `Suspense`-triggered and `startTransition`-triggered transitions fire.

If your pages manage their own per-page transitions, either (a) don't use a layout-level `<ViewTransition>` on `{children}`, or (b) set `default="none"` on it so it only activates for explicit `transitionTypes`.

For a detailed guide on Next.js integration, including App Router patterns and Server Component considerations, see the Next.js Integration section below.

Key points:
- The `<ViewTransition>` component is imported from `react` directly — no Next.js-specific import.
- Works with the App Router and `startTransition` + `router.push()` for programmatic navigation.

### The `transitionTypes` prop on `next/link`

As of Next.js 16.2+, `next/link` supports a native `transitionTypes` prop that eliminates the need for custom `TransitionLink` wrapper components. Instead of intercepting navigation with `onNavigate`, `startTransition`, and `addTransitionType`, you pass transition types directly:

```tsx
import Link from 'next/link';

// Before (manual wrapper required):
<TransitionLink href="/products/1" type="transition-to-detail">
  View Product
</TransitionLink>

// After (native prop, no wrapper needed):
<Link href="/products/1" transitionTypes={['transition-to-detail']}>
  View Product
</Link>
```

The `transitionTypes` prop accepts an array of strings — the same types you would pass to `addTransitionType`. This removes the need for `'use client'`, `useRouter`, and custom link components when all you need is to tag a navigation with a transition type. The `<ViewTransition>` components in the tree respond to these types the same way they respond to manual `addTransitionType` calls.

**Composition note:** `transitionTypes` on `<Link>` works best when you have a single `<ViewTransition>` at the layout level with `default="none"` (so it only fires for your specific types) and no per-page Suspense VTs competing. If your pages have their own Suspense transitions, use `transitionTypes` at the page level (e.g., to distinguish sources of `startTransition` within a client component) rather than at the layout level, or the layout slide and the page's Suspense reveal will both fire simultaneously.

For full examples of `transitionTypes` with shared element transitions and directional animations across routes, see the Next.js Integration section below.

---

## Real-World Patterns

### Searchable Grid with `useDeferredValue`

A client-side searchable grid where the filtered results cross-fade as the user types. `useDeferredValue` makes the filter update a transition, which activates the wrapping `<ViewTransition>`:

```tsx
'use client';

import { useDeferredValue, useState, ViewTransition, Suspense } from 'react';

export default function SearchableGrid({ itemsPromise }) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search..."
      />
      <ViewTransition>
        <Suspense fallback={<GridSkeleton />}>
          <ItemGrid itemsPromise={itemsPromise} search={deferredSearch} />
        </Suspense>
      </ViewTransition>
    </>
  );
}
```

### Card Expand/Collapse with `startTransition`

Toggle between a card grid and a detail view using `startTransition` to animate the swap:

```tsx
'use client';

import { useState, startTransition, ViewTransition } from 'react';

export default function ItemGrid({ items }) {
  const [expandedId, setExpandedId] = useState(null);

  return expandedId ? (
    <ViewTransition enter="slide-up" exit="slide-down">
      <ItemDetail
        item={items.find(i => i.id === expandedId)}
        onClose={() => {
          startTransition(() => {
            setExpandedId(null);
          });
        }}
      />
    </ViewTransition>
  ) : (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <ViewTransition key={item.id}>
          <ItemCard
            item={item}
            onSelect={() => {
              startTransition(() => {
                setExpandedId(item.id);
              });
            }}
          />
        </ViewTransition>
      ))}
    </div>
  );
}
```

The CSS for slide-up/slide-down enter/exit:

```css
::view-transition-old(.slide-down) {
  animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}
::view-transition-new(.slide-up) {
  animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

@keyframes slide-up {
  from { transform: translateY(10px); }
  to { transform: translateY(0); }
}
@keyframes slide-down {
  from { transform: translateY(0); }
  to { transform: translateY(10px); }
}
@keyframes fade-in {
  from { opacity: 0; }
}
@keyframes fade-out {
  to { opacity: 0; }
}
```

### Type-Safe Transition Helpers

For larger apps, define type-safe transition IDs and transition maps to prevent ID clashes and keep animation configurations consistent. Use `as const` arrays for transition IDs, types, and animation classes, then derive types from them:

```tsx
import { ViewTransition } from 'react';

const transitionTypes = ['default', 'transition-to-detail', 'transition-to-list', 'transition-backwards', 'transition-forwards'] as const;
const animationTypes = ['auto', 'none', 'animate-slide-from-left', 'animate-slide-from-right', 'animate-slide-to-left', 'animate-slide-to-right'] as const;

type TransitionType = (typeof transitionTypes)[number];
type AnimationType = (typeof animationTypes)[number];
type TransitionMap = { default: AnimationType } & Partial<Record<Exclude<TransitionType, 'default'>, AnimationType>>;

export function HorizontalTransition({ children, enter, exit }: {
  children: React.ReactNode;
  enter: TransitionMap;
  exit: TransitionMap;
}) {
  return <ViewTransition enter={enter} exit={exit}>{children}</ViewTransition>;
}
```

These wrappers enforce that only valid transition IDs and animation classes are used, catching mistakes at compile time. See the Next.js App Router Playground (`vercel/next-app-router-playground`) for a complete example of this pattern.

### Shared Elements Across Routes in Next.js

See the Next.js Integration section below.

---

## Accessibility

Always respect `prefers-reduced-motion`. React does not disable animations automatically for this preference. Add this to your global CSS:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0s !important;
  }
}
```

Or disable specific animations conditionally in JavaScript events by checking the media query.

---

## Troubleshooting

**ViewTransition not activating:**
- Ensure the `<ViewTransition>` comes before any DOM node in the component (not wrapped in a `<div>`).
- Ensure the state update is inside `startTransition`, not a plain `setState`.

**"Two ViewTransition components with the same name" error:**
- Each `name` must be globally unique across the entire app at any point in time. Add item IDs: `name={\`hero-${item.id}\`}`.

**Back button skips animation:**
- The legacy `popstate` event requires synchronous completion, conflicting with view transitions. Upgrade your router to use the Navigation API for back-button animations.

**Animations from `flushSync` are skipped:**
- `flushSync` completes synchronously, which prevents view transitions from running. Use `startTransition` instead.

**Enter/exit not firing in a client component (only updates animate):**
- `startTransition(() => setState(...))` triggers a Transition, but if the new content isn't behind a `<Suspense>` boundary, React treats the swap as an **update** to the existing tree — not an enter/exit. The `<ViewTransition>` sees its children change but never fully unmounts/remounts, so only `update` animations fire. To get true enter/exit, either conditionally render the `<ViewTransition>` itself (so it mounts/unmounts with the content), or wrap the async content in `<Suspense>` so React can treat the reveal as an insertion.

**Competing / double animations on navigation:**
- Multiple `<ViewTransition>` components at different tree levels (layout + page + items) all fire simultaneously inside a single `document.startViewTransition`. If a layout-level VT cross-fades the whole page while a page-level VT slides up content, both run at once and fight for attention. Fix: use `default="none"` on the layout-level VT, or remove it entirely if pages manage their own animations. See "How Multiple ViewTransitions Interact" above.

**TypeScript error: "Property 'default' is missing in type 'ViewTransitionClassPerType'":**
- When passing an object to `enter`/`exit`/`update`/`share`, TypeScript requires a `default` key in the object. This applies even if the component-level `default` prop is set. Always include `default: 'none'` (or `'auto'`) in type-keyed objects.

**Batching:**
- If multiple updates occur while an animation is running, React batches them into one. For example: if you navigate A→B, then B→C, then C→D during the first animation, the next animation will go B→D.

---

## Animation Timing Guidelines

Match duration to the interaction type — direct user actions need fast feedback, while ambient reveals can be slower:

| Interaction | Duration | Rationale |
|------------|----------|-----------|
| Direct toggle (expand/collapse, show/hide) | 100–200ms | Responds to a click — must feel instant |
| Route transition (directional slide) | 150–250ms | Brief spatial cue, shouldn't delay navigation |
| Suspense reveal (skeleton → content) | 200–400ms | Soft reveal, content is "arriving" |
| Shared element morph | 300–500ms | Users watch the morph — give it room to breathe |

These are starting points. Test on low-end devices — animations that feel smooth on a fast machine can feel sluggish on mobile.

---

## CSS Recipe Reference

For ready-to-use CSS animation recipes (slide, fade, scale, flip, and combined patterns), see the CSS Animation Recipes section below.

---

# Next.js Integration — Detailed Reference


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

---

# CSS Animation Recipes — Complete Collection


Ready-to-use CSS snippets for common view transition animations. Use these class names with `<ViewTransition>` props.

## Table of Contents

1. [Fade](#fade)
2. [Slide](#slide)
3. [Scale](#scale)
4. [Slide + Fade Combined](#slide--fade-combined)
5. [Directional Navigation (Forward / Back)](#directional-navigation)
6. [Flip](#flip)
7. [Reduced Motion](#reduced-motion)
8. [Slow Cross-Fade](#slow-cross-fade)

---

## Fade

```css
::view-transition-old(.fade-out) {
  animation: 200ms ease-out fade-to-hidden;
}
::view-transition-new(.fade-in) {
  animation: 200ms ease-in fade-from-hidden;
}

@keyframes fade-to-hidden {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes fade-from-hidden {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Usage:
```jsx
<ViewTransition enter="fade-in" exit="fade-out" />
```

---

## Slide

```css
::view-transition-old(.slide-out-left) {
  animation: 300ms ease-in-out slide-to-left;
}
::view-transition-new(.slide-in-from-right) {
  animation: 300ms ease-in-out slide-from-right;
}
::view-transition-old(.slide-out-right) {
  animation: 300ms ease-in-out slide-to-right;
}
::view-transition-new(.slide-in-from-left) {
  animation: 300ms ease-in-out slide-from-left;
}

/* Vertical */
::view-transition-old(.slide-out-up) {
  animation: 300ms ease-in-out slide-to-top;
}
::view-transition-new(.slide-in-from-bottom) {
  animation: 300ms ease-in-out slide-from-bottom;
}
::view-transition-old(.slide-out-down) {
  animation: 300ms ease-in-out slide-to-bottom;
}
::view-transition-new(.slide-in-from-top) {
  animation: 300ms ease-in-out slide-from-top;
}

@keyframes slide-to-left {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
@keyframes slide-from-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slide-to-right {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
@keyframes slide-from-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
@keyframes slide-to-top {
  from { transform: translateY(0); }
  to { transform: translateY(-100%); }
}
@keyframes slide-from-bottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes slide-to-bottom {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}
@keyframes slide-from-top {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}
```

Usage:
```jsx
<ViewTransition enter="slide-in-from-right" exit="slide-out-left" />
```

---

## Scale

```css
::view-transition-old(.scale-out) {
  animation: 250ms ease-in scale-down;
}
::view-transition-new(.scale-in) {
  animation: 250ms ease-out scale-up;
}

@keyframes scale-down {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.85); opacity: 0; }
}
@keyframes scale-up {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

Usage:
```jsx
<ViewTransition enter="scale-in" exit="scale-out" />
```

---

## Slide + Fade Combined

```css
::view-transition-old(.slide-fade-out) {
  animation: 300ms ease-in-out slide-fade-exit;
}
::view-transition-new(.slide-fade-in) {
  animation: 300ms ease-in-out slide-fade-enter;
}

@keyframes slide-fade-exit {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
}
@keyframes slide-fade-enter {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

Usage:
```jsx
<ViewTransition enter="slide-fade-in" exit="slide-fade-out" />
```

---

## Directional Navigation

A complete setup for forward/back page transitions using `addTransitionType`:

```css
/* Forward navigation: content slides left */
::view-transition-old(.nav-forward-exit) {
  animation: 350ms ease-in-out nav-slide-out-left;
}
::view-transition-new(.nav-forward-enter) {
  animation: 350ms ease-in-out nav-slide-in-from-right;
}

/* Back navigation: content slides right */
::view-transition-old(.nav-back-exit) {
  animation: 350ms ease-in-out nav-slide-out-right;
}
::view-transition-new(.nav-back-enter) {
  animation: 350ms ease-in-out nav-slide-in-from-left;
}

@keyframes nav-slide-out-left {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-30%); opacity: 0; }
}
@keyframes nav-slide-in-from-right {
  from { transform: translateX(30%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes nav-slide-out-right {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(30%); opacity: 0; }
}
@keyframes nav-slide-in-from-left {
  from { transform: translateX(-30%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

Usage with transition types:
```jsx
<ViewTransition
  enter={{
    'navigation-forward': 'nav-forward-enter',
    'navigation-back': 'nav-back-enter',
    default: 'auto',
  }}
  exit={{
    'navigation-forward': 'nav-forward-exit',
    'navigation-back': 'nav-back-exit',
    default: 'auto',
  }}
>
  <Page />
</ViewTransition>
```

Triggering:
```jsx
startTransition(() => {
  addTransitionType('navigation-forward');
  router.push('/next-page');
});
```

---

## Flip

```css
::view-transition-old(.flip-out) {
  animation: 400ms ease-in flip-exit;
  backface-visibility: hidden;
}
::view-transition-new(.flip-in) {
  animation: 400ms ease-out flip-enter;
  backface-visibility: hidden;
}

@keyframes flip-exit {
  from { transform: rotateY(0deg); opacity: 1; }
  to { transform: rotateY(-90deg); opacity: 0; }
}
@keyframes flip-enter {
  from { transform: rotateY(90deg); opacity: 0; }
  to { transform: rotateY(0deg); opacity: 1; }
}
```

Usage:
```jsx
<ViewTransition enter="flip-in" exit="flip-out" />
```

---

## Reduced Motion

Always include this in your global stylesheet to respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

---

## Slow Cross-Fade

Override the browser default timing for a slower, more cinematic cross-fade:

```css
::view-transition-old(.slow-fade) {
  animation-duration: 600ms;
  animation-timing-function: ease-in-out;
}
::view-transition-new(.slow-fade) {
  animation-duration: 600ms;
  animation-timing-function: ease-in-out;
}
```

Usage:
```jsx
<ViewTransition default="slow-fade">
  <Content />
</ViewTransition>
```
