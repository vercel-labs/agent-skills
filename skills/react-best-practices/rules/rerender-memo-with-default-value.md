---
title: Extract Default Non-primitive Parameter Value from Memoized Component to Constant
impact: MEDIUM
impactDescription: restores memoization by using a constant for default value
tags: rerender, memo, optimization
---

## Extract Default Non-primitive Parameter Value from Memoized Component to Constant

`memo()` compares **incoming props**, not internal default parameter values. A default like `onClick = () => {}` is only evaluated inside the component body after `memo` has already decided whether to re-render — so it does not affect memoization on its own. However, when the component is called without that prop and the default value is used as a dependency in `useEffect`, `useCallback`, or `useMemo`, a new function instance is created on every render, causing those hooks to re-run unnecessarily. To fix this, extract the default value into a constant at the module level.

**Incorrect:**
```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  useEffect(() => {
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [onClick]) // ← new function instance on every render = effect re-runs constantly
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**Correct:**
```tsx
const NOOP = () => {}

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  useEffect(() => {
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [onClick]) // ← stable reference, effect only re-runs when onClick genuinely changes
  // ...
})

// Used without optional onClick
<UserAvatar />
```