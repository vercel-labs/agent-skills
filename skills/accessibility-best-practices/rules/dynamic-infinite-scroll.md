---
title: Provide Accessible Alternatives to Infinite Scroll
impact: MEDIUM
impactDescription: Infinite scroll traps keyboard users and makes footer content unreachable
tags: dynamic, infinite-scroll, pagination, keyboard, screen-reader
wcag: "2.1.1 Level A, 2.4.1 Level A"
---

## Provide Accessible Alternatives to Infinite Scroll

**Impact: MEDIUM (Infinite scroll traps keyboard users and makes footer content unreachable)**

Infinite scroll can prevent keyboard users from reaching footer content, overwhelm screen readers with continuously growing content, and provide no sense of position within results. Provide a "Load more" button or pagination as an alternative.

**Incorrect (automatic infinite scroll with no controls):**

```tsx
function ProductList() {
  useEffect(() => {
    // Auto-loads on scroll — keyboard users can never reach footer
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore()
    })
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
      <div ref={sentinelRef} />
    </div>
  )
}
```

**Correct (Load More button with status announcement):**

```tsx
function ProductList() {
  const [products, setProducts] = useState(initialProducts)
  const [status, setStatus] = useState('')

  async function handleLoadMore() {
    setStatus('Loading more products...')
    const more = await fetchMore()
    setProducts((prev) => [...prev, ...more])
    setStatus(`${more.length} more products loaded. Showing ${products.length + more.length} of ${total}.`)
  }

  return (
    <div>
      <div aria-live="polite" className="sr-only">{status}</div>
      <ul aria-label={`Products, showing ${products.length} of ${total}`}>
        {products.map((p) => (
          <li key={p.id}><ProductCard product={p} /></li>
        ))}
      </ul>
      {hasMore && (
        <button onClick={handleLoadMore}>
          Load more products ({total - products.length} remaining)
        </button>
      )}
    </div>
  )
}
```

Announce how many items loaded and the user's current position. The "Load more" button lets keyboard users decide when to load content, keeping footer and other page regions reachable.

Reference: [WCAG 2.4.1 Bypass Blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
