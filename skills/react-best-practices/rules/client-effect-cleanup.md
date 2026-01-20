---
title: Clean up effects and abort async work
impact: MEDIUM
impactDescription: prevents memory leaks and stale updates
tags: client, effects, cleanup, abortcontroller, subscriptions
---

## Clean up effects and abort async work

Always clean up subscriptions/listeners and abort in-flight async work in `useEffect` to prevent memory leaks and `setState` after unmount.

**Incorrect (leaks listener, fetch can update after unmount):**

```tsx
function Notifications() {
  const [data, setData] = useState<Notification[]>([])

  useEffect(() => {
    const onResize = () => { /* ... */ }
    window.addEventListener('resize', onResize)

    fetch('/api/notifications')
      .then(res => res.json())
      .then(setData)

    // Missing cleanup + no abort
  }, [])

  return <List items={data} />
}
```

**Correct (cleanup + AbortController guard):**

```tsx
function Notifications() {
  const [data, setData] = useState<Notification[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const onResize = () => setData(prev => prev)

    window.addEventListener('resize', onResize)

    fetch('/api/notifications', { signal: controller.signal })
      .then(res => res.json())
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result)
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          throw error
        }
      })

    return () => {
      window.removeEventListener('resize', onResize)
      controller.abort()
    }
  }, [])

  return <List items={data} />
}
```

Reference: [React useEffect cleanup](https://react.dev/reference/react/useEffect#cleaning-up-an-effect), [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
