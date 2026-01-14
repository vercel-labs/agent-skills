---
title: Deduplicate Global Event Listeners
impact: MEDIUM-HIGH
impactDescription: single listener for N components
tags: client, swr, event-listeners, subscription
---

## Deduplicate Global Event Listeners

Use `useSWRSubscription()` to share global event listeners across component instances.

**Incorrect (N instances = N listeners):**

```tsx
function KeyboardShortcut({ onTrigger }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        onTrigger()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onTrigger])
}
```

**Correct (N instances = 1 listener):**

```tsx
import useSWRSubscription from 'swr/subscription'

function useKeyboardShortcut(key: string, callback: () => void) {
  useSWRSubscription(['keydown', key], (_, { next }) => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        next(null, e)
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function KeyboardShortcut({ onTrigger }: Props) {
  useKeyboardShortcut('k', onTrigger)
}
```
