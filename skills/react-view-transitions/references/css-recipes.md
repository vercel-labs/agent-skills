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

Triggering programmatically with `addTransitionType`:
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
