# React View Transitions

Guide for implementing smooth, native-feeling animations using React's View
Transition API. Covers the `<ViewTransition>` component, `addTransitionType`,
CSS view transition pseudo-elements, shared element transitions, and Next.js
integration including the `transitionTypes` prop on `next/link`.

## Structure

- `SKILL.md` - Core skill instructions with references to sub-documents
- `references/` - Supporting documentation
  - `nextjs.md` - Next.js-specific patterns (App Router, `transitionTypes`, shared elements across routes)
  - `css-recipes.md` - Ready-to-use CSS animation recipes (fade, slide, scale, flip, directional)
- `metadata.json` - Skill metadata (version, organization, abstract)
- **`AGENTS.md`** - Full compiled document with all references inlined

## Topics Covered

- `<ViewTransition>` component (enter, exit, update, share triggers)
- `addTransitionType` for directional/context-specific animations
- View Transition Classes and CSS pseudo-elements
- Shared element transitions with the `name` prop
- JavaScript animations via Web Animations API (`onEnter`, `onExit`, `onUpdate`, `onShare`)
- Next.js `transitionTypes` prop on `next/link` (Next.js 16.2+)
- `useDeferredValue` + `ViewTransition` for search animations
- Type-safe transition helpers
- Accessibility (`prefers-reduced-motion`)

## References

- [React `<ViewTransition>` docs](https://react.dev/reference/react/ViewTransition)
- [React `addTransitionType` docs](https://react.dev/reference/react/addTransitionType)
- [Next.js `viewTransition` config](https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition)
- [next16-conferences](https://github.com/aurorascharff/next16-conferences) — real-world example app
- [Next.js App Router Playground](https://github.com/vercel/next-app-router-playground/tree/main/app/view-transitions) — Vercel's reference implementation
