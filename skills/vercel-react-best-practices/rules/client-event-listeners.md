---
title: Deduplicate Global Event Listeners
impact: LOW
impactDescription: single listener for N components
tags: client, event-listeners, singleton
---

## Deduplicate Global Event Listeners

Use a module-level singleton listener to share global event listeners across component instances, instead of each instance attaching its own.

**Incorrect (N instances = N listeners):**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

When using the `useKeyboardShortcut` hook multiple times, each instance will register a new listener.

**Correct (N instances = 1 listener):**

```tsx
// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

// Module-level singleton: the single real DOM listener, attached once
let globalKeydownHandler: ((e: KeyboardEvent) => void) | null = null

function attachGlobalKeydownListener() {
  if (globalKeydownHandler) return
  globalKeydownHandler = (e: KeyboardEvent) => {
    if (e.metaKey && keyCallbacks.has(e.key)) {
      keyCallbacks.get(e.key)!.forEach(cb => cb())
    }
  }
  window.addEventListener('keydown', globalKeydownHandler)
}

function detachGlobalKeydownListenerIfUnused() {
  if (keyCallbacks.size === 0 && globalKeydownHandler) {
    window.removeEventListener('keydown', globalKeydownHandler)
    globalKeydownHandler = null
  }
}

function useKeyboardShortcut(key: string, callback: () => void) {
  // Register this callback in the Map
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)
    attachGlobalKeydownListener()

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
      detachGlobalKeydownListenerIfUnused()
    }
  }, [key, callback])
}

function Profile() {
  // Multiple shortcuts will share the same listener
  useKeyboardShortcut('p', () => { /* ... */ }) 
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```
