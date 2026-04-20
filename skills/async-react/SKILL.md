---
name: vercel-async-react
description: Audit and review React async patterns — surface frozen UI, missing loading states, stale data, and uncoordinated mutations. Suggests fixes using async primitives (useOptimistic, useTransition, useActionState, Suspense, useDeferredValue, form actions, action props). Use when the user wants to review their async patterns, reports UI freezing, no async feedback, data out of sync after navigation, layout shift on load, or wants suggestions for optimistic updates, pending indicators, loading skeletons, or instant-feeling interactions. Also use when mentioning useOptimistic, useTransition, useActionState, startTransition, Suspense, useDeferredValue, action props, data-pending, or async in-between states.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# Async React

Use this skill to review a React app's async patterns and suggest improvements — fixing frozen UI, stale data, uncoordinated mutations, missing loading states, or lack of feedback. This is a collaborative audit tool: scan the codebase, surface issues, present findings to the user, and implement what they prioritize.

The core idea: wrap async work in **transitions**, and React tracks pending state, batches updates, and coordinates everything — loading, mutations, navigation — through a single pipeline. No competing state layers, no race conditions.

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
| Adding to a list (client owns list) | `useOptimistic(items, reducer)` + `crypto.randomUUID()` | Shared ID prevents duplicate flash |
| Adding to a list (server owns list) | `useOptimistic([])` + `crypto.randomUUID()` | Pending-only; server list is separate |
| Move between groups (Kanban, categories) | `useOptimistic` with reducer + `useTransition` | Instant move, auto-revert on failure |
| Destructive action (delete) | `useOptimistic` or `useTransition` | Optimistic delete with rollback, or pending feedback via `disabled` |
| Form submission (create, edit) | `useActionState` | Server response state, `isPending`, key-based reset |
| Chat / comment input | `useOptimistic` + immediate form clear | Input clears instantly, optimistic list add |
| Tab / filter switch | `action` prop on design component | Instant highlight, old content stays |
| Search / filter with async results | `useDeferredValue` + `useSuspenseQuery` | Stale results stay visible while fresh data loads |
| Streaming data to client components | Promise prop + `use()` | Server starts fetch, client unwraps — enables streaming |
| Pagination / nav link loading | Framework link pending hook (e.g., `useLinkStatus`) | Per-link spinner shows which link is loading |

For animations on these state changes, see the `vercel-react-view-transitions` skill.

**Every mutation must invalidate** — without it, optimistic updates settle to stale data. For framework-specific invalidation APIs, see `references/nextjs.md`.

---

## Audit & Review Workflow

When reviewing an app's async patterns, **follow `references/implementation.md` step by step.** Start with the audit — do not skip it. Present findings to the user before making any changes. The user decides what to fix and in what order.

---

## Core Concepts

### Transitions (Actions)

Any function run inside `startTransition` is called an **Action**. React tracks `isPending` automatically. The transition keeps the current UI visible and interactive until the action completes. Multiple updates inside a transition commit together — no intermediate flickers. Errors thrown inside transitions bubble to error boundaries.

**Standalone vs hook:** The standalone `startTransition` (imported from `react`) doesn't provide `isPending` and doesn't bubble errors to error boundaries — errors propagate as uncaught errors. Use it for background work that shouldn't affect UI pending state — like polling. The `useTransition` hook's `startTransition` provides `isPending` and bubbles errors to the nearest error boundary, so use it when you want visible pending feedback and error handling.

**Naming convention:** Suffix callback props and functions with "Action" (e.g., `submitAction`, `deleteAction`, `filterAction`) to signal they run inside a transition. Do **not** combine `handle` with `Action` — `handle` is reserved for direct event handlers (e.g., `handleClick`, `handleDragStart`), even if they internally wrap `startTransition`. An `Action`-suffixed function is a callback passed as a prop that will be wrapped in a transition by the receiving component.

### Optimistic Updates

`useOptimistic` shows instant updates while an Action runs in the background. Unlike `useState` (which defers updates inside transitions), `useOptimistic` updates **immediately**. The optimistic value persists while the Action is pending, then settles to the source of truth (props or state) when the transition completes. On failure, it automatically reverts. The setter must be called inside an Action (`startTransition` or form `action`).

**Why `useOptimistic`, not `useState`, for server-derived data:** `useOptimistic(value)` re-evaluates `value` every render — when the server sends fresh data (via invalidation or navigation), the component automatically shows it. `useState(initialValue)` only reads the initial value on mount and ignores subsequent prop changes. This is the most common coordination bug: `useState(prop)` works on first render, but after fresh data arrives the component shows stale data. Always use `useOptimistic(prop)` for server-derived values that the user can mutate. You can have **multiple `useOptimistic` calls** in one component for independent values (e.g., priority and assignee on a card).

**Updater functions:** Pass a function to the setter for state-relative updates: `setOptimistic(current => PRIORITY_CYCLE[current])`. This is essential when rapid interactions queue multiple transitions — each updater computes from the latest optimistic state, not a stale closure. Without an updater, rapid clicks can compute the wrong next value.

**Reducers:** Handle complex state (increment, add to list, multi-field, multi-action types). Reducers are essential when the base state might change during your Action (e.g., from polling) — React re-runs the reducer with the updated base value. Use reducers when you need to pass data to the update or handle multiple action types with a single hook.

**Choosing between updaters and reducers:**
- **Updater** (`setOptimistic(current => ...)`) — For single-value calculations where the setter naturally describes the update. Similar to `setState(prev => ...)`.
- **Reducer** (`useOptimistic(value, (current, action) => ...)`) — When you need to pass data to the update (which item to add/remove), handle multiple action types, or when the base state might change during pending actions.

`useOptimistic(false)` can also serve as a **pending indicator** — call `setIsPending(true)` inside the action, and it automatically reverts to `false` when the transition completes. No manual reset needed. Another option is deriving `isPending` by comparing the optimistic value to the server value: `const isPending = optimisticValue !== serverValue` — useful when you already have `useOptimistic` and don't want to add a separate `useTransition`.

See `references/patterns.md` for toggle, reducer, updater, list add, delete, move, multi-value, and pending indicator examples.

### Suspense Boundaries

Declarative loading boundaries. Place them around any component using a **Suspense-enabled data source** — async server components, `useSuspenseQuery`, `use()` with promises, or `lazy()`. Each boundary resolves independently. Push data access deep in the component tree — the static shell renders instantly, dynamic parts stream in. Co-locate skeletons with their components.

Transitions interact with Suspense: updates inside `startTransition` that cause a component to suspend keep the old content visible instead of re-showing the fallback.

See `references/patterns.md` for skeleton co-location and boundary structure guidance. For deeper streaming patterns (parallel data fetching, promise-passing, static shells), consult the framework's streaming docs — e.g., the [Next.js Streaming guide](https://nextjs.org/docs/app/guides/streaming). If the audit surfaces many streaming opportunities, present them to the user as a separate category of improvements.

### `use()` — Unwrapping Promises and Context

`use()` unwraps a promise or reads a context value during render. When given a promise, it suspends the component until the promise resolves — triggering the nearest `<Suspense>` fallback. Errors reject to the nearest error boundary. Unlike hooks, `use()` can be called conditionally (inside `if` statements, loops, or early returns). For context, `use()` replaces `useContext()` and can also be called conditionally.

### Deferred Values (Stale-While-Revalidate)

`useDeferredValue` keeps old content visible while fresh data loads. Combined with a Suspense-enabled data source, it creates a stale-while-revalidate pattern: the input stays responsive, old results remain visible with a stale indicator (`filterText !== deferredFilter`), and fresh data replaces them when ready.

See `references/patterns.md` for the full search combobox pattern with `useSuspenseQuery`.

### Form Actions

A form's `action` prop wraps the callback in a transition automatically — same coordination as `startTransition`, but declarative. Form actions are a natural fit for submissions, toggles, and delete actions. For interactions that aren't naturally forms (drag-and-drop, inline edits, navigation), `startTransition` with `onClick` is fine. `formAction` on a button works the same way — useful for reusable submit button design components where the consumer keeps a plain `<form>` and the button handles pending state internally.

See `references/patterns.md` for SubmitButton implementations using `formAction` and `useFormStatus`.

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

See `references/patterns.md` for form with server response, key-based reset, and combining with `useOptimistic`.

### Action Props Pattern

Design components (tabs, chips, selects, toggles) expose an `action` prop. Internally, the component wraps the callback in `startTransition` with `useOptimistic`. Consumers pass one prop — the component handles async coordination. The action prop accepts `void | Promise<void>`, so consumers don't need their own `startTransition`.

When reviewing a design component, consider:

- Does it support both `onChange` (synchronous, fires before the transition) and the action prop?
- Does it include built-in pending feedback (spinner, highlight)? Or does the consumer own pending feedback on surrounding content?

See `references/patterns.md` for TabList, EditableText, and SubmitButton implementations.

---

## How It All Connects

Transitions create a shared coordination pipeline. Every async operation goes through `startTransition`:

- **Navigation + Mutations**: Optimistic updates survive tab switches. The optimistic value persists while the framework fetches new data for the destination.
- **Mutations + Background Refresh**: A mid-action refresh doesn't clobber optimistic state. Reducers re-run with the latest base value.
- **Suspense + Navigation**: Old page stays visible while destination boundaries resolve independently.

For animating between these states — page transitions, enter/exit animations, shared element animations during navigation — see the `vercel-react-view-transitions` skill.

If unsure about the behavior or API of any React primitive, consult the official React docs at `https://react.dev/reference/react/<hook-name>` before guessing. These APIs are new and training data may be outdated or incorrect. For framework-specific APIs (Next.js invalidation, routing, caching), always verify against the project's installed version first — see Step 0 in `references/implementation.md`.

---

## Reference Files

- **`references/implementation.md`** — Audit and review workflow. Start here.
- **`references/patterns.md`** — Detailed code patterns for each primitive.
- **`references/nextjs.md`** — Next.js App Router integration: invalidation, router behavior, promise-passing.
- **`references/common-mistakes.md`** — Common pitfalls and how to avoid them.

## Full Compiled Document

For the complete guide with all reference files expanded: `AGENTS.md`
