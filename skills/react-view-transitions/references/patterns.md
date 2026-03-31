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

The shared `name={`item-${id}`}` on both the card and detail `<ViewTransition>` creates a shared element pair — the card morphs into the detail view. The `scrollRef` saves and restores scroll position so users return to where they were in the grid. See `css-recipes.md` for the slide-up/slide-down CSS.

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

See `nextjs.md` (Shared Elements Across Routes) for complete examples using `transitionTypes` on `next/link` combined with shared element `<ViewTransition name={...}>` for list-to-detail image morph animations.

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

For elements with `backdrop-blur` or `backdrop-filter`, see the Backdrop-Blur Workaround in `css-recipes.md`.

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
- `backdrop-blur` / `backdrop-filter` can render incorrectly in the old snapshot (browser-dependent), causing a flash during cross-fade. Fix: `::view-transition-old(name) { display: none }` + `::view-transition-new(name) { animation: none }`. See Backdrop-Blur Workaround in `css-recipes.md`.

**Named shared elements animate on every `useDeferredValue` update:**
- Per-item `<ViewTransition>` in a deferred list triggers per-item cross-fades on every keystroke. Fix: `default="none"` on each inner `<ViewTransition>`. See "Named Shared Elements Inside `useDeferredValue` Lists" above.

**`border-radius` lost during list reorder or shared element transitions:**
- Snapshots are placed in a flat pseudo-tree, losing the parent's clip. If `border-radius` comes from a parent's `overflow: hidden`, the snapshot shows square corners. Fix: apply `border-radius` directly to the captured element. Alternative: nested view transition groups (`view-transition-group: parent`, Chrome 140+) restore the hierarchy.

**Skeleton controls slide away while real controls pop in independently:**
- Give matching controls in fallback and content the same `viewTransitionName`. See "Shared Controls Between Skeleton and Content" above.

**Batching:**
- If multiple updates occur while an animation is running, React batches them into one. For example: if you navigate A→B, then B→C, then C→D during the first animation, the next animation will go B→D.
