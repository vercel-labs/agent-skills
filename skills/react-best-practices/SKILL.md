---
name: react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimization, or performance improvements.
---

# React Best Practices

## Overview

Performance optimization guide for React and Next.js applications, ordered by impact. Apply these patterns when writing or reviewing code to maximize performance gains.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

## Priority-Ordered Guidelines

Rules are prioritized by impact:

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size Optimization | CRITICAL |
| 3 | Server-Side Performance | HIGH |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |
| 6 | Rendering Performance | MEDIUM |
| 7 | JavaScript Performance | LOW-MEDIUM |
| 8 | Advanced Patterns | LOW |

## Quick Reference

### Critical Patterns (Apply First)

**Eliminate Waterfalls:**
- Use `Promise.all()` for independent async operations
- Start promises early, await late
- Use `better-all` for partial dependencies
- Use Suspense boundaries to stream content

**Reduce Bundle Size:**
- Avoid barrel file imports (import directly from source)
- Use `next/dynamic` for heavy components
- Defer non-critical third-party libraries
- Preload based on user intent

### High-Impact Server Patterns

- Use `React.cache()` for per-request deduplication
- Use LRU cache for cross-request caching
- Minimize serialization at RSC boundaries
- Parallelize data fetching with component composition

### Medium-Impact Client Patterns

- Use SWR for automatic request deduplication
- Defer state reads to usage point
- Use derived state subscriptions
- Apply `startTransition` for non-urgent updates

## References

Full documentation with code examples is available in:

- `references/react-performance-guidelines.md` - Complete guide with all patterns
- `references/rules/` - Individual rule files organized by category

To look up a specific pattern, grep the rules directory:
```
grep -l "suspense" references/rules/
grep -l "barrel" references/rules/
grep -l "swr" references/rules/
```

## Rule Categories in `references/rules/`

- `async-*` - Waterfall elimination patterns
- `bundle-*` - Bundle size optimization
- `server-*` - Server-side performance
- `client-*` - Client-side data fetching
- `rerender-*` - Re-render optimization
- `rendering-*` - DOM rendering performance
- `js-*` - JavaScript micro-optimizations
- `advanced-*` - Advanced patterns
