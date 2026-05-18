import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { gradeRecommendation, applyQualityFloor } from '../../../skills/vercel-optimize/lib/grade-recommendation.mjs';
import { extractClaims, summarizeClaimResults } from '../../../skills/vercel-optimize/lib/extract-claims.mjs';
import { verifyClaim } from '../../../skills/vercel-optimize/lib/verify-claim.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize');

test('grade: an exemplary rec scores Good-or-better (>=0.70) under the May-2026 weighted rubric', () => {
  // May 2026 weights: grounding 0.35, evidence 0.30, specificity 0.20,
  // actionability 0.15. Excellent (>=0.85) needs near-max grounding AND evidence.
  const rec = {
    what: 'Add Cache-Control with s-maxage to /api/products.',
    why: 'src/app/api/products/route.ts:22 returns Response without Cache-Control; o11y shows 0% cache hit on 1.2M invocations/mo (p95=850ms, ttfb=576ms).',
    fix: '1. Replace the bare `return Response.json(...)` on line 22 with a `NextResponse.json(...)`.\n2. Set headers `Cache-Control: s-maxage=300, stale-while-revalidate=86400`.\n3. Verify cache_result=HIT on next deploy.',
    affectedFiles: ['src/app/api/products/route.ts'],
    findingRefs: ['src/app/api/products/route.ts:22'],
    currentBehavior: '```ts\nreturn Response.json(products);\n```',
    desiredBehavior: "```ts\nreturn NextResponse.json(products, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=86400' } });\n```",
    candidateRef: 'uncached_route:/api/products',
    verify: 'Re-run `vercel metrics vercel.request.count -d cache_result -f "route eq /api/products"` and watch cache HIT % rise from 0% toward 60-80%.',
  };
  const q = gradeRecommendation(rec, {
    knownFindings: [{ file: 'src/app/api/products/route.ts', line: 22 }],
  });
  assert.ok(q.overall >= 0.70, `expected >=0.70 (Good), got ${q.overall}`);
  assert.ok(['Good', 'Excellent'].includes(q.grade), `expected Good or Excellent, got ${q.grade}`);
});

test('grade: a hedge-filled rec without specifics scores Poor', () => {
  const rec = {
    what: 'Consider caching.',
    why: 'The route might be slow.',
    fix: 'Consider adding caching.',
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
  };
  const q = gradeRecommendation(rec);
  assert.ok(q.overall < 0.55, `expected <0.55, got ${q.overall}`);
  assert.equal(q.grade, 'Poor');
});

test('grade: hedge-words penalize actionability', () => {
  const withHedges = gradeRecommendation({ fix: 'Consider maybe adding caching; this might help.' });
  const without = gradeRecommendation({ fix: 'Add `Cache-Control: s-maxage=300` to the response.' });
  assert.ok(without.actionability > withHedges.actionability, `expected hedge-free > hedged: ${without.actionability} vs ${withHedges.actionability}`);
});

test('grade: file:line evidence boosts evidence axis', () => {
  const withEvidence = gradeRecommendation({
    why: 'src/x.ts:22 returns no cache header; o11y shows 0% hit on 1.2M invocations.',
  });
  const without = gradeRecommendation({
    why: 'The route returns no cache header.',
  });
  assert.ok(withEvidence.evidence > without.evidence, `expected ${withEvidence.evidence} > ${without.evidence}`);
});

test('grade: findingRefs matching knownFindings maxes grounding', () => {
  const rec = {
    findingRefs: ['src/x.ts:22'],
    affectedFiles: ['src/x.ts'],
    currentBehavior: '```ts\nreturn Response.json(x);\n```',
    desiredBehavior: '```ts\nreturn Response.json(x, { headers });\n```',
    candidateRef: 'uncached_route:/x',
  };
  const matched = gradeRecommendation(rec, { knownFindings: [{ file: 'src/x.ts', line: 22 }] });
  const unmatched = gradeRecommendation(rec, { knownFindings: [{ file: 'src/y.ts', line: 5 }] });
  assert.ok(matched.grounding > unmatched.grounding);
});

test('applyQualityFloor: drops below floor, keeps above', () => {
  const recs = [
    { id: 'good', quality: { overall: 0.9 } },
    { id: 'bad', quality: { overall: 0.3 } },
    { id: 'borderline', quality: { overall: 0.4 } },
  ];
  const { kept, dropped } = applyQualityFloor(recs, 0.4);
  assert.equal(kept.length, 2, 'good + borderline (>=) kept');
  assert.equal(dropped.length, 1);
  assert.equal(dropped[0].rec.id, 'bad');
});

test('extractClaims: emits citation_in_library for every URL citation', () => {
  const rec = {
    citations: [
      'https://vercel.com/docs/caching/cdn-cache',
      'vercel-react-best-practices:async-parallel',
    ],
  };
  const claims = extractClaims(rec, { framework: 'next', version: '15.4.10' });
  const citeClaims = claims.filter((c) => c.type === 'citation_in_library');
  assert.equal(citeClaims.length, 2);
});

test('extractClaims: only emits citation_applies_to_version for URLs (not skill-rule refs)', () => {
  const rec = {
    citations: [
      'https://vercel.com/docs/caching/cdn-cache',
      'vercel-react-best-practices:async-parallel',
    ],
  };
  const claims = extractClaims(rec, { framework: 'next', version: '15.4.10' });
  const versionClaims = claims.filter((c) => c.type === 'citation_applies_to_version');
  assert.equal(versionClaims.length, 1);
  assert.equal(versionClaims[0].url, 'https://vercel.com/docs/caching/cdn-cache');
});

test('extractClaims: emits file_exists for affectedFiles + unique findingRefs', () => {
  const rec = {
    affectedFiles: ['src/a.ts', 'src/b.ts'],
    findingRefs: ['src/a.ts:10', 'src/c.ts:5'],
  };
  const claims = extractClaims(rec);
  const fileClaims = claims.filter((c) => c.type === 'file_exists');
  const files = fileClaims.map((c) => c.file).sort();
  assert.deepEqual(files, ['src/a.ts', 'src/b.ts', 'src/c.ts']);
});

test('extractClaims: passes through verifiableClaims provided by recommender', () => {
  const rec = {
    verifiableClaims: [
      { type: 'pattern_count', file: 'src/x.ts', pattern: 'fetch\\(', expected: 3 },
    ],
  };
  const claims = extractClaims(rec, { repoRoot: '/repo' });
  const pc = claims.find((c) => c.type === 'pattern_count');
  assert.ok(pc);
  assert.equal(pc.expected, 3);
  assert.equal(pc.repoRoot, '/repo');
});

test('summarizeClaimResults: passRate excludes unsupported + unverifiable', () => {
  const r = summarizeClaimResults([
    { disposition: 'verified' },
    { disposition: 'verified' },
    { disposition: 'failed' },
    { disposition: 'unsupported' },
    { disposition: 'unverifiable' },
  ]);
  assert.equal(r.verifiable, 3);
  assert.equal(r.passRate, 2 / 3);
});

test('grade: abstention recs should NOT be scored like regular recs', () => {
  // Abstentions are valid outputs (`{abstain:true, candidateRef, reason}`).
  // If scored as recs they hit ~0.035 → silently dropped at floor. The
  // orchestrator must never pass them to gradeRecommendation. This test pins
  // that contract by confirming the grader would Poor them if called.
  const abstainRec = {
    abstain: true,
    candidateRef: 'uncached_route:/api/x',
    reason: 'POST-heavy route, not a real cache miss',
  };
  const q = gradeRecommendation(abstainRec);
  assert.ok(q.overall < 0.55, 'abstain recs grade as Poor when scored — the orchestrator must NOT pass them to gradeRecommendation');
});

test('verifyClaim: file_exists succeeds for an existing path', async () => {
  const r = await verifyClaim({
    type: 'file_exists',
    file: 'lib/grade-recommendation.mjs',
    repoRoot: SKILL_ROOT,
  });
  assert.equal(r.disposition, 'verified');
});

test('verifyClaim: file_exists accepts absolute paths', async () => {
  const r = await verifyClaim({
    type: 'file_exists',
    file: fileURLToPath(new URL('../../../skills/vercel-optimize/lib/grade-recommendation.mjs', import.meta.url)),
    repoRoot: '/not-used-for-absolute-paths',
  });
  assert.equal(r.disposition, 'verified');
});

test('verifyClaim: file_exists accepts app-root-relative paths when project rootDirectory is known', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-root-'));
  await mkdir(join(repoRoot, 'apps/site/app/api/products'), { recursive: true });
  await writeFile(join(repoRoot, 'apps/site/app/api/products/route.ts'), 'export function GET() {}\n');

  const r = await verifyClaim({
    type: 'file_exists',
    file: 'app/api/products/route.ts',
    repoRoot,
    projectRootDirectory: 'apps/site',
  });
  assert.equal(r.disposition, 'verified');
});

test('verifyClaim: file_exists fails for a missing path', async () => {
  const r = await verifyClaim({
    type: 'file_exists',
    file: 'lib/this-does-not-exist.mjs',
    repoRoot: SKILL_ROOT,
  });
  assert.equal(r.disposition, 'failed');
});

test('extractClaims + verifyClaim: CDN cache recs using Vercel geolocation must vary by X-Vercel-IP-Country', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-geo-'));
  await mkdir(join(repoRoot, 'apps/site/app/api/banner'), { recursive: true });
  await writeFile(
    join(repoRoot, 'apps/site/app/api/banner/route.ts'),
    "import { geolocation } from '@vercel/functions';\nexport function GET(req) { return Response.json({ country: geolocation(req).country }); }\n"
  );

  const baseRec = {
    what: 'Add s-maxage Cache-Control to /api/banner.',
    fix: "Return `Cache-Control: public, s-maxage=3600` and `Vary: accept-language`.",
    affectedFiles: ['app/api/banner/route.ts'],
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
  };
  const claims = extractClaims(baseRec, {
    repoRoot,
    projectRootDirectory: 'apps/site',
    framework: 'next',
    version: '16.3.0-canary.11',
  });
  const cacheClaim = claims.find((c) => c.type === 'cache_vary_matches_dynamic_inputs');
  assert.ok(cacheClaim);

  const failed = await verifyClaim(cacheClaim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /X-Vercel-IP-Country/);

  const fixed = await verifyClaim({
    ...cacheClaim,
    rec: {
      ...baseRec,
      fix: "Return `Cache-Control: public, s-maxage=3600` and `Vary: X-Vercel-IP-Country, accept-language`.",
    },
  });
  assert.equal(fixed.disposition, 'verified');
});

test('extractClaims + verifyClaim: geolocation Vary proof must be an actual Vary header value', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-geo-prose-'));
  await mkdir(join(repoRoot, 'app/api/banner'), { recursive: true });
  await writeFile(
    join(repoRoot, 'app/api/banner/route.ts'),
    "import { geolocation } from '@vercel/functions';\nexport function GET(req) { return Response.json({ country: geolocation(req).country }); }\n"
  );

  const rec = {
    candidateRef: 'uncached_route:/api/banner',
    what: 'Cache the banner with s-maxage and Vary on geo plus accept-language.',
    fix: "Set `Cache-Control: public, s-maxage=3600` and `Vary: accept-language`. Vercel CDN already segments by geo for x-vercel-ip-country.",
    affectedFiles: ['app/api/banner/route.ts'],
  };
  const claim = extractClaims(rec, { repoRoot })
    .find((c) => c.type === 'cache_vary_matches_dynamic_inputs');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /X-Vercel-IP-Country/);
});

test('extractClaims + verifyClaim: cache header values cannot contain empty directives', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/api/docs-og',
    what: 'Add CDN cache headers.',
    fix: "Return `Cache-Control: public, max-age=0, ` and `CDN-Cache-Control: public, s-maxage=86400`.",
    affectedFiles: ['app/api/docs-og/route.tsx'],
  };
  const claim = extractClaims(rec).find((c) => c.type === 'cache_control_header_syntax');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /empty directive/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "Return `Cache-Control: public, max-age=0, must-revalidate` and `CDN-Cache-Control: public, s-maxage=86400`.",
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: cache header changes need Vercel cache docs citation', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/docs/md/[...slug]',
    what: 'Extend Cache-Control for the markdown route.',
    fix: "Set `Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800`.",
    affectedFiles: ['app/docs/md/[...slug]/route.ts'],
    citations: ['https://vercel.com/docs/functions/debug-slow-functions'],
  };
  const claim = extractClaims(rec).find((c) => c.type === 'cache_control_headers_citation');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /Vercel cache documentation/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      citations: ['https://vercel.com/docs/caching/cache-control-headers'],
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: long shared caching for 404 branches needs explicit safety', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/docs/messages/llm-digest/[slug]',
    what: 'Add CDN cache headers to the digest route.',
    fix: 'Add `CDN-Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` to both Response objects, including the not-found branch.',
    affectedFiles: ['app/docs/messages/llm-digest/[slug]/route.ts'],
  };
  const claim = extractClaims(rec).find((c) => c.type === 'cache_404_long_ttl_safety');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /404/);

  const allResponses = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "Add `Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` to each of the four Response header blocks (sitemap, index, not-found, and the main branch).",
    },
  });
  assert.equal(allResponses.disposition, 'failed');
  assert.match(allResponses.reason, /not-found/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Add `CDN-Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800` only on the successful response; keep the not-found branch uncached.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: cached notFound 5xx claims need Next-specific support', async () => {
  const rec = {
    candidateRef: 'route_errors:/docs/messages/dynamic-server-error',
    what: "Move notFound() calls out of the 'use cache' scope to stop 500s.",
    why: "The file declares 'use cache' and calls notFound(); notFound() inside a cached function surfaces as 500.",
    affectedFiles: ['app/docs/messages/[slug]/page.tsx'],
    citations: ['https://vercel.com/docs/functions/serverless-functions'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_cached_not_found_causal_support');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /Next-specific citation or runtime stack/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      citations: [
        'https://nextjs.org/docs/app/api-reference/functions/not-found',
        'https://nextjs.org/docs/app/api-reference/directives/use-cache',
      ],
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Next 16 cache API examples must use stable names', async () => {
  const rec = {
    candidateRef: 'isr_overrevalidation:/docs',
    what: 'Add cacheLife and cacheTag.',
    fix: "import { unstable_cacheLife, unstable_cacheTag, revalidateTag } from 'next/cache';\ncacheLife('weeks');\ncacheTag('docs');\nrevalidateTag('docs');",
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_stable_cache_api_for_version');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /unstable cache API/);

  const badRevalidate = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "import { cacheLife, cacheTag, revalidateTag } from 'next/cache';\ncacheLife('weeks');\ncacheTag('docs');\nrevalidateTag('docs');",
    },
  });
  assert.equal(badRevalidate.disposition, 'failed');
  assert.match(badRevalidate.reason, /profile argument/);

  const fixed = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "import { cacheLife, cacheTag, revalidateTag } from 'next/cache';\ncacheLife('weeks');\ncacheTag('docs');\nrevalidateTag('docs', 'max');",
    },
  });
  assert.equal(fixed.disposition, 'verified');
});

test('extractClaims + verifyClaim: Next 16 cache API checks apply outside ISR candidates', async () => {
  const rec = {
    candidateRef: 'uncached_route:/docs/app/building-your-application/routing/loading-ui-and-streaming',
    what: 'Add cacheLife to the docs page.',
    fix: "import { unstable_cacheLife } from 'next/cache';\ncacheLife('days');",
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_stable_cache_api_for_version');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /unstable cache API/);
});

test('extractClaims + verifyClaim: Next 16 Runtime Cache recs must not use unstable_cache', async () => {
  const rec = {
    candidateRef: 'slow_route:/login',
    what: 'Use Vercel Runtime Cache for login CMS globals.',
    fix: "import { unstable_cache as runtimeCache } from 'next/cache';\nconst getLogin = runtimeCache(async () => getGlobal(), ['login-page']);",
    citations: ['https://vercel.com/docs/caching/runtime-cache'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_runtime_cache_api_for_version');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /use cache: remote/);

  const next15 = await verifyClaim({ ...claim, frameworkVersion: '15.4.10' });
  assert.equal(next15.disposition, 'verified');
});

test('extractClaims + verifyClaim: Next 16 cacheLife should appear once per recommended code path', async () => {
  const rec = {
    candidateRef: 'isr_overrevalidation:/event/[code]/[location]',
    what: 'Add cacheLife to the cached homepage function.',
    fix: "cacheTag('banner');\ncacheLife('hours');\ncacheTag(`event-homepage-${location}`);\ncacheLife('hours');",
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_cache_life_single_execution');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /multiple cacheLife/);

  const branched = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "if (isBreakingNews) {\n  cacheLife('minutes');\n} else {\n  cacheLife('days');\n}",
    },
  });
  assert.equal(branched.disposition, 'verified');
});

test('extractClaims + verifyClaim: cacheLife recs must not claim CDN headers without evidence', async () => {
  const rec = {
    candidateRef: 'uncached_route:/docs/app/images',
    what: "Add cacheLife() so the 'use cache' segment emits CDN cache headers.",
    why: "The page declares 'use cache' but never calls cacheLife(), so the function still runs per request.",
    fix: "import { cacheLife } from 'next/cache';\ncacheLife('hours');",
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_cache_life_cdn_header_semantics');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /defaults to the default profile/);
  assert.match(failed.reason, /production header evidence/);
});

test('extractClaims + verifyClaim: ImageResponse header fixes need ImageResponse API citation', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/api/docs-og',
    what: 'Add Cache-Control headers to the ImageResponse.',
    fix: "return new ImageResponse(<Card />, { headers: { 'Cache-Control': 'public, s-maxage=3600' } });",
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.2.2' })
    .find((c) => c.type === 'image_response_headers_citation');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /ImageResponse API reference/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      citations: [
        'https://vercel.com/docs/caching/cdn-cache',
        'https://nextjs.org/docs/app/api-reference/functions/image-response',
      ],
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Cache Components blocks removed route segment config recs', async () => {
  const rec = {
    candidateRef: 'uncached_route:/docs/[[...slug]]',
    what: 'Set dynamicParams=false on the docs catch-all route.',
    fix: 'export const dynamicParams = false;',
  };
  const claim = extractClaims(rec, {
    framework: 'next',
    version: '16.3.0-canary.11',
    cacheComponents: true,
  }).find((c) => c.type === 'next_cache_components_route_segment_config');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /Cache Components/);

  const withoutCacheComponents = await verifyClaim({ ...claim, cacheComponents: false });
  assert.equal(withoutCacheComponents.disposition, 'verified');
});

test('extractClaims + verifyClaim: Cache Components rejects overbroad Route Handler segment-config claims', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/docs/[version]/llms.txt',
    what: 'Add Cache-Control headers.',
    fix: 'Do not add a revalidate route segment export because route segment config options for Route Handlers no longer apply.',
  };
  const claim = extractClaims(rec, {
    framework: 'next',
    version: '16.3.0-canary.11',
    cacheComponents: true,
  }).find((c) => c.type === 'next_cache_components_route_segment_config');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /Route Segment Config still has Route Handler options/);
});

test('extractClaims + verifyClaim: cacheTag invalidation claims need matching revalidateTag/updateTag evidence', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-tags-'));
  await mkdir(join(repoRoot, 'apps/site'), { recursive: true });
  await writeFile(
    join(repoRoot, 'apps/site/cache.ts'),
    "cacheTag('sponsors');\ncacheTag(`event-homepage-${location}`);\n"
  );
  await writeFile(
    join(repoRoot, 'apps/site/revalidate.ts'),
    "import { revalidateTag } from 'next/cache';\nexport function invalidate(config) { for (const tag of config.tags) revalidateTag(tag, { expire: 0 }); }\n"
  );
  await writeFile(
    join(repoRoot, 'apps/site/payload.config.ts'),
    "export const config = { collections: { sponsors: { tags: ['sponsors'] }, homepages: { tags: ['location-homepage'] } } };\n"
  );

  const rec = {
    candidateRef: 'isr_overrevalidation:/event/[code]/[location]',
    what: 'Add cacheLife.',
    fix: "Keep existing invalidation via `revalidateTag`: cacheTag('sponsors'); cacheTag(`event-homepage-${location}`); cacheLife('max');",
  };
  const claim = extractClaims(rec, {
    repoRoot,
    projectRootDirectory: 'apps/site',
    framework: 'next',
    version: '16.3.0-canary.11',
  }).find((c) => c.type === 'next_cache_tag_invalidation_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /event-homepage/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "Keep existing invalidation via `revalidateTag`: cacheTag('sponsors'); cacheLife('max');",
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: cacheTag invalidation scan stays inside the Vercel project root', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-cachetag-root-'));
  await mkdir(join(repoRoot, 'apps/shop/app'), { recursive: true });
  await mkdir(join(repoRoot, 'apps/docs/app/api/revalidate'), { recursive: true });
  await writeFile(
    join(repoRoot, 'apps/shop/app/page.tsx'),
    "export default async function Page() { 'use cache'; cacheTag('shared'); }",
    'utf-8'
  );
  await writeFile(
    join(repoRoot, 'apps/docs/app/api/revalidate/route.ts'),
    "import { revalidateTag } from 'next/cache'; export async function POST() { revalidateTag('shared', 'max'); }",
    'utf-8'
  );

  const rec = {
    candidateRef: 'isr_overrevalidation:/',
    what: 'Use Cache Components for the page.',
    fix: "Keep existing invalidation via `revalidateTag`: cacheTag('shared'); cacheLife('max');",
  };
  const claim = extractClaims(rec, {
    repoRoot,
    projectRootDirectory: 'apps/shop',
  }).find((c) => c.type === 'next_cache_tag_invalidation_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /shared/);

  const siblingProjectClaim = { ...claim, projectRootDirectory: 'apps/docs' };
  const verified = await verifyClaim(siblingProjectClaim);
  assert.equal(verified.disposition, 'verified');
});

test('extractClaims + verifyClaim: cacheLife recs with cacheTag need matching invalidation evidence', async () => {
  const failingRoot = await mkdtemp(join(tmpdir(), 'vo-cachelife-missing-'));
  await mkdir(join(failingRoot, 'app'), { recursive: true });
  await writeFile(
    join(failingRoot, 'app/page.tsx'),
    "import { cacheTag } from 'next/cache';\nexport async function getPage(location) { 'use cache'; cacheTag('sponsors'); cacheTag(`event-homepage-${location}`); }\n"
  );
  const rec = {
    candidateRef: 'isr_overrevalidation:/event/[*]/berlin',
    what: 'Lengthen the cache TTL on the homepage.',
    fix: "Add `cacheLife('hours')` next to the existing `cacheTag()` calls.",
    affectedFiles: ['app/page.tsx'],
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const claim = extractClaims(rec, { repoRoot: failingRoot })
    .find((c) => c.type === 'next_cache_lifetime_freshness_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /without matching revalidateTag\/updateTag/);

  const passingRoot = await mkdtemp(join(tmpdir(), 'vo-cachelife-valid-'));
  await mkdir(join(passingRoot, 'app'), { recursive: true });
  await writeFile(
    join(passingRoot, 'app/page.tsx'),
    await readFile(join(failingRoot, 'app/page.tsx'), 'utf-8')
  );
  await writeFile(
    join(passingRoot, 'app/actions.ts'),
    "import { revalidateTag } from 'next/cache';\nexport function publish(location) { revalidateTag('sponsors'); revalidateTag(`event-homepage-${location}`); }\n"
  );
  const supported = await verifyClaim({ ...claim, repoRoot: passingRoot });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: content cacheLife recs without tags are not ready', async () => {
  const rec = {
    candidateRef: 'slow_route:/docs/guide',
    what: 'Cache the docs guide shell.',
    fix: "Add `'use cache'` and `cacheLife('days')` around `getGuidesByProduct()` for Contentful-backed docs content.",
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'next_cache_lifetime_freshness_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /cacheTag\/revalidateTag evidence/);
});

test('extractClaims + verifyClaim: Cache Components layout recs must cite a layout in the route chain', async () => {
  const wrongLayout = {
    candidateRef: 'slow_route:/docs/projects/overview',
    what: 'Make the shared docs layout cacheable with Cache Components.',
    fix: "Add `'use cache'` and `cacheLife('days')` in apps/docs-app/app/(localized)/[rootFlagsCode]/[lang]/layout.tsx.",
    affectedFiles: ['apps/docs-app/app/(localized)/[rootFlagsCode]/[lang]/layout.tsx'],
    citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
  };
  const ctx = {
    framework: 'next',
    version: '16.3.0-canary.11',
    cacheComponents: true,
    signals: {
      codebase: {
        routes: [
          { routePath: '/[rootFlagsCode]/docs', file: 'app/[rootFlagsCode]/docs/layout.tsx', type: 'layout' },
          { routePath: '/[rootFlagsCode]/docs/projects/overview', file: 'app/[rootFlagsCode]/docs/projects/overview/page.tsx', type: 'page' },
          { routePath: '/[rootFlagsCode]/[lang]', file: 'app/(localized)/[rootFlagsCode]/[lang]/layout.tsx', type: 'layout' },
        ],
      },
    },
  };
  const claim = extractClaims(wrongLayout, ctx)
    .find((c) => c.type === 'next_cache_components_route_chain_file');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /outside the observed route chain/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...wrongLayout,
      affectedFiles: ['apps/docs-app/app/[rootFlagsCode]/docs/layout.tsx'],
      fix: "Add `'use cache'` and `cacheLife('days')` in apps/docs-app/app/[rootFlagsCode]/docs/layout.tsx.",
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Next 16 image recommendations must not use deprecated priority', async () => {
  const rec = {
    candidateRef: 'cwv_poor:/learn/certificate',
    what: 'Improve LCP on the certificate hero image.',
    fix: 'Mark the hero `<Image>` with `priority` so it loads first.',
    citations: ['https://nextjs.org/docs/pages/api-reference/components/image'],
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.0.0' })
    .find((c) => c.type === 'next_image_priority_api_for_version');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /preload/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Replace the old `priority` guidance with `preload` on the LCP image, or use `fetchPriority` when preloading is not the right loading intent.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Ignored Build Step recs respect project skip-unaffected state', async () => {
  const rec = {
    candidateRef: 'build_minutes_fanout:<account>',
    what: 'Reduce build minutes in this monorepo.',
    fix: 'Add an Ignored Build Step using `turbo-ignore` for this project.',
  };
  const claim = extractClaims(rec, {
    signals: { project: { enableAffectedProjectsDeployments: true, commandForIgnoringBuildStep: '' } },
  }).find((c) => c.type === 'vercel_ignore_command_project_state');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /skip-unaffected deployments enabled/);

  const supported = await verifyClaim({
    ...claim,
    signals: { project: { enableAffectedProjectsDeployments: false, commandForIgnoringBuildStep: '' } },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Cache Components projects prefer use cache remote over Runtime Cache APIs', async () => {
  const rec = {
    candidateRef: 'uncached_route:/docs/md/[...slug]',
    what: 'Cache the generated markdown with Runtime Cache.',
    fix: "import { getCache } from '@vercel/functions';\nconst cache = getCache();",
    citations: ['https://vercel.com/docs/caching/runtime-cache'],
  };
  const claim = extractClaims(rec, {
    framework: 'next',
    version: '16.3.0',
    cacheComponents: true,
  }).find((c) => c.type === 'next_cache_components_runtime_cache_preference');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /use cache: remote/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "Extract the work into a helper with `'use cache: remote'`, then call it from the route handler.",
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: Turbo build-cache recs reject side-effectful builds and bad outputs', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'vo-turbo-cache-'));
  await mkdir(join(repoRoot, 'apps/site'), { recursive: true });
  await Promise.all([
    writeFile(join(repoRoot, 'apps/site/package.json'), JSON.stringify({
      scripts: { build: 'payload migrate && pnpm buildonly' },
      dependencies: { next: '16.3.0' },
    }), 'utf-8'),
    writeFile(join(repoRoot, 'apps/site/turbo.json'), JSON.stringify({
      tasks: { build: { cache: false, outputs: ['dist/**'] } },
    }), 'utf-8'),
  ]);

  const rec = {
    candidateRef: 'build_minutes_fanout:<account>',
    what: 'Re-enable Turbo build caching.',
    fix: 'Set `tasks.build.cache` to `true` in `turbo.json`.',
    affectedFiles: ['apps/site/turbo.json'],
  };
  const claim = extractClaims(rec, {
    repoRoot,
    framework: 'next',
  }).find((c) => c.type === 'turbo_build_cache_safety');
  assert.ok(claim);
  const sideEffectFailure = await verifyClaim(claim);
  assert.equal(sideEffectFailure.disposition, 'failed');
  assert.match(sideEffectFailure.reason, /migrations|side effects/);

  const separatedButBadOutputs = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Split `payload migrate` into an uncached prebuild task, then enable caching for the pure build.',
    },
  });
  assert.equal(separatedButBadOutputs.disposition, 'failed');
  assert.match(separatedButBadOutputs.reason, /\.next/);

  await writeFile(join(repoRoot, 'apps/site/turbo.json'), JSON.stringify({
    tasks: { build: { cache: false, outputs: ['.next/**', '!.next/cache/**'] } },
  }), 'utf-8');
  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Split `payload migrate` into an uncached prebuild task, then enable caching for the pure build.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: cache header recs must acknowledge error-dominated routes', async () => {
  const rec = {
    candidateRef: 'uncached_route:/docs/llm-digest/[...slug]',
    what: 'Add Cache-Control with s-maxage.',
    fix: "Set `Cache-Control: public, s-maxage=3600`.",
    affectedFiles: ['app/docs/route.ts'],
  };
  const signals = {
    metrics: {
      fnStatusByRoute: {
        rows: [
          { route: '/docs/llm-digest/[...slug]', http_status: '200', value: 400 },
          { route: '/docs/llm-digest/[...slug]', http_status: '500', value: 600 },
        ],
      },
    },
  };
  const claim = extractClaims(rec, { signals }).find((c) => c.type === 'cache_rec_not_error_dominated_or_acknowledged');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /5xx share/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      why: 'Apply this after fixing the 5xx storm; cache impact is limited to successful 2xx markdown responses.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: cache candidates must name a positive cache policy', async () => {
  const noStoreOnly = {
    candidateRef: 'uncached_route:/api/models',
    what: 'Make /api/models explicit.',
    why: 'The route is dynamic.',
    fix: "Set `cache: 'no-store'` on the fetch and return `Cache-Control: no-store`.",
  };
  const claim = extractClaims(noStoreOnly).find((c) => c.type === 'cache_policy_positive_or_no_ready_rec');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /no-store-only/);

  const successPolicy = await verifyClaim({
    ...claim,
    rec: {
      ...noStoreOnly,
      fix: 'Cache only successful public responses with `CDN-Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`; keep error and fallback branches `no-store`.',
    },
  });
  assert.equal(successPolicy.disposition, 'verified');
});

test('extractClaims + verifyClaim: cache candidates without a policy are held back', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/api/models',
    what: 'Clean up /api/models caching.',
    why: 'The route has many GET requests.',
    fix: 'Move the helper into a shared utility.',
  };
  const claim = extractClaims(rec).find((c) => c.type === 'cache_policy_positive_or_no_ready_rec');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /does not name a cache policy/);
});

test('extractClaims + verifyClaim: immutable browser caching on dynamic routes needs byte-versioned URLs', async () => {
  const rec = {
    candidateRef: 'cache_header_gap:/api/docs-og',
    what: 'Add immutable Cache-Control to the OG image route.',
    fix: "return new ImageResponse(<Og />, { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } });",
    affectedFiles: ['app/api/docs-og/route.tsx'],
  };
  const claim = extractClaims(rec).find((c) => c.type === 'immutable_dynamic_route_safety');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /byte-versioned/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: "Use `Vercel-CDN-Cache-Control: public, max-age=31536000, immutable`; keep browser Cache-Control short.",
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: auth-sensitive parallelization cannot move private fetches before ownership checks', async () => {
  const rec = {
    candidateRef: 'slow_route:/account/[accountId]/records/[slug]/private',
    what: 'Parallelize the private record lookups.',
    fix: "const [ownsRecord, privateRecord] = await Promise.all([\n  getUserOwnsRecord(session.data.email, slug),\n  getPrivateRecordBySlug(slug),\n]);",
  };
  const claim = extractClaims(rec).find((c) => c.type === 'auth_guard_parallelization_safety');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /private data/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Replace the two calls with one lookup constrained by both email and slug, so the private record is fetched only after the ownership predicate is part of the query.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: parallelization impact cannot promise unmeasured helper-sized drops', async () => {
  const rec = {
    candidateRef: 'slow_route:/register',
    what: 'Parallelize getSession with the content fetch.',
    fix: 'Use Promise.all for getSession() and getRegisterPageContent().',
    verify: 'Expect a reduction roughly equal to min(getSession duration, getRegisterPageContent duration).',
  };
  const claim = extractClaims(rec).find((c) => c.type === 'parallelization_impact_not_overclaimed');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /without measured helper/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      verify: 'Trace spans measured getSession duration at p95=120ms; watch latency.p95 drop by roughly the measured helper duration.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: CPU-bound parallelization needs measured wait evidence', async () => {
  const rec = {
    candidateRef: 'slow_route:/docs/[[...slug]]',
    what: 'Parallelize two getDoc calls.',
    why: 'MDX compilation runs sequentially; cpu.p95=1311ms is close to latency.p95=1501ms.',
    fix: 'Use Promise.all so both getDoc calls compile concurrently.',
  };
  const claim = extractClaims(rec).find((c) => c.type === 'parallelization_not_cpu_bound_work');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /CPU-bound/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      why: 'Trace spans measured CMS fetch wait time at p95=500ms before MDX compilation starts.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: route error root-cause claims need runtime evidence', async () => {
  const rec = {
    candidateRef: 'route_errors:/blog/llm-digest/next-15',
    what: 'Stop reading MDX from the filesystem at request time.',
    why: 'The route has a signature of ENOENT because it reads post.filePath at request time.',
    fix: 'Move the post body into the build-time manifest.',
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'runtime_error_cause_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /runtime logs or stack/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      why: 'Runtime logs show Error: ENOENT at getMdDoc (app/blog/llm-digest/[slug]/route.ts:63).',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('extractClaims + verifyClaim: unhandled-exception route-error claims need runtime evidence', async () => {
  const rec = {
    candidateRef: 'route_errors:/docs/llm-digest/[...slug]',
    what: 'Wrap the GET handler so unhandled exceptions stop returning 500s.',
    why: 'The helper reads from disk and any unhandled exception bubbles to the runtime as a 500.',
    fix: 'Add try/catch around the handler.',
  };
  const claim = extractClaims(rec, { framework: 'next', version: '16.3.0-canary.11' })
    .find((c) => c.type === 'runtime_error_cause_supported');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /runtime logs or stack/);
});

test('extractClaims + verifyClaim: route-error not-found catches need explicit 404 and unknown-error handling', async () => {
  const rec = {
    candidateRef: 'route_errors:/docs/llm-digest/[...slug]',
    what: 'Catch missing docs in the LLM digest route.',
    why: 'Runtime logs show Error: ENOENT at getDocsMd.',
    fix: 'Add `try/catch` around the handler and return markdown not found for exceptions.',
  };
  const claim = extractClaims(rec).find((c) => c.type === 'route_error_not_found_status_and_scope');
  assert.ok(claim);
  const failed = await verifyClaim(claim);
  assert.equal(failed.disposition, 'failed');
  assert.match(failed.reason, /explicit 404 status/);

  const broadCatch = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Add `try/catch`; return `new Response("not found", { status: 404 })` for any exception.',
    },
  });
  assert.equal(broadCatch.disposition, 'failed');
  assert.match(broadCatch.reason, /classify expected misses/);

  const unexpectedCatch = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Wrap the body of GET in try/catch; on catch, log the slug and error, then return `new Response("not found", { status: 404 })` so unexpected exceptions degrade to 404 markdown.',
    },
  });
  assert.equal(unexpectedCatch.disposition, 'failed');
  assert.match(unexpectedCatch.reason, /unexpected exceptions/);

  const supported = await verifyClaim({
    ...claim,
    rec: {
      ...rec,
      fix: 'Catch only known missing-content cases such as ENOENT and return `new Response("not found", { status: 404 })`; log and rethrow unexpected errors so they remain visible as 5xx.',
    },
  });
  assert.equal(supported.disposition, 'verified');
});

test('verifyClaim: citation_in_library accepts skill-rule format', async () => {
  const r = await verifyClaim({
    type: 'citation_in_library',
    url: 'vercel-react-best-practices:async-parallel',
  });
  assert.equal(r.disposition, 'verified');
});

test('verifyClaim: citation_in_library rejects unknown URL', async () => {
  const r = await verifyClaim({
    type: 'citation_in_library',
    url: 'https://made-up-docs.example.com/page',
  });
  assert.equal(r.disposition, 'failed');
});

test('verifyClaim: pattern_count file-not-found returns failed', async () => {
  const r = await verifyClaim({
    type: 'pattern_count',
    file: 'lib/missing.mjs',
    pattern: 'foo',
    expected: 1,
    repoRoot: SKILL_ROOT,
  });
  assert.equal(r.disposition, 'failed');
});

test('verifyClaim: pattern_count succeeds on exact match', async () => {
  // Grep self: expected=2 = gradeRecommendation + applyQualityFloor.
  const r = await verifyClaim({
    type: 'pattern_count',
    file: 'lib/grade-recommendation.mjs',
    pattern: 'export function',
    expected: 2,
    repoRoot: SKILL_ROOT,
  });
  assert.equal(r.disposition, 'verified', `reason=${r.reason}, actual=${r.actual}`);
});

test('verifyClaim: line-number-as-count is unsupported (not failed)', async () => {
  const r = await verifyClaim({
    type: 'pattern_count',
    file: 'lib/grade-recommendation.mjs',
    pattern: '42',
    expected: 1,
    repoRoot: SKILL_ROOT,
  });
  assert.equal(r.disposition, 'unsupported');
});
