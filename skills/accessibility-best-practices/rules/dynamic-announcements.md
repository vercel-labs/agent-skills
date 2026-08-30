---
title: Announce Dynamic Changes to Screen Readers
impact: HIGH
impactDescription: Screen reader users miss content changes that happen outside their current focus
tags: dynamic, announcements, live-region, screen-reader
wcag: "4.1.3 Level AA"
---

## Announce Dynamic Changes to Screen Readers

**Impact: HIGH (Screen reader users miss content changes that happen outside their current focus)**

When UI content changes dynamically (items added to cart, filters applied, sort changed), screen reader users need to be informed. Create a reusable announcer component using an `aria-live` region that persists in the DOM.

**Incorrect (no announcement of dynamic changes):**

```tsx
function CartButton({ item }) {
  function addToCart() {
    cart.add(item)
    // Visual badge updates but screen reader user doesn't know
  }
  return <button onClick={addToCart}>Add to cart</button>
}
```

**Correct (announcer component for dynamic changes):**

```tsx
// Reusable announcer — mount once at app root
function Announcer() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    function handler(e: CustomEvent) {
      setMessage(e.detail)
    }
    window.addEventListener('announce', handler as EventListener)
    return () => window.removeEventListener('announce', handler as EventListener)
  }, [])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}

// Usage — dispatch custom event from anywhere
function announce(message: string) {
  window.dispatchEvent(new CustomEvent('announce', { detail: message }))
}

function CartButton({ item }) {
  function addToCart() {
    cart.add(item)
    announce(`${item.name} added to cart. Cart total: ${cart.count} items.`)
  }
  return <button onClick={addToCart}>Add to cart</button>
}
```

The `aria-live` region must exist in the DOM before the content changes. Mount the `Announcer` component once in your layout. Use `aria-atomic="true"` to announce the full content, not just the changed portion.

Reference: [WCAG 4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
