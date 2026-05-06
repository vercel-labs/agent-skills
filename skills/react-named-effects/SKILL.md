---
name: react-named-effects
description: Name useEffect, useCallback, and useMemo callbacks with function expressions instead of anonymous arrows. Use when writing, reviewing, or refactoring React components with multiple effects, debugging unclear stack traces, or improving hook readability. Triggers on effect-heavy components, hook refactoring, code review, and stack trace debugging.
license: MIT
metadata:
  author: community
  version: "1.0.0"
---

# Named Effects

Replace anonymous arrows in `useEffect` with named function expressions. The name documents intent, improves stack traces, and acts as a diagnostic — effects that resist clear naming have structural problems.

> **Note:** React's official documentation uses anonymous arrows in all `useEffect` examples for brevity. This skill recommends named expressions for production code where readability and debugging outweigh conciseness — the same reason we name variables instead of using single letters.

```tsx
// Anonymous — tells you nothing
useEffect(() => {
  const ws = new WebSocket(`wss://api/${id}`);
  ws.onmessage = (e) => setData(JSON.parse(e.data));
  return () => ws.close();
}, [id]);

// Named — intent is immediate
useEffect(function connectToWebSocket() {
  const ws = new WebSocket(`wss://api/${id}`);
  ws.onmessage = (e) => setData(JSON.parse(e.data));
  return () => ws.close();
}, [id]);
```

## Why This Matters

**Stack traces improve.** Anonymous effects show `at (anonymous) @ InventorySync.tsx:14`. Named effects show `at connectToWebSocket @ InventorySync.tsx:14`. This works in Chrome, Firefox, Node.js, Sentry, and Datadog — the name comes from the JavaScript engine, not React.

**Component data flow becomes scannable.** Four named effects tell you everything without reading a single line of implementation:

```tsx
useEffect(function connectToInventoryWebSocket() { /* ... */ }, [warehouseId]);
useEffect(function fetchInitialStock() { /* ... */ }, [warehouseId, locationId, connected]);
useEffect(function resetStockOnLocationChange() { /* ... */ }, [locationId]);
useEffect(function synchronizeDocumentTitle() { /* ... */ }, [stock]);
```

**Naming reveals structural problems.** If a name requires "and," the effect should be split. If the name sounds like state shuffling (`syncDerivedValue`, `updateStateFromProps`), the effect probably shouldn't exist. See `references/diagnostics.md` for the full diagnostic framework.

## When to Apply

Name every effect by default. It costs nothing and the benefits compound. Especially valuable when:
- A component has 2 or more effects
- An effect body exceeds a few lines
- Reviewing or debugging unfamiliar code
- Triaging errors in monitoring tools (Sentry, Datadog)

## Quick Reference

| Verb | Signals | Example |
|------|---------|---------|
| `connect` / `subscribe` | Event-based external sync | `connectToWebSocket` |
| `fetch` / `load` | Data retrieval | `fetchInitialStock` |
| `initialize` / `setup` | One-time setup | `initializeMapSDK` |
| `synchronize` / `apply` | External system sync | `synchronizeMapViewport` |
| `reset` / `clear` | State cleanup on change | `resetStockOnLocationChange` |
| `track` / `observe` | Monitoring | `trackWindowWidth` |

For cleanup function naming, custom hook patterns, ESLint enforcement, and technical notes, see `references/conventions.md`.

## Deeper Guidance

- **Refactoring or reviewing effects?** → `references/diagnostics.md` — anti-pattern detection, split signals, effects that shouldn't exist
- **Need naming patterns or tooling?** → `references/conventions.md` — verb vocabulary, cleanup naming, useCallback/useMemo, custom hooks, ESLint plugins, technical notes

## References

- [Neciu Dan — Start Naming Your useEffect Functions](https://neciudan.dev/name-your-effects)
- [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Kyle Shevlin — useEncapsulation](https://kyleshevlin.com/use-encapsulation/)
- [Sergio Xalambrí — Pro Tip: Name Your useEffect Functions](https://sergiodxa.com/articles/pro-tip-name-your-useeffect-functions)
