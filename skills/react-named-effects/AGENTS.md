# Named Effects — Complete Guide

**Version 1.0.0**
Community
April 2026

> **Note:**
> This document is the compiled version of the react-named-effects skill with all reference content expanded inline. It is generated from `SKILL.md`, `references/diagnostics.md`, and `references/conventions.md`. Edit the source files, not this document. For the progressive-disclosure version, start with `SKILL.md`.

## Core Pattern

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

**Naming reveals structural problems.** If a name requires "and," the effect should be split. If the name sounds like state shuffling (`syncDerivedValue`, `updateStateFromProps`), the effect probably shouldn't exist.

## When to Apply

Name every effect by default. It costs nothing and the benefits compound. Especially valuable when:
- A component has 2 or more effects
- An effect body exceeds a few lines
- Reviewing or debugging unfamiliar code
- Triaging errors in monitoring tools (Sentry, Datadog)

---

## Diagnostics: What Naming Reveals

Naming effects isn't just style — it's a diagnostic tool. When an effect resists a clean name, the name is telling you the effect has a structural problem.

### Split Signal: "And" in the Name

If the best name contains "and," the effect handles two concerns:

```tsx
// Name requires "and" — two unrelated concerns
useEffect(function syncWidthAndApplyTheme() {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  if (user?.preferences?.theme) {
    document.body.className = user.preferences.theme;
  }
  return () => window.removeEventListener('resize', handleResize);
}, [user?.preferences?.theme]);
```

```tsx
// Two focused effects
useEffect(function trackWindowWidth() {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(function applyUserTheme() {
  if (user?.preferences?.theme) {
    document.body.className = user.preferences.theme;
  }
}, [user?.preferences?.theme]);
```

After splitting, each effect has a single clear name and its own dependency array. Dependencies that seemed unrelated in the combined effect now make sense in isolation.

### Elimination Signal: State Shuffling Names

If the best name sounds like internal state management, the effect likely shouldn't exist:

```tsx
// Vague name — signals derived state stored in state
useEffect(function syncFullName() {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Derive during render instead — no effect, no extra render cycle
const fullName = `${firstName} ${lastName}`;
```

The effect version triggers an extra render: React renders, runs the effect, calls `setFullName`, re-renders. The derived version computes inline — always correct, zero overhead.

### Anti-Pattern Reference

When naming exposes a problem, fix the structure — not the name:

| Difficult Name | Signal | Fix |
|----------------|--------|-----|
| `syncDerivedValue` | Derived state stored in state | Compute during render |
| `resetFormOnSubmit` | Interaction logic in effect | Move to event handler |
| `notifyParentOfStateChange` | Upward data flow via effect | Lift state or callback to source |
| `updateStateBasedOnOtherState` | State-to-state sync | Derive or consolidate state |
| `doMultipleThingsOnMount` | Multiple concerns | Split into separate effects |

These map directly to patterns in React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

### The Naming Test

When writing or reviewing an effect, apply this sequence:

1. **Can you name it in 2-4 words?** → Good effect, name it
2. **Does the name require "and"?** → Split into separate effects
3. **Does the name describe state-to-state sync?** → Derive during render or move to event handler
4. **Can't think of a name at all?** → The effect is doing too much or shouldn't be an effect

Effects that survive this test tend to synchronize with external systems: `connectToWebSocket`, `initializeMapSDK`, `subscribeToGeolocation`. The verbs are concrete and the targets are external.

---

## Naming Conventions

### Verb Vocabulary

Use verb phrases that describe what the effect synchronizes with:

| Verb | Signals | Example |
|------|---------|---------|
| `connect` / `subscribe` / `listen` | Event-based external sync | `connectToWebSocket` |
| `fetch` / `load` | Data retrieval | `fetchInitialStock` |
| `initialize` / `setup` | One-time setup | `initializeMapSDK` |
| `synchronize` / `apply` | External system sync | `synchronizeMapViewport` |
| `notify` / `report` | Outbound communication | `notifyAnalyticsOfPageView` |
| `reset` / `clear` | State cleanup on change | `resetStockOnLocationChange` |
| `track` / `observe` | Monitoring | `trackWindowWidth` |

Effects with clear, concrete names tend to be legitimate synchronization points. Names that sound like internal state management (`updateStateBasedOnProps`, `syncDerivedValue`) usually signal code that belongs elsewhere.

### Naming Cleanup Functions

When teardown does non-trivial work, name it for symmetry:

```tsx
useEffect(function pollServerForUpdates() {
  const intervalId = setInterval(() => {
    fetch(`/api/status/${serverId}`)
      .then((res) => res.json())
      .then(setServerStatus);
  }, 5000);

  return function stopPollingServer() {
    clearInterval(intervalId);
  };
}, [serverId]);
```

The symmetry between `pollServerForUpdates` and `stopPollingServer` makes both halves immediately clear. For simple cleanup (clearing a single listener or timeout), naming the return function is optional.

### Naming Other Hooks

The same pattern improves readability in `useMemo` and `useCallback`:

```tsx
const sortedItems = useMemo(function sortItemsByPrice() {
  return [...items].sort((a, b) => a.price - b.price);
}, [items]);

const stableOnChange = useCallback(function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
  validate(e.target.value);
  onChange(e.target.value);
}, [validate, onChange]);
```

`useEffect` benefits most because effects run at non-obvious times, have hidden cleanup semantics, and require reconstructing trigger conditions from dependency arrays. But any hook taking a callback gains readability from a name.

### Named Effects Inside Custom Hooks

Custom hooks and named effects solve different problems — use both:

- **Name inline** when the effect is single-use with no associated state
- **Extract to custom hook** when the effect manages its own state and may be reused
- **Always name the function inside the custom hook too** — custom hooks can have multiple effects

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(function trackWindowWidth() {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

The custom hook name (`useWindowWidth`) describes what the consumer gets. The effect name (`trackWindowWidth`) describes what the implementation does. Both names serve different audiences: the hook name serves component authors, the effect name serves debuggers.

---

## Tooling

### ESLint Enforcement

Two community plugins can enforce named effect callbacks:

**eslint-plugin-goodeffects** — rule `enforce-named-effect-callbacks` fails on anonymous arrows in `useEffect`:

```json
{
  "plugins": ["goodeffects"],
  "rules": {
    "goodeffects/enforce-named-effect-callbacks": "warn"
  }
}
```

**eslint-plugin-use-encapsulation** — rule `prefer-custom-hooks` requires all hook calls to live inside custom hooks (stricter; enforces extraction, not just naming). Based on Kyle Shevlin's [useEncapsulation](https://kyleshevlin.com/use-encapsulation/) pattern.

### Technical Notes

**Named callbacks appear in JavaScript engine stack traces.** Chrome, Firefox, Node.js, and error monitoring tools (Sentry, Datadog, Replay.io) all display the function name instead of `(anonymous)`. This is the primary debugging benefit.

**Named callbacks do not change React DevTools display.** DevTools extracts hook names via source-map AST parsing from variable assignments (e.g., `const [count, setCount] = useState(0)` shows "count"). Since `useEffect` returns nothing and has no variable assignment, DevTools shows "Effect" regardless of whether the callback is named. This is a common misconception.

**No performance difference.** Named and anonymous functions are equivalent at runtime. Both create a new function reference on each render. Use `useCallback` for referential stability — naming is purely for readability and debugging.

**React docs use anonymous arrows.** React's official documentation uses anonymous arrow functions in all `useEffect` examples for brevity and pedagogical clarity. This skill recommends named expressions for production code, where the readability and debugging benefits justify the slightly longer syntax.

---

## References

- [Neciu Dan — Start Naming Your useEffect Functions](https://neciudan.dev/name-your-effects)
- [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Kyle Shevlin — useEncapsulation](https://kyleshevlin.com/use-encapsulation/)
- [Sergio Xalambrí — Pro Tip: Name Your useEffect Functions](https://sergiodxa.com/articles/pro-tip-name-your-useeffect-functions)
