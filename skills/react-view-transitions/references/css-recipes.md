# CSS Animation Recipes for View Transitions

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
