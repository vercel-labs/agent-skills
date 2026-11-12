# Performance decisions

Use this reference for React performance work. It carries forward selected ideas from Vercel's React Best Practices with explicit applicability, rather than treating every optimization as a default code-generation rule.

## Remove avoidable waiting

Start independent work together and await results where they are needed. Preserve true dependencies: an operation requiring another operation's result must wait for it. Check cheap conditions before starting work that may be unnecessary.

In a framework with streaming or Suspense-enabled data fetching, place waits and boundaries so independent content can become visible independently. Use the framework's supported data APIs. Wrapping an Effect-based fetch in Suspense does not make it stream.

Sources: [independent async work](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md), [defer awaits](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md), [React Suspense](https://react.dev/reference/react/Suspense).

## Keep urgent interactions responsive

Keep controlled input updates immediate. Use a Transition for suitable non-urgent updates, or defer a value consumed by expensive UI. Neither mechanism makes a synchronous computation inside an event handler run on another thread.

Transitions can interrupt background rendering; they do not automatically cancel network requests or order custom async responses. Use the framework's data integration, an appropriate Action abstraction, or explicit ordering/cancellation where needed. Read the installed version's guidance on updates after `await` before implementing an async Transition.

Sources: [React useTransition](https://react.dev/reference/react/useTransition), [React useDeferredValue](https://react.dev/reference/react/useDeferredValue).

## Optimize the work that costs time

Check whether React Compiler is enabled and covers the code in question. Avoid adding `memo`, `useMemo`, or `useCallback` mechanically when the compiler already handles that optimization. Without compiler coverage, use profiling to identify expensive repeated work and the boundary where memoization helps. Preserve existing memoization unless the change justifies removing it.

Before caching a calculation, consider whether it needs to run at all: an early return or a component boundary can avoid work for content that is not being rendered. Keep component definitions outside render so unrelated renders do not create a new component type and reset state.

Sources: [React Compiler](https://react.dev/learn/react-compiler/introduction), [avoid unnecessary Effects](https://react.dev/learn/you-might-not-need-an-effect), [component identity and state](https://react.dev/learn/preserving-and-resetting-state).

## Reduce transferred code and data

Load a substantial optional dependency when its feature is needed, using the project's bundler or framework integration. Consider the effect on when the UI becomes usable; deferring a dependency needed immediately can create another waterfall.

For projects using Server Components, pass the data needed by the client component across the boundary instead of entire records. Respect the framework's supported serialization rules and keep request-specific mutable data out of shared module state.

Sources: [conditional loading](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-conditional.md), [RSC serialization](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/server-serialization.md), [React Server Components](https://react.dev/reference/rsc/server-components).

The linked legacy rules provide provenance and additional examples. Check their assumptions against the current React and framework documentation before applying them; they are not a requirement to load the old skill or its complete compiled guide.
