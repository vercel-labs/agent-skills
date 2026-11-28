---
title: Animate SVG Wrapper Instead of SVG Element
impact: LOW
impactDescription: enables hardware acceleration in engines that don't composite SVG animations
tags: rendering, svg, css, animation, performance
---

## Animate SVG Wrapper Instead of SVG Element

Engines without hardware acceleration for SVG animations repaint the SVG on every frame when a CSS animation targets the SVG element itself. Chromium 89+ and Firefox already hardware-accelerate these animations ([Chrome blog](https://developer.chrome.com/blog/hardware-accelerated-animations)), so there the wrapper makes no difference. Wrapping the SVG in an inline-block `<div>` and animating the wrapper is a cheap way to get compositing in engines that don't. Keep the wrapper `inline-block` (or give it the SVG's size): a block-level wrapper stretches to the container width and rotates around its own centre, not the icon's. Confirm with DevTools → Rendering → Paint flashing.

**Incorrect (animating SVG directly - repaints in engines without SVG compositing):**

```tsx
function LoadingSpinner() {
  return (
    <svg 
      className="animate-spin"
      width="24" 
      height="24" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**Correct (animating wrapper div - composited):**

```tsx
function LoadingSpinner() {
  return (
    <div className="inline-block animate-spin">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

This applies to the compositor-friendly properties: `transform` (and the individual `translate`, `scale`, `rotate` properties) and `opacity`.
