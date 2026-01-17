---
title: Early Length Check for Array Comparisons
impact: MEDIUM-HIGH
impactDescription: avoids expensive operations when lengths differ
tags: javascript, arrays, performance, optimization, comparison
---

## Early Length Check for Array Comparisons

When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.

In real-world applications, this optimization is especially valuable when the comparison runs in hot paths (event handlers, render loops).

**Incorrect (always runs expensive comparison):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and stringifies, even when lengths differ
  return JSON.stringify(current.sort()) !== JSON.stringify(original.sort())
}
```

Two O(n log n) sorts run even when `current.length` is 5 and `original.length` is 100. There is also overhead of stringifying the arrays and comparing the strings.

**Correct (O(1) length check first):**

```typescript
function getCounts(array: string[]) {
  const counts = new Map()
  for (const element of array) {
    counts.set(element, (counts.get(element) ?? 0) + 1)
  }
  return counts
}
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only count when lengths match
  const currentCounts = getCounts(current)
  const originalCounts = getCounts(original)
  if (currentCounts.size !== originalCounts.size) {
    return true
  }
  // Only compare when the number of elements in the maps are the same
  for (const [element, count] of currentCounts) {
    if (count !== originalCounts.get(element)) {
      return true
    }
  }
  return false
}
```

This new approach is more efficient because:
- It avoids the overhead of sorting and joining the arrays when lengths differ
- It avoids O(n log n) sorting operations by creating and comparing maps of the element counts, an O(n) procedure
- It avoids consuming memory for the joined strings (especially important for large arrays)
- It avoids mutating the original arrays
- It returns early when a difference is found
