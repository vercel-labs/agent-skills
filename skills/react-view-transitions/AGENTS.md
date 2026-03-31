# React View Transitions

**Version 1.0.0**
Vercel

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

### Choosing the Right Animation Style

Not everything should slide. Match the animation to the spatial relationship:

| Context | Animation | Why |
|---------|-----------|-----|
| Detail page main content | `enter="slide-up"` | Reveals "deeper" content the user drilled into |
| Detail page outer wrapper | `enter`/`exit` type map for `nav-forward` | Navigating forward — horizontal direction |
| List / overview pages | Bare `<ViewTransition>` (fade) or `default="none"` | Lateral navigation — no spatial depth to communicate |
| Page headers / breadcrumbs | Bare `<ViewTransition>` (fade) | Small, fast-loading metadata — slide feels excessive |
| Secondary section on same page | `enter="slide-up"` | Second Suspense boundary streaming in after the header |
| Revalidation / background refresh | `default="none"` | Data refreshed silently — animation would be distracting |

When in doubt, use a bare `<ViewTransition>` (default cross-fade) or `default="none"`. Only add directional motion (slide-up, slide-from-right) when it communicates spatial meaning.

**Hierarchical vs. lateral navigation:** Reserve directional `transitionTypes` (like `nav-forward` / `nav-back`) for hierarchical navigation — where the user drills deeper (list → detail) or backs out. For lateral/sibling navigation between pages at the same level (e.g., tab-to-tab or peer sections), use a bare `<ViewTransition>` (cross-fade) or `default="none"` — don't add `transitionTypes`. Directional slides on sibling links falsely imply spatial depth where none exists.

---

## Availability

- `<ViewTransition>` and `addTransitionType` require `react@canary` or `react@experimental`. They are **not** in stable React (including 19.x). Before implementing, verify the project uses canary — check `package.json` for `"react": "canary"` or run `npm ls react`. If on stable, install canary: `npm install react@canary react-dom@canary`.
- Browser support: Chromium 111+, Firefox 144+, Safari 18.2+ (cross-document only). The API gracefully degrades — unsupported browsers skip the animation and apply the DOM change instantly.

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

React automatically assigns a unique `view-transition-name` to the nearest DOM node inside each `<ViewTransition>`, and calls `document.startViewTransition` behind the scenes. Never call `startViewTransition` yourself — React coordinates all view transitions and will interrupt external ones. React also waits up to 500ms for fonts to load and delays for images inside `<ViewTransition>` to avoid flicker.

### Animation Triggers

React decides which type of animation to run based on what changed:

| Trigger | When it fires |
|---------|--------------|
| **enter** | A `<ViewTransition>` is first inserted during a Transition |
| **exit** | A `<ViewTransition>` is first removed during a Transition |
| **update** | DOM mutations happen inside a `<ViewTransition>`, or the boundary changes size/position due to an immediate sibling. With nested `<ViewTransition>`s, the mutation applies to the innermost one, not the parent |
| **share** | A named `<ViewTransition>` unmounts and another with the same `name` mounts in the same Transition (shared element transition) |

Only updates wrapped in `startTransition`, `useDeferredValue`, or `Suspense` activate `<ViewTransition>`. Regular `setState` updates immediately and does not animate.

**Nested mutation capture:** Nested `<ViewTransition>` components steal mutations from parents — `update="auto"` on a parent wrapping a Suspense boundary never fires if the resolved content has per-item `<ViewTransition>` wrappers. Use `key` + `share` to force exit/enter instead, or `default="none"` on inner VTs.

### Critical Placement Rule

`<ViewTransition>` only activates enter/exit if it appears **before any DOM nodes** in the component tree:

```jsx
// Works — ViewTransition is before the DOM node
<ViewTransition enter="auto" exit="auto">
  <div>Content</div>
</ViewTransition>

// Broken — a <div> wraps the ViewTransition, preventing enter/exit
<div>
  <ViewTransition enter="auto" exit="auto">
    <div>Content</div>
  </ViewTransition>
</div>
```

**Common mistake:** `<ViewTransition key={id}>` inside a `<div className="grid">` won't trigger enter/exit — the grid wrapper suppresses it. Worse, these nested VTs capture mutations from parent VTs. Per-item VTs inside a wrapper only work for `update` (reorder) and `share` (morph).

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

The `default` key inside the object is the fallback when no type matches.

### Using Types with CSS `:active-view-transition-type()`

React adds transition types as browser view transition types, enabling CSS scoping with `:root:active-view-transition-type(type-name)`. **Caveat:** `::view-transition-old(*)` / `::view-transition-new(*)` match **all** named elements — prefer class-based props for per-component animations; reserve `:active-view-transition-type()` for global rules.

### Types and Suspense: When Types Are Available

When a navigation with `addTransitionType` triggers, the transition type is available to **all `<ViewTransition>`s that enter/exit during that navigation**. An outer page-level `<ViewTransition>` with a type map sees the type and responds. Inner `<ViewTransition>`s with simple string props also enter — the type is irrelevant to them because simple strings fire regardless of type.

Subsequent Suspense reveals — when streamed data loads after navigation completes — are **separate transitions with no type**. This means type-keyed props on Suspense content don't work:

```jsx
// This does NOT animate on Suspense reveal — the type is gone by then
<ViewTransition enter={{ "nav-forward": "slide-up", default: "none" }} default="none">
  <AsyncContent />
</ViewTransition>
```

When Suspense resolves later, a new transition fires with no type — so `default: "none"` applies and nothing animates.

**Use type maps for `<ViewTransition>`s that enter/exit directly with the navigation. Use simple string props for Suspense reveals.** See the two-layer pattern in "Two Patterns — Can Coexist with Proper Isolation" below for a complete example.

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
- If a Suspense fallback appears between unmounting one side and mounting the other, no shared element pair forms.
- **Never use a fade-out exit on pages with shared element morphs** — the page dissolving conflicts with the morph, causing a flash. Use a directional slide exit instead.
- Use a constant defined in a shared module to avoid name collisions.

---

## View Transition Events (JavaScript Animations)

For imperative control with `onEnter`, `onExit`, `onUpdate`, `onShare` callbacks and the `instance` object, see **Patterns and Guidelines** below. Always return a cleanup function. `onShare` takes precedence over `onEnter`/`onExit`.

---

## Common Patterns

### Animate Enter/Exit of a Component

Conditionally render the `<ViewTransition>` itself — toggle with `startTransition`:

```jsx
{show && (
  <ViewTransition enter="fade-in" exit="fade-out">
    <Panel />
  </ViewTransition>
)}
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

Trigger the reorder inside `startTransition`. Avoid wrapper `<div>`s between the list and `<ViewTransition>` — they block the reorder animation. `startTransition` doesn't need async work — the View Transition API captures before/after snapshots and animates position changes, even for synchronous state changes like sorting.

### Force Re-Enter with `key`

Use a `key` prop on `<ViewTransition>` to force an enter/exit animation when a value changes — even if the component itself doesn't unmount:

```jsx
<ViewTransition key={searchParams.toString()} enter="slide-up" exit="slide-down" default="none">
  <ResultsGrid results={results} />
</ViewTransition>
```

When the key changes, React unmounts and remounts the `<ViewTransition>`, triggering exit on the old instance and enter on the new one.

**Caution with Suspense:** If the `<ViewTransition>` wraps a `<Suspense>`, changing the key remounts the entire Suspense boundary, re-triggering the data fetch. Only use `key` on `<ViewTransition>` outside of Suspense, or accept the refetch.

**Alternative for tabs:** For tab switches within a persistent layout, omitting `key` keeps the `<ViewTransition>` mounted and triggers an update animation (cross-fade) instead of exit + enter — avoiding Suspense remount and refetch. See "Cross-Fade Without Remount" below.

### Animate Suspense Fallback to Content

The simplest approach: wrap `<Suspense>` in a single `<ViewTransition>` for a zero-config cross-fade from skeleton to content:

```jsx
<ViewTransition>
  <Suspense fallback={<Skeleton />}>
    <Content />
  </Suspense>
</ViewTransition>
```

For directional motion, give the fallback and content separate `<ViewTransition>`s. Use `default="none"` on the content to prevent re-animation on revalidation:

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

When Suspense resolves, the fallback unmounts (exit) and content mounts (enter) simultaneously. Staggered CSS timing (`enter` delays by the `exit` duration) ensures the skeleton leaves before new content arrives. Keep skeleton dimensions close to the real content — large size mismatches produce jarring staggers.

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

For more patterns (isolate persistent/floating elements, reusable animated collapse, preserve state with `<Activity>`, exclude elements with `useOptimistic`), see **Patterns and Guidelines** below.

---

## How Multiple `<ViewTransition>`s Interact

When a transition fires, **every** `<ViewTransition>` in the tree that matches the trigger participates simultaneously inside a single `document.startViewTransition` call. Multiple `<ViewTransition>`s in the **same** transition animate at once and can compete. `<ViewTransition>`s in **different** transitions (e.g., navigation vs. a later Suspense resolve) don't compete — they animate at different moments.

### Use `default="none"` Liberally

Without `default="none"`, a `<ViewTransition>` fires the browser's cross-fade on **every** transition — including Suspense resolves, `useDeferredValue` updates, and background data revalidations. Always use `default="none"` on content `<ViewTransition>`s and only enable specific triggers explicitly. Compare the type-keyed example in "Using Types with View Transition Classes" above — change `default: 'fade-in'` / `'fade-out'` to `default: 'none'` and add `default="none"` on the component to make it silent on all non-typed transitions.

**TypeScript note:** When passing an object to `enter`/`exit`, `ViewTransitionClassPerType` requires a `default` key — omitting it causes a type error even if the component-level `default` prop is set.

### Two Patterns — Can Coexist with Proper Isolation

There are two distinct view transition patterns:

**Pattern A — Directional page slides** (e.g., left/right navigation):
- Uses `addTransitionType` (or `transitionTypes` prop on router links) to tag navigation direction
- An outer `<ViewTransition>` on the page maps types to slide classes with `default="none"`
- Fires during the navigation transition (when the type is present)

**Pattern B — Suspense content reveals** (e.g., streaming data):
- No `transitionTypes` needed
- Simple `enter="slide-up"` / `exit="slide-down"` on `<ViewTransition>`s around Suspense boundaries
- `default="none"` prevents re-animation on revalidation
- Fires later when data loads (a separate transition with no type)

**These coexist when they fire at different moments.** The nav slide fires during navigation (with the type); the Suspense reveal fires later when data streams in (no type). `default="none"` on both layers prevents cross-interference:

```jsx
<ViewTransition
  enter={{ "nav-forward": "slide-from-right", default: "none" }}
  exit={{ "nav-forward": "slide-to-left", default: "none" }}
  default="none"
>
  <div>
    <Suspense fallback={
      <ViewTransition exit="slide-down"><Skeleton /></ViewTransition>
    }>
      <ViewTransition enter="slide-up" default="none">
        <Content />
      </ViewTransition>
    </Suspense>
  </div>
</ViewTransition>
```

**Always pair `enter` with `exit` on directional transitions.** Without an exit animation, the old page disappears instantly while the new one slides in — a jarring jump.

**When they DO conflict:** If both layers use `default="auto"`, they animate simultaneously and fight. Place the outer directional `<ViewTransition>` in each **page component** — not in a layout (layouts persist and don't trigger enter/exit).

Shared element transitions (`name` prop) work alongside either pattern because `share` takes precedence over `enter`/`exit`.

---

## Next.js Integration

Next.js supports React View Transitions. `<ViewTransition>` works out of the box for `startTransition`- and `Suspense`-triggered updates — no config needed.

To also animate `<Link>` navigations, enable the experimental flag in `next.config.js` (or `next.config.ts`):

```js
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
};
module.exports = nextConfig;
```

**What this flag does:** It wraps every `<Link>` navigation in `document.startViewTransition`, so all mounted `<ViewTransition>` components participate in every link click. Without this flag, only `startTransition`/`Suspense`-triggered transitions animate. This makes the composition rules in "How Multiple `<ViewTransition>`s Interact" especially important: use `default="none"` on layout-level `<ViewTransition>`s to avoid competing animations.

**Production warning:** As of Next.js 16, the `viewTransition` flag is experimental and the Next.js team advises against using it in production. The flag opts into React's experimental build. `<ViewTransition>` itself works without the flag for `startTransition`- and `Suspense`-triggered updates.

For a detailed guide including App Router patterns and Server Component considerations, see **View Transitions in Next.js** below.

Key points:
- The `<ViewTransition>` component is imported from `react` directly — no Next.js-specific import.
- Works with the App Router and `startTransition` + `router.push()` for programmatic navigation.

### The `transitionTypes` prop on `next/link`

`next/link` supports a native `transitionTypes` prop — pass an array of strings directly, no `'use client'` or wrapper component needed:

```tsx
<Link href="/products/1" transitionTypes={['transition-to-detail']}>View Product</Link>
```

For full examples with shared element transitions and directional animations, see **View Transitions in Next.js** below.

---

## Accessibility

Always respect `prefers-reduced-motion`. React does not disable animations automatically for this preference. Add the reduced motion CSS (see Reduced Motion section below) to your global stylesheet, or disable specific animations conditionally in JavaScript events by checking the media query.

---

# Patterns and Guidelines

## Searchable Grid with `useDeferredValue`

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

### Named Shared Elements Inside `useDeferredValue` Lists

Per-item `<ViewTransition name={...} share="morph">` inside a `useDeferredValue`-driven list triggers update animations on every keystroke — each named element gets its own cross-fade, which can look noisy or washed-out. The searchable grid above avoids this with a single unnamed `<ViewTransition>`. If you need per-item shared elements (for card-to-detail morph), add `default="none"`:

```tsx
{filteredItems.map(item => (
  <ViewTransition key={item.id} name={`item-${item.id}`} share="morph" default="none">
    <ItemCard item={item} />
  </ViewTransition>
))}
```

The morph still fires on navigation when the element unmounts and a matching `name` mounts elsewhere.

## Card Expand/Collapse with `startTransition`

Toggle between a card grid and a detail view using `startTransition` to animate the swap. Add a shared element `name` to morph the card into the detail view:

```tsx
'use client';

import { useState, useRef, startTransition, ViewTransition } from 'react';

export default function ItemGrid({ items }) {
  const [expandedId, setExpandedId] = useState(null);
  const scrollRef = useRef(0);

  return expandedId ? (
    <ViewTransition enter="slide-in" name={`item-${expandedId}`}>
      <ItemDetail
        item={items.find(i => i.id === expandedId)}
        onClose={() => {
          startTransition(() => {
            setExpandedId(null);
            setTimeout(() => window.scrollTo({ behavior: 'smooth', top: scrollRef.current }), 100);
          });
        }}
      />
    </ViewTransition>
  ) : (
    <div className="grid grid-cols-3 gap-4">
      {items.map(item => (
        <ViewTransition key={item.id} name={`item-${item.id}`}>
          <ItemCard
            item={item}
            onSelect={() => {
              scrollRef.current = window.scrollY;
              startTransition(() => setExpandedId(item.id));
            }}
          />
        </ViewTransition>
      ))}
    </div>
  );
}
```

The shared `name={`item-${id}`}` on both the card and detail `<ViewTransition>` creates a shared element pair — the card morphs into the detail view. The `scrollRef` saves and restores scroll position so users return to where they were in the grid. See **CSS Animation Recipes** below for the slide-up/slide-down CSS.

## Type-Safe Transition Helpers

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

These wrappers enforce that only valid transition IDs and animation classes are used, catching mistakes at compile time.

## Cross-Fade Without Remount (Alternative to `key` for Tabs)

For tab switches within a persistent layout, omitting `key` keeps the `<ViewTransition>` mounted and triggers an update animation (cross-fade) instead of exit + enter. This avoids remounting Suspense boundaries and refetching data:

```jsx
<ViewTransition>
  <TabPanel tab={activeTab} />
</ViewTransition>
```

Use `key` when content identity changes and you want a full re-enter animation (component state resets). Omit `key` for cross-fades within a persistent container (tabs, panels, carousel slides).

## Fade-Out Exit Conflicts with Shared Element Morphs

A fade-out exit on a page with shared element morphs causes a flash — the page dissolves while the element tries to morph. Fix: use a directional slide exit so the morph can visually detach from the exiting page:

```css
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
```

## Shared Elements Across Routes in Next.js

See **View Transitions in Next.js** below (Shared Elements Across Routes) for complete examples using `transitionTypes` on `next/link` combined with shared element `<ViewTransition name={...}>` for list-to-detail image morph animations.

## Isolate Elements from Parent Animations

### Persistent Layout Elements (Headers, Sidebars, Toolbars)

Elements that persist across navigations (sticky headers, navbars, sidebars, toolbars) get captured in the page content's transition snapshot. When a directional slide animates the page, the persistent element slides away with it — which looks broken.

Fix: give persistent elements their own `viewTransitionName` and disable animation on their transition group:

```jsx
<nav style={{ viewTransitionName: "persistent-nav" }}>
  {/* persistent element content */}
</nav>
```

```css
::view-transition-group(persistent-nav) {
  animation: none;
  z-index: 100;
}
```

This isolates the element into its own transition group that stays static during page slides. It won't be included in the page content's old/new snapshot.

For elements with `backdrop-blur` or `backdrop-filter`, see the Backdrop-Blur Workaround in CSS recipes below.

### Floating Elements (Popovers, Tooltips)

Popovers, tooltips, and dropdowns can also get captured in a parent's view transition snapshot, causing them to ghost or animate unexpectedly. The same pattern applies — give them their own `viewTransitionName`:

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

For a global fix that ensures all view transition groups render above normal content, use the wildcard selector:

```css
::view-transition-group(*) {
  z-index: 100;
}
```

## Shared Controls Between Skeleton and Content

When a Suspense fallback mirrors controls from the real content (search input, tab bar, filter row), give them the same `viewTransitionName` to form a shared element pair. Without this, the skeleton control slides away while the real one pops in independently:

```jsx
// In fallback skeleton:
<input disabled placeholder="Search..." style={{ viewTransitionName: 'search-input' }} />

// In real content:
<input placeholder="Search..." style={{ viewTransitionName: 'search-input' }} />
```

The matching name morphs the skeleton control into the real one in place. Ensure the element with manual `viewTransitionName` is not the root DOM node inside a `<ViewTransition>` — React applies its auto-generated name to the root node, which would override the manual one.

## Reusable Animated Collapse

For apps with many expand/collapse interactions, extract a reusable wrapper instead of repeating the conditional-render-with-`<ViewTransition>` pattern:

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

## Preserve State with Activity

Use `<Activity>` with `<ViewTransition>` to animate show/hide while preserving component state:

```jsx
import { Activity, ViewTransition, startTransition } from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <ViewTransition enter="slide-in" exit="slide-out">
    <Sidebar />
  </ViewTransition>
</Activity>
```

## Exclude Elements from a Transition with `useOptimistic`

When a `startTransition` changes both a control (e.g. a button label) and content (e.g. list order), use `useOptimistic` for the control. The optimistic value updates before React's transition snapshot, so it won't animate. The committed state drives the content, which changes within the transition and animates:

```tsx
const [sort, setSort] = useState('newest');
const [optimisticSort, setOptimisticSort] = useOptimistic(sort);

function cycleSort() {
  const nextSort = getNextSort(optimisticSort);
  startTransition(() => {
    setOptimisticSort(nextSort);  // updates before snapshot — no animation
    setSort(nextSort);            // changes within transition — animates
  });
}

// Button uses optimisticSort (instant, excluded from animation)
<button>Sort: {LABELS[optimisticSort]}</button>

// List uses committed sort (changes between snapshots, animates)
{items.sort(comparators[sort]).map(item => (
  <ViewTransition key={item.id}>
    <ItemCard item={item} />
  </ViewTransition>
))}
```

`useOptimistic` values resolve before the transition snapshot. Any DOM driven by optimistic state is already in its final form when the "before" snapshot is taken, so it doesn't participate in the `<ViewTransition>`. Only DOM driven by committed state (via `setState`) changes between snapshots and animates.

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
    return () => anim.cancel();
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

### Using Types in Event Callbacks

The `types` array is available as the second argument to all event callbacks:

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

## Troubleshooting

**ViewTransition not activating:**
- Ensure the `<ViewTransition>` comes before any DOM node in the component (not wrapped in a `<div>`).
- Ensure the state update is inside `startTransition`, not a plain `setState`.

**Nested `<ViewTransition>` steals update from parent:**
- Inner `<ViewTransition>` wrappers capture mutations, so `update="auto"` on a parent never fires. Fix: use `key` + `share` to force exit/enter, or `default="none"` on inner VTs.

**Enter/exit not firing on list items inside a grid wrapper:**
- `<ViewTransition key={id}>` inside a `<div className="grid">` suppresses enter/exit. Per-item VTs inside a wrapper only work for `update` (reorder) and `share` (morph). Restructure so the VT isn't below a DOM node.

**Fade-out exit breaks shared element morph:**
- Page dissolving conflicts with the morph animation. Use a directional slide exit instead. See "Fade-Out Exit Conflicts with Shared Element Morphs" above.

**"Two ViewTransition components with the same name" error:**
- Each `name` must be globally unique across the entire app at any point in time. Add item IDs: `` name={`hero-${item.id}`} ``.

**Back button skips animation:**
- The legacy `popstate` event requires synchronous completion, conflicting with view transitions. Upgrade your router to use the Navigation API for back-button animations.

**Animations from `flushSync` are skipped:**
- `flushSync` completes synchronously, which prevents view transitions from running. Use `startTransition` instead.

**Enter/exit not firing in a client component (only updates animate):**
- `startTransition(() => setState(...))` triggers a Transition, but if the new content isn't behind a `<Suspense>` boundary, React treats the swap as an **update** to the existing tree — not an enter/exit. The `<ViewTransition>` sees its children change but never fully unmounts/remounts, so only `update` animations fire. To get true enter/exit, either conditionally render the `<ViewTransition>` itself (so it mounts/unmounts with the content), or wrap the async content in `<Suspense>` so React can treat the reveal as an insertion.

**Competing / double animations on navigation:**
- Multiple `<ViewTransition>` components at different tree levels (layout + page + items) all fire simultaneously inside a single `document.startViewTransition`. If a layout-level one cross-fades the whole page while a page-level one slides up content, both run at once and fight for attention. Fix: use `default="none"` on the layout-level `<ViewTransition>`, or remove it entirely if pages manage their own animations.

**List reorder not animating with `useOptimistic`:**
- If the optimistic value drives the list sort order, items are already in their final positions before the transition snapshot — there's nothing to animate. Use the optimistic value only for controls (labels, icons) and the committed state (`useState`) for the list sort order.

**TypeScript error: "Property 'default' is missing in type 'ViewTransitionClassPerType'":**
- When passing an object to `enter`/`exit`/`update`/`share`, TypeScript requires a `default` key in the object. This applies even if the component-level `default` prop is set. Always include `default: 'none'` (or `'auto'`) in type-keyed objects.

**Hash fragments cause scroll jumps during view transitions:**
- Links with URL hash fragments (e.g., `/page#section`) trigger the browser's native scroll-to-anchor behavior during the navigation transition. This interferes with directional slide animations — the page scrolls to the anchor while simultaneously sliding horizontally, producing a diagonal jump. If you need to link to a specific section on a detail page, navigate without the hash and handle scroll/expansion programmatically after navigation completes.

**Backdrop-blur flickers on isolated persistent elements:**
- `backdrop-blur` / `backdrop-filter` can render incorrectly in the old snapshot (browser-dependent), causing a flash during cross-fade. Fix: `::view-transition-old(name) { display: none }` + `::view-transition-new(name) { animation: none }`. See Backdrop-Blur Workaround in CSS recipes.

**Named shared elements animate on every `useDeferredValue` update:**
- Per-item `<ViewTransition>` in a deferred list triggers per-item cross-fades on every keystroke. Fix: `default="none"` on each inner `<ViewTransition>`. See "Named Shared Elements Inside `useDeferredValue` Lists" above.

**`border-radius` lost during list reorder or shared element transitions:**
- Snapshots are placed in a flat pseudo-tree, losing the parent's clip. If `border-radius` comes from a parent's `overflow: hidden`, the snapshot shows square corners. Fix: apply `border-radius` directly to the captured element. Alternative: nested view transition groups (`view-transition-group: parent`, Chrome 140+) restore the hierarchy.

**Skeleton controls slide away while real controls pop in independently:**
- Give matching controls in fallback and content the same `viewTransitionName`. See "Shared Controls Between Skeleton and Content" above.

**Batching:**
- If multiple updates occur while an animation is running, React batches them into one. For example: if you navigate A→B, then B→C, then C→D during the first animation, the next animation will go B→D.

---

# CSS Animation Recipes for View Transitions

Ready-to-use CSS snippets for common view transition animations. Use these class names with `<ViewTransition>` props.

## Table of Contents

1. [Timing Variables](#timing-variables)
2. [Fade](#fade)
3. [Slide (Vertical)](#slide-vertical)
4. [Directional Navigation (Forward / Back)](#directional-navigation)
5. [Shared Element Morph](#shared-element-morph)
6. [Scale](#scale)
7. [Reduced Motion](#reduced-motion)

---

## Timing Variables

Define timing as CSS custom properties so durations are adjustable in one place. Use staggered timing — the enter animation delays by the exit duration so the old content leaves before the new content appears:

```css
:root {
  --duration-exit: 150ms;
  --duration-enter: 210ms;
  --duration-move: 400ms;
}
```

All recipes below reference these variables.

### Shared Keyframes

These reusable keyframes are used across multiple recipes:

```css
@keyframes fade {
  from { filter: blur(3px); opacity: 0; }
  to { filter: blur(0); opacity: 1; }
}

@keyframes slide {
  from { translate: var(--slide-offset); }
  to { translate: 0; }
}

@keyframes slide-y {
  from { transform: translateY(var(--slide-y-offset, 10px)); }
  to { transform: translateY(0); }
}
```

The `slide` keyframe uses a CSS variable for direction — set `--slide-offset: -60px` for left, `60px` for right. The same keyframe with `animation-direction: reverse` handles the exit.

---

## Fade

```css
::view-transition-old(.fade-out) {
  animation: var(--duration-exit) ease-in fade reverse;
}
::view-transition-new(.fade-in) {
  animation: var(--duration-enter) ease-out var(--duration-exit) both fade;
}
```

Usage:
```jsx
<ViewTransition enter="fade-in" exit="fade-out" />
```

---

## Slide (Vertical)

Slide down on exit, slide up on enter — the most common pattern for Suspense fallback-to-content transitions. Uses staggered timing with a fade:

```css
::view-transition-old(.slide-down) {
  animation:
    var(--duration-exit) ease-out both fade reverse,
    var(--duration-exit) ease-out both slide-y reverse;
}
::view-transition-new(.slide-up) {
  animation:
    var(--duration-enter) ease-in var(--duration-exit) both fade,
    var(--duration-move) ease-in both slide-y;
}
```

Usage:
```jsx
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <Skeleton />
    </ViewTransition>
  }
>
  <ViewTransition default="none" enter="slide-up">
    <Content />
  </ViewTransition>
</Suspense>
```

---

## Directional Navigation

### Separate Enter/Exit Classes

Used with the two-layer pattern where `enter` and `exit` map to different class names:

```css
::view-transition-new(.slide-from-right) {
  --slide-offset: 60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}
::view-transition-old(.slide-to-left) {
  --slide-offset: -60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}

::view-transition-new(.slide-from-left) {
  --slide-offset: -60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}
::view-transition-old(.slide-to-right) {
  --slide-offset: 60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
```

Usage with the two-layer pattern:
```jsx
<ViewTransition
  enter={{ "nav-forward": "slide-from-right", default: "none" }}
  exit={{ "nav-forward": "slide-to-left", default: "none" }}
  default="none"
>
  {children}
</ViewTransition>
```

### Single-Class Approach

Alternatively, a single CSS class name targets both `::view-transition-old` and `::view-transition-new` with different animations. This keeps the JSX simple — `enter="nav-forward"` / `exit="nav-forward"`:

```css
::view-transition-old(.nav-forward) {
  --slide-offset: -60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
::view-transition-new(.nav-forward) {
  --slide-offset: 60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}

::view-transition-old(.nav-back) {
  --slide-offset: 60px;
  animation:
    var(--duration-exit) ease-in both fade reverse,
    var(--duration-move) ease-in-out both slide reverse;
}
::view-transition-new(.nav-back) {
  --slide-offset: -60px;
  animation:
    var(--duration-enter) ease-out var(--duration-exit) both fade,
    var(--duration-move) ease-in-out both slide;
}
```

Usage with transition types:
```jsx
<ViewTransition
  default="none"
  enter={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
  exit={{
    'nav-forward': 'nav-forward',
    'nav-back': 'nav-back',
    default: 'none',
  }}
>
  {children}
</ViewTransition>
```

Triggering with `transitionTypes` on `next/link`:
```jsx
<Link href="/products/1" transitionTypes={['nav-forward']}>Next</Link>
<Link href="/products" transitionTypes={['nav-back']}>Back</Link>
```

Or programmatically:
```jsx
startTransition(() => {
  addTransitionType('nav-forward');
  router.push('/next-page');
});
```

---

## Shared Element Morph

For shared element transitions, control the morph duration on `::view-transition-group` and add a motion blur on `::view-transition-image-pair` to smooth fast-moving elements:

```css
::view-transition-group(.morph) {
  animation-duration: var(--duration-move);
}

::view-transition-image-pair(.morph) {
  animation-name: via-blur;
}

@keyframes via-blur {
  30% { filter: blur(3px); }
}
```

The blur at 30% creates a subtle motion-blur effect — fast-moving elements can be visually jarring, and this smooths the transition without adding perceptible delay.

Usage:
```jsx
<ViewTransition name={`product-${id}`} share="morph">
  <Image src={product.image} alt={product.name} />
</ViewTransition>
```

---

## Scale

```css
::view-transition-old(.scale-out) {
  animation: var(--duration-exit) ease-in scale-down;
}
::view-transition-new(.scale-in) {
  animation: var(--duration-enter) ease-out var(--duration-exit) both scale-up;
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

## Persistent Element Isolation

Prevent persistent elements (sticky headers, navbars, sidebars, toolbars) from being captured in page content's transition snapshot. Give them a `viewTransitionName` in JSX, then disable animation on their group:

```css
::view-transition-group(persistent-nav) {
  animation: none;
  z-index: 100;
}
```

### Backdrop-Blur Workaround

Elements with `backdrop-blur` or `backdrop-filter` can flash during the cross-fade — the old snapshot may render the blur incorrectly or not at all (browser-dependent). To avoid the cross-fade entirely, hide the old snapshot and disable animation on the new one:

```css
::view-transition-old(persistent-nav) {
  display: none;
}
::view-transition-new(persistent-nav) {
  animation: none;
}
```

Use instead of the group-level fix when the isolated element uses composited effects like `backdrop-filter`.

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

# View Transitions in Next.js

## Table of Contents

1. [Setup](#setup)
2. [Layout-Level ViewTransition](#layout-level-viewtransition)
3. [The transitionTypes Prop on next/link](#the-transitiontypes-prop-on-nextlink)
4. [Programmatic Navigation with Transitions](#programmatic-navigation-with-transitions)
5. [Transition Types for Navigation Direction](#transition-types-for-navigation-direction)
6. [Shared Elements Across Routes](#shared-elements-across-routes)
7. [Combining with Suspense and Loading States](#combining-with-suspense-and-loading-states)
8. [Server Components Considerations](#server-components-considerations)

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
