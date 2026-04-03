# Optimization Patterns

A reference catalog of cost-optimization patterns for Vercel-hosted Next.js applications, organized by billing dimension. Each pattern includes effort level, applicable framework versions, before/after code examples, and cross-references to `react-best-practices` rules where relevant.

---

## Function Invocations

Function invocations are billed per execution of serverless and edge functions. Reducing unnecessary executions — through static generation, caching, and bot filtering — is the highest-leverage lever for most applications.

---

### FUNC-01: Generate Static Params for Dynamic Routes

- **ID**: FUNC-01
- **Versions**: Next.js 13+ (App Router)
- **Effort**: Low

**Description**: Dynamic routes in the App Router render server-side on every request by default. Providing `generateStaticParams` causes Next.js to pre-render those pages at build time, converting SSR invocations to static file serves.

**Before** — dynamic route renders on every request:

```tsx
// app/blog/[slug]/page.tsx
import { getPostBySlug } from '@/lib/posts'

interface Props {
  params: { slug: string }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

**After** — pages pre-rendered at build time, zero function invocations at runtime:

```tsx
// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

**Notes**: For routes with a very large number of possible values, combine with `dynamicParams = false` to return 404 for any slug not in the static set, or `dynamicParams = true` (default) to fall back to SSR for unknown slugs while still pre-rendering known ones.

---

### FUNC-02: Use `use cache` Directive (Next.js 15+)

- **ID**: FUNC-02
- **Versions**: Next.js 15+
- **Effort**: Low

**Description**: The `'use cache'` directive opts a server component or async function into Next.js's persistent cache. Subsequent requests that hit the same cache key are served from the cache without invoking the function. For Next.js 14, see FUNC-03.

**Before** — server component fetches data on every request:

```tsx
// app/dashboard/page.tsx
import { getMetrics } from '@/lib/analytics'

export default async function DashboardPage() {
  // Called on every request — each call is a billable function invocation
  const metrics = await getMetrics()

  return (
    <main>
      <h1>Dashboard</h1>
      <MetricsGrid data={metrics} />
    </main>
  )
}
```

**After** — component result is cached; subsequent requests skip function execution:

```tsx
// app/dashboard/page.tsx
'use cache'

import { getMetrics } from '@/lib/analytics'

export default async function DashboardPage() {
  const metrics = await getMetrics()

  return (
    <main>
      <h1>Dashboard</h1>
      <MetricsGrid data={metrics} />
    </main>
  )
}
```

You can also scope the cache to an individual data-fetching function rather than the whole component:

```tsx
// lib/analytics.ts
import { cacheTag, cacheLife } from 'next/cache'

export async function getMetrics() {
  'use cache'
  cacheTag('metrics')
  cacheLife('hours')

  const res = await fetch('https://api.example.com/metrics')
  return res.json()
}
```

**Notes**: `cacheTag` and `cacheLife` are Next.js 15 APIs for tagging cached entries and setting TTLs. Use `revalidateTag('metrics')` in a Server Action or Route Handler to invalidate on demand.

---

### FUNC-03: Use `unstable_cache` (Next.js 14)

- **ID**: FUNC-03
- **Versions**: Next.js 14.x
- **Effort**: Medium

**Description**: In Next.js 14, `unstable_cache` wraps any async function to persist its return value in the data cache between requests. This is the predecessor to the `'use cache'` directive.

**Before** — direct database call on every request:

```tsx
// lib/products.ts
import { db } from '@/lib/db'

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { featured: true },
    take: 12,
  })
}
```

**After** — wrapped with `unstable_cache` to cache results:

```tsx
// lib/products.ts
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getFeaturedProducts = unstable_cache(
  async () => {
    return db.product.findMany({
      where: { featured: true },
      take: 12,
    })
  },
  ['featured-products'],          // cache key parts
  {
    revalidate: 3600,             // revalidate every hour
    tags: ['products'],           // tag for on-demand invalidation
  }
)
```

Invalidate on demand from a Server Action or Route Handler:

```ts
// app/actions/revalidate.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function revalidateProducts() {
  revalidateTag('products')
}
```

**Notes**: `unstable_cache` is stable in practice despite the name. Upgrade to Next.js 15 and migrate to `'use cache'` when the team is ready (see FUNC-02).

---

### FUNC-04: Enable Bot Protection

- **ID**: FUNC-04
- **Versions**: All
- **Effort**: Low (configuration change)

**Description**: Automated bots can account for a significant share of function invocations on public-facing SSR pages. Vercel's built-in Firewall bot protection blocks known malicious and scraper bots before they reach your functions.

**Before**: No bot protection — every bot request triggers a full SSR function invocation.

**After**: Bot protection enabled in Vercel project settings:

1. Navigate to your Vercel project dashboard.
2. Go to **Settings > Security > Firewall**.
3. Enable **Bot Protection** (available on Pro and Enterprise plans).

For custom rules, configure via `vercel.json`:

```json
{
  "firewall": {
    "rules": [
      {
        "name": "Block known bad bots",
        "description": "Block requests matching known scraper user-agent patterns",
        "conditionGroup": [
          {
            "conditions": [
              {
                "type": "user_agent",
                "op": "re",
                "value": "(scrapy|python-requests|go-http-client)"
              }
            ]
          }
        ],
        "action": { "type": "block" }
      }
    ]
  }
}
```

**Notes**: Review Vercel's managed bot list in the dashboard. Challenge mode (CAPTCHA) is preferable to hard-blocking for ambiguous user agents to avoid false positives.

---

### FUNC-05: Convert Polling to Webhooks

- **ID**: FUNC-05
- **Versions**: All
- **Effort**: High

**Description**: Client-side polling hits an API route on a timer, generating a continuous stream of function invocations even when there is no new data. Webhooks push updates only when data actually changes.

**Before** — client polls every 5 seconds:

```tsx
// hooks/useOrderStatus.ts
import { useEffect, useState } from 'react'

export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`)
      const data = await res.json()
      setStatus(data.status)
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId])

  return status
}
```

**After** — server pushes updates via Server-Sent Events; function only invoked on actual change:

```ts
// app/api/orders/[orderId]/stream/route.ts
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Subscribe to order status change events (e.g., Redis pub/sub, DB trigger)
      const unsubscribe = await subscribeToOrderUpdates(params.orderId, (status) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status })}\n\n`))
      })

      req.signal.addEventListener('abort', () => {
        unsubscribe()
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
```

```tsx
// hooks/useOrderStatus.ts
import { useEffect, useState } from 'react'

export function useOrderStatus(orderId: string) {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const es = new EventSource(`/api/orders/${orderId}/stream`)
    es.onmessage = (e) => {
      const { status } = JSON.parse(e.data)
      setStatus(status)
    }
    return () => es.close()
  }, [orderId])

  return status
}
```

**Notes**: If SSE is not suitable (e.g., you need bidirectional communication), consider Vercel's WebSocket support via Ably, Pusher, or PartyKit integrations. Ensure your webhook provider signs payloads and validate signatures in the receiving Route Handler.

---

## Function Duration

Function duration measures wall-clock execution time, billed in GB-seconds. Shorter function runs reduce cost and improve response latency.

---

### DUR-01: Parallel Data Fetching with Promise.all

- **ID**: DUR-01
- **Versions**: All
- **Effort**: Low
- **Cross-ref**: `react-best-practices` rules `async-parallel`, `server-parallel-fetching`

**Description**: Sequential `await` calls execute one at a time, and each call's latency adds to the total function duration. `Promise.all` fans out independent fetches concurrently, reducing duration to the slowest individual call.

**Before** — sequential fetches; total duration = latency(A) + latency(B) + latency(C):

```tsx
// app/profile/page.tsx
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user    = await fetchUser(params.id)       // 120ms
  const posts   = await fetchUserPosts(params.id)  // 200ms
  const follows = await fetchFollows(params.id)    // 80ms
  // Total wait: ~400ms

  return <ProfileView user={user} posts={posts} follows={follows} />
}
```

**After** — parallel fetches; total duration = max(latency(A), latency(B), latency(C)):

```tsx
// app/profile/page.tsx
export default async function ProfilePage({ params }: { params: { id: string } }) {
  const [user, posts, follows] = await Promise.all([
    fetchUser(params.id),
    fetchUserPosts(params.id),
    fetchFollows(params.id),
  ])
  // Total wait: ~200ms

  return <ProfileView user={user} posts={posts} follows={follows} />
}
```

**Notes**: Only parallelize truly independent operations. If `fetchUserPosts` requires a field from `fetchUser`, it must remain sequential for that dependency. Also see DUR-05 for deduplicating the same fetch across multiple components in the same render.

---

### DUR-02: Enable Fluid Compute

- **ID**: DUR-02
- **Versions**: All (Vercel platform feature)
- **Effort**: Low (configuration change)

**Description**: Fluid Compute is a Vercel execution model that allows a single function instance to handle multiple concurrent requests sequentially rather than spinning up a new instance per request. This reduces cold starts, idle time between invocations, and billable GB-seconds for I/O-bound workloads.

Enable per-function in `vercel.json`:

```json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 60
    }
  }
}
```

Enable globally in the Vercel dashboard:

1. Go to **Settings > Functions**.
2. Toggle **Fluid Compute** to enabled.

Or set the runtime configuration at the function level:

```ts
// app/api/search/route.ts
export const runtime = 'nodejs'
export const preferredRegion = 'iad1'
// Fluid Compute is applied automatically when enabled at the project level
```

**Notes**: Fluid Compute is most beneficial for functions with high concurrency and significant I/O wait. It does not help for CPU-bound functions. Verify that your function's logic is safe for concurrent execution (i.e., no mutable shared module-level state).

---

### DUR-03: Connection Pooling

- **ID**: DUR-03
- **Versions**: All
- **Effort**: Medium

**Description**: Each serverless function invocation establishing a new database connection adds 20-100ms+ of latency and exhausts database connection limits under load. A connection pooler maintains a warm pool of connections shared across invocations.

**Before** — direct connection; new TCP + TLS handshake on every cold start:

```ts
// lib/db.ts
import { Pool } from 'pg'

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Direct connection — each function instance competes for connection slots
})
```

**After** — pooler URL routes through PgBouncer or equivalent:

```ts
// lib/db.ts
import { Pool } from 'pg'

export const db = new Pool({
  // Use the pooler endpoint (e.g., Supabase Transaction Pooler, Neon Pooled URL)
  connectionString: process.env.DATABASE_POOLER_URL,
  max: 1, // Serverless functions should limit pool size to 1
})
```

For Prisma, switch to the accelerate or pooled URL:

```ts
// lib/db.ts (Prisma)
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

```
# .env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=..."
```

**Notes**: When using Supabase, use the **Transaction Pooler** (port 6543) for serverless functions rather than the Session Pooler (port 5432). For Neon, use the `@neondatabase/serverless` driver with the HTTP transport to avoid TCP connection overhead entirely.

---

### DUR-04: Prevent N+1 Queries

- **ID**: DUR-04
- **Versions**: All
- **Effort**: Medium

**Description**: N+1 queries occur when fetching a list of N items and then issuing a separate query for each item's related data, resulting in N+1 round trips to the database. Each round trip adds latency that accumulates into billable function duration.

**Before** — N+1 pattern; one query per post for its author:

```ts
// lib/posts.ts
export async function getPostsWithAuthors() {
  const posts = await db.post.findMany({ take: 20 })

  // N additional queries — one per post
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
      const author = await db.user.findUnique({ where: { id: post.authorId } })
      return { ...post, author }
    })
  )

  return postsWithAuthors
}
```

**After** — single query with eager loading via Prisma `include`:

```ts
// lib/posts.ts
export async function getPostsWithAuthors() {
  // Single query with JOIN — no additional round trips
  return db.post.findMany({
    take: 20,
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  })
}
```

For Drizzle ORM, use a join:

```ts
// lib/posts.ts (Drizzle)
import { eq } from 'drizzle-orm'
import { db } from './db'
import { posts, users } from './schema'

export async function getPostsWithAuthors() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      authorName: users.name,
      authorAvatar: users.avatarUrl,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .limit(20)
}
```

**Notes**: Use query logging in development (e.g., `DEBUG="prisma:query"`) to detect N+1 patterns. Tools like `prisma-query-inspector` or Vercel's observability integrations can surface these in production.

---

### DUR-05: React.cache() Request Deduplication

- **ID**: DUR-05
- **Versions**: Next.js 13+ (React 18+)
- **Effort**: Low
- **Cross-ref**: `react-best-practices` rules `server-cache-react`, `server-cache-lru`

**Description**: Multiple server components in the same render tree may independently call the same data-fetching function. Without deduplication, this results in redundant database or network calls within a single request, inflating function duration. `React.cache()` memoizes the function's return value for the lifetime of the current request.

**Before** — same fetch called independently in multiple components:

```tsx
// lib/user.ts
export async function getCurrentUser(userId: string) {
  // Called in Layout, Header, and ProfilePage independently
  return db.user.findUnique({ where: { id: userId } })
}

// app/layout.tsx
import { getCurrentUser } from '@/lib/user'
export default async function Layout({ children, params }) {
  const user = await getCurrentUser(params.userId) // DB call #1
  return <html><body><Nav user={user} />{children}</body></html>
}

// app/profile/page.tsx
import { getCurrentUser } from '@/lib/user'
export default async function ProfilePage({ params }) {
  const user = await getCurrentUser(params.userId) // DB call #2 — duplicate!
  return <ProfileView user={user} />
}
```

**After** — `React.cache()` deduplicates calls within the same request:

```tsx
// lib/user.ts
import { cache } from 'react'

export const getCurrentUser = cache(async (userId: string) => {
  // Only executed once per request, regardless of how many components call it
  return db.user.findUnique({ where: { id: userId } })
})

// app/layout.tsx and app/profile/page.tsx remain unchanged —
// both import and call getCurrentUser, but the DB query executes only once
```

**Notes**: `React.cache()` scope is per-request (per render pass). It does not persist across requests — for cross-request caching, use `unstable_cache` (FUNC-03) or `'use cache'` (FUNC-02). `React.cache()` works only in React Server Components.

---

### DUR-06: Use `after()` for Non-blocking Work

- **ID**: DUR-06
- **Versions**: Next.js 15+
- **Effort**: Low
- **Cross-ref**: `react-best-practices` rule `server-after-nonblocking`

**Description**: Logging, analytics, and audit trail writes do not need to complete before the response is sent to the client. Including them in the critical path inflates function duration. `after()` schedules a callback to run after the response has been flushed, removing this work from the billable duration for the response.

**Before** — analytics write blocks response:

```tsx
// app/api/checkout/route.ts
import { trackPurchase } from '@/lib/analytics'

export async function POST(req: Request) {
  const body = await req.json()
  const order = await createOrder(body)

  // Blocks response by ~50ms — adds to billable function duration
  await trackPurchase({ orderId: order.id, total: order.total })

  return Response.json({ orderId: order.id })
}
```

**After** — analytics deferred until after response is sent:

```tsx
// app/api/checkout/route.ts
import { after } from 'next/server'
import { trackPurchase } from '@/lib/analytics'

export async function POST(req: Request) {
  const body = await req.json()
  const order = await createOrder(body)

  // Runs after response is flushed — does not block the client
  after(async () => {
    await trackPurchase({ orderId: order.id, total: order.total })
  })

  return Response.json({ orderId: order.id })
}
```

Also applicable in Server Components:

```tsx
// app/product/[id]/page.tsx
import { after } from 'next/server'
import { recordPageView } from '@/lib/analytics'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  after(() => {
    recordPageView({ productId: params.id })
  })

  return <ProductDetail product={product} />
}
```

**Notes**: Work scheduled with `after()` still counts against your function's `maxDuration` limit. Do not use it for unbounded long-running jobs — use a background job queue for those.

---

## Edge Requests

Edge Middleware runs before every matched request at the CDN layer. Each execution is billed as an edge invocation. Reducing the scope and complexity of middleware directly reduces this cost.

---

### EDGE-01: Scope Middleware with Matcher

- **ID**: EDGE-01
- **Versions**: Next.js 12+
- **Effort**: Low

**Description**: Without a `matcher` config, Next.js Middleware runs on every request, including requests for static files, images, fonts, and favicons that do not benefit from middleware logic. Restricting the matcher to application routes eliminates the majority of edge invocations for asset-heavy sites.

**Before** — middleware executes on all requests, including static assets:

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

// No config export — runs on every request, including /_next/static/**, /favicon.ico, etc.
```

**After** — matcher excludes static assets, images, and metadata files:

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico  (browser metadata)
     * - Public folder assets (png, jpg, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf|eot)).*)',
  ],
}
```

**Notes**: Measure the reduction in edge invocations in the Vercel dashboard after deploying. For applications with many static routes, consider also listing only the protected path prefixes explicitly (e.g., `['/dashboard/:path*', '/account/:path*']`).

---

### EDGE-02: Simplify Middleware Logic

- **ID**: EDGE-02
- **Versions**: Next.js 12+
- **Effort**: Medium

**Description**: Complex middleware that combines authentication, redirect rules, A/B test assignment, geolocation-based routing, and header injection increases the CPU time and memory footprint of each edge invocation. Non-critical logic should be moved into Server Components or Route Handlers.

**Before** — middleware doing too many things:

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { getAbTestVariant } from '@/lib/ab-testing'
import { resolveCountryRedirect } from '@/lib/geo'

export async function middleware(request: NextRequest) {
  // 1. Auth check
  const token = request.cookies.get('session')?.value
  const user = token ? await verifyJWT(token) : null
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. A/B test assignment — reads from DB
  const variant = await getAbTestVariant(user?.id ?? 'anonymous')

  // 3. Geo redirect — complex lookup
  const countryRedirect = resolveCountryRedirect(
    request.geo?.country,
    request.nextUrl.pathname
  )
  if (countryRedirect) return NextResponse.redirect(countryRedirect)

  const res = NextResponse.next()
  res.headers.set('x-ab-variant', variant)
  res.headers.set('x-user-id', user?.id ?? '')
  return res
}
```

**After** — middleware limited to auth gating; everything else moved to server-side:

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only the minimal auth gate lives here
  const sessionCookie = request.cookies.get('session')?.value
  if (!sessionCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

```tsx
// app/dashboard/layout.tsx — A/B and geo logic moved to Server Component
import { cookies, headers } from 'next/headers'
import { getAbTestVariant } from '@/lib/ab-testing'
import { resolveGeoContent } from '@/lib/geo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const userId = cookieStore.get('user-id')?.value ?? 'anonymous'
  const variant = await getAbTestVariant(userId)

  const headerStore = headers()
  const country = headerStore.get('x-vercel-ip-country') ?? 'US'
  const geoContent = resolveGeoContent(country)

  return (
    <div data-variant={variant} data-region={geoContent.region}>
      {children}
    </div>
  )
}
```

**Notes**: Edge Middleware cannot access Node.js APIs, native modules, or large npm dependencies. Any middleware that imports heavy libraries will slow cold starts significantly. Keep the middleware bundle under 1MB and execution time under 50ms.

---

## Image Optimization

Vercel charges for image optimization requests (transformations) separately from regular requests. Providing correct sizing hints and skipping optimization for already-optimal formats reduces this cost.

---

### IMG-01: Add `sizes` Prop to All Images

- **ID**: IMG-01
- **Versions**: Next.js 10+
- **Effort**: Low

**Description**: Without a `sizes` prop, Next.js Image generates and serves a fixed-width image for every device. With `sizes`, the browser requests the smallest image that adequately fills the layout slot, reducing both optimization requests for large sizes and bandwidth.

**Before** — no `sizes` prop; Next.js generates the full `width` size for all viewports:

```tsx
// components/ProductCard.tsx
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={800}
        height={600}
        // No sizes prop — browser always requests the 800px-wide version
      />
    </div>
  )
}
```

**After** — `sizes` prop describes the layout, enabling responsive image selection:

```tsx
// components/ProductCard.tsx
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={800}
        height={600}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        // Mobile: full viewport width
        // Tablet: half viewport width
        // Desktop: fixed 400px column
      />
    </div>
  )
}
```

For hero images that fill the full viewport width:

```tsx
<Image
  src={hero.imageUrl}
  alt={hero.title}
  fill
  sizes="100vw"
  priority
/>
```

**Notes**: The `sizes` value should match the CSS layout as closely as possible. Use browser DevTools to inspect the rendered image size at various breakpoints. Inaccurate `sizes` values can still result in over-fetching.

---

### IMG-02: Skip Optimization for SVG and GIF

- **ID**: IMG-02
- **Versions**: Next.js 10+
- **Effort**: Low

**Description**: Next.js Image optimization converts images to WebP/AVIF and resizes them. For SVGs (already vector, infinite resolution) and animated GIFs (optimization strips animation), running them through the optimizer wastes invocations and can produce worse output.

**Before** — SVGs and GIFs routed through the image optimizer unnecessarily:

```tsx
// components/Logo.tsx
import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Company Logo"
      width={120}
      height={40}
      // Triggers an optimization request even though SVG needs none
    />
  )
}

// components/HowItWorks.tsx
export function HowItWorks() {
  return (
    <Image
      src="/animation.gif"
      alt="How it works"
      width={600}
      height={400}
      // Strips animation frames during optimization
    />
  )
}
```

**After** — `unoptimized` prop bypasses the optimizer for these formats:

```tsx
// components/Logo.tsx
import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/logo.svg"
      alt="Company Logo"
      width={120}
      height={40}
      unoptimized
      // Served directly — no optimization request billed
    />
  )
}

// components/HowItWorks.tsx
export function HowItWorks() {
  return (
    <Image
      src="/animation.gif"
      alt="How it works"
      width={600}
      height={400}
      unoptimized
      // Animation preserved, no optimization cost
    />
  )
}
```

Alternatively, configure globally in `next.config.ts` for all SVGs:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
```

**Notes**: When using `dangerouslyAllowSVG`, apply the CSP settings shown above to mitigate XSS risk from SVGs containing scripts. For user-uploaded content, always sanitize SVGs server-side before serving.

---

## Bandwidth

Bandwidth is billed on data transferred from Vercel's edge to clients. Reducing payload sizes through selective prop passing, code splitting, and deferred loading reduces bandwidth costs and improves Core Web Vitals.

---

### BW-01: Reduce RSC Payload Size

- **ID**: BW-01
- **Versions**: Next.js 13+ (App Router)
- **Effort**: Medium

**Description**: React Server Components serialize their output (the RSC payload) and send it to the client. Passing large, unfiltered database objects as props to Client Components inflates this payload. Filtering data to only required fields at the server boundary reduces payload size.

**Before** — full database object passed across the RSC boundary:

```tsx
// app/users/[id]/page.tsx (Server Component)
import { UserProfile } from '@/components/UserProfile' // 'use client'

export default async function UserPage({ params }: { params: { id: string } }) {
  // Returns entire DB row including hashed_password, internal_flags, audit_fields, etc.
  const user = await db.user.findUnique({ where: { id: params.id } })

  // Entire object serialized into RSC payload — includes fields the UI never uses
  return <UserProfile user={user} />
}
```

**After** — select only the fields the Client Component actually uses:

```tsx
// app/users/[id]/page.tsx (Server Component)
import { UserProfile } from '@/components/UserProfile' // 'use client'

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      // Excludes: hashedPassword, internalFlags, auditFields, etc.
    },
  })

  return <UserProfile user={user} />
}
```

Or transform the data explicitly before passing:

```tsx
const rawUser = await db.user.findUnique({ where: { id: params.id } })

const user = {
  id: rawUser.id,
  name: rawUser.name,
  avatarUrl: rawUser.avatarUrl,
}

return <UserProfile user={user} />
```

**Notes**: Use the React DevTools "Components" panel with RSC support, or Vercel's Speed Insights, to inspect RSC payload sizes per route. Large payloads also negatively impact Time to First Byte (TTFB) and Largest Contentful Paint (LCP).

---

### BW-02: Dynamic Imports for Heavy Components

- **ID**: BW-02
- **Versions**: Next.js 1+
- **Effort**: Low
- **Cross-ref**: `react-best-practices` rule `bundle-dynamic-imports`

**Description**: Statically importing large Client Components (charts, rich text editors, maps, video players) includes their code in the initial JavaScript bundle, increasing the amount of data sent on every page load. Dynamic imports split these into separate chunks loaded only when needed.

**Before** — heavy chart library in the initial bundle:

```tsx
// app/analytics/page.tsx
import { RevenueChart } from '@/components/RevenueChart'
// chart.js, d3, or similar: ~300KB parsed on page load

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <RevenueChart />
    </div>
  )
}
```

**After** — chart loaded in a separate chunk, only when the component renders:

```tsx
// app/analytics/page.tsx
import dynamic from 'next/dynamic'

const RevenueChart = dynamic(
  () => import('@/components/RevenueChart'),
  {
    ssr: false,          // Chart uses browser APIs — skip server render
    loading: () => <ChartSkeleton />,
  }
)

export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <RevenueChart />
    </div>
  )
}
```

For a component that only appears conditionally, dynamic imports are even more effective:

```tsx
const HeavyModal = dynamic(() => import('@/components/HeavyModal'))

export function Page() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <HeavyModal onClose={() => setOpen(false)} />}
    </>
  )
}
```

**Notes**: Check bundle sizes with `ANALYZE=true next build` (requires `@next/bundle-analyzer`). Target chunks over 50KB as candidates for dynamic import. Avoid dynamic importing tiny components — the network round trip overhead can outweigh the benefit.

---

### BW-03: Eliminate Barrel Imports

- **ID**: BW-03
- **Versions**: All
- **Effort**: Medium
- **Cross-ref**: `react-best-practices` rule `bundle-barrel-imports`

**Description**: Barrel files (`index.ts` re-exporting everything from a directory) cause bundlers to include the entire barrel when any single export is imported. This pulls in unused components, increasing bundle size and bandwidth.

**Before** — barrel import pulls in all components:

```tsx
// components/index.ts (the barrel)
export { Button } from './Button'
export { Modal } from './Modal'
export { DataTable } from './DataTable'      // heavy: 80KB
export { RichTextEditor } from './RichTextEditor'  // heavy: 200KB
export { VideoPlayer } from './VideoPlayer'  // heavy: 150KB
// ... 40 more exports

// app/login/page.tsx — only needs Button, but imports entire barrel
import { Button } from '@/components'
// DataTable, RichTextEditor, VideoPlayer all end up in the bundle
```

**After** — direct import; only Button is included:

```tsx
// app/login/page.tsx
import { Button } from '@/components/Button'
// Only the Button module is bundled
```

To enforce this project-wide, configure the ESLint `no-restricted-imports` rule:

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["@/components", "@/components/index"],
            "message": "Import directly from the component file, not the barrel (e.g. '@/components/Button' not '@/components')."
          }
        ]
      }
    ]
  }
}
```

Alternatively, configure `optimizePackageImports` in `next.config.ts` for third-party packages that use barrels:

```ts
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns'],
  },
}
```

**Notes**: `optimizePackageImports` is the recommended approach for third-party packages you cannot modify. For your own codebase, prefer direct imports. The `modularizeImports` option (legacy) works similarly but is deprecated in favor of `optimizePackageImports`.

---

### BW-04: Defer Third-Party Scripts

- **ID**: BW-04
- **Versions**: All
- **Effort**: Low
- **Cross-ref**: `react-best-practices` rule `bundle-defer-third-party`

**Description**: Analytics snippets, chat widgets, and ad scripts loaded eagerly block rendering, increase bandwidth on initial load, and count against Core Web Vitals. `next/script` with `strategy="lazyOnload"` defers these until the page is fully interactive.

**Before** — scripts in `_document.tsx` or a raw `<script>` tag blocking render:

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Loaded synchronously — blocks parsing */}
        <script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
        <script src="https://widget.intercom.io/widget/APP_ID" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**After** — deferred with `next/script`:

```tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Loads after page is interactive — does not block LCP */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="lazyOnload"
          onLoad={() => {
            window.dataLayer = window.dataLayer || []
            window.gtag = function () { window.dataLayer.push(arguments) }
            window.gtag('js', new Date())
            window.gtag('config', 'GA_ID')
          }}
        />

        <Script
          src="https://widget.intercom.io/widget/APP_ID"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
```

For scripts with inline initialization code, use the `id` prop:

```tsx
<Script id="gtm-init" strategy="afterInteractive">
  {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXX');
  `}
</Script>
```

**Notes**: Use `strategy="afterInteractive"` for scripts that need to run soon after hydration (e.g., GTM). Use `strategy="lazyOnload"` for scripts that can wait until the browser is fully idle (e.g., chat widgets, surveys). Avoid `strategy="beforeInteractive"` unless absolutely required by the vendor.

---

### BW-05: Add Suspense Boundaries for Streaming

- **ID**: BW-05
- **Versions**: Next.js 13+ (App Router)
- **Effort**: Medium
- **Cross-ref**: `react-best-practices` rule `async-suspense-boundaries`

**Description**: Without Suspense boundaries, the entire page waits for the slowest data fetch before sending any HTML. This wastes bandwidth on TTFB and increases the time users wait for visible content. Suspense boundaries enable HTTP streaming: fast sections render and flush immediately while slow sections stream in progressively.

**Before** — page fully blocked on the slowest component:

```tsx
// app/product/[id]/page.tsx
import { getProduct, getReviews, getRecommendations } from '@/lib/data'

export default async function ProductPage({ params }: { params: { id: string } }) {
  // All three fetches must complete before any HTML is sent
  const [product, reviews, recommendations] = await Promise.all([
    getProduct(params.id),        // 50ms
    getReviews(params.id),        // 800ms  <-- blocks everything
    getRecommendations(params.id), // 300ms
  ])

  return (
    <div>
      <ProductDetail product={product} />
      <ReviewsList reviews={reviews} />
      <Recommendations items={recommendations} />
    </div>
  )
}
```

**After** — fast content streams immediately; slow sections stream in as data arrives:

```tsx
// app/product/[id]/page.tsx
import { Suspense } from 'react'
import { getProduct } from '@/lib/data'
import { ReviewsSection } from './ReviewsSection'
import { RecommendationsSection } from './RecommendationsSection'

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Only the fast fetch blocks initial HTML
  const product = await getProduct(params.id)  // 50ms — streams immediately

  return (
    <div>
      <ProductDetail product={product} />

      {/* Streams in when reviews data is ready (~800ms) */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsSection productId={params.id} />
      </Suspense>

      {/* Streams in when recommendations are ready (~300ms) */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <RecommendationsSection productId={params.id} />
      </Suspense>
    </div>
  )
}
```

```tsx
// app/product/[id]/ReviewsSection.tsx
import { getReviews } from '@/lib/data'

export async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await getReviews(productId)
  return <ReviewsList reviews={reviews} />
}
```

**Notes**: Each `<Suspense>` boundary requires its async data fetching to be done inside a dedicated async Server Component child, not in the parent. Nesting Suspense boundaries allows for progressive disclosure of content at different levels of detail.

---

## ISR / Data Cache

Incremental Static Regeneration (ISR) and data cache revalidation consume function invocations on revalidation. Calibrating revalidation frequency and using event-driven invalidation avoids unnecessary cache churn.

---

### ISR-01: Increase Revalidate Intervals

- **ID**: ISR-01
- **Versions**: Next.js 12+
- **Effort**: Low

**Description**: A short `revalidate` interval causes Next.js to re-execute the page function frequently even when the underlying data has not changed. Increasing the interval reduces unnecessary function invocations for data that changes infrequently.

**Before** — revalidates every 10 seconds; 6 function invocations per minute per cached path:

```tsx
// app/blog/page.tsx
export const revalidate = 10  // revalidate every 10 seconds

export default async function BlogListPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

**After** — revalidates hourly; reduces invocations by 99.7% for the same path:

```tsx
// app/blog/page.tsx
export const revalidate = 3600  // revalidate every hour

export default async function BlogListPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

Per-fetch revalidation (more granular control):

```tsx
// app/blog/page.tsx
export const dynamic = 'force-static'

async function getPosts() {
  const res = await fetch('https://cms.example.com/api/posts', {
    next: { revalidate: 3600 },  // revalidate this specific fetch hourly
  })
  return res.json()
}
```

**Notes**: Match the `revalidate` value to the actual update cadence of the data source. A blog updated twice per day does not need a 10-second TTL. Combine with ISR-02 (on-demand revalidation) to get fresh data on publish while keeping the interval high for background refreshes.

---

### ISR-02: Switch to On-Demand Revalidation

- **ID**: ISR-02
- **Versions**: Next.js 12.1+
- **Effort**: Medium

**Description**: Time-based revalidation refreshes cache entries on a schedule regardless of whether the content has changed. On-demand revalidation triggers only when data actually changes (e.g., a CMS publish event), eliminating all unnecessary revalidation invocations.

**Before** — time-based revalidation fires on schedule whether content changed or not:

```tsx
// app/blog/[slug]/page.tsx
export const revalidate = 300  // Revalidates every 5 minutes

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  return <PostContent post={post} />
}
```

**After** — tagged cache entry; only revalidated when CMS publishes:

```tsx
// app/blog/[slug]/page.tsx
// No revalidate export — page never revalidates unless triggered

import { unstable_cache } from 'next/cache'

const getPostBySlug = unstable_cache(
  async (slug: string) => {
    return fetchFromCMS(slug)
  },
  ['post'],
  { tags: ['posts', `post-${slug}`] }
)

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  return <PostContent post={post} />
}
```

Webhook Route Handler that receives CMS publish events and triggers revalidation:

```ts
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  // Validate the webhook signature from your CMS
  const signature = req.headers.get('x-cms-signature')
  if (!isValidSignature(signature, await req.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = await req.json()

  if (body.type === 'post.published') {
    // Revalidate just the changed post
    revalidateTag(`post-${body.slug}`)
    revalidatePath(`/blog/${body.slug}`)
  }

  if (body.type === 'category.updated') {
    // Revalidate all posts in a category
    revalidateTag('posts')
    revalidatePath('/blog')
  }

  return NextResponse.json({ revalidated: true })
}
```

For Next.js 15 with `'use cache'` and `cacheTag`:

```ts
// lib/posts.ts (Next.js 15)
import { cacheTag } from 'next/cache'

export async function getPostBySlug(slug: string) {
  'use cache'
  cacheTag('posts', `post-${slug}`)

  return fetchFromCMS(slug)
}
```

**Notes**: On-demand revalidation requires your content platform to support outgoing webhooks on publish events. Most headless CMS platforms (Contentful, Sanity, Payload, Strapi) support this. Store the webhook secret in an environment variable and always validate it before calling `revalidateTag` or `revalidatePath`.

---

*End of pattern catalog. For rule cross-references, see the `react-best-practices` skill documentation.*
