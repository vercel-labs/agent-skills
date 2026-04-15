---
name: vercel-async-react
description: Fix React UX issues (frozen UI, missing loading states, stale data, uncoordinated mutations) using async primitives (useOptimistic, useTransition, useActionState, Suspense, useDeferredValue, form actions, action props). Replaces useState/useEffect fetch patterns, onClick mutations, and manual loading management. Use when the user reports UI freezing, no async feedback, data out of sync after navigation, layout shift on load, sluggish search/filter, or wants optimistic updates, pending indicators, loading skeletons, or instant-feeling interactions. Also use when mentioning useOptimistic, useTransition, useActionState, startTransition, Suspense, useDeferredValue, action props, data-pending, or async in-between states.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# Async React

Use this skill when adding optimistic updates, loading states, pending indicators, or async coordination to a React app — or when fixing frozen UI, stale data, and uncoordinated mutations.

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

This is an implementation order, not a "pick one" list. Implement every pattern that fits the app. Only skip a pattern if the app has no use case for it.

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

For framework-specific integration (Next.js server actions, `updateTag()`/`refresh()` invalidation, router behavior), see `references/nextjs.md`. **Every server action that mutates data must call `updateTag()` or `refresh()`** — without this, optimistic updates settle to stale data.

---

## Two Migration Paths

- **Fix legacy patterns** — Replace `useState` + `useEffect` client-side fetching and `useState(prop)` for server-derived data with server data as props + `useOptimistic`. These are actively broken: mutations and navigation compete because state lives in two places. Leave `useState` alone for local UI concerns (form inputs, modals, controlled selects) — only target server-derived data.
- **Add coordination** — Take a working but non-interactive app (no feedback, frozen UI during async work) and add `<Suspense>` boundaries, action props, optimistic updates, and pending indicators.

Most apps have a mix of both.

## Implementation Workflow

When adding async coordination to an existing app, **follow `references/implementation.md` step by step.** Start with the audit — do not skip it. Present findings to the user before making changes. If unsure whether a pattern is causing issues, ask.

---

## Core Concepts

### Transitions (Actions)

Any function run inside `startTransition` is called an **Action**. React tracks `isPending` automatically. The transition keeps the current UI visible and interactive until the action completes. Multiple updates inside a transition commit together — no intermediate flickers. Errors thrown inside transitions bubble to error boundaries.

**Naming convention:** Suffix callback props and functions with "Action" (e.g., `submitAction`, `deleteAction`, `filterAction`) to signal they run inside a transition. Do **not** combine `handle` with `Action` — `handle` is reserved for direct event handlers (e.g., `handleClick`, `handleDragStart`). An `Action`-suffixed function wraps async work in a transition; a `handle`-prefixed function responds to a DOM event directly.

### Optimistic Updates

`useOptimistic` shows instant updates while an Action runs in the background. Unlike `useState` (which defers updates inside transitions), `useOptimistic` updates **immediately**. The optimistic value persists while the Action is pending, then settles to the source of truth (props or state) when the transition completes. On failure, it automatically reverts. The setter must be called inside an Action (`startTransition` or form `action`).

**Why `useOptimistic`, not `useState`, for server-derived data:** `useOptimistic(value)` re-evaluates `value` every render — when the server sends fresh data (via `refresh()`), the component automatically shows it. `useState(initialValue)` only reads the initial value on mount and ignores subsequent prop changes. This is the most common coordination bug: `useState(prop)` works on first render, but after a server refresh the component shows stale data. Always use `useOptimistic(prop)` for server-derived values that the user can mutate. You can have **multiple `useOptimistic` calls** in one component for independent values (e.g., priority and assignee on a card).

**Updater functions:** Pass a function to the setter for state-relative updates: `setOptimistic(current => PRIORITY_CYCLE[current])`. This is essential when rapid interactions queue multiple transitions — each updater computes from the latest optimistic state, not a stale closure. Without an updater, rapid clicks can compute the wrong next value.

**Reducers:** Handle complex state (increment, add to list, multi-field, multi-action types). Reducers are essential when the base state might change during your Action (e.g., from polling) — React re-runs the reducer with the updated base value. Use reducers when you need to pass data to the update or handle multiple action types with a single hook.

**Choosing between updaters and reducers:**
- **Updater** (`setOptimistic(current => ...)`) — For single-value calculations where the setter naturally describes the update. Similar to `setState(prev => ...)`.
- **Reducer** (`useOptimistic(value, (current, action) => ...)`) — When you need to pass data to the update (which item to add/remove), handle multiple action types, or when the base state might change during pending actions.

`useOptimistic(false)` can also serve as a **pending indicator** — showing "Submitting..." without `useTransition`. Another option is deriving `isPending` by comparing the optimistic value to the server value: `const isPending = optimisticValue !== serverValue` — useful when you already have `useOptimistic` and don't want to add a separate `useTransition`.

See `references/patterns.md` for toggle, reducer, updater, list add, delete, move, multi-value, and pending indicator examples.

### Suspense Boundaries

Declarative loading boundaries. Place them around any component using a **Suspense-enabled data source** — async server components, `useSuspenseQuery`, `use()` with promises, or `lazy()`. Each boundary resolves independently. Push data access deep in the component tree — the static shell renders instantly, dynamic parts stream in. Co-locate skeletons with their components.

Transitions interact with Suspense: updates inside `startTransition` that cause a component to suspend keep the old content visible instead of re-showing the fallback.

See `references/patterns.md` for skeleton co-location and boundary structure guidance.

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

Design components (tabs, chips, selects, toggles) expose an `action` or `changeAction` prop. Internally, the component wraps the callback in `startTransition` with `useOptimistic`. Consumers swap one prop name — the component handles async coordination. The naming convention matters: **suffixing with "Action"** signals the callback runs inside a transition. The action prop accepts `void | Promise<void>`, so consumers don't need their own `startTransition`.

Key design decisions:

- Support both `onChange` (synchronous, fires before the transition) and the action prop
- Include a built-in spinner with a `hideSpinner` opt-out for custom pending UI via `data-pending`
- Accept `displayValue` as `ReactNode | (value) => ReactNode` for formatted optimistic state

See `references/patterns.md` for TabList, EditableText, and SubmitButton implementations.

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

- **Skipping the audit** — Without classifying interactions first, you'll miss coordination gaps or apply the wrong pattern. See `references/implementation.md` Step 1.
- **Forgetting to invalidate after mutations** — `useOptimistic` shows the instant result, the server action succeeds, but without `updateTag()` or `refresh()`, the server never re-renders. The optimistic value settles to stale data. Every server action that mutates data must invalidate. See `references/nextjs.md`.
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
- **Exporting constants from `"use server"` files** (Next.js) — Only async functions can be exported. Shared constants must live in a separate file. See `references/nextjs.md`.
- **`data-pending` without a parent reacting to it** — Setting `data-pending` does nothing by itself. A parent must have `has-data-pending:` styles.
- **Silent optimistic rollback** — `useOptimistic` auto-reverts on failure, but the user sees no explanation. Pair with `toast.error()` inside a `try/catch`, or an error boundary for unexpected failures.
- **State updates after `await` fall outside the transition** — Post-`await` cleanup (closing dialogs, resetting forms) runs immediately instead of batching with the re-render. Use a double-transition: wrap post-`await` updates in another `startTransition`. See `references/patterns.md`.
- **`useState` setters don't clear immediately in transitions** — Unlike `useOptimistic`, `useState` updates are deferred until the transition commits. For immediate form clearing in chat/comment UIs, use `formRef.current?.reset()` (uncontrolled) instead of `setContent('')` (controlled). See `references/patterns.md`.

---

## Reference Files

- **`references/implementation.md`** — Step-by-step audit and implementation workflow. Start here.
- **`references/patterns.md`** — Detailed code patterns for each primitive.
- **`references/nextjs.md`** — Next.js App Router integration: server actions, `updateTag()`, router behavior, promise-passing.

## When in Doubt

If unsure about the behavior or API of any React primitive (`useOptimistic`, `useActionState`, `useTransition`, `useDeferredValue`, `use`, `Suspense`), consult the official React docs at `https://react.dev/reference/react/<hook-name>` before guessing. These APIs are new and training data may be outdated or incorrect.

## Full Compiled Document

For the complete guide with all reference files expanded: `AGENTS.md`
