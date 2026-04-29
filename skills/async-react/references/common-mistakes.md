# Common Mistakes

Pitfalls to watch for during the audit. Many of these are the patterns Step 1 scans for.

---

- **Skipping the audit** — Without classifying interactions first, you'll miss coordination gaps or apply the wrong pattern. See `implementation.md` Step 1.
- **Forgetting to invalidate after mutations** — `useOptimistic` shows the instant result, the mutation succeeds, but without calling the framework's invalidation API, the server never re-renders. The optimistic value settles to stale data.
- **`useState` + `useEffect` for server-derived state** — Creates the coordination problem. Fetch state client-side, manage it locally, and now mutations and navigation don't talk to each other. Fix: server data as props, `useOptimistic` for instant feedback.
- **`useState(prop)` instead of `useOptimistic(prop)`** — `useState` only reads the initial value on mount. When fresh server data arrives, the prop updates but `useState` ignores it. `useOptimistic(prop)` re-evaluates on each render, automatically tracking server updates. See `patterns.md` → `useState(prop)` Anti-Pattern.
- **`onClick` with raw `await` instead of form `action` or `startTransition`** — Both form actions and `startTransition` provide transition wrapping. Use whichever fits the interaction. The mistake is doing neither.
- **Calling `useOptimistic` setter outside an Action** — The setter must be called inside `startTransition` or a form `action`. Outside, React warns and the optimistic value briefly renders then reverts.
- **Reading optimistic value in setter instead of using updater** — `setOptimistic(CYCLE[optimisticValue])` captures a stale closure if rapid clicks queue multiple transitions. Use an updater: `setOptimistic(current => CYCLE[current])`.
- **Competing data layers** — Don't mix `useOptimistic` with separate `useState` for the same data. One source of truth (server props), one overlay (`useOptimistic`).
- **`handleFooAction` naming** — Don't combine `handle` prefix with `Action` suffix. `handle` is for direct event handlers (`handleClick`); `Action` suffix replaces it (`filterAction`, `deleteAction`).
- **Wrong boundary structure** — One big `<Suspense>` means nothing renders until everything loads. But blindly splitting into siblings can cause layout shift (CLS) if a component above has unknown height. Choose boundaries based on the loading state you want for the page.
- **Using updater instead of reducer when base state can change** — If the base data might change during your Action (e.g., from polling), use a reducer. Updaters only see state from when the transition started; reducers re-run with the latest base value.
- **`data-pending` without a parent reacting to it** — Setting `data-pending` does nothing by itself. A parent must have `has-[[data-pending]]:` styles.
- **Silent optimistic rollback without error boundary** — `useOptimistic` auto-reverts on failure, but the user sees no explanation. Use `useTransition`'s `startTransition` so unexpected errors bubble to the error boundary. Only use `try/catch` + `toast.error()` for **expected** failures (validation, conflicts) where you want inline feedback instead of a full error boundary.
- **Manual state for create/edit forms instead of `useActionState`** — If a form has error handling, auto-reset on success, and pending state, use `useActionState` — it manages all three with built-in key-based reset. See `patterns.md` → Action State.
- **State updates after `await` fall outside the transition** — Post-`await` cleanup (closing dialogs, resetting forms) runs immediately instead of batching with the re-render. Use a double-transition: wrap post-`await` updates in another `startTransition`. See `patterns.md`.
- **`useState` setters don't clear immediately in transitions** — Unlike `useOptimistic`, `useState` updates are deferred until the transition commits. For immediate form clearing in chat/comment UIs, use `formRef.current?.reset()` (uncontrolled) instead of `setContent('')` (controlled). See `patterns.md`.
- **Omitting Suspense fallback on visible components causes layout shift** — Only omit the fallback when the child renders nothing (side-effect components, conditional guards). For visible content, use skeleton fallbacks (data) or static markup (interactive controls) — see `patterns.md` → Fallback Quality.
- For framework-specific pitfalls (async page components, `"use server"` export constraints, dynamic hooks in layouts), see `nextjs.md`.
