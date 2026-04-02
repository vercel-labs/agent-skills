# Diagnostics: What Naming Reveals

Naming effects isn't just style — it's a diagnostic tool. When an effect resists a clean name, the name is telling you the effect has a structural problem.

## Split Signal: "And" in the Name

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

## Elimination Signal: State Shuffling Names

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

## Anti-Pattern Reference

When naming exposes a problem, fix the structure — not the name:

| Difficult Name | Signal | Fix |
|----------------|--------|-----|
| `syncDerivedValue` | Derived state stored in state | Compute during render |
| `resetFormOnSubmit` | Interaction logic in effect | Move to event handler |
| `notifyParentOfStateChange` | Upward data flow via effect | Lift state or callback to source |
| `updateStateBasedOnOtherState` | State-to-state sync | Derive or consolidate state |
| `doMultipleThingsOnMount` | Multiple concerns | Split into separate effects |

These map directly to patterns in React's [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

## The Naming Test

When writing or reviewing an effect, apply this sequence:

1. **Can you name it in 2-4 words?** → Good effect, name it
2. **Does the name require "and"?** → Split into separate effects
3. **Does the name describe state-to-state sync?** → Derive during render or move to event handler
4. **Can't think of a name at all?** → The effect is doing too much or shouldn't be an effect

Effects that survive this test tend to synchronize with external systems: `connectToWebSocket`, `initializeMapSDK`, `subscribeToGeolocation`. The verbs are concrete and the targets are external.
