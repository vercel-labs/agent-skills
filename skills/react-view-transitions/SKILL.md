---
name: vercel-react-view-transitions
description: Guide for implementing smooth, native-feeling animations using React's View Transition API (`<ViewTransition>` component, `addTransitionType`, and CSS view transition pseudo-elements). Use this skill whenever the user wants to add page transitions, animate route changes, create shared element animations, animate enter/exit of components, animate list reorder, implement directional (forward/back) navigation animations, or integrate view transitions in Next.js. Also use when the user mentions view transitions, `startViewTransition`, `ViewTransition`, transition types, or asks about animating between UI states in React without third-party animation libraries.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React View Transitions

React's View Transition API lets you animate between UI states using the browser's native `document.startViewTransition` under the hood. Declare *what* to animate with `<ViewTransition>`, trigger *when* with `startTransition` / `useDeferredValue` / `Suspense`, and control *how* with CSS classes or the Web Animations API. Unsupported browsers skip the animation and apply the DOM change instantly.

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

- `<ViewTransition>` and `addTransitionType` require `react@canary` or `react@experimental`. Check `react --version` — if these APIs are not available, install canary: `npm install react@canary react-dom@canary`.
- Browser support: Chromium 111+, with Firefox and Safari adding support. The API gracefully degrades — unsupported browsers skip the animation and apply the DOM change instantly.

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

### Props

Each prop controls a different animation trigger. Values can be:

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

**How it works:** `startTransition` doesn't need async work to animate. The View Transition API captures a "before" snapshot of the DOM, then React applies the state update, and the API captures an "after" snapshot. As long as items change position between snapshots, the animation runs — even for purely synchronous local state changes like sorting.

### Animate Suspense Fallback to Content

Wrap `<Suspense>` in `<ViewTransition>` to cross-fade from fallback to loaded content:

```jsx
<ViewTransition>
  <Suspense fallback={<Skeleton />}>
    <AsyncContent />
  </Suspense>
</ViewTransition>
```

For directional motion, give the fallback and content separate `<ViewTransition>`s with explicit triggers. Use `default="none"` on the content one to prevent it from re-animating on unrelated transitions:

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

For more patterns (isolate floating elements, reusable animated collapse, preserve state with `<Activity>`, exclude elements with `useOptimistic`), see `references/patterns.md`.

---

## How Multiple `<ViewTransition>`s Interact

When a transition fires, **every** `<ViewTransition>` in the tree that matches the trigger participates simultaneously. Each gets its own `view-transition-name`, and the browser animates all of them inside a single `document.startViewTransition` call. They run in parallel, not sequentially.

This means a layout-level `<ViewTransition>` (whole-page cross-fade) + a page-level one (Suspense slide-up) + per-item ones (list reorder) all fire at once. The result is usually competing animations that look broken.

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

- **App with per-page Suspense reveals and shared elements:** Don't add a layout-level `<ViewTransition>` on `{children}`. The pages already manage their own transitions. A layout-level cross-fade on top will double-animate.
- **Simple app with no per-page animations:** A layout-level `<ViewTransition>` with `default="auto"` on `{children}` gives you free cross-fades between routes.
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

**What this flag does:** It wraps every `<Link>` navigation in `document.startViewTransition`, so all mounted `<ViewTransition>` components participate in every link click — not just `startTransition`/Suspense-triggered ones. This makes the composition rules in "How Multiple `<ViewTransition>`s Interact" especially important: use `default="none"` on layout-level `<ViewTransition>`s to avoid competing animations.

For a detailed guide including App Router patterns and Server Component considerations, see `references/nextjs.md`.

Key points:
- The `<ViewTransition>` component is imported from `react` directly — no Next.js-specific import.
- Works with the App Router and `startTransition` + `router.push()` for programmatic navigation.

### The `transitionTypes` prop on `next/link`

`next/link` supports a native `transitionTypes` prop that eliminates the need for custom `TransitionLink` wrapper components. Instead of intercepting navigation with `onNavigate`, `startTransition`, and `addTransitionType`, you pass transition types directly:

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

The `transitionTypes` prop accepts an array of strings — the same types you would pass to `addTransitionType`. This removes the need for `'use client'`, `useRouter`, and custom link components when all you need is to tag a navigation with a transition type.

For full examples with shared element transitions and directional animations, see `references/nextjs.md`.

---

## Real-World Patterns

For complete real-world patterns (searchable grids, card expand/collapse, type-safe transition helpers, shared elements across routes), see `references/patterns.md`.

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
- Multiple `<ViewTransition>` components at different tree levels (layout + page + items) all fire simultaneously inside a single `document.startViewTransition`. If a layout-level one cross-fades the whole page while a page-level one slides up content, both run at once and fight for attention. Fix: use `default="none"` on the layout-level `<ViewTransition>`, or remove it entirely if pages manage their own animations. See "How Multiple `<ViewTransition>`s Interact" above.

**List reorder not animating with `useOptimistic`:**
- If the optimistic value drives the list sort order, items are already in their final positions before the transition snapshot — there's nothing to animate. Use the optimistic value only for controls (labels, icons) and the committed state (`useState`) for the list sort order.

**TypeScript error: "Property 'default' is missing in type 'ViewTransitionClassPerType'":**
- When passing an object to `enter`/`exit`/`update`/`share`, TypeScript requires a `default` key in the object. This applies even if the component-level `default` prop is set. Always include `default: 'none'` (or `'auto'`) in type-keyed objects.

**Batching:**
- If multiple updates occur while an animation is running, React batches them into one. For example: if you navigate A→B, then B→C, then C→D during the first animation, the next animation will go B→D.

---

## Reference Files

- **`references/patterns.md`** — Real-world patterns (searchable grids, expand/collapse, type-safe helpers) and animation timing guidelines.
- **`references/css-recipes.md`** — Ready-to-use CSS animation recipes (slide, fade, scale, flip, and combined patterns).
- **`references/nextjs.md`** — Detailed Next.js integration guide with App Router patterns and Server Component considerations.
