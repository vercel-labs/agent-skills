# React Best Practices Skill

An agent skill containing React and Next.js performance optimization guidelines from Vercel Engineering.

## What This Skill Does

When activated, this skill provides Claude with 40+ performance optimization rules across 8 categories, prioritized by impact. Claude will apply these patterns when:

- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Installation

```bash
npx add-skill vercel-labs/agent-skills
```

## Skill Structure

```
react-best-practices/
├── SKILL.md                              # Main skill definition
└── references/
    ├── react-performance-guidelines.md   # Complete guide with all patterns
    └── rules/                            # Individual rule files by category
        ├── async-*                       # Waterfall elimination
        ├── bundle-*                      # Bundle size optimization
        ├── server-*                      # Server-side performance
        ├── client-*                      # Client-side data fetching
        ├── rerender-*                    # Re-render optimization
        ├── rendering-*                   # DOM rendering performance
        ├── js-*                          # JavaScript micro-optimizations
        └── advanced-*                    # Advanced patterns
```

## Rule Categories by Priority

| Priority | Category | Impact | Examples |
|----------|----------|--------|----------|
| 1 | Eliminating Waterfalls | CRITICAL | Defer await, Promise.all, Suspense |
| 2 | Bundle Size | CRITICAL | Avoid barrel imports, dynamic imports |
| 3 | Server-Side | HIGH | React.cache(), LRU cache, serialization |
| 4 | Client Data Fetching | MEDIUM-HIGH | SWR deduplication |
| 5 | Re-render Optimization | MEDIUM | Lazy state init, transitions, memo |
| 6 | Rendering Performance | MEDIUM | content-visibility, hydration |
| 7 | JavaScript | LOW-MEDIUM | Batch DOM changes, index maps |
| 8 | Advanced Patterns | LOW | useLatest, event handler refs |

## Example Trigger Phrases

- "Write a React component for..."
- "Review this Next.js page for performance"
- "Optimize this data fetching code"
- "Refactor to reduce bundle size"
- "Why is this component re-rendering?"

## License

MIT
