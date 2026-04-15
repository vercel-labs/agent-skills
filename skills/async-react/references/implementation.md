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

The patterns in `nextjs.md` target Next.js 16. For older versions, adapt the API calls based on the docs.

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
- **Data that updates without user action** — Live feeds, collaborative features. Consider a real-time data layer; for simple cases, see the polling example in `nextjs.md`.

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

For every async component the user wants addressed, decide: should this block the page, or stream in? See `patterns.md` for skeleton co-location and boundary structure examples.

**Rules:**

- Push data fetching into child components wrapped in `<Suspense>` — the shell renders instantly and async parts stream in. Works with async server components, `useSuspenseQuery`, `use()`, or any Suspense-enabled data source.
- Co-locate skeletons with their components — export both from the same file.
- Skeleton fallbacks must match the content layout (same heights, same grid). Otherwise you get CLS.
- Sibling `<Suspense>` boundaries resolve independently and stream in parallel. Use siblings when components have independent data and predictable sizes.
- If a component above has an unknown height, wrap both in a single boundary to avoid CLS.

## Step 3: Convert Design Components to Action Props

For approved design components that use `onChange` and trigger a navigation or state update, add the action props pattern. See `patterns.md` for the full TabList, EditableText, and SubmitButton implementations.

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
6. **Ensure the server action invalidates** — call `updateTag()` or `refresh()` after mutating data. See `nextjs.md`.
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

For approved mutations where the user expects instant feedback, apply the appropriate pattern from `patterns.md`:

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

When the client needs to predict the server result (e.g., cycling enum values), extract the logic into a shared constant importable by both the client component and the mutation handler. For Next.js-specific constraints (e.g., `"use server"` files can only export async functions), see `nextjs.md`.

### Post-await state updates

State updates after `await` inside `startTransition` fall outside the transition scope. Wrap post-`await` updates in another `startTransition`. See `patterns.md` for the double-transition pattern.

## Step 6: Add Pending Feedback

Use `useTransition` + `data-pending` for "working" feedback. This works on its own for pessimistic mutations (e.g., delete with no optimistic result), or as an addition alongside `useOptimistic` to show both instant feedback and a subtle pending indicator. See `patterns.md` for the DeleteButton and grouped pending examples.

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
