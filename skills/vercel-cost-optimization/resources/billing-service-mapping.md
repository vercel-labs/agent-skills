# Vercel Billing Service Mapping

A reference guide mapping Vercel billing services to code investigation steps. Use this to identify cost drivers and apply quick wins in a Next.js codebase.

---

## 1. Function Invocations

**What drives the cost**: Every SSR page render, API route call, and server action execution counts as a function invocation. Dynamic routes that could be statically generated are a common source of unnecessary invocations.

### Code Locations to Investigate

```bash
# Find all exported functions in app/ and pages/api/ (SSR pages, API routes, server actions)
grep -r "export default function\|export async function" app/ pages/api/

# Find dynamic route segments that are missing generateStaticParams
find app/ -name "page.tsx" -o -name "page.js" | xargs grep -L "generateStaticParams"

# Look for client-side polling patterns that trigger repeated API calls
grep -rn "setInterval\|setTimeout.*fetch\|useEffect.*fetch" app/ --include="*.tsx" --include="*.ts"

# Find pages explicitly opted into dynamic rendering
grep -rn "export const dynamic" app/ --include="*.tsx" --include="*.ts"
```

### Investigation Steps

1. Count dynamic vs static routes: run `next build` and inspect the output table for routes marked `λ` (dynamic) vs `○` (static).
2. For each dynamic route, determine whether it truly needs per-request rendering or could be statically generated at build time.
3. Check for pages that fetch data without `revalidate`, which forces dynamic rendering.
4. Identify client components that poll an API endpoint on a timer — each poll is a new invocation.
5. Review server actions to confirm they are not called redundantly on every render.

### Quick Wins

- Add `generateStaticParams` to dynamic route segments (`[id]`, `[slug]`) to pre-render them at build time.
- Add `export const dynamic = 'force-static'` to pages that do not need per-request data.
- Replace polling patterns with `revalidatePath` / `revalidateTag` triggered by mutations.
- Move read-heavy API routes to cached server components where possible.

---

## 2. Function Duration (GB-hours)

**What drives the cost**: Slow database queries, sequential data fetching, large response payloads, and cold starts all increase the wall-clock time a function runs. GB-hours is memory × duration, so slow functions are expensive even at low traffic.

### Code Locations to Investigate

```bash
# Find sequential awaits that could be parallelized
grep -rn "await.*\n.*await\|await.*await" app/ --include="*.tsx" --include="*.ts"

# Find .then chaining patterns
grep -rn "\.then.*\.then" app/ --include="*.tsx" --include="*.ts"

# Find ORM query sites (Prisma, Drizzle, Mongoose)
grep -rn "prisma\.\|db\.\|mongoose\." app/ --include="*.tsx" --include="*.ts"

# Find files that import database clients (to locate all DB-touching routes)
grep -rn "from.*prisma\|from.*drizzle\|from.*mongoose\|from.*pg\b" app/ --include="*.tsx" --include="*.ts"

# Look for missing connection pooling (direct DB connections without a pool)
grep -rn "new Pool\|createPool\|PrismaClient" app/ --include="*.tsx" --include="*.ts"
```

### Investigation Steps

1. Profile slow routes using Vercel's Function Logs — sort by duration and identify the slowest endpoints.
2. For each slow route, check whether awaits are sequential when they could be parallel (`Promise.all`).
3. Inspect ORM queries for N+1 patterns: a query inside a loop over an array returned by a previous query.
4. Check whether a new database client is instantiated on every request (common in serverless environments without a global singleton).
5. Review payload sizes — large JSON serialization adds duration even after the query completes.

### Quick Wins

- Replace sequential independent awaits with `Promise.all([fetch1, fetch2, fetch3])`.
- Enable **Fluid Compute** in Vercel project settings to reduce cold start overhead.
- Use a connection pooler (PgBouncer, Prisma Accelerate, Neon pooling) rather than direct connections.
- Add `select` or field projection to ORM queries to avoid fetching unused columns.
- Use `includes` / `with` (Prisma/Drizzle) to batch related queries instead of looping.

---

## 3. Edge Requests (Edge Middleware)

**What drives the cost**: Middleware runs on every matched request. Without a `matcher`, it runs on every request including `_next/static` asset fetches, image optimization requests, and favicon lookups — none of which benefit from middleware logic.

### Code Locations to Investigate

```bash
# Check for matcher configuration in middleware
grep -n "matcher" middleware.ts

# View the full middleware config export
grep -n "export const config" middleware.ts

# Check what the middleware actually does (auth, redirects, rewrites)
cat middleware.ts
```

### Investigation Steps

1. Open `middleware.ts` and check whether a `matcher` array is defined in the exported `config` object.
2. If no matcher is present, the middleware runs on every single request — measure the volume in Vercel's usage dashboard.
3. Identify which request types the middleware actually needs to intercept (e.g., authenticated pages only).
4. Verify the middleware does not make external network calls on every request (e.g., JWT validation is fine; database lookups are not).

### Quick Wins

- Add a `matcher` to restrict middleware to application routes only:

```ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

- Move any non-auth logic out of middleware and into route handlers or server components.
- Use `EdgeConfig` for feature flags instead of a database call inside middleware.

---

## 4. Image Optimization

**What drives the cost**: Every unique `(src, width, quality)` combination that passes through `next/image` is processed and cached. Missing `sizes` props cause the optimizer to generate unnecessarily large variants. SVGs and animated GIFs are also run through the optimizer by default despite not benefiting from it.

### Code Locations to Investigate

```bash
# Find all Next.js Image components and raw img tags
grep -rn "Image\|<img" --include="*.tsx" --include="*.jsx" app/ components/

# Find Image components missing a sizes prop
grep -rn "<Image" --include="*.tsx" --include="*.jsx" app/ components/ | grep -v "sizes="

# Find SVG files being served through next/image
grep -rn "<Image.*\.svg" --include="*.tsx" --include="*.jsx" app/ components/

# Check next.config.js for image domain/remotePatterns configuration
grep -n "images\|remotePatterns\|domains" next.config.js next.config.ts 2>/dev/null
```

### Investigation Steps

1. Audit all `<Image>` components — confirm each has an explicit `sizes` prop that matches its CSS layout width.
2. Check for SVG sources passed to `<Image>` — SVGs should be inlined or served as static files.
3. Check for animated GIFs — the optimizer strips animation; use `unoptimized` or convert to video.
4. Review `remotePatterns` in `next.config.js` — overly broad patterns allow arbitrary external images to be optimized at your cost.
5. Look for the same image URL rendered many times on a single page (e.g., avatars in a list) — ensure consistent `width`/`quality` to maximize cache hits.

### Quick Wins

- Add a `sizes` prop to every `<Image>` that reflects the actual rendered width (e.g., `sizes="(max-width: 768px) 100vw, 50vw"`).
- Add `unoptimized` to `<Image>` components serving SVG or GIF sources.
- Tighten `remotePatterns` to only allow specific hostnames and path prefixes.
- For static images that never change, consider moving them to a CDN and using a plain `<img>` tag.

---

## 5. Bandwidth (Data Transfer)

**What drives the cost**: Large RSC payloads sent to the client, oversized JavaScript bundles, barrel imports that pull in unused modules, and missing streaming all increase bytes transferred per request.

### Code Locations to Investigate

```bash
# Analyze bundle composition
ANALYZE=true npx next build
# or install @next/bundle-analyzer and run:
npx @next/bundle-analyzer

# Find barrel imports (index re-exports) that bloat bundles
grep -rn "from '.*/index'" app/ --include="*.tsx" --include="*.ts"
grep -rn "from \".*\/index\"" app/ --include="*.tsx" --include="*.ts"

# Find large client components (use-client boundary with heavy imports)
grep -rn "\"use client\"" app/ --include="*.tsx" --include="*.ts"

# Find components that could be lazy-loaded
grep -rn "import.*from" app/ --include="*.tsx" | grep -v "dynamic\|next/"

# Look for missing Suspense boundaries
grep -rn "async function\|await " app/ --include="*.tsx" | grep -v "Suspense"
```

### Investigation Steps

1. Run `next build` with bundle analyzer enabled and inspect the treemap for unexpectedly large modules.
2. Check server component props — avoid passing large data objects as props to client components; pass only what the client renders.
3. Identify `"use client"` files that import heavy libraries; consider whether those libraries can stay server-side.
4. Look for barrel exports (`index.ts` files that re-export entire directories) — these prevent tree-shaking.
5. Check whether long-loading pages use `<Suspense>` to stream content progressively.

### Quick Wins

- Replace static imports of heavy client-only components with `next/dynamic(() => import(...))`.
- Eliminate barrel `index.ts` re-exports; import directly from source files instead.
- Add `<Suspense fallback={<Skeleton />}>` around async server components to enable streaming.
- Ensure `response.json()` calls in server components select only needed fields before passing to client components.

---

## 6. ISR / Data Cache

**What drives the cost**: Very short `revalidate` intervals cause the cache to expire frequently, triggering new function invocations to regenerate pages. Broad `revalidatePath` calls that invalidate large swaths of the cache at once can create revalidation storms.

### Code Locations to Investigate

```bash
# Find all revalidate settings (ISR interval and cache revalidation)
grep -rn "revalidate\|revalidatePath\|revalidateTag" app/ --include="*.tsx" --include="*.ts"

# Find fetch calls with cache options
grep -rn "next:.*revalidate\|cache:.*no-store\|cache:.*force-cache" app/ --include="*.tsx" --include="*.ts"

# Find route segment config exports
grep -rn "export const revalidate" app/ --include="*.tsx" --include="*.ts"

# Find on-demand revalidation call sites
grep -rn "revalidatePath\|revalidateTag" app/ --include="*.tsx" --include="*.ts"
```

### Investigation Steps

1. List all `revalidate` values across the codebase — anything below 60 seconds warrants scrutiny.
2. For each short-interval route, determine whether the data changes that frequently in practice.
3. Check `revalidatePath` call sites — if they pass `/` or a broad path, every page is revalidated on each mutation.
4. Verify that `revalidateTag` tags are granular enough to avoid over-invalidation.
5. Check for multiple mutations in a single request each calling `revalidatePath` independently.

### Quick Wins

- Increase `revalidate` intervals for non-critical data (e.g., `revalidate = 60` → `revalidate = 3600`).
- Switch from time-based ISR to on-demand revalidation using `revalidateTag` triggered only on actual data changes.
- Replace `revalidatePath('/')` with specific tagged cache entries (`revalidateTag('product-list')`).
- Batch multiple `revalidateTag` calls into a single mutation handler to avoid redundant cache purges.

---

## 7. Cron Invocations

**What drives the cost**: High-frequency cron jobs invoke serverless functions on a schedule regardless of whether there is work to do. Long-running cron handlers also accumulate GB-hours in addition to the per-invocation cost.

### Code Locations to Investigate

```bash
# Check vercel.json for cron job definitions
grep -rn "cron" vercel.json

# View the full cron configuration
cat vercel.json | grep -A 10 "\"crons\""

# Find the cron handler route files
find app/ pages/ -path "*/api/*" -name "*.ts" -o -name "*.tsx" | xargs grep -l "cron\|scheduled"

# Check handler duration indicators (large loops, sequential DB calls)
grep -rn "for.*await\|while.*await" app/api/ --include="*.ts"
```

### Investigation Steps

1. Open `vercel.json` and list every cron job with its schedule expression.
2. For each job, verify the frequency matches the actual business need (a daily digest does not need a `* * * * *` schedule).
3. Open each cron handler and check whether it does all its work synchronously or fans out to an external queue.
4. Measure average cron handler duration in Vercel Function Logs — anything over 10 seconds is a candidate for optimization.
5. Check whether multiple cron jobs overlap in their work (e.g., two jobs both processing the same queue).

### Quick Wins

- Reduce cron frequency to the minimum needed (e.g., `*/5 * * * *` → `0 * * * *` for hourly).
- Batch database operations inside the handler rather than processing records one-by-one.
- Offload heavy work to an external queue (e.g., Inngest, Trigger.dev, BullMQ) and keep the cron handler as a lightweight dispatcher.
- Add an early-exit check at the top of the handler so it returns immediately when there is no work to do.

---

## 8. Web Analytics

**What drives the cost**: Vercel Web Analytics charges based on tracked events and page views. High-traffic sites can accumulate significant analytics cost, especially when analytics is enabled in addition to an existing external analytics solution.

### Code Locations to Investigate

```bash
# Check next.config.js for analytics configuration
grep -n "analytics\|Analytics" next.config.js next.config.ts 2>/dev/null

# Find Analytics component usage in layout files
grep -rn "Analytics\|SpeedInsights" app/ --include="*.tsx" --include="*.ts"

# Check for the @vercel/analytics package
grep -n "vercel/analytics\|vercel/speed-insights" package.json

# Check for duplicate analytics providers
grep -rn "gtag\|plausible\|fathom\|posthog\|mixpanel" app/ --include="*.tsx" --include="*.ts"
```

### Investigation Steps

1. Search `app/layout.tsx` (and any `layout.tsx` files in route groups) for `<Analytics />` or `<SpeedInsights />` component usage.
2. Check `package.json` for `@vercel/analytics` and `@vercel/speed-insights` as dependencies.
3. Determine whether Vercel Analytics is being used alongside an external provider (Google Analytics, Plausible, Fathom, PostHog) — running both doubles the cost for zero additional insight.
4. Verify that analytics is not accidentally imported in multiple layout files, causing double-counting.
5. Review the Vercel dashboard to confirm the analytics event volume is expected given your traffic level.

### Quick Wins

- Remove `<Analytics />` and uninstall `@vercel/analytics` if an external analytics tool already covers the same data.
- If Vercel Analytics is preferred, remove the external provider to avoid paying twice.
- Use the `beforeSend` callback in `@vercel/analytics` to filter out bot traffic or internal team visits before they are counted.
- Limit `<SpeedInsights />` to production builds only by conditionally rendering based on `process.env.NODE_ENV`.

---

## Summary Table

| Billing Service       | Primary Cost Driver                        | Fastest Win                                      |
|-----------------------|--------------------------------------------|--------------------------------------------------|
| Function Invocations  | Dynamic routes that could be static        | Add `generateStaticParams` or `force-static`     |
| Function Duration     | Sequential awaits, N+1 queries, cold starts| `Promise.all`, connection pooling, Fluid Compute |
| Edge Requests         | Middleware without a matcher               | Add `matcher` to skip static assets              |
| Image Optimization    | Missing `sizes`, SVG/GIF through optimizer | Add `sizes` prop, use `unoptimized` for SVG/GIF  |
| Bandwidth             | Large bundles, barrel imports, no streaming| `next/dynamic`, remove barrel imports, Suspense  |
| ISR / Data Cache      | Short revalidate intervals                 | Increase intervals, switch to tag-based revalidation |
| Cron Invocations      | High-frequency schedules, slow handlers    | Reduce frequency, batch work, use a queue        |
| Web Analytics         | Running alongside external analytics       | Remove duplicate provider                        |
