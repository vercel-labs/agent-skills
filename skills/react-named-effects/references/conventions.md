# Naming Conventions and Tooling

## Verb Vocabulary

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

Effects with clear, concrete names tend to be legitimate synchronization points. Names that sound like internal state management (`updateStateBasedOnProps`, `syncDerivedValue`) usually signal code that belongs elsewhere — see `diagnostics.md`.

## Naming Cleanup Functions

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

## Naming Other Hooks

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

## Named Effects Inside Custom Hooks

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

## ESLint Enforcement

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

## Technical Notes

**Named callbacks appear in JavaScript engine stack traces.** Chrome, Firefox, Node.js, and error monitoring tools (Sentry, Datadog, Replay.io) all display the function name instead of `(anonymous)`. This is the primary debugging benefit.

**Named callbacks do not change React DevTools display.** DevTools extracts hook names via source-map AST parsing from variable assignments (e.g., `const [count, setCount] = useState(0)` shows "count"). Since `useEffect` returns nothing and has no variable assignment, DevTools shows "Effect" regardless of whether the callback is named. This is a common misconception.

**No performance difference.** Named and anonymous functions are equivalent at runtime. Both create a new function reference on each render. Use `useCallback` for referential stability — naming is purely for readability and debugging.

**React docs use anonymous arrows.** React's official documentation uses anonymous arrow functions in all `useEffect` examples for brevity and pedagogical clarity. This skill recommends named expressions for production code, where the readability and debugging benefits justify the slightly longer syntax.
