# Stack-Specific Advice

## Prisma

### Connection Pooling

**Problem:** Serverless functions open a new database connection on every invocation. Under load, this exhausts your database's connection limit and causes timeouts.

**Solution:** Use Prisma Accelerate (managed) or configure an external connection pooler like PgBouncer.

```env
# .env — append PgBouncer params to your DATABASE_URL
DATABASE_URL="postgresql://user:password@host:6543/db?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://user:password@host:5432/db"
```

```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // used for migrations only
}
```

**Impact:** Reduces Function Duration (fewer connection timeouts), prevents connection exhaustion at the database level.

---

### N+1 Prevention

**Problem:** Fetching a list of records and then looping to fetch each relation individually.

```ts
// Before — N+1 pattern: 1 query + N queries for relations
const posts = await prisma.post.findMany();
const postsWithAuthors = await Promise.all(
  posts.map((post) => prisma.user.findUnique({ where: { id: post.authorId } }))
);
```

**Solution:** Use `include` or `select` with nested relations to fetch everything in a single query.

```ts
// After — single query with relation included
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: { id: true, name: true, email: true },
    },
  },
});
```

**Impact:** Reduces Function Duration significantly — replaces N+1 round trips with a single database query.

---

### Prisma Accelerate

Prisma Accelerate provides managed connection pooling plus a global query cache, and enables edge-compatible database access.

```env
# .env
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=<your_key>"
DIRECT_URL="postgresql://user:password@host:5432/db"
```

```prisma
// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

```ts
// Optionally cache individual queries
const user = await prisma.user.findUnique({
  where: { id },
  cacheStrategy: { ttl: 60 }, // cache for 60 seconds
});
```

**Impact:** Reduces Function Duration, prevents connection exhaustion, and enables Edge Runtime for database-backed routes.

---

## Drizzle

### Prefer Joins Over Multiple Queries

**Problem:** Multiple sequential `db.select()` calls for related data add round-trip latency inside a single function invocation.

```ts
// Before — two separate queries
const post = await db.select().from(posts).where(eq(posts.id, postId));
const author = await db.select().from(users).where(eq(users.id, post[0].authorId));
```

**Solution:** Use Drizzle's relational query API or an explicit SQL join.

```ts
// After — single query with join
const result = await db
  .select({
    postId: posts.id,
    title: posts.title,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.id, postId));
```

**Impact:** Reduces Function Duration by eliminating sequential round trips to the database.

---

### Prepared Statements

Use `.prepare()` for queries that execute on every request to avoid repeated query planning overhead.

```ts
// Prepare once at module level (outside the handler)
const getUserById = db
  .select()
  .from(users)
  .where(eq(users.id, sql.placeholder("id")))
  .prepare("get_user_by_id");

// Execute inside the handler
export async function GET(req: Request) {
  const { id } = await getParams(req);
  const user = await getUserById.execute({ id });
  return Response.json(user);
}
```

**Impact:** Small reduction in Function Duration per invocation by skipping query planning on repeated executions.

---

## Supabase

### Use the Connection Pooler URL

**Problem:** The direct connection string (port 5432) does not pool connections in a serverless environment, exhausting Postgres connection limits under load.

**Solution:** Use the Supabase connection pooler URL (port 6543, PgBouncer) in your `DATABASE_URL`.

```env
# Direct connection — avoid in serverless
DATABASE_URL="postgresql://postgres:[password]@db.<ref>.supabase.co:5432/postgres"

# Pooler connection — use this in serverless functions
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Keep the direct URL for Prisma migrations
DIRECT_URL="postgresql://postgres:[password]@db.<ref>.supabase.co:5432/postgres"
```

**Impact:** Reduces Function Duration, prevents connection exhaustion, and improves reliability under concurrent traffic.

---

### RLS Overhead

Row Level Security (RLS) adds a policy evaluation step to every query. For public or non-sensitive data served from high-traffic routes, this overhead adds up.

**Options:**

1. Use the `service_role` key with caution — it bypasses RLS entirely. Only use in server-side code where the data is genuinely public and the key is never exposed to the client.

2. Create a database view that pre-filters data, removing the need for RLS on the hot path:

```sql
-- Create a view for public post data (no RLS needed)
CREATE VIEW public_posts AS
  SELECT id, title, excerpt, published_at, author_name
  FROM posts
  WHERE published = true;

GRANT SELECT ON public_posts TO anon;
```

```ts
// Query the view instead of the base table
const { data } = await supabase.from("public_posts").select("*");
```

**Impact:** Reduces Function Duration on read-heavy public routes by eliminating per-row policy evaluation.

---

## tRPC

### Enable Request Batching

**Problem:** Multiple tRPC calls initiated by a client component fire as separate HTTP requests, each triggering a separate function invocation.

**Solution:** Ensure `httpBatchLink` is configured in your tRPC client. This is the default in most starter setups, but verify it is not accidentally replaced with `httpLink`.

```ts
// src/trpc/client.ts
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/api/root";

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const client = trpc.createClient({
    links: [
      httpBatchLink({
        url: "/api/trpc",
        // Multiple queries from the same render cycle are batched into one request
      }),
    ],
  });
  // ...
}
```

**Impact:** Reduces Function Invocations — N simultaneous client queries become 1 batched HTTP request and 1 function invocation.

---

### Use Server-Side Callers

**Problem:** React Server Components or Route Handlers that call their own tRPC API over HTTP create a self-referencing network request, wasting a full round trip and spawning an additional function invocation.

```ts
// Before — RSC calling its own API over HTTP (unnecessary network round trip)
export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/trpc/post.list`);
  const data = await res.json();
  // ...
}
```

**Solution:** Use `createCallerFactory` to call tRPC procedures directly on the server, bypassing HTTP entirely.

```ts
// src/server/api/caller.ts
import { createCallerFactory } from "@trpc/server";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

const createCaller = createCallerFactory(appRouter);

export async function getServerCaller() {
  const ctx = await createTRPCContext({ headers: new Headers() });
  return createCaller(ctx);
}
```

```ts
// app/posts/page.tsx — After: direct server call, no HTTP
import { getServerCaller } from "@/server/api/caller";

export default async function PostsPage() {
  const caller = await getServerCaller();
  const posts = await caller.post.list(); // called directly, no network hop
  return <PostList posts={posts} />;
}
```

**Impact:** Eliminates unnecessary Function Invocations from self-referencing HTTP calls and reduces Function Duration by removing network latency.

---

### Limit Batch Size

**Problem:** If batching is enabled without a size limit, a component tree with many queries can produce a single enormous batched request that causes the function to time out.

**Solution:** Configure `maxBatchSize` in the batch link to cap how many procedures are combined per request.

```ts
import { httpBatchLink } from "@trpc/client";

httpBatchLink({
  url: "/api/trpc",
  maxBatchSize: 10, // split into multiple requests if more than 10 queries batch together
});
```

**Impact:** Prevents Function Duration spikes and timeouts caused by oversized batched payloads.
