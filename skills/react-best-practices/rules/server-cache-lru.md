---
title: Cross-Request LRU Caching
impact: HIGH
impactDescription: caches across requests
tags: server, cache, lru, cross-request
---

## Cross-Request LRU Caching

`React.cache()` only works within one request. For data shared across sequential requests (user clicks button A then button B), use an LRU cache.

**Implementation:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Use when sequential user actions hit multiple endpoints needing the same data within seconds.

**With Vercel's [Fluid Compute](https://vercel.com/docs/fluid-compute):** LRU caching is especially effective because multiple concurrent requests can share the same function instance and cache. This means the cache persists across requests without needing external storage like Redis.

**In traditional serverless:** Each invocation runs in isolation, so an in-memory cache only helps while the same instance stays warm. For cross-process caching, back the LRU with a shared store that every instance reaches over HTTP.

**With a shared store:**

```typescript
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()  // UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

export async function getUser(id: string) {
  const local = cache.get(id)
  if (local) return local

  const shared = await redis.get<User>(`user:${id}`)
  if (shared) {
    cache.set(id, shared)
    return shared
  }

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  await redis.set(`user:${id}`, user, { ex: 300 })  // 5 minutes, matches the LRU ttl
  return user
}

// Instance A: DB query, result in LRU + shared store
// Instance B (cold): LRU miss, shared-store hit, no DB query
```

Key entries by the data's identity, give them a TTL (`ex`, seconds) so stale data expires without manual invalidation, and never put request- or session-scoped data under a shared key (see [Avoid Shared Module State for Request Data](./server-no-shared-module-state.md)). A REST client runs in both Node.js and Edge runtimes because it uses `fetch` rather than a TCP socket. Projects migrated from `@vercel/kv` keep their `KV_REST_API_URL` / `KV_REST_API_TOKEN` variables; `Redis.fromEnv()` reads those too.

Reference: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache), [https://vercel.com/docs/redis](https://vercel.com/docs/redis)
