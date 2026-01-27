---
title: Cache and Paginate Sitemaps
impact: MEDIUM
impactDescription: reduces DB load from crawler spikes
tags: server, sitemap, seo, caching, pagination
---

## Cache and Paginate Sitemaps

Sitemaps are requested by crawlers, monitors, and uptime checks. Generating them by scanning the entire database on every request wastes CPU/DB and can cause timeouts. Cache the response and page large sitemaps so each request does bounded work.

**Incorrect (full table scan on every request):**

```typescript
// app/sitemap.xml/route.ts
export async function GET() {
  const pages = await db.page.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  })

  const xml = buildSitemapXml(
    pages.map(page => ({
      loc: `https://example.com/${page.slug}`,
      lastmod: page.updatedAt.toISOString()
    }))
  )

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  })
}
```

**Correct (paged sitemap with cache headers):**

```typescript
// app/sitemap.xml/route.ts
const PAGE_SIZE = 10000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')

  const items = await db.page.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    select: { slug: true, updatedAt: true },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE
  })

  const xml = buildSitemapXml(
    items.map(item => ({
      loc: `https://example.com/${item.slug}`,
      lastmod: item.updatedAt.toISOString()
    }))
  )

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  })
}
```

**Also good (generateSitemaps with paging):**

```typescript
// app/sitemap.ts
const PAGE_SIZE = 10000

export async function generateSitemaps() {
  const total = await db.page.count({ where: { published: true } })
  const pageCount = Math.ceil(total / PAGE_SIZE)

  return Array.from({ length: pageCount }, (_, index) => ({
    page: index + 1
  }))
}

export default async function sitemap({ page }: { page: number }) {
  const items = await db.page.findMany({
    where: { published: true },
    orderBy: { updatedAt: 'desc' },
    select: { slug: true, updatedAt: true },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE
  })

  return items.map(item => ({
    url: `https://example.com/${item.slug}`,
    lastModified: item.updatedAt
  }))
}
```

**Also good (dynamic route + generateSitemaps):**

```typescript
// app/[site]/sitemap.ts
export async function generateSitemaps() {
  const sites = await db.site.findMany({
    where: { isActive: true },
    select: { slug: true }
  })

  return sites.map(site => ({
    site: site.slug
  }))
}

export default async function sitemap({ site }: { site: string }) {
  const items = await db.page.findMany({
    where: { published: true, siteSlug: site },
    select: { slug: true, updatedAt: true }
  })

  return items.map(item => ({
    url: `https://${site}.example.com/${item.slug}`,
    lastModified: item.updatedAt
  }))
}
```

If your sitemap data already exists behind an internal API (or a public endpoint you control), you can fetch it instead of querying the database directly. Just keep the same caching and pagination discipline to avoid moving the bottleneck from DB to API.

If you have multiple sitemap pages, expose a sitemap index that lists each page URL, and cache that index too. Prefer cursor-based pagination over deep offsets for very large tables.
