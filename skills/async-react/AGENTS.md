# Async React

**Version 1.0.0**
Vercel Engineering
April 2026

---

Use this skill to review a React app's async patterns and suggest improvements — fixing frozen UI, stale data, uncoordinated mutations, missing loading states, or lack of feedback. This is a collaborative audit tool: scan the codebase, surface issues, present findings to the user, and implement what they prioritize.

Coordinate async UI states using React's built-in primitives. The core idea: wrap async work in **transitions**, and React tracks pending state, batches updates, and coordinates everything — loading, mutations, navigation — through a single pipeline. No competing state layers, no race conditions.

This is the combination of React 18's concurrent features and React 19's coordination APIs. The React team calls this "Async React" — a complete system for building responsive async applications through composable primitives. Based on [Ricky Hanlon's React Conf 2025 demo](https://github.com/rickhanlonii/async-react), the vision is that product code becomes simple and declarative because three infrastructure layers handle async coordination internally:

- **Routing** — The router uses transitions by default, so navigation never freezes the UI.
- **Data fetching** — The data layer uses Suspense by default, so loading states are declarative.
- **Design components** — UI components expose `action` props with built-in `useOptimistic` and delayed loading indicators, so product code just passes callbacks.

On fast networks (<150ms), the app feels synchronous — no visible loading states. On slow networks, loading states appear automatically.

## When to Add Coordination

Every async interaction creates an in-between state. Each has a primitive:

| Priority | Pattern | What it communicates | Primitive |
|----------|---------|---------------------|-----------|
| 1 | **Loading boundaries** | "Data is coming" | `<Suspense>` + skeleton fallback |
| 2 | **Optimistic mutation** | "Done (pending confirmation)" | `useOptimistic` + form `action` |
| 3 | **Action state** | "Submitted (here's the result)" | `useActionState` |
| 4 | **Transition feedback** | "Working on it" | `useTransition` or `useOptimistic(false)` |
| 5 | **Action props** | "Control responded instantly" | Design component with `action` prop |
| 6 | **Stale-while-revalidate** | "Searching (old results visible)" | `useDeferredValue` + Suspense-enabled source |

This is a reference for what's possible, not a checklist to apply blindly. Review the app, identify which patterns are relevant, and present your findings to the user. They decide what to prioritize.

### Choosing the Right Pattern

| User Interaction | Pattern | Why |
|-----------------|---------|-----|
| Page load / data fetching | `<Suspense>` with skeleton | Show structure instantly, stream data |
| Toggle (favorite, like) | Form `action` + `useOptimistic` | Instant visual toggle, auto-rollback on failure |
| One-way action (upvote) | Form `action` + `useOptimistic` with reducer | Increment-only, disable after |
| Adding to a list | `useOptimistic` + `crypto.randomUUID()` | Shared ID prevents duplicate flash |
| Move between groups (Kanban, categories) | `useOptimistic` with reducer + `useTransition` | Instant move, auto-revert on failure |
| Destructive action (delete) | `useOptimistic` or `useTransition` + `data-pending` | Optimistic delete with rollback, or pending feedback |
| Form submission (create, edit) | `useActionState` | Server response state, `isPending`, key-based reset |
| Chat / comment input | `useOptimistic` + immediate form clear | Input clears instantly, optimistic list add |
| Tab / filter switch | `action` prop on design component | Instant highlight, old content stays |
| Search / filter with async results | `useDeferredValue` + `useSuspenseQuery` | Stale results stay visible while fresh data loads |
| Streaming data to client components | Promise prop + `use()` | Server starts fetch, client unwraps — enables streaming |

For animations on these state changes, see the `vercel-react-view-transitions` skill.

For framework-specific integration (Next.js server actions, `updateTag()`/`refresh()` invalidation, router behavior), see [Async React in Next.js](#async-react-in-nextjs). **Every server action that mutates data must call `updateTag()` or `refresh()`** — without this, optimistic updates settle to stale data.

---

## Two Migration Paths

- **Fix legacy patterns** — Replace `useState` + `useEffect` client-side fetching with server data as props + `useOptimistic` + form actions. These are actively broken: mutations and navigation compete because state lives in two places.
- **Add coordination** — Take a working but non-interactive app (no feedback, frozen UI during async work) and add `<Suspense>` boundaries, action props, optimistic updates, and pending indicators.

Most apps have a mix of both.

## Workflow

**Start with the audit in the [Audit & Review Workflow](#audit--review-workflow).** Scan the codebase, classify interactions, and present findings to the user before making any changes. The user decides what to fix and in what order. If unsure whether something is broken or just different, ask — don't assume.

---

## Core Concepts

### Transitions (Actions)

Any function run inside `startTransition` is called an **Action**. React tracks `isPending` automatically. The transition keeps the current UI visible and interactive until the action completes. Multiple updates inside a transition commit together — no intermediate flickers. Errors thrown inside transitions bubble to error boundaries.

**Standalone vs hook:** The standalone `startTransition` (imported from `react`) doesn't provide `isPending` and doesn't catch errors — errors thrown inside it will propagate as uncaught event handler errors. Use it for background work that shouldn't affect UI pending state — like polling. The `useTransition` hook's `startTransition` sets `isPending` on that component and bubbles errors to the nearest error boundary, so use it when you want visible pending feedback and error handling.

**Naming convention:** Suffix callback props and functions with "Action" (e.g., `submitAction`, `deleteAction`, `filterAction`) to signal they run inside a transition. Do **not** combine `handle` with `Action` — `handle` is reserved for direct event handlers (e.g., `handleClick`, `handleDragStart`), even if they internally wrap `startTransition`. An `Action`-suffixed function is a callback passed as a prop that will be wrapped in a transition by the receiving component.

### Optimistic Updates

`useOptimistic` shows instant updates while an Action runs in the background. Unlike `useState` (which defers updates inside transitions), `useOptimistic` updates **immediately**. The optimistic value persists while the Action is pending, then settles to the source of truth (props or state) when the transition completes. On failure, it automatically reverts. The setter must be called inside an Action (`startTransition` or form `action`).

**Why `useOptimistic`, not `useState`, for server-derived data:** `useOptimistic(value)` re-evaluates `value` every render — when the server sends fresh data (via `refresh()`), the component automatically shows it. `useState(initialValue)` only reads the initial value on mount and ignores subsequent prop changes. This is the most common coordination bug: `useState(prop)` works on first render, but after a server refresh the component shows stale data. Always use `useOptimistic(prop)` for server-derived values that the user can mutate. You can have **multiple `useOptimistic` calls** in one component for independent values (e.g., priority and assignee on a card).

**Updater functions:** Pass a function to the setter for state-relative updates: `setOptimistic(current => PRIORITY_CYCLE[current])`. This is essential when rapid interactions queue multiple transitions — each updater computes from the latest optimistic state, not a stale closure. Without an updater, rapid clicks can compute the wrong next value.

**Reducers:** Handle complex state (increment, add to list, multi-field, multi-action types). Reducers are essential when the base state might change during your Action (e.g., from polling) — React re-runs the reducer with the updated base value. Use reducers when you need to pass data to the update or handle multiple action types with a single hook.

**Choosing between updaters and reducers:**
- **Updater** (`setOptimistic(current => ...)`) — For single-value calculations where the setter naturally describes the update. Similar to `setState(prev => ...)`.
- **Reducer** (`useOptimistic(value, (current, action) => ...)`) — When you need to pass data to the update (which item to add/remove), handle multiple action types, or when the base state might change during pending actions.

`useOptimistic(false)` can also serve as a **pending indicator** — call `setIsPending(true)` inside the action, and it automatically reverts to `false` when the transition completes. No manual reset needed. Another option is deriving `isPending` by comparing the optimistic value to the server value: `const isPending = optimisticValue !== serverValue` — useful when you already have `useOptimistic` and don't want to add a separate `useTransition`.

See [Optimistic Mutations](#optimistic-mutations) for toggle, reducer, updater, list add, delete, move, multi-value, and pending indicator examples.

### Suspense Boundaries

Declarative loading boundaries. Place them around any component using a **Suspense-enabled data source** — async server components, `useSuspenseQuery`, `use()` with promises, or `lazy()`. Each boundary resolves independently. Push data access deep in the component tree — the static shell renders instantly, dynamic parts stream in. Co-locate skeletons with their components.

Transitions interact with Suspense: updates inside `startTransition` that cause a component to suspend keep the old content visible instead of re-showing the fallback.

See [Suspense Boundaries](#suspense-boundaries-1) for skeleton co-location and boundary structure guidance.

### `use()` — Unwrapping Promises and Context

`use()` unwraps a promise or reads a context value during render. When given a promise, it suspends the component until the promise resolves — triggering the nearest `<Suspense>` fallback. Errors reject to the nearest error boundary. Unlike hooks, `use()` can be called conditionally (inside `if` statements, loops, or early returns). For context, `use()` replaces `useContext()` and can also be called conditionally.

### Deferred Values (Stale-While-Revalidate)

`useDeferredValue` keeps old content visible while fresh data loads. Combined with a Suspense-enabled data source, it creates a stale-while-revalidate pattern: the input stays responsive, old results remain visible with a stale indicator (`filterText !== deferredFilter`), and fresh data replaces them when ready.

See [Deferred Values](#deferred-values-stale-while-revalidate) for the full search combobox pattern with `useSuspenseQuery`.

### Form Actions

A form's `action` prop wraps the callback in a transition automatically — same coordination as `startTransition`, but declarative. Form actions are a natural fit for submissions, toggles, and delete actions. For interactions that aren't naturally forms (drag-and-drop, inline edits, navigation), `startTransition` with `onClick` is fine. `formAction` on a button works the same way — useful for reusable submit button design components where the consumer keeps a plain `<form>` and the button handles pending state internally.

See [Action Props](#action-props-design-components) for SubmitButton implementations using `formAction` and `useFormStatus`.

### Action State

`useActionState` manages state derived from the result of an action — like `useReducer` but the reducer can be async. It gives you `isPending` for free and queues actions sequentially (each receives the previous result):

```tsx
const [state, formAction, isPending] = useActionState(reducer, initialState);
```

**Key-based form reset:** Increment a `key` in the returned state on success. Use that key on the form content to remount and reset all internal state — no manual `resetForm()` needed.

| Need | Use |
|------|-----|
| Server response state (validation errors, success/failure) | `useActionState` |
| Instant visual feedback before server responds | `useOptimistic` |
| Just `isPending` for a one-off action | `useTransition` or `useOptimistic(false)` |
| All of the above | `useActionState` + `useOptimistic` on top |

See [Action State](#action-state-useactionstate) for form with server response, key-based reset, and combining with `useOptimistic`.

### Action Props Pattern

Design components (tabs, chips, selects, toggles) expose an `action` or `changeAction` prop. Internally, the component wraps the callback in `startTransition` with `useOptimistic`. Consumers swap one prop name — the component handles async coordination. The naming convention matters: **suffixing with "Action"** signals the callback runs inside a transition. The action prop accepts `void | Promise<void>`, so consumers don't need their own `startTransition`.

Key design decisions:

- Support both `onChange` (synchronous, fires before the transition) and the action prop
- Include a built-in spinner with a `hideSpinner` opt-out for custom pending UI via `data-pending`
- Accept `displayValue` as `ReactNode | (value) => ReactNode` for formatted optimistic state
- Action props aren't needed when the navigation target has `<Suspense>` boundaries — the router handles that

See [Action Props](#action-props-design-components) for TabList, EditableText, and SubmitButton implementations.

### The `data-pending` CSS Pattern

Show pending states without client component wrappers. Set `data-pending` on the transitioning element, **and add `has-data-pending:` styles on a parent** — both parts are required:

```tsx
<button data-pending={isPending ? '' : undefined}>Delete</button>

// Any ancestor (even a server component) reacts via CSS
<div className="has-data-pending:opacity-50">
```

For sibling elements, use `group` on a common ancestor with `group-has-data-pending:` styles. For animating these state changes beyond opacity/pulse, see the `vercel-react-view-transitions` skill.

---

## How It All Connects

Transitions create a shared coordination pipeline. Every async operation goes through `startTransition`:

- **Navigation + Mutations**: Optimistic updates survive tab switches. The optimistic value persists while the framework fetches new data for the destination.
- **Mutations + Background Refresh**: A mid-action refresh doesn't clobber optimistic state. Reducers re-run with the latest base value.
- **Suspense + Navigation**: Old page stays visible while destination boundaries resolve independently.

For animating between these states — page transitions, enter/exit animations, shared element animations during navigation — see the `vercel-react-view-transitions` skill.

---

## Common Mistakes

- **Skipping the audit** — Without classifying interactions first, you'll miss coordination gaps or apply the wrong pattern. See [Step 1: Audit](#step-1-audit-the-app).
- **Forgetting to invalidate after mutations** — `useOptimistic` shows the instant result, the server action succeeds, but without `updateTag()` or `refresh()`, the server never re-renders. The optimistic value settles to stale data. Every server action that mutates data must invalidate. See [Invalidation After Mutations](#invalidation-after-mutations).
- **`useState` + `useEffect` for server-derived state** — Creates the coordination problem. Fetch state client-side, manage it locally, and now mutations and navigation don't talk to each other. Fix: server data as props, `useOptimistic` for instant feedback.
- **`useState(prop)` instead of `useOptimistic(prop)`** — `useState` only reads the initial value on mount. After `refresh()` delivers fresh server data, the prop updates but `useState` ignores it — the component shows stale values. `useOptimistic(prop)` re-evaluates every render, automatically tracking server updates. This is the most common subtle bug: the component works on first render but goes stale after mutations.
- **`onClick` with raw `await` instead of form `action` or `startTransition`** — Both form actions and `startTransition` provide transition wrapping. Use whichever fits the interaction — forms for submissions/toggles, `startTransition` for everything else. The mistake is doing neither.
- **Calling `useOptimistic` setter outside an Action** — The setter must be called inside `startTransition` or a form `action`. Outside, React warns and the optimistic value briefly renders then reverts.
- **Reading optimistic value in setter instead of using updater** — `setOptimistic(CYCLE[optimisticValue])` captures a stale closure if rapid clicks queue multiple transitions. Use an updater: `setOptimistic(current => CYCLE[current])`.
- **Competing data layers** — Don't mix `useOptimistic` with separate `useState` for the same data. One source of truth (server props), one overlay (`useOptimistic`).
- **`handleFooAction` naming** — Don't combine `handle` prefix with `Action` suffix. `handle` is for direct event handlers (`handleClick`); `Action` suffix replaces it (`filterAction`, `deleteAction`).
- **Wrong boundary structure** — One big `<Suspense>` means nothing renders until everything loads. But blindly splitting into siblings can cause layout shift (CLS) if a component above has unknown height. Choose boundaries based on the loading state you want for the page.
- **Using updater instead of reducer when base state can change** — If the base data might change during your Action (e.g., from polling), use a reducer. Updaters only see state from when the transition started; reducers re-run with the latest base value.
- **Raw `await` on server actions bypasses error boundaries** — `await serverAction()` inside an `onClick` handler is not in a transition. Errors are unhandled. Wrap in `startTransition` or use form `action`.
- **Exporting constants from `"use server"` files** — Only async functions can be exported. Shared constants must live in a separate file.
- **`data-pending` without a parent reacting to it** — Setting `data-pending` does nothing by itself. A parent must have `has-data-pending:` styles.
- **Silent optimistic rollback** — `useOptimistic` auto-reverts on failure, but the user sees no explanation. Pair with `toast.error()` inside a `try/catch`, or an error boundary for unexpected failures.
- **State updates after `await` fall outside the transition** — Post-`await` cleanup (closing dialogs, resetting forms) runs immediately instead of batching with the re-render. Use a double-transition: wrap post-`await` updates in another `startTransition`. See [Double-Transition Pattern](#double-transition-pattern).
- **`useState` setters don't clear immediately in transitions** — Unlike `useOptimistic`, `useState` updates are deferred until the transition commits. For immediate form clearing in chat/comment UIs, use `formRef.current?.reset()` (uncontrolled) instead of `setContent('')` (controlled). See [Immediate Form Clearing](#immediate-form-clearing).

---

## When in Doubt

If unsure about the behavior or API of any React primitive (`useOptimistic`, `useActionState`, `useTransition`, `useDeferredValue`, `use`, `Suspense`), consult the official React docs at `https://react.dev/reference/react/<hook-name>` before guessing. These APIs are new and training data may be outdated or incorrect.

For framework-specific APIs (Next.js invalidation, routing, caching), always verify against the project's installed version first — see Step 0 below.

---
---

# Audit & Review Workflow

This is a collaborative workflow. Audit the codebase, present findings, and implement what the user prioritizes. Don't apply patterns blindly — surface issues and let the user decide.

There are two kinds of findings:

- **Legacy patterns** — `useState` + `useEffect` client-side fetching, `useState(prop)` for server-derived data. These are actively broken — mutations and navigation compete because state lives in two places.
- **Missing coordination** — Working but non-interactive: no feedback, no loading states, frozen UI during async work. These are improvement opportunities, not bugs.

**Important:** Only fix what's actually broken or causing UX issues. Don't convert working code just to match a pattern. `useState` for local UI state (form inputs, modals, controlled selects) is completely fine — the anti-pattern is `useState` for **server-derived data** that should track server updates. If you're unsure whether something is broken or just different, **ask the user** — confirm what issues they're seeing before refactoring.

The audit surfaces both. Present the full picture, then work on what the user cares about.

## Step 0: Verify Framework APIs

Before implementing any pattern, check the project's framework version. Next.js invalidation APIs change between major versions (e.g., `revalidatePath` in 14, `revalidateTag` in 14–15, `updateTag`/`refresh()` in 16). Using the wrong API will cause build errors or silent failures.

1. Check the installed version (e.g., `package.json` or `next --version`).
2. Read the bundled docs at `node_modules/next/dist/docs/` or the framework's API reference.
3. Confirm which invalidation, caching, and routing APIs are available before writing code.

The patterns in the Next.js section below target Next.js 16. For older versions, adapt the API calls based on the docs.

## Step 1: Audit the App

Before writing any code, scan the codebase and classify every async interaction.

**Quick scan — run these searches to find candidates:**

```
grep -r "useState.*useEffect" --include="*.tsx"   # Legacy fetch patterns
grep -r "useState.*initial\|useState.*prop" --include="*.tsx"  # useState(prop) → useOptimistic(prop)
grep -r "onClick.*await" --include="*.tsx"         # Async onClick handlers → form actions
grep -r "router\.refresh" --include="*.tsx"        # Client-side invalidation → move server-side
grep -r "/api/" --include="*.tsx"                  # API routes that might be unnecessary
grep -r "onChange" --include="*.tsx"                # Design components missing action props
grep -r "window\.location" --include="*.tsx"       # Hard refreshes → router.refresh or refresh()
grep -r "handleAction\|handle.*Action" --include="*.tsx"  # Wrong naming — use Action suffix without handle
```

**Look for legacy patterns to fix:**

- **Every `useState` + `useEffect` pair** — Client-side data fetching that should be server data passed as props. This is the #1 source of coordination bugs: mutations and navigation don't talk to each other because state lives in two places. **Exception:** streaming responses via `fetch` + `ReadableStream` are not this anti-pattern — client-side streaming is legitimate.
- **Every `useState(prop)` / `useState(initialProp)`** — Components receiving server data as a prop and storing it in `useState`. After `refresh()` delivers fresh data, `useState` ignores the new prop value. Replace with `useOptimistic(prop)` which re-evaluates every render. **Exception:** components that need both `useOptimistic(prop)` for display and `useState` for an edit draft — here `useState` is for the local draft, not the server value.
- **Every `onClick` that calls an async function without `startTransition`** — These bypass error boundaries and provide no pending state. Wrap in `startTransition`, or use a form `action` if the interaction is naturally a submission.
- **Every API route created just for client-side fetching** — Often a sign of the `useEffect` anti-pattern. The data should come from the server component and flow as props.
- **Every `handleFooAction` function name** — `handle` prefix and `Action` suffix should not be combined. `handle` is for direct event handlers (`handleClick`, `handleDragStart`); `Action` suffix replaces it (`filterAction`, `deleteAction`).

**Look for missing coordination:**

- **Every async component** — Any component with `await`. Candidates for `<Suspense>` boundaries.
- **Every `<Suspense>` boundary** — Check if fallbacks match the content layout. Missing or spinner-only fallbacks cause layout shift.
- **Every mutation** — Form submissions, button clicks that call server actions. Classify each: does the user expect instant feedback (optimistic), or is confirmation important (pessimistic)?
- **Every navigation trigger** — Check if the control provides instant visual feedback (tab highlight, filter selection).
- **Every custom design component** (tabs, chips, toggles) — Check if they support an `action` prop. If they have `onChange` but not `action`, they're candidates. Only modify your own components — don't patch third-party library code.
- **Data that updates without user action** — Live feeds, collaborative features. Consider a real-time data layer; for simple cases, see [Background Polling](#background-polling-simple-approach).

Then produce an interaction map and **STOP. Present the table to the user and ask what to prioritize before writing any code.** Do not proceed to Step 2 until the user confirms scope. The audit often surfaces more work than needed — the user may only care about a subset.

```
| Component      | Interaction     | Current Behavior       | Category     | Pattern              |
|----------------|-----------------|------------------------|--------------|----------------------|
| DataGrid       | Page load       | Global spinner         | Add coord.   | Suspense + skeleton  |
| LikeButton     | Toggle          | useEffect + useState   | Fix legacy   | useOptimistic + form |
| DeleteButton   | Destructive     | No feedback            | Add coord.   | useOptimistic or useTransition |
| TabNav         | Tab switch      | onChange (freezes)      | Add coord.   | action prop          |
| VoteButton     | One-way vote    | onSubmit (freezes)     | Add coord.   | useOptimistic + form |
```

## Step 2: Add Suspense Boundaries

*Only implement items the user approved from the audit.*

For every async component the user wants addressed, decide: should this block the page, or stream in? See [Suspense Boundaries](#suspense-boundaries-1) for skeleton co-location and boundary structure examples.

**Rules:**

- Push data fetching into child components wrapped in `<Suspense>` — the shell renders instantly and async parts stream in. Works with async server components, `useSuspenseQuery`, `use()`, or any Suspense-enabled data source.
- Co-locate skeletons with their components — export both from the same file.
- Skeleton fallbacks must match the content layout (same heights, same grid). Otherwise you get CLS.
- Sibling `<Suspense>` boundaries resolve independently and stream in parallel. Use siblings when components have independent data and predictable sizes.
- If a component above has an unknown height, wrap both in a single boundary to avoid CLS.

## Step 3: Convert Design Components to Action Props

For approved design components that use `onChange` and trigger a navigation or state update, add the action props pattern. See [Action Props](#action-props-design-components) for the full TabList, EditableText, and SubmitButton implementations.

**Rules:**

- **Keep `onChange` when adding `action`** — don't replace it. `onChange` fires synchronously before the transition and is needed for validation, `event.preventDefault()`, or consumers that don't use transitions. Add the `action` prop alongside it.
- Consider setting `data-pending` on the component root when the transition has a visible delay (e.g., filtering a list, switching tabs with async data). Not every action prop needs it — skip it for instant-feeling interactions.
- Name callback props with "Action" to signal they'll run inside a transition.
- For animating async state changes (enter/exit, navigation, tab switches, list reorder), see the `vercel-react-view-transitions` skill.

## Step 4: Fix Legacy State Patterns

**Only target `useState` that manages server-derived data or mutation results.** Leave `useState` alone for local UI concerns — form inputs, modals, multi-selects, dependent selects, drag state. These are not anti-patterns.

**Dual-state components:** Some components legitimately need both — `useOptimistic(prop)` for display and `useState` for an edit draft (e.g., an editable text field). Don't flag `useState` as an anti-pattern when a component also needs `useOptimistic` alongside it. The fix is adding `useOptimistic` for the display/committed value, not removing `useState` for the draft.

For every `useState` + `useEffect` pair that fetches server-derived data:

1. Delete the API endpoint (if created just for this)
2. Delete the `useEffect` fetch and local `useState`
3. Pass the data from a server component as a prop — **but first check if the data is actually server-only.** Constants (enums, option lists, static arrays) can often be imported directly in client components.
4. Add `useOptimistic` for instant feedback on mutations
5. Where suitable, use form `action` instead of `onClick` (e.g., submit buttons, toggles, delete actions). Don't force everything into forms — `startTransition` with `onClick` is fine for interactions that aren't naturally form submissions.
6. **Ensure the server action invalidates** — call `updateTag()` or `refresh()` after mutating data. See [Invalidation After Mutations](#invalidation-after-mutations).
7. **Remove `key` props used to force remounts on data changes** — `useOptimistic` tracks the base value automatically; `key`-based remounting is only needed for `useState`.

For every `useState(prop)` / `useState(initialProp)` that stores server-derived data:

1. Replace `useState(prop)` with `useOptimistic(prop)` — this ensures the component tracks server updates after `refresh()`
2. Replace the `setState` calls with the optimistic setter inside `startTransition` or a form `action`
3. For relative updates (cycling, incrementing), use an updater function: `setOptimistic(current => next(current))`
4. Remove any `useEffect` syncing props to state — `useOptimistic` handles this automatically

**Before (broken coordination):**
```tsx
const [isFavorited, setIsFavorited] = useState(false);
useEffect(() => {
  fetch(`/api/favorites/${id}`).then(r => r.json()).then(d => setIsFavorited(d.value));
}, [id]);

async function handleClick() {
  setIsFavorited(!isFavorited);
  await toggleFavorite(id);
}
```

Problems: values flash stale after navigation, mutations and tab switches don't coordinate, initial render shows wrong state.

**After (coordinated):**
```tsx
const [optimistic, setOptimistic] = useOptimistic(hasFavorited); // prop from server

<form action={async () => {
  setOptimistic(!optimistic);
  await toggleFavorite(id);
}}>
```

Server component passes `hasFavorited` as a prop. `useOptimistic` provides instant toggle. Form action wraps in a transition. Mutations and navigation now coordinate through the same system. **The server action must invalidate** — without `updateTag()` or `refresh()`, the optimistic value settles but server data stays stale.

## Step 5: Add Optimistic Updates

For approved mutations where the user expects instant feedback, apply the appropriate pattern from [Optimistic Mutations](#optimistic-mutations):

- **Toggle** (favorite, like) — Boolean `useOptimistic` with form `action`
- **Multi-value** (follow with count) — Reducer form of `useOptimistic`
- **One-way** (upvote) — Reducer that increments and disables
- **List add** (create item) — Reducer with `crypto.randomUUID()` dedup
- **Move between groups** (Kanban) — Reducer that remaps the group field
- **Optimistic delete** — Reducer that marks `deleting: true`
- **Immediate form clearing** (chat/comment) — `formRef.current?.reset()` before `await`

**Rules:**

- The setter must be called inside an Action (`startTransition` or form `action`).
- Use **updater functions** (`setOptimistic(current => ...)`) for relative updates (cycling, incrementing, toggling) — prevents stale closures on rapid interactions.
- Use **reducers** (not updaters) when the base state might change during the Action (e.g., from polling), or when handling multiple action types.
- A component can have **multiple `useOptimistic` calls** for independent values.
- **Every optimistic update must have error feedback.** `useOptimistic` silently reverts on failure — the user sees the value snap back with no explanation. Add `try/catch` around the server action with `toast.error()` for expected failures. Don't leave catch blocks empty.
- For list adds, generate a UUID on the client and pass it to the server.
- Every server action that mutates data must call `updateTag()` or `refresh()`.

### Shared mutation logic

When the client needs to predict the server result (e.g., cycling enum values), extract the logic into a shared constant importable by both the client component and the mutation handler. For Next.js-specific constraints (e.g., `"use server"` files can only export async functions), see [Async React in Next.js](#async-react-in-nextjs).

### Post-await state updates

State updates after `await` inside `startTransition` fall outside the transition scope. Wrap post-`await` updates in another `startTransition`. See [Double-Transition Pattern](#double-transition-pattern).

## Step 6: Add Pending Feedback

Use `useTransition` + `data-pending` for "working" feedback. This works on its own for pessimistic mutations (e.g., delete with no optimistic result), or as an addition alongside `useOptimistic` to show both instant feedback and a subtle pending indicator. See [Pessimistic Mutations](#pessimistic-mutations-data-pending) for the DeleteButton and grouped pending examples.

**Rules:**

- `data-pending` requires a parent with `has-data-pending:` styles to create a visible effect. Always add both parts.
- For grouped regions, use `group-has-data-pending:`.

## Step 7: Review Together

**Do not skip this step.** A successful build doesn't mean the coordination works — most async bugs are behavioral, not type errors. Walk through every item you changed with the user and verify each interaction:

- Does loading avoid layout shift? (Skeleton matches content)
- Does the mutation provide feedback? (Optimistic or pending indicator)
- Does navigation feel responsive? (Controls highlight immediately)
- Do mutations persist after navigation? (Mutate, navigate away, navigate back — fresh data shows)
- Do mutations survive navigation? (Toggle, then switch tabs — no stale data)
- Does background refresh coordinate with user actions? (Action mid-poll — no clobber)
- Does every server action call `updateTag()` or `refresh()`?
- Are all server-derived values using `useOptimistic(prop)`, not `useState(prop)`?
- Are Action-suffixed functions named without `handle` prefix?
- Do relative updates use updater functions (`current => ...`)?
- Do errors surface correctly? (Unexpected → error boundary, expected → toast)
- Are state changes animated? (See the `vercel-react-view-transitions` skill for page transitions, enter/exit, and shared element animations)

---
---

# Async React Patterns

Code reference for each primitive. See [Audit & Review Workflow](#audit--review-workflow) for the step-by-step workflow. For framework-specific patterns (Next.js server actions, router behavior), see [Async React in Next.js](#async-react-in-nextjs).

---

## Suspense Boundaries

### Basic

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Header />
      <Suspense fallback={<GridSkeleton />}>
        <DataGrid />
      </Suspense>
    </div>
  );
}
```

### Skeleton Co-location

Export skeleton components from the same file as their component:

```tsx
export async function DataGrid() {
  const data = await fetchData();
  return <div className="grid">{data.map(item => <Card key={item.id} item={item} />)}</div>;
}

export function DataGridSkeleton() {
  return (
    <div className="grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-md bg-black/15 dark:bg-white/15 h-32" />
      ))}
    </div>
  );
}
```

### Boundary Structure

Sibling boundaries stream in parallel — each resolves independently:

```tsx
<Suspense fallback={<ProfileSkeleton />}>
  <UserProfile userId={id} />
</Suspense>
<Suspense fallback={<PostsSkeleton />}>
  <UserPosts userId={id} />
</Suspense>
```

Use siblings when components have independent data **and predictable sizes**. If a component above has an unknown height, siblings below it cause layout shift (CLS) when it resolves. In that case, wrap both in a single boundary:

```tsx
<Suspense fallback={<PageSkeleton />}>
  <VariableHeightHeader slug={slug} />
  <ContentFeed slug={slug} />
</Suspense>
```

Choose the boundary structure that produces the best loading state for the page — there's no single rule.

---

## Action Props (Design Components)

### TabList — Full Implementation

Support both `changeAction` and `onChange`. The "Action" suffix signals the callback runs inside a transition. The action prop accepts `void | Promise<void>`, so consumers don't need their own `startTransition`:

```tsx
'use client';

import { startTransition, useOptimistic } from 'react';

type TabListProps = {
  tabs: { label: string; value: string }[];
  activeTab: string;
  changeAction?: (value: string) => void | Promise<void>;
  onChange?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export function TabList({ tabs, activeTab, changeAction, onChange }: TabListProps) {
  const [optimisticTab, setOptimisticTab] = useOptimistic(activeTab);
  const isPending = optimisticTab !== activeTab;

  function handleTabChange(e: React.MouseEvent<HTMLButtonElement>, value: string) {
    onChange?.(e);
    startTransition(async () => {
      setOptimisticTab(value);
      await changeAction?.(value);
    });
  }

  return (
    <div data-pending={isPending ? '' : undefined}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={e => handleTabChange(e, tab.value)}
          className={tab.value === optimisticTab ? 'active' : ''}
        >
          {tab.label}
        </button>
      ))}
      {isPending && <Spinner />}
    </div>
  );
}
```

`isPending` is derived by comparing the optimistic value to the server value — useful when you already have `useOptimistic` and don't want to add a separate `useTransition`. `onChange` fires synchronously before the transition starts — useful for validation or `event.preventDefault()`. The action prop handles the async coordination. For animating the tab switch itself, see the `vercel-react-view-transitions` skill.

### Consumer Usage

```tsx
// Before — freezes until navigation completes
<TabList tabs={tabs} activeTab={current} onChange={() => navigate(value)} />

// After — tab highlights instantly, spinner shows during async work
<TabList tabs={tabs} activeTab={current} changeAction={value => navigate(value)} />
```

### Customizing Pending UI (hideSpinner + data-pending)

When the consumer wants custom pending treatment instead of the built-in spinner, they add their own `useTransition` and use `data-pending` for CSS-based feedback:

```tsx
function PostTabs() {
  const [isPending, startTransition] = useTransition();

  return (
    <div data-pending={isPending ? '' : undefined}>
      <TabList
        hideSpinner
        tabs={tabs}
        activeTab={current}
        changeAction={value => {
          startTransition(() => {
            navigate(value);
          });
        }}
      />
    </div>
  );
}
```

The optimistic tab switch still happens inside `TabList`. The consumer's `isPending` drives `data-pending` on a wrapper, and descendants use `group-has-data-pending:` to style themselves.

### EditableText — displayValue Pattern

For components where the display format differs from the raw value, accept a `displayValue` prop as either a static `ReactNode` or a function that receives the optimistic value:

```tsx
type EditableTextProps = {
  value: string;
  displayValue?: ((value: string) => React.ReactNode) | React.ReactNode;
  onChange?: (e: React.SyntheticEvent) => void;
  action: (value: string) => void | Promise<void>;
};

export function EditableText({ value, displayValue, action, onChange }: EditableTextProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function handleCommit(e: React.SyntheticEvent) {
    setIsEditing(false);
    if (draft === optimisticValue) return;
    onChange?.(e);
    startTransition(async () => {
      setOptimisticValue(draft);
      await action(draft);
    });
  }

  const resolvedDisplay = optimisticValue
    ? typeof displayValue === 'function'
      ? displayValue(optimisticValue)
      : (displayValue ?? optimisticValue)
    : null;

  // ... render editing input or display button with resolvedDisplay
}
```

Consumer usage:

```tsx
<EditableText
  value={price}
  action={savePrice}
  displayValue={value => formatCurrency(Number(value))}
/>
```

The formatted display updates instantly on commit because the function receives the optimistic value.

### SubmitButton — formAction with Pending Indicator

A reusable submit button that wraps any form's submission in a transition with pending state. Uses `formAction` on the button instead of `action` on the form — this auto-wraps in a transition (like form `action`) and passes `FormData`:

```tsx
'use client';

import { useOptimistic } from 'react';

type SubmitButtonProps = React.ComponentProps<'button'> & {
  action: (formData: FormData) => void | Promise<void>;
  onSubmit?: (formData: FormData) => void;
};

export function SubmitButton({ children, action, onSubmit, disabled, ...props }: SubmitButtonProps) {
  const [isPending, setIsPending] = useOptimistic(false);

  async function submitAction(formData: FormData) {
    onSubmit?.(formData);
    setIsPending(true);
    await action(formData);
  }

  return (
    <button type="submit" formAction={submitAction} disabled={isPending || disabled} {...props}>
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

**Why `formAction` on the button instead of `action` on the form:** The consumer keeps a plain `<form>` and drops in `<SubmitButton>` — the button's `formAction` overrides the form's `action`. This makes the design component composable: the consumer controls the form, the button handles pending state. No `startTransition` needed — `formAction` wraps in a transition automatically.

**`onSubmit` callback:** Fires synchronously before the transition starts — useful for immediate side effects like clearing an input or closing a dropdown (same role as `onChange` on action-prop design components).

### SubmitButton — useFormStatus Alternative

`useFormStatus` reads the pending state of a parent `<form>`. It's a child-component pattern — the button must be a child of a `<form>` with an `action` prop:

```tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, disabled, ...props }: React.ComponentProps<'button'>) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending || disabled} {...props}>
      {pending ? 'Submitting...' : children}
    </button>
  );
}
```

**`useFormStatus` vs `useOptimistic(false)` vs `formAction`:**

| Pattern | Where pending lives | Works with |
|---------|-------------------|------------|
| `useFormStatus` | Reads parent form's pending state | Must be child of `<form action={...}>` |
| `useOptimistic(false)` | Self-contained in the button | Any form, `formAction` on button |
| `formAction` on button | Button overrides form's action | Composable — consumer keeps plain `<form>` |

All three work — choose based on your component structure. See the [useFormStatus docs](https://react.dev/reference/react-dom/hooks/useFormStatus) for details.

---

## Optimistic Mutations

### Toggle (Boolean)

```tsx
'use client';

import { useOptimistic } from 'react';

export function LikeButton({ isLiked, toggleAction }) {
  const [optimistic, setOptimistic] = useOptimistic(isLiked);

  return (
    <form action={async () => {
      setOptimistic(!optimistic);
      await toggleAction();
    }}>
      <button type="submit">
        {optimistic ? '❤️' : '🤍'}
      </button>
    </form>
  );
}
```

No `startTransition` needed — form `action` already wraps in a transition. The setter is called inside an Action prop.

### Updater Function (Cycle / Relative)

When computing the next value from the current value, use an updater function instead of reading from the optimistic variable. This prevents stale closures when rapid interactions queue multiple transitions:

```tsx
'use client';

import { useOptimistic } from 'react';
import { PRIORITY_CYCLE } from '@/lib/data';

export function PriorityButton({ taskId, priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);

  return (
    <form action={async () => {
      // ✅ Updater — computes from latest optimistic state
      setOptimisticPriority(current => PRIORITY_CYCLE[current]);
      await cyclePriority(taskId);
    }}>
      <button type="submit">{optimisticPriority}</button>
    </form>
  );
}
```

**Why not `setOptimisticPriority(PRIORITY_CYCLE[optimisticPriority])`?** If the user clicks twice rapidly, both calls read the same `optimisticPriority` from the closure. Updater functions queue and each computes from the result of the previous one.

### Multiple Optimistic Values

A single component can have multiple independent `useOptimistic` calls. Each tracks its own server prop:

```tsx
export function TaskCard({ id, priority, assignee }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);
  const [optimisticAssignee, setOptimisticAssignee] = useOptimistic(assignee);

  function handlePriority(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticPriority(current => PRIORITY_CYCLE[current]);
      await cyclePriority(id);
    });
  }

  function handleAssignee(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticAssignee(nextAssignee);
      await reassignTask(id, nextAssignee);
    });
  }

  // Render with optimisticPriority and optimisticAssignee
}
```

Each optimistic value settles independently when its transition completes. Both track fresh server data after `refresh()`.

### `useState(prop)` Anti-Pattern

`useState(initialValue)` only reads the initial value on mount. After `refresh()` delivers new server data, the prop updates but `useState` ignores it:

```tsx
// ❌ Stale after refresh — useState ignores prop updates
function Card({ priority: initialPriority }) {
  const [priority, setPriority] = useState(initialPriority);
  // After refresh(), initialPriority changes but priority stays stale
}

// ✅ Tracks server data — useOptimistic re-evaluates every render
function Card({ priority }) {
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(priority);
  // After refresh(), priority changes and optimisticPriority follows
}
```

This distinction is critical for drag-and-drop boards, Kanban columns, and any component that receives server-derived props and supports mutations. `useState` creates an island of stale data; `useOptimistic` stays in sync with the server.

### Multi-Value (Reducer)

When an optimistic update affects multiple related values, use a reducer:

```tsx
const [optimistic, dispatch] = useOptimistic(
  { isFollowing: user.isFollowing, count: user.followerCount },
  (current, shouldFollow) => ({
    isFollowing: shouldFollow,
    count: current.count + (shouldFollow ? 1 : -1),
  })
);

function toggleAction() {
  startTransition(async () => {
    dispatch(!optimistic.isFollowing);
    await followAction(!optimistic.isFollowing);
  });
}
```

### One-Way (Counter)

```tsx
const [optimistic, setOptimistic] = useOptimistic(
  { count: voteCount, hasVoted },
  (state) => ({ count: state.count + 1, hasVoted: true })
);

<form action={async () => {
  setOptimistic(null);
  await upvote(id);
}}>
  <button disabled={optimistic.hasVoted}>👍 {optimistic.count}</button>
</form>
```

### Optimistic Delete (with Error Recovery)

You can use `useOptimistic` for destructive actions too. On failure, the item reappears automatically:

```tsx
const [optimisticItems, removeItem] = useOptimistic(
  items,
  (currentItems, idToRemove) =>
    currentItems.map(item =>
      item.id === idToRemove ? { ...item, deleting: true } : item
    )
);

function deleteItemAction(id) {
  startTransition(async () => {
    removeItem(id);
    try {
      await deleteAction(id);
    } catch (e) {
      toast.error(e.message);
    }
  });
}
```

Style deleted items with reduced opacity. If the action fails, `useOptimistic` reverts and the item reappears.

### Move Between Groups (Kanban, Categories)

When items move between groups (columns, categories, status buckets), use a reducer that remaps the item's group field. The optimistic update moves the item instantly; on failure, `useOptimistic` snaps it back:

```tsx
const [optimisticItems, moveItem] = useOptimistic(
  items,
  (state, { id, newStatus }: { id: string; newStatus: Status }) =>
    state.map(item => item.id === id ? { ...item, status: newStatus } : item)
);

function moveAction(id: string, newStatus: Status) {
  startTransition(async () => {
    moveItem({ id, newStatus });
    await updateStatus(id, newStatus);
  });
}
```

This works for drag-and-drop boards, category reassignment, priority changes — any interaction that moves an item between groups. The reducer re-runs with the latest base data if a background refresh arrives mid-action, so the move sits on top of fresh data.

### List Add (UUID Dedup)

```tsx
const [optimisticItems, addOptimistic] = useOptimistic(
  items,
  (state, newItem: Item) => {
    if (state.some(i => i.id === newItem.id)) return state;
    return [...state, { ...newItem, pending: true }];
  }
);

async function submitAction(formData: FormData) {
  const id = crypto.randomUUID();
  addOptimistic({ id, text: formData.get('text') });

  const result = await createItem(id, formData);
  if (result.error) toast.error(result.error);
}
```

Pass the client-generated ID to the server action so the optimistic item and real response share the same key. Use a reducer (not an updater) so that if the base list changes during the Action (e.g., from polling), React re-runs the reducer with the latest data.

### Immediate Form Clearing

For chat/comment UIs, the input should clear immediately when the user submits — not after the server responds. Use an uncontrolled input with `formRef.current?.reset()`:

```tsx
'use client';

import { useOptimistic, useRef } from 'react';

export function CommentForm({ addAction }: { addAction: (content: string) => Promise<void> }) {
  const [isPending, setIsPending] = useOptimistic(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        const text = (formData.get('content') as string)?.trim();
        if (!text) return;
        setIsPending(true);
        formRef.current?.reset();
        await addAction(text);
      }}
    >
      <input name="content" required disabled={isPending} />
      <button type="submit" disabled={isPending}>Send</button>
    </form>
  );
}
```

`formRef.current?.reset()` directly manipulates the DOM, so it clears the input synchronously before the `await`. `setIsPending(true)` uses `useOptimistic` and also updates immediately. React's automatic form reset after `formAction` completes would also clear the input, but only *after* the action finishes — `formRef.reset()` makes it immediate.

**Why not controlled inputs?** `useState` setters are deferred inside transitions — `setContent('')` inside a form `action` does NOT clear the input until the transition commits (after the `await`). Only `useOptimistic` setters and direct DOM manipulation (`formRef.reset()`) update immediately.

---

## Pessimistic Mutations (data-pending)

When you don't want to show the result optimistically but still need feedback:

```tsx
'use client';

import { useTransition } from 'react';

export function DeleteButton({ id, deleteAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      data-pending={isPending ? '' : undefined}
      disabled={isPending}
      onClick={() => startTransition(async () => await deleteAction(id))}
    >
      Delete
    </button>
  );
}
```

Parent (can be a server component):

```tsx
<div className="has-data-pending:opacity-50 transition-opacity">
  <CardContent />
  <DeleteButton id={item.id} deleteAction={deleteItem} />
</div>
```

### Grouped Pending (data-pending + group)

For sibling elements, use `group` on a common ancestor:

```tsx
<div className="group">
  <FilterBar />   {/* sets data-pending internally */}
  <div className="group-has-data-pending:opacity-50 transition-opacity">
    <ContentGrid />
  </div>
</div>
```

---

## Deferred Values (Stale-While-Revalidate)

### Async Search with useSuspenseQuery

Extract data fetching into a separate component that uses a Suspense-enabled data source. Use `useDeferredValue` so old results stay visible while fresh data loads:

```tsx
import { useState, useDeferredValue, Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

export function SearchCombobox({ asyncSearchFn, onSelect, placeholder = 'Search...' }) {
  const [filterText, setFilterText] = useState('');
  const deferredFilterText = useDeferredValue(filterText);
  const isStale = filterText !== deferredFilterText;

  return (
    <div>
      <input
        placeholder={placeholder}
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      {deferredFilterText.length >= 2 && (
        <ErrorBoundary fallback={<div>Error loading results</div>}>
          <Suspense fallback={<div>Loading results...</div>}>
            <div className={isStale ? 'animate-pulse' : ''}>
              <SearchResults
                query={deferredFilterText}
                asyncSearchFn={asyncSearchFn}
                onItemClick={onSelect}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

function SearchResults({ query, asyncSearchFn, onItemClick }) {
  const { data: results } = useSuspenseQuery({
    queryKey: ['search', query],
    queryFn: () => asyncSearchFn(query),
  });

  if (!results?.length) return <span>No results found</span>;

  return results.map(item => (
    <div key={item.id} onClick={() => onItemClick(item)}>
      {item.name}
    </div>
  ));
}
```

How it works:
- The input stays responsive — `filterText` updates immediately on every keystroke.
- `deferredFilterText` lags behind, so `SearchResults` keeps showing stale results while `useSuspenseQuery` fetches fresh data.
- `isStale` (comparing the two values) drives a visual indicator on the stale content.
- On first load, the `<Suspense>` fallback shows. On subsequent changes, old results stay visible.
- `useSuspenseQuery` provides built-in caching — repeated queries show instant cache hits.

This pattern works with any Suspense-enabled data source, not just TanStack Query.

---

## Action State (useActionState)

### Form with Server Response

`useActionState` manages state derived from an action result. The reducer receives `(prevState, payload)` and returns new state. When passed as a form `action`, the payload is `FormData` and React wraps the submission in a transition automatically:

```tsx
'use client';

import { useActionState, startTransition } from 'react';
import { saveItem } from '@/lib/actions';

export function CreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [{ error, key }, formAction, isPending] = useActionState(
    async (prev: { error: string | null; key: number }, formData: FormData) => {
      const result = await saveItem(formData);
      if ('error' in result) return { ...prev, error: result.error };
      startTransition(() => onSuccess?.());
      return { error: null, key: prev.key + 1 };
    },
    { error: null, key: 0 }
  );

  return (
    <form action={formAction}>
      <div key={key}>
        <input name="title" required />
        <textarea name="description" />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

**Key-based reset:** Incrementing `key` in the returned state remounts form content, resetting all internal state (inputs, `useState` hooks) without a manual `resetForm()`.

**Error handling:** Return expected errors as state and display inline. Throw unexpected errors — `useActionState` rethrows them to the nearest error boundary and cancels all queued actions.

### Combining with useOptimistic

`useOptimistic` reads from `useActionState`'s state for instant feedback:

```tsx
const [state, dispatchAction, isPending] = useActionState(updateAction, { count: 0 });
const [optimisticCount, setOptimisticCount] = useOptimistic(state.count);

function addAction() {
  startTransition(() => {
    setOptimisticCount(c => c + 1);
    dispatchAction({ type: 'ADD' });
  });
}
```

### When Not to Use

- If you just need optimistic feedback and don't care about the server response, `useOptimistic` alone is simpler.
- `useActionState` queues actions sequentially — each waits for the previous to complete. For parallel actions, use `useState` + `useTransition` directly.
- If the form has no validation/error state and no need for auto-reset, a plain form `action` with `useOptimistic(false)` for `isPending` is sufficient.

---

## Double-Transition Pattern

State updates after `await` inside an async `startTransition` fall outside the transition scope. This matters when you need to close a dialog, reset a form, or update UI after a mutation completes — those updates run immediately instead of being batched with the re-render from `refresh()`.

```tsx
function CreateDialog({ action }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form action={async (formData) => {
        setIsPending(true);
        await action(formData);
        // Without inner startTransition, dialog closes before
        // the board re-renders with fresh data — causes a flash
        startTransition(() => {
          setIsOpen(false);
        });
      }}>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
    </Dialog>
  );
}
```

The outer transition (from `<form action>`) wraps the `await`. The inner `startTransition` batches the dialog close with the re-render triggered by `refresh()` inside the server action. Without it, the dialog closes instantly while the page still shows stale data.

---

## Coordination

### Mutation + Navigation

Toggle a favorite, then switch to a filtered view. Both go through the transition system — `useOptimistic` handles the instant toggle, the tab switch triggers navigation, and React coordinates everything in a single render pass. The optimistic value settles when the server responds.

### Mutation + Background Refresh

A background data refresh arrives mid-action. If using a reducer, React re-runs it with the updated base data — your optimistic addition sits on top of the latest list. When the action completes, the optimistic overlay settles.

---
---

# Async React in Next.js

Coordination gotchas specific to Next.js. For the primitives themselves, see the sections above. For general Next.js APIs, see the [Next.js docs](https://nextjs.org/docs).

**Important:** The patterns below target Next.js 16. APIs change between versions — see Step 0 in the implementation workflow above to verify your version's APIs before using anything here.

---

## Page Structure

Keep `page.tsx` non-async when possible. Push `await` calls into async server components inside `<Suspense>` so the static shell renders instantly and dynamic parts stream in.

See: [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents), [`use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheTag`](https://nextjs.org/docs/app/api-reference/functions/cacheTag), [`cacheLife`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)

---

## Invalidation After Mutations

**Every server action that mutates data must invalidate.** Without it, `useOptimistic` shows the instant result but the server never re-renders — the optimistic value settles to stale data.

The flow: user submits → `useOptimistic` shows instant result → server action runs → invalidation → optimistic value settles to real data.

Choose invalidation based on the app's caching strategy:

- **No `'use cache'`**: [`refresh()`](https://nextjs.org/docs/app/api-reference/functions/refresh) alone is sufficient.
- **With `'use cache'` + `cacheTag`**: [`updateTag()`](https://nextjs.org/docs/app/api-reference/functions/updateTag) — expires cache and ensures the next request sees fresh data immediately (read-your-own-writes).
- **Route Handlers / webhooks**: [`revalidateTag()`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) — `updateTag` is not available outside Server Actions.

```tsx
'use server';

import { refresh } from 'next/cache';

// No 'use cache' — refresh() re-renders server components
export async function toggleStar(taskId: string) {
  await db.star.toggle({ where: { taskId, userId } });
  refresh();
}
```

```tsx
'use server';

import { updateTag } from 'next/cache';

// With 'use cache' + cacheTag — updateTag() expires and re-fetches
export async function updatePost(slug: string, formData: FormData) {
  await db.post.update({ where: { slug }, data: { ... } });
  updateTag('posts');
  updateTag(`post-${slug}`);
}
```

**If you forget the invalidation call:** the optimistic update shows instantly, the mutation succeeds on the server, but the UI never updates with the real data. This is the most common bug when applying the skill.

---

## Shared Constants

[`"use server"`](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) files can only export async functions. If the client needs to predict a server result (e.g., cycling enum values like `PRIORITY_CYCLE`), put the shared constant in a separate file and import from both.

---

## `router.push()` in Transitions

When called inside `startTransition`, [`router.push()`](https://nextjs.org/docs/app/api-reference/functions/use-router) coordinates with `useOptimistic` in the same transition — both commit together.

### Search params / filter navigation

A common pattern: update `searchParams` via `router.push()` and pass the callback as an action prop to a design component. The design component wraps it in `startTransition` with `useOptimistic`, so the chip/tab highlights instantly while the page re-renders with filtered data.

```tsx
// Consumer — passes router.push as an action prop
function LabelFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("label") ?? null;

  function filterAction(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("label", value);
    } else {
      params.delete("label");
    }
    router.push(`/?${params.toString()}`);
  }

  return <ChipGroup items={labels} value={current} changeAction={filterAction} />;
}
```

```tsx
// Design component — wraps action in transition with optimistic state
function ChipGroup({ items, value, changeAction }: ChipGroupProps) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);

  function handleClick(newValue: string | null) {
    startTransition(async () => {
      setOptimisticValue(newValue);
      await changeAction(newValue);
    });
  }

  return /* chips using optimisticValue for active state */;
}
```

### Tab / index navigation

Same pattern for tab-like navigation — the action prop receives a URL, and the design component handles the optimistic index:

```tsx
startTransition(async () => {
  setOptimisticIndex(newIndex);
  await action(href); // action = (href) => router.push(href)
});
```

---

## Promise-Passing and Streaming

Server components can start a fetch without awaiting it, passing the **promise** as a prop to a client component. The client uses `use()` (see [Core Concepts](#use--unwrapping-promises-and-context)) to unwrap it — the server renders instantly and data streams in via `<Suspense>`. The `.then()` pattern on `params` avoids making the page `async`:

```tsx
function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const taskPromise = params.then(({ id }) => getTask(id));
  const commentsPromise = commentsFromTask(taskPromise);

  return (
    <div>
      <Suspense fallback={<TaskSkeleton />}>
        <TaskDetail taskPromise={taskPromise} />
      </Suspense>
      <Suspense fallback={<CommentListSkeleton />}>
        <CommentList commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

Each `<Suspense>` boundary streams independently — the task detail can appear before comments finish loading. Chaining promises (e.g., `commentsFromTask(taskPromise)`) lets you derive dependent data without `await`.

See: [Streaming guide](https://nextjs.org/docs/app/guides/streaming), [Suspense](https://nextjs.org/docs/app/guides/streaming#streaming-with-suspense), [Data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## Background Polling (Simple Approach)

For quick prototyping or low-frequency updates, `startTransition` + [`router.refresh()`](https://nextjs.org/docs/app/api-reference/functions/use-router) on an interval is a simple option. Prefer server-sent events, WebSockets, or a real-time data layer for production live data.

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export function usePolling(intervalMs = 5000) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => router.refresh());
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
}
```

Because the refresh runs inside `startTransition`, it coordinates with `useOptimistic` — a mid-action refresh updates the base data without clobbering optimistic state.
