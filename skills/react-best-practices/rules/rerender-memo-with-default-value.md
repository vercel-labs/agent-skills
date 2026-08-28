---
title: Pass Stable Non-primitive Props to Memoized Components
impact: MEDIUM
impactDescription: restores memoization by avoiding new references on each render
tags: rerender, memo, optimization
---

## Pass Stable Non-primitive Props to Memoized Components

When parent components pass non-primitive props (functions, objects, arrays) as inline values to a memoized child, each render creates a new reference. `memo()` performs shallow comparison of props, so new references cause unnecessary re-renders.

To address this, extract inline non-primitive values to stable references outside the component.

**Incorrect (new function reference on every render):**

```tsx
function UserList() {
  return <UserAvatar onClick={() => handleClick()} />
}
```

**Correct (stable reference):**

```tsx
const NOOP = () => {};

function UserList() {
  return <UserAvatar onClick={NOOP} />
}
```

**Alternative with useCallback:**

```tsx
function UserList({ userId }: { userId: string }) {
  const handleClick = useCallback(() => {
    doSomething(userId)
  }, [userId])

  return <UserAvatar onClick={handleClick} />
}
```

Default parameter values in a memoized component (e.g., `{ onClick = () => {} }`) do NOT affect memo comparison—`memo()` only compares props passed by the parent, not internal defaults. The optimization above applies to the **caller**, not the component definition.
