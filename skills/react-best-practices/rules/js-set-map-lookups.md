---
title: Use Set/Map for O(1) Lookups
impact: LOW-MEDIUM
impactDescription: O(n) to O(1)
tags: javascript, set, map, data-structures, performance
---

## Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

**Incorrect (O(n) per check):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correct (O(1) per check):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

### Common Pitfall: Recreating Set/Map Inside Functions

Creating a Set inside a function that runs repeatedly negates the benefit - Set construction is O(n), so you pay O(n) on every call instead of once.

**Incorrect (recreated every call):**

```typescript
function isAllowed(id: string) {
  const allowedIds = new Set(['a', 'b', 'c', ...])
  return allowedIds.has(id)
}
```

**Correct (created once at module level):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])

function isAllowed(id: string) {
  return allowedIds.has(id)
}
