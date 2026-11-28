---
title: Use Passive Event Listeners for Scrolling Performance
impact: MEDIUM
impactDescription: eliminates scroll delay caused by event listeners
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## Use Passive Event Listeners for Scrolling Performance

Add `{ passive: true }` to touch and wheel event listeners on scrollable elements to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.

**Incorrect:**

```typescript
const scrollerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const el = scrollerRef.current
  if (!el) return
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  el.addEventListener('touchstart', handleTouch)
  el.addEventListener('wheel', handleWheel)
  
  return () => {
    el.removeEventListener('touchstart', handleTouch)
    el.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Correct:**

```typescript
const scrollerRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  const el = scrollerRef.current
  if (!el) return
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)
  
  el.addEventListener('touchstart', handleTouch, { passive: true })
  el.addEventListener('wheel', handleWheel, { passive: true })
  
  return () => {
    el.removeEventListener('touchstart', handleTouch)
    el.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Already passive by default on `window`, `document`, `document.documentElement` and `document.body`:** `touchstart` and `touchmove` in all major browsers (Chrome 55, Firefox 61, Safari 11.1), and `wheel`/`mousewheel` in Chrome 73+ and Firefox 84+, but not Safari ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)). On those targets, an explicit `{ passive: true }` only changes behaviour for `wheel` in Safari. On any other element, the default is `false`, so the option matters.

**Use passive when:** tracking/analytics, logging, any listener that doesn't call `preventDefault()`.

**Don't use passive when:** implementing custom swipe gestures, custom zoom controls, or any listener that needs `preventDefault()`.
