import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dedupeRecommendations,
  dedupEditTarget,
  dedupIntent,
  fixShape,
  normalizePath,
  primarySkillRule,
  recommendationKey,
} from '../../../skills/vercel-optimize/lib/dedup-recs.mjs';

const baseRec = {
  what: 'Parallelize product data fetches.',
  why: 'src/app/product/page.tsx waits on data fetches sequentially.',
  fix: '1. Start `getProduct()` and `getReviews()` before awaiting either.\n2. Await them with `Promise.all`.',
  bucket: 'performance',
  effort: 'low',
  impactTier: 'high',
  affectedFiles: ['src/app/product/page.tsx'],
  candidateRef: 'slow_route:/product',
  o11ySignal: 'inv=10000,p95=1200ms',
  citations: ['vercel-react-best-practices:async-parallel', 'https://nextjs.org/docs/app/building-your-application/data-fetching'],
  quality: { overall: 0.8 },
  priority: 100,
};

test('normalizePath: strips local prefix, duplicate slashes, backslashes, and line suffix', () => {
  assert.equal(normalizePath('./src\\app//product/page.tsx:42'), 'src/app/product/page.tsx');
});

test('primarySkillRule: picks the first skill-rule citation', () => {
  assert.equal(primarySkillRule(baseRec), 'vercel-react-best-practices:async-parallel');
});

test('fixShape: normalizes code and numeric noise into a stable shape', () => {
  const a = fixShape({ fix: '1. Await `getA(123)` with Promise.all.\n```ts\nconst x = 1\n```' });
  const b = fixShape({ fix: '2. Await `getB(456)` with Promise.all.\n```ts\nconst y = 2\n```' });
  assert.equal(a, b);
});

test('recommendationKey: same bucket, file, rule, and fix shape produce the same key', () => {
  const duplicate = {
    ...baseRec,
    affectedFiles: ['./src/app/product/page.tsx:88'],
    candidateRef: 'slow_route:/product/[id]',
    o11ySignal: 'inv=9000,p95=1100ms',
    what: 'Parallelize product fetch work.',
  };
  assert.equal(recommendationKey(baseRec), recommendationKey(duplicate));
});

test('dedupeRecommendations: folds duplicate recs and records appliesAlsoTo', () => {
  const duplicate = {
    ...baseRec,
    candidateRef: 'slow_route:/product/[id]',
    affectedFiles: ['./src/app/product/page.tsx:88'],
    o11ySignal: 'inv=9000,p95=1100ms',
    priority: 90,
  };
  const out = dedupeRecommendations([baseRec, duplicate]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/product');
  assert.equal(out[0].corroborationCount, 2);
  assert.deepEqual(out[0].appliesAlsoTo, [{
    candidateRef: 'slow_route:/product/[id]',
    affectedFiles: ['src/app/product/page.tsx'],
    o11ySignal: 'inv=9000,p95=1100ms',
    what: 'Parallelize product data fetches.',
  }]);
});

test('dedupeRecommendations: folds duplicates when the edit target is a shared helper', () => {
  const routeVariant = {
    ...baseRec,
    affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'],
    candidateRef: 'slow_route:/event/london',
    fix: 'Parallelize the 3 Payload reads in `packages/content-kit/components/pages/homepage/content.ts` with `Promise.all`.',
    why: '`packages/content-kit/components/pages/homepage/content.ts` performs the same sequential reads for this route.',
    priority: 90,
  };
  const canonicalRoute = {
    ...routeVariant,
    affectedFiles: ['packages/content-kit/components/pages/homepage/content.ts'],
    candidateRef: 'slow_route:/event/[code]/[location]',
    priority: 100,
  };

  assert.equal(recommendationKey(routeVariant), recommendationKey(canonicalRoute));
  const out = dedupeRecommendations([routeVariant, canonicalRoute]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/event/[code]/[location]');
  assert.equal(out[0].corroborationCount, 2);
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'slow_route:/event/london');
});

test('dedupeRecommendations: folds shared helper fixes even when one rec points at the caller', () => {
  const dynamicRoute = {
    ...baseRec,
    affectedFiles: ['packages/content-kit/components/pages/homepage/content.ts'],
    candidateRef: 'slow_route:/event/[code]/[location]',
    what: 'Parallelize the 3 sequential Payload reads inside getHomepageContent.',
    fix: 'In content.ts, issue the banner, event, and homepage reads with Promise.all inside getHomepageContent.',
    priority: 100,
  };
  const staticRoute = {
    ...baseRec,
    affectedFiles: ['packages/content-kit/components/pages/homepage/homepage.tsx'],
    candidateRef: 'slow_route:/event/nyc',
    what: 'Parallelize the 3 sequential Payload reads behind getHomepageContent for the location homepage path.',
    fix: 'Open packages/content-kit/components/pages/homepage/homepage.tsx, follow the getHomepageContent import, and parallelize the banner, event, and homepage reads there.',
    priority: 90,
  };

  assert.equal(dedupEditTarget(dynamicRoute), 'function:getHomepageContent');
  assert.equal(dedupEditTarget(staticRoute), 'function:getHomepageContent');
  assert.equal(recommendationKey(dynamicRoute), recommendationKey(staticRoute));
  const out = dedupeRecommendations([dynamicRoute, staticRoute]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/event/[code]/[location]');
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'slow_route:/event/nyc');
});

test('dedupeRecommendations: folds Suspense boundary recs for the same async helper', () => {
  const firstFlagVariant = {
    ...baseRec,
    what: 'Stream the related-guides footer via Suspense so getGuidesByProduct no longer blocks article TTFB.',
    fix: 'Extract `GuideFooter` into an async Server Component that calls `getGuidesByProduct` internally; wrap it in Suspense.',
    affectedFiles: [
      'apps/docs-app/app/[rootFlagsCode]/kb/guide/[...segments]/page.tsx',
      'apps/docs-app/app/[rootFlagsCode]/kb/guide/[...segments]/components/kb-guide-content-section.tsx',
    ],
    citations: [
      'vercel-react-best-practices:async-suspense-boundaries',
      'vercel-react-best-practices:server-parallel-fetching',
    ],
    candidateRef: 'slow_route:/[rootFlagsCode]/kb/guide/[...segments]',
    priority: 100,
  };
  const secondFlagVariant = {
    ...firstFlagVariant,
    what: 'Stream the related-guides footer via Suspense on /flg.../kb/guide/[...segments].',
    fix: 'Extract `RelatedGuidesFooter` into an async Server Component that accepts productId and calls `getGuidesByProduct`; wrap it in Suspense.',
    candidateRef: 'slow_route:/flg.../kb/guide/[...segments]',
    priority: 90,
  };

  assert.equal(dedupEditTarget(firstFlagVariant), 'function:getGuidesByProduct');
  assert.equal(dedupEditTarget(secondFlagVariant), 'function:getGuidesByProduct');
  assert.equal(recommendationKey(firstFlagVariant), recommendationKey(secondFlagVariant));
  const out = dedupeRecommendations([firstFlagVariant, secondFlagVariant]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/[rootFlagsCode]/kb/guide/[...segments]');
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'slow_route:/flg.../kb/guide/[...segments]');
});

test('dedupeRecommendations: keeps distinct fix shapes separate', () => {
  const other = {
    ...baseRec,
    fix: '1. Add Cache-Control with s-maxage=300.\n2. Verify cache_result=HIT.',
    citations: ['vercel-react-best-practices:cache-control'],
    candidateRef: 'uncached_route:/product',
  };
  const out = dedupeRecommendations([baseRec, other]);
  assert.equal(out.length, 2);
});

test('dedupeRecommendations: folds narrower s-maxage cache-header recs for the same file', () => {
  const broad = {
    ...baseRec,
    what: 'Add Cache-Control with s-maxage to every response branch.',
    fix: 'Create a shared headers object with Cache-Control: public, s-maxage=3600 and use it for every Response.',
    affectedFiles: ['src/app/docs/route.ts'],
    candidateRef: 'uncached_route:/docs',
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
    priority: 100,
  };
  const narrow = {
    ...baseRec,
    what: 'Set s-maxage Cache-Control on markdown responses.',
    fix: 'Add Cache-Control: public, s-maxage=3600 to the markdown Response branch.',
    affectedFiles: ['src/app/docs/route.ts'],
    candidateRef: 'cache_header_gap:/docs',
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
    priority: 50,
  };
  assert.equal(dedupIntent(broad), 'cache-control:s-maxage');
  assert.equal(dedupIntent(narrow), 'cache-control:s-maxage');

  const out = dedupeRecommendations([broad, narrow]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'uncached_route:/docs');
  assert.equal(out[0].corroborationCount, 2);
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'cache_header_gap:/docs');
});

test('dedupeRecommendations: folds same-file s-maxage recs across buckets', () => {
  const performanceRec = {
    ...baseRec,
    bucket: 'performance',
    what: 'Add Cache-Control with s-maxage to /docs markdown responses.',
    fix: 'Set Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400.',
    affectedFiles: ['src/app/docs/route.ts'],
    candidateRef: 'uncached_route:/docs',
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
    priority: 100,
  };
  const costRec = {
    ...performanceRec,
    bucket: 'cost',
    what: 'Set s-maxage Cache-Control on the same docs route handler.',
    candidateRef: 'cache_header_gap:/docs',
    priority: 90,
  };

  assert.equal(recommendationKey(performanceRec), recommendationKey(costRec));
  const out = dedupeRecommendations([performanceRec, costRec]);
  assert.equal(out.length, 1);
  assert.equal(out[0].corroborationCount, 2);
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'cache_header_gap:/docs');
});

test('dedupeRecommendations: folds same-file cacheLife ISR recs across route variants', () => {
  const london = {
    ...baseRec,
    what: 'Add cacheLife to the event homepage cached function.',
    fix: "Call `cacheLife('hours')` inside `getHomepageContent`.",
    affectedFiles: ['packages/content-kit/components/pages/homepage/content.ts'],
    candidateRef: 'isr_overrevalidation:/event/[*]/london',
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
    priority: 100,
  };
  const sf = {
    ...london,
    candidateRef: 'isr_overrevalidation:/event/[*]/sf',
    what: 'Use cacheLife for the same event homepage cached function.',
    priority: 90,
  };

  assert.equal(dedupIntent(london), 'next-cache:cache-life:hours:<none>:no-invalidation-api');
  assert.equal(recommendationKey(london), recommendationKey(sf));
  const out = dedupeRecommendations([london, sf]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'isr_overrevalidation:/event/[*]/london');
  assert.equal(out[0].corroborationCount, 2);
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'isr_overrevalidation:/event/[*]/sf');
});

test('dedupeRecommendations: keeps cacheLife recs separate when profiles differ', () => {
  const maxProfile = {
    ...baseRec,
    what: 'Add cacheLife to the event homepage cached function.',
    fix: "Call `cacheLife('max')` inside `getHomepageContent`.",
    affectedFiles: ['packages/content-kit/components/pages/homepage/content.ts'],
    candidateRef: 'isr_overrevalidation:/event/[*]/london',
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
    priority: 100,
  };
  const hoursProfile = {
    ...maxProfile,
    fix: "Call `cacheLife('hours')` inside `getHomepageContent`.",
    candidateRef: 'isr_overrevalidation:/event/[*]/berlin',
    priority: 90,
  };

  assert.notEqual(recommendationKey(maxProfile), recommendationKey(hoursProfile));
  const out = dedupeRecommendations([maxProfile, hoursProfile]);
  assert.equal(out.length, 2);
});

test('dedupeRecommendations: keeps the higher-priority duplicate as winner', () => {
  const higher = {
    ...baseRec,
    candidateRef: 'slow_route:/product/high-volume',
    priority: 200,
  };
  const out = dedupeRecommendations([baseRec, higher]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/product/high-volume');
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'slow_route:/product');
});

test('dedupeRecommendations: keeps the higher metric-impact duplicate when priority is absent', () => {
  const broad = {
    ...baseRec,
    priority: undefined,
    quality: { overall: 0.7 },
    o11ySignal: null,
    candidateRef: 'slow_route:/event/[code]/[location]',
    what: 'Parallelize the 3 sequential Payload reads inside getHomepageContent.',
    why: 'Observed function invocations: 62,611; 95th percentile duration: 5316ms.',
  };
  const narrower = {
    ...broad,
    quality: { overall: 0.9 },
    candidateRef: 'slow_route:/event/nyc',
    what: 'Parallelize the same getHomepageContent work.',
    why: 'Observed function invocations: 12,856; 95th percentile duration: 3136ms.',
  };

  const out = dedupeRecommendations([narrower, broad]);
  assert.equal(out.length, 1);
  assert.equal(out[0].candidateRef, 'slow_route:/event/[code]/[location]');
  assert.equal(out[0].appliesAlsoTo[0].candidateRef, 'slow_route:/event/nyc');
});
