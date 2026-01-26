---
title: Use Transitions for Non-Urgent Updates
impact: MEDIUM
impactDescription: maintains UI responsiveness
tags: rerender, transitions, startTransition, performance, web, react-native
---

## Use Transitions for Non-Urgent Updates

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.

**Incorrect (Web - blocks UI on every scroll):**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**Correct (Web - non-blocking updates):**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**Incorrect (React Native - blocks UI on every scroll):**

```tsx
import { ScrollView, Text } from 'react-native'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  
  return (
    <ScrollView
      onScroll={(e) => {
        // Direct state update blocks UI rendering
        setScrollY(e.nativeEvent.contentOffset.y)
      }}
      scrollEventThrottle={16}
    >
      <Text>Scroll Position: {scrollY}</Text>
      {/* Heavy content */}
    </ScrollView>
  )
}
```

**Correct (React Native - non-blocking updates):**

```tsx
import { ScrollView, Text } from 'react-native'
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  
  return (
    <ScrollView
      onScroll={(e) => {
        // Non-urgent update doesn't block scrolling
        startTransition(() => {
          setScrollY(e.nativeEvent.contentOffset.y)
        })
      }}
      scrollEventThrottle={16}
    >
      <Text>Scroll Position: {scrollY}</Text>
      {/* Heavy content */}
    </ScrollView>
  )
}
```
