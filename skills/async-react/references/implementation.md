# Implementation Workflow

Follow these steps in order when adding async coordination to an app. Each step builds on the previous one.

There are two kinds of work:

- **Fix legacy patterns** — Replace `useState` + `useEffect` client-side fetching, `onClick` handlers, and competing state layers with server data + `useOptimistic` + form actions. These are actively broken — mutations and navigation don't coordinate.
- **Add coordination** — Take a working but non-interactive app (no feedback, no loading states, frozen UI during async work) and add transitions, optimistic updates, pending indicators, and Suspense boundaries.

The audit identifies both. Steps 2–3 are "add coordination." Step 4 is "fix legacy." Steps 5–6 are "add coordination." Most apps have a mix.

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

- **Every `useState` + `useEffect` pair** — Client-side data fetching that should be server data passed as props. This is the #1 source of coordination bugs: mutations and navigation don't talk to each other because state lives in two places.
- **Every `useState(prop)` / `useState(initialProp)`** — Components receiving server data as a prop and storing it in `useState`. After `refresh()` delivers fresh data, `useState` ignores the new prop value. Replace with `useOptimistic(prop)` which re-evaluates every render.
- **Every `onClick` that calls an async function** — Should be a form `action` (gets transition wrapping for free) or wrapped in `startTransition`.
- **Every API route created just for client-side fetching** — Often a sign of the `useEffect` anti-pattern. The data should come from the server component and flow as props.
- **Every `handleFooAction` function name** — `handle` prefix and `Action` suffix should not be combined. `handle` is for direct event handlers (`handleClick`, `handleDragStart`); `Action` suffix replaces it (`filterAction`, `deleteAction`).

**Look for missing coordination:**

- **Every async component** — Any component with `await`. Candidates for `<Suspense>` boundaries.
- **Every `<Suspense>` boundary** — Check if fallbacks match the content layout. Missing or spinner-only fallbacks cause layout shift.
- **Every mutation** — Form submissions, button clicks that call server actions. Classify each: does the user expect instant feedback (optimistic), or is confirmation important (pessimistic)?
- **Every navigation trigger** — Check if the control provides instant visual feedback (tab highlight, filter selection).
- **Every design component** (tabs, chips, toggles) — Check if they support an `action` prop. If they have `onChange` but not `action`, they're candidates.
- **Data that updates without user action** — Live feeds, collaborative features. Candidates for background polling (see `nextjs.md`).

Then produce an interaction map:

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

For every async component, decide: should this block the page, or stream in? See `patterns.md` for skeleton co-location and boundary structure examples.

**Rules:**

- Push dynamic data access deep in the component tree. Keep pages non-async when possible.
- Co-locate skeletons with their components — export both from the same file.
- Skeleton fallbacks must match the content layout (same heights, same grid). Otherwise you get CLS.
- Sibling `<Suspense>` boundaries resolve independently and stream in parallel. Use siblings when components have independent data and predictable sizes.
- If a component above has an unknown height, wrap both in a single boundary to avoid CLS.

## Step 3: Convert Design Components to Action Props

For every design component that uses `onChange` and triggers a navigation or state update, add the action props pattern. See `patterns.md` for the full TabList, EditableText, and SubmitButton implementations.

**Rules:**

- Support both `action` and `onChange` for backward compatibility.
- Set `data-pending` on the component root so consumers can style pending states via CSS.
- Name callback props with "Action" to signal they'll run inside a transition.
- Action props aren't needed when the destination has `<Suspense>` boundaries — the router handles that.
- For animating tab/filter transitions, see the `vercel-react-view-transitions` skill.

## Step 4: Fix Legacy State Patterns

For every `useState` + `useEffect` pair that fetches server-derived data:

1. Delete the API endpoint (if created just for this)
2. Delete the `useEffect` fetch and local `useState`
3. Pass the data from a server component as a prop — **but first check if the data is actually server-only.** Constants (enums, option lists, static arrays) can often be imported directly in client components.
4. Add `useOptimistic` for instant feedback on mutations
5. Use form `action` instead of `onClick`
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

For every mutation where the user expects instant feedback, apply the appropriate pattern from `patterns.md`:

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
- Pair rollback with user-visible feedback (`toast.error()` or error boundary).
- For list adds, generate a UUID on the client and pass it to the server.
- Every server action that mutates data must call `updateTag()` or `refresh()`.

### Shared mutation logic

When the client needs to predict the server result (e.g., cycling enum values), extract the logic into a shared constant. **Do not put constants in `"use server"` files** — put them in a separate file (e.g., `data.ts`) and import from both the server action and the client component.

### Complex forms with controlled state

Keep `useState` for complex UI controls (multi-select, dependent selects). Wrap submission in `<form action>` that reads from controlled state directly. This is not the `useState` anti-pattern — controlled state for complex UI is fine. The anti-pattern is `useState` for **server-derived data** or **mutation results**.

### Post-await state updates

State updates after `await` inside `startTransition` fall outside the transition scope. Wrap post-`await` updates in another `startTransition`. See `patterns.md` for the double-transition pattern.

## Step 6: Add Pending Feedback

For interactions where you want "working" feedback without optimistic results, use `useTransition` + `data-pending`. See `patterns.md` for the DeleteButton and grouped pending examples.

**Rules:**

- `data-pending` requires a parent with `has-data-pending:` styles to create a visible effect. Always add both parts.
- For grouped regions, use `group-has-data-pending:`.

## Step 7: Verify

Walk through every row in the interaction map from Step 1:

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
