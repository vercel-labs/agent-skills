# Version Gating Guide

## Next.js Feature Availability Matrix

| Feature/Pattern | Next 13 | Next 14 | Next 15+ |
|---|---|---|---|
| App Router | Stable | Yes | Yes |
| `generateStaticParams` | Yes | Yes | Yes |
| `unstable_cache` | No | Yes | Deprecated (use `use cache`) |
| `use cache` directive | No | No | Yes |
| `after()` API | No | No | Yes |
| Partial Prerendering (PPR) | No | No | Yes (experimental) |
| `dynamicIO` | No | No | Yes (experimental) |
| `React.cache()` | Yes (React 18) | Yes | Yes |
| Middleware matcher | Yes (12+) | Yes | Yes |
| ISR (`revalidate`) | Yes (12+) | Yes | Yes |
| On-demand revalidation (`revalidateTag`/`revalidatePath`) | Yes (App Router) / 12.1+ (Pages Router) | Yes | Yes |
| `next/dynamic` | Yes | Yes | Yes |
| Suspense streaming | Yes (App Router) | Yes | Yes |
| `connection()` / `unstable_noStore()` | No | Yes (`unstable_noStore()`) | Yes (prefer `connection()`) |

## Decision Logic

### Caching Strategy

- If Next 15+: Recommend `'use cache'` directive (FUNC-02)
- If Next 14: Recommend `unstable_cache` (FUNC-03)
- If Next 13: Recommend fetch-level `{ next: { revalidate } }` options

```
if (version >= 15) {
  recommend: 'use cache' directive (FUNC-02)
} else if (version === 14) {
  recommend: unstable_cache (FUNC-03)
} else if (version === 13) {
  recommend: fetch({ next: { revalidate: N } })
}
```

### Non-blocking Work

- If Next 15+: Recommend `after()` (DUR-06)
- If Next 14 or below: Recommend `waitUntil()` from `@vercel/functions` as alternative, or a background API route

```
if (version >= 15) {
  recommend: after() (DUR-06)
} else {
  recommend: waitUntil() from @vercel/functions, or background API route
}
```

### Static Generation

- If Next 13+: Recommend `generateStaticParams` (FUNC-01) for App Router
- All versions: Recommend `getStaticPaths` for Pages Router

```
if (version >= 13 && usingAppRouter) {
  recommend: generateStaticParams (FUNC-01)
} else {
  recommend: getStaticPaths (Pages Router)
}
```

### Request Deduplication

- All versions with App Router: Recommend `React.cache()` (DUR-05)
- Pages Router: Recommend SWR client-side deduplication

```
if (usingAppRouter) {
  recommend: React.cache() (DUR-05)
} else {
  recommend: SWR client-side dedup
}
```

### Dynamic vs Static

- If Next 15+: Recommend checking `connection()` usage; default rendering is static
- If Next 14: Check for `unstable_noStore()` usage to opt out of caching
- If Next 13: Check `export const dynamic` route segment config

```
if (version >= 15) {
  check: connection() usage; default is static, opt into dynamic explicitly
} else if (version === 14) {
  check: unstable_noStore() usage
} else if (version === 13) {
  check: export const dynamic = 'force-dynamic' | 'force-static' | 'auto'
}
```

## Version Detection Notes

- The detected version from `detect-stack.sh` is the installed version, not necessarily the intended deployment target
- When the major version is ambiguous (e.g., `"^14.0.0"` in `package.json`), treat the version as the lower bound of the range (i.e., Next 14)
- Canary and RC releases of Next 15 (e.g., `15.0.0-rc.1`, `15.0.0-canary.42`) should be treated as Next 15 for the purposes of feature availability
