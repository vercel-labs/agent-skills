---
title: Subscribe to Derived State
impact: MEDIUM
impactDescription: reduces re-render frequency
tags: rerender, derived-state, media-query, optimization, web, react-native
---

## Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

**Incorrect (re-renders on every pixel change):**

```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**Correct (Web - re-renders only when boolean changes):**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**React Native (requires custom hook for derived state):**

In React Native, `useWindowDimensions()` still triggers re-renders on every dimension change. You need to create a custom hook that only re-renders when the derived boolean changes:

```tsx
import { useWindowDimensions } from 'react-native'
import { useSyncExternalStore } from 'react'

// Custom hook that only updates when breakpoint changes
function useIsMobile() {
  const subscribe = (callback: () => void) => {
    const dimensions = Dimensions.addEventListener('change', callback)
    return () => dimensions?.remove()
  }

  const getSnapshot = () => {
    const { width } = Dimensions.get('window')
    return width < 768
  }

  return useSyncExternalStore(subscribe, getSnapshot)
}

function Sidebar() {
  const isMobile = useIsMobile()  // Only re-renders when crossing 768px threshold
  return <View style={isMobile ? styles.mobile : styles.desktop} />
}
```

**Alternative (simpler but less efficient):**

If re-render frequency is not critical, use `useWindowDimensions()` directly:

```tsx
import { useWindowDimensions, View } from 'react-native'

function Sidebar() {
  const { width } = useWindowDimensions()
  const isMobile = width < 768  // Still re-renders on every dimension change
  return <View style={isMobile ? styles.mobile : styles.desktop} />
}
```
