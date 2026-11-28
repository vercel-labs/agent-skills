---
title: Use Passive Event Listeners for Scrolling Performance
impact: MEDIUM
impactDescription: eliminates scroll delay caused by event listeners
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## Use Passive Event Listeners for Scrolling Performance

Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.

**Incorrect:**

```tsx
function Feed({ children }: { children: ReactNode }) {
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

  return <div ref={scrollerRef} className="overflow-auto">{children}</div>
}
```

**Correct:**

```tsx
function Feed({ children }: { children: ReactNode }) {
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

  return <div ref={scrollerRef} className="overflow-auto">{children}</div>
}
```

**Already passive by default on `window`, `document`, `document.documentElement` and `document.body`:** `touchstart` and `touchmove` in all major browsers (Chrome 55, Firefox 61, Safari 11.1), and `wheel`/`mousewheel` in Chrome 73+ and Firefox 84+, but not Safari ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#using_passive_listeners)). On those targets, an explicit `{ passive: true }` only changes behaviour for `wheel`/`mousewheel` in Safari (and in browsers older than those versions). On any other element the default is `false`, and a non-passive listener on the element a scroll starts over, or any of its ancestors, delays that scroll.

**Use passive when:** tracking/analytics, logging, any listener that doesn't call `preventDefault()`.

**Don't use passive when:** implementing custom swipe gestures, custom zoom controls, or any listener that needs `preventDefault()`.
