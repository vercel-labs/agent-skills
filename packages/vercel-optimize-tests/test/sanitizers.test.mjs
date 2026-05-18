// $-strip / unknown-citation / version-mismatch are covered in
// impact-magnitude.test.mjs + citations.test.mjs; this file covers the 9
// newer sanitizers plus the orchestrator's ordering contract.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as vercelDirectiveStrip from '../../../skills/vercel-optimize/lib/sanitizers/vercel-directive-strip.mjs';
import * as rateLimit from '../../../skills/vercel-optimize/lib/sanitizers/rate-limit.mjs';
import * as preRelease from '../../../skills/vercel-optimize/lib/sanitizers/pre-release.mjs';
import * as middlewareConflict from '../../../skills/vercel-optimize/lib/sanitizers/middleware-conflict.mjs';
import * as undeclaredDep from '../../../skills/vercel-optimize/lib/sanitizers/undeclared-dep.mjs';
import * as countCorrect from '../../../skills/vercel-optimize/lib/sanitizers/count-correct.mjs';
import * as renderingMode from '../../../skills/vercel-optimize/lib/sanitizers/rendering-mode-mislabel.mjs';
import * as windowUnits from '../../../skills/vercel-optimize/lib/sanitizers/window-units.mjs';
import * as functionDurationInvocations from '../../../skills/vercel-optimize/lib/sanitizers/function-duration-invocations.mjs';
import * as botProtectionCertainty from '../../../skills/vercel-optimize/lib/sanitizers/bot-protection-certainty.mjs';
import * as cacheTagInvalidationCertainty from '../../../skills/vercel-optimize/lib/sanitizers/cache-tag-invalidation-certainty.mjs';
import * as missingCitation from '../../../skills/vercel-optimize/lib/sanitizers/missing-citation.mjs';
import { applySanitizers, applySanitizersBatch } from '../../../skills/vercel-optimize/lib/sanitizers/index.mjs';

test('vercel-directive-strip: strips stale-if-error from Cache-Control', () => {
  const rec = {
    fix: "Set `Cache-Control: 's-maxage=300, stale-while-revalidate=86400, stale-if-error=600'`",
  };
  const r = vercelDirectiveStrip.apply(rec);
  assert.ok(!rec.fix.includes('stale-if-error'));
  assert.ok(rec.fix.includes('s-maxage=300'), 'preserves honored directives');
  assert.ok(rec.fix.includes('stale-while-revalidate=86400'));
  assert.ok(r.tags.some((t) => t === 'vercel-directive-strip:stale-if-error'));
});

test('vercel-directive-strip: strips proxy-revalidate', () => {
  const rec = { desiredBehavior: '```\nCache-Control: public, max-age=60, proxy-revalidate\n```' };
  const r = vercelDirectiveStrip.apply(rec);
  assert.ok(!rec.desiredBehavior.includes('proxy-revalidate'));
  assert.ok(rec.desiredBehavior.includes('max-age=60'));
  assert.ok(r.tags.includes('vercel-directive-strip:proxy-revalidate'));
});

test('vercel-directive-strip: no-op when no offending directive', () => {
  const rec = { fix: 'Cache-Control: s-maxage=60, public' };
  const r = vercelDirectiveStrip.apply(rec);
  assert.equal(rec.fix, 'Cache-Control: s-maxage=60, public');
  assert.equal(r.tags, undefined);
});

test('rate-limit: prepends caveat when Notion concurrency exceeds 3 rps', () => {
  const rec = {
    fix: 'Run 50 parallel Notion requests via Promise.all to denormalize the data.',
  };
  const r = rateLimit.apply(rec);
  assert.ok(rec.fix.startsWith('⚠'));
  assert.match(rec.fix, /Notion rate-limits to ~3/);
  assert.equal(r.needsReview, true);
  assert.ok(r.tags.some((t) => t.startsWith('rate-limit:Notion:50/3')));
});

test('rate-limit: silent when concurrency stays below provider limit', () => {
  const rec = { fix: 'Issue 2 parallel Notion requests at most.' };
  const r = rateLimit.apply(rec);
  assert.equal(r.tags, undefined);
});

test('rate-limit: silent when provider mentioned without concurrency prescription', () => {
  const rec = { fix: 'Anthropic returned a 429 — investigate retry-after handling.' };
  const r = rateLimit.apply(rec);
  assert.equal(r.tags, undefined);
});

test('rate-limit: catches Anthropic at 30 concurrent (> 10)', () => {
  const rec = { fix: 'Fan-out 30 parallel Anthropic completions to summarize.' };
  const r = rateLimit.apply(rec);
  assert.ok(r.tags.some((t) => t.startsWith('rate-limit:Anthropic:30/10')));
});

test('pre-release: appends caveat when PPR mentioned', () => {
  const rec = { fix: 'Enable Partial Prerendering (PPR) on /dashboard via `experimental.ppr = true`.' };
  const r = preRelease.apply(rec);
  assert.match(rec.fix, /Requires next@canary/);
  assert.ok(r.tags.some((t) => t.startsWith('pre-release:next@canary')));
});

test('pre-release: catches "use cache" directive', () => {
  const rec = { fix: 'Wrap getProducts in a function with `"use cache"` directive.' };
  const r = preRelease.apply(rec);
  assert.ok(r.tags.some((t) => t.startsWith('pre-release:next@>=15')));
});

test('pre-release: silent when detected Next.js version supports stable cache APIs', () => {
  const rec = { fix: 'Wrap getProducts in a function with `"use cache"` directive and call `cacheTag("products")`.' };
  const r = preRelease.apply(rec, { framework: 'next', version: '16.3.0-canary.11' });
  assert.equal(r.tags, undefined);
  assert.doesNotMatch(rec.fix, /Requires next@>=15/);
});

test('pre-release: catches explicit `pkg@a.b.c-rc.N` references', () => {
  const rec = { fix: 'Upgrade to `next@15.5.0-canary.42` to get the fix.' };
  const r = preRelease.apply(rec);
  assert.ok(r.tags.some((t) => t === 'pre-release:next@15.5.0-canary.42'));
});

test('pre-release: silent on stable version references', () => {
  const rec = { fix: 'Upgrade to `next@15.4.10`.' };
  const r = preRelease.apply(rec);
  assert.equal(r.tags, undefined);
});

test('middleware-conflict: appends caveat when matcher covers the rec route', () => {
  const rec = {
    candidateRef: 'uncached_route:/api/products',
    fix: 'Add `Cache-Control: s-maxage=300` to the response.',
  };
  const ctx = {
    signals: {
      codebase: {
        findings: [{
          scannerId: 'middleware-broad-matcher',
          file: 'middleware.ts',
          detail: { matcher: '/((?!_next/static).*)' },
        }],
      },
    },
  };
  const r = middlewareConflict.apply(rec, ctx);
  assert.match(rec.fix, /Middleware at `middleware\.ts`/);
  assert.equal(r.needsReview, true);
  assert.ok(r.tag.startsWith('middleware-conflict:'));
});

test('middleware-conflict: silent when finding lists routes and ours is excluded', () => {
  const rec = {
    candidateRef: 'uncached_route:/api/products',
    fix: 'Add Cache-Control headers.',
  };
  const ctx = {
    signals: {
      codebase: {
        findings: [{
          scannerId: 'middleware-broad-matcher',
          file: 'middleware.ts',
          detail: { matcher: '/admin/:path*', routesCovered: ['/admin', '/admin/users'] },
        }],
      },
    },
  };
  const r = middlewareConflict.apply(rec, ctx);
  assert.equal(r.tag, undefined);
});

test('middleware-conflict: silent when no middleware finding present', () => {
  const rec = { candidateRef: 'uncached_route:/api/x', fix: 'fix.' };
  const r = middlewareConflict.apply(rec, { signals: { codebase: { findings: [] } } });
  assert.equal(r.tag, undefined);
});

test('undeclared-dep: catches an import of a package not in package.json', () => {
  const rec = {
    fix: 'Wrap the work in a queue:\n```ts\nimport pLimit from "p-limit";\nconst limit = pLimit(2);\n```',
  };
  const ctx = { package: { dependencies: { next: '15.4.10' } } };
  const r = undeclaredDep.apply(rec, ctx);
  assert.ok(rec.fix.startsWith('**Add dependency first**'));
  assert.match(rec.fix, /npm i p-limit/);
  assert.ok(r.tags.includes('undeclared-dep:p-limit'));
  assert.equal(r.needsReview, true);
});

test('undeclared-dep: silent on declared deps', () => {
  const rec = {
    fix: '```ts\nimport { unstable_cache } from "next/cache";\n```',
  };
  const ctx = { package: { dependencies: { next: '15.4.10' } } };
  const r = undeclaredDep.apply(rec, ctx);
  assert.equal(r.tags, undefined);
});

test('undeclared-dep: silent on node builtins + relative imports', () => {
  const rec = {
    fix: '```ts\nimport fs from "node:fs/promises";\nimport { helper } from "./helper";\nimport "buffer";\n```',
  };
  const ctx = { package: { dependencies: { next: '15.4.10' } } };
  const r = undeclaredDep.apply(rec, ctx);
  assert.equal(r.tags, undefined);
});

test('undeclared-dep: handles scoped packages correctly', () => {
  const rec = {
    fix: '```ts\nimport { put } from "@vercel/blob";\n```',
  };
  const ctx = { package: { dependencies: { next: '15.4.10' } } };
  const r = undeclaredDep.apply(rec, ctx);
  assert.ok(r.tags.includes('undeclared-dep:@vercel/blob'), `expected @vercel/blob, got ${JSON.stringify(r.tags)}`);
});

test('undeclared-dep: silent when devDependencies declare it', () => {
  const rec = {
    fix: '```ts\nimport { describe, test } from "vitest";\n```',
  };
  const ctx = { package: { devDependencies: { vitest: '^1.0.0' } } };
  const r = undeclaredDep.apply(rec, ctx);
  assert.equal(r.tags, undefined);
});

test('count-correct: rewrites "60 icons" to "~50 icons" when verifier says 50', () => {
  const rec = {
    why: 'The barrel imports 60 icons from packages/ui/src/icons.',
  };
  const ctx = {
    verifyResults: [{
      type: 'cited_count_literal',
      token: 'icons',
      expected: 60,
      actual: 50,
      disposition: 'failed',
    }],
  };
  const r = countCorrect.apply(rec, ctx);
  assert.match(rec.why, /~50 icons/);
  assert.ok(r.tags.some((t) => t === 'count-correct:icons:60->50'));
});

test('count-strip: rewrites "60+ icons" to "a number of icons" when actual is non-numeric', () => {
  const rec = { why: 'The barrel exports 60+ icons.' };
  const ctx = {
    verifyResults: [{
      type: 'cited_count_literal',
      token: 'icons',
      expected: 60,
      actual: 'unverifiable',
      disposition: 'failed',
    }],
  };
  const r = countCorrect.apply(rec, ctx);
  assert.match(rec.why, /a number of icons/);
  assert.ok(r.tags.includes('count-strip:icons'));
});

test('count-correct: silent on verified counts', () => {
  const rec = { why: 'The file has 5 fetch() calls.' };
  const ctx = {
    verifyResults: [{ type: 'pattern_count', token: 'fetch() calls', expected: 5, actual: 5, disposition: 'verified' }],
  };
  const r = countCorrect.apply(rec, ctx);
  assert.equal(r.tags, undefined);
});

test('rendering-mode-mislabel: warns when claimed ISR but scanner says static', () => {
  const rec = {
    candidateRef: 'isr_overrevalidation:/blog/[slug]',
    fix: 'Reduce the ISR revalidate interval from 60 to 3600 to cut writes.',
  };
  const ctx = {
    signals: {
      codebase: {
        routes: [{ routePath: '/blog/[slug]', file: 'app/blog/[slug]/page.tsx', renderingMode: 'static' }],
      },
    },
  };
  const r = renderingMode.apply(rec, ctx);
  assert.match(rec.fix, /Rendering-mode mismatch/);
  assert.match(rec.fix, /classified it as `static`/);
  assert.ok(r.tag.startsWith('rendering-mode-mislabel:'));
});

test('rendering-mode-mislabel: silent when claim matches scanner', () => {
  const rec = {
    candidateRef: 'isr_overrevalidation:/blog',
    fix: 'Adjust the ISR revalidate interval.',
  };
  const ctx = {
    signals: { codebase: { routes: [{ routePath: '/blog', renderingMode: 'isr' }] } },
  };
  const r = renderingMode.apply(rec, ctx);
  assert.equal(r.tag, undefined);
});

test('rendering-mode-mislabel: silent when scanner did NOT classify the route', () => {
  const rec = {
    candidateRef: 'slow_route:/foo',
    fix: 'Switch from ISR to dynamic.',
  };
  const ctx = { signals: { codebase: { routes: [{ routePath: '/foo' }] } } };
  const r = renderingMode.apply(rec, ctx);
  assert.equal(r.tag, undefined);
});

test('window-units: rewrites observed monthly-looking counts to the current metrics window', () => {
  const rec = {
    what: 'Cache the route with 6.28M/mo function invocations.',
    why: 'The route has 668,627 monthly requests and 16 GB/mo egress.',
  };
  const r = windowUnits.apply(rec);
  assert.match(rec.what, /6\.28M function invocations in this window/);
  assert.match(rec.why, /requests in this window/);
  assert.match(rec.why, /16 GB egress in this window/);
  assert.ok(r.tags.includes('window-units:what'));
  assert.ok(r.tags.includes('window-units:why'));
});

test('function-duration-invocations: rewrites slow-route invocation-count savings claims', () => {
  const rec = {
    candidateRef: 'slow_route:/login',
    verify: 'Expect function invocations to drop sharply and p95 latency to fall after adding Runtime Cache.',
  };
  const r = functionDurationInvocations.apply(rec);
  assert.match(rec.verify, /95th percentile duration should drop/);
  assert.match(rec.verify, /function invocation count may stay flat/);
  assert.ok(r.tags.includes('function-duration-invocations:verify'));
  assert.equal(r.needsReview, undefined);
});

test('function-duration-invocations: leaves cache-route invocation claims alone', () => {
  const rec = {
    candidateRef: 'uncached_route:/api/products',
    verify: 'Function invocations should drop after CDN HIT rate rises.',
  };
  const r = functionDurationInvocations.apply(rec);
  assert.equal(r.tags, undefined);
});

test('bot-protection-certainty: softens unsupported rule-state claims and adds rollout caveat', () => {
  const rec = {
    candidateRef: 'platform_bot_protection:<account>',
    why: 'There is no firewall bot_filter rule and bots are the cause of excess transfer without false-positive risk.',
    fix: 'Turn on BotID for the LLM endpoints.',
  };
  const r = botProtectionCertainty.apply(rec);
  assert.match(rec.why, /did not show an enforced bot-filter rule/);
  assert.match(rec.why, /likely contributor/);
  assert.match(rec.why, /false-positive risk monitored/);
  assert.doesNotMatch(rec.why, /without false-positive risk/);
  assert.match(rec.fix, /Log -> Challenge -> Deny/);
  assert.ok(r.tags.includes('bot-protection-certainty:why'));
  assert.ok(r.tags.includes('bot-protection-certainty:staged-rollout'));
  assert.equal(r.needsReview, true);
});

test('cache-tag-invalidation-certainty: removes unsupported existing-tag guarantees', () => {
  const rec = {
    candidateRef: 'isr_overrevalidation:/event/[code]/[location]',
    fix: "Add `cacheLife('hours')`; existing cache tags preserve instant CMS updates.",
  };
  const r = cacheTagInvalidationCertainty.apply(rec);
  assert.match(rec.fix, /Confirm a matching revalidateTag\(\) or updateTag\(\) path/);
  assert.ok(r.tags.includes('cache-tag-invalidation-certainty:fix'));
  assert.equal(r.needsReview, true);
});

test('missing-citation: drops rec with empty citations', () => {
  const rec = { what: 'Add caching', citations: [] };
  const r = missingCitation.apply(rec);
  assert.equal(r.dropped, true);
});

test('missing-citation: keeps rec with ≥1 citation', () => {
  const rec = { what: 'Add caching', citations: ['https://vercel.com/docs/caching/cdn-cache'] };
  const r = missingCitation.apply(rec);
  assert.equal(r.dropped, undefined);
});

test('applySanitizers: $-strip runs before content sanitizers', async () => {
  const rec = {
    what: 'Save $340/mo by caching.',
    fix: 'Set Cache-Control with stale-if-error directive.',
    citations: ['https://vercel.com/docs/caching/cdn-cache'],
  };
  const r = await applySanitizers(rec, { framework: 'next', version: '15.4.10' });
  assert.ok(r.kept);
  assert.ok(!rec.what.includes('$340'));
  assert.ok(!rec.fix.includes('stale-if-error'));
  assert.ok(rec.sanitizerTrail.some((t) => t.startsWith('$-strip:')));
  assert.ok(rec.sanitizerTrail.some((t) => t.startsWith('vercel-directive-strip:')));
});

test('applySanitizers: drops uncited rec via missing-citation last', async () => {
  const rec = { what: 'Do a thing', citations: [] };
  const r = await applySanitizers(rec, { framework: 'next', version: '15.4.10' });
  assert.equal(r.kept, false);
  assert.equal(r.dropReason, 'missing-citation');
});

test('applySanitizers: version-mismatch strips next@15-only URL on next@13 project', async () => {
  const rec = {
    what: 'Cache with "use cache".',
    citations: [
      'https://nextjs.org/docs/app/api-reference/directives/use-cache',
      'https://vercel.com/docs/caching/cdn-cache',
    ],
  };
  const r = await applySanitizers(rec, { framework: 'next', version: '13.5.0' });
  assert.ok(r.kept, 'kept because Vercel docs is wildcard');
  assert.ok(rec.sanitizerTrail.some((t) => t.startsWith('version-mismatch:')));
  assert.equal(rec.citations.length, 1, 'use-cache URL stripped');
});

test('applySanitizers: missing-citation drops rec whose only citation was version-stripped', async () => {
  const rec = {
    what: '...',
    citations: ['https://nextjs.org/docs/app/api-reference/directives/use-cache'],
  };
  const r = await applySanitizers(rec, { framework: 'next', version: '13.5.0' });
  assert.equal(r.kept, false);
  assert.equal(r.dropReason, 'missing-citation');
});

test('applySanitizersBatch: partitions kept vs dropped with reasons', async () => {
  const recs = [
    { what: 'A', citations: ['https://vercel.com/docs/caching/cdn-cache'] },
    { what: 'B', citations: [] },
    { what: 'C', citations: ['https://vercel.com/docs/functions/fluid-compute'] },
  ];
  const r = await applySanitizersBatch(recs, { framework: 'next', version: '15.4.10' });
  assert.equal(r.kept.length, 2);
  assert.equal(r.dropped.length, 1);
  assert.equal(r.dropped[0].dropReason, 'missing-citation');
});
