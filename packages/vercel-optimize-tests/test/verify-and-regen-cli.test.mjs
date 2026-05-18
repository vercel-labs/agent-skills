import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..', '..', '..');
const SKILL_ROOT = join(REPO_ROOT, 'skills', 'vercel-optimize');
const SCRIPT = join(SKILL_ROOT, 'scripts', 'verify-and-regen.mjs');

test('verify-and-regen CLI: emits explicit renderable and withheld recommendation lists', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-verify-contract-'));
  try {
    const recsPath = join(scratch, 'recommendations.json');
    const signalsPath = join(scratch, 'signals.json');
    const good = {
      candidateRef: 'uncached_route:/ok',
      what: 'Add shared Cache-Control to /ok.',
      why: 'lib/grade-recommendation.mjs:1 is the verified handler file; observability shows function invocations: 100,000; cache hit rate: 0%; GET request share: 100%.',
      fix: 'Set `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600` on the response and keep any existing Vary header.',
      currentBehavior: 'The response returns without shared CDN caching.',
      desiredBehavior: 'The response is cacheable at the CDN for read-only GET traffic.',
      verify: 'Re-run Vercel metrics and confirm cache hit rate rises above 50%.',
      bucket: 'cost',
      effort: 'low',
      impactTier: 'high',
      priority: 100,
      o11ySignal: 'inv=100000,p95=900ms',
      affectedFiles: ['lib/grade-recommendation.mjs'],
      findingRefs: ['lib/grade-recommendation.mjs:1'],
      citations: ['https://vercel.com/docs/caching/cdn-cache'],
    };
    const unsafe = {
      ...good,
      candidateRef: 'uncached_route:/bad-cache-api',
      what: 'Add cacheLife to the page.',
      fix: "import { unstable_cacheLife } from 'next/cache';\ncacheLife('days');",
      priority: 90,
    };
    await Promise.all([
      writeFile(recsPath, JSON.stringify([good, unsafe]), 'utf-8'),
      writeFile(signalsPath, JSON.stringify({
        stack: { framework: 'next', frameworkVersion: '16.3.0-canary.11', cacheComponents: true },
        codebase: { findings: [] },
        project: { defaultResourceConfig: {} },
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, recsPath, '--signals', signalsPath, '--repo-root', SKILL_ROOT], { cwd: SKILL_ROOT });
    const out = JSON.parse(stdout);

    assert.equal(out.summary.verifiedRecommendations, 1);
    assert.equal(out.summary.withheldRecommendations, 1);
    assert.deepEqual(out.renderableRecommendations.map((r) => r.candidateRef), ['uncached_route:/ok']);
    assert.deepEqual(out.withheldRecommendations.map((r) => r.candidateRef), ['uncached_route:/bad-cache-api']);
    assert.equal(out.regenPlan[0].regenTrigger, 'semantic_safety');
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('verify-and-regen CLI: holds back cacheLife recs that claim CDN header behavior', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-verify-cachelife-cdn-'));
  try {
    const recsPath = join(scratch, 'recommendations.json');
    const signalsPath = join(scratch, 'signals.json');
    const rec = {
      candidateRef: 'uncached_route:/docs/app/images',
      what: "Add cacheLife() so the 'use cache' segment emits CDN cache headers.",
      why: "The file declares 'use cache' but never calls cacheLife(), so every request invokes the function.",
      fix: "import { cacheLife } from 'next/cache';\ncacheLife('hours');",
      currentBehavior: 'The route is public docs content.',
      desiredBehavior: 'The route should be cached.',
      verify: 'Confirm Cache-Control and x-vercel-cache: HIT.',
      bucket: 'performance',
      effort: 'low',
      impactTier: 'high',
      priority: 100,
      affectedFiles: ['lib/grade-recommendation.mjs'],
      findingRefs: ['lib/grade-recommendation.mjs:1'],
      citations: ['https://nextjs.org/docs/app/api-reference/functions/cacheLife'],
    };
    await Promise.all([
      writeFile(recsPath, JSON.stringify([rec]), 'utf-8'),
      writeFile(signalsPath, JSON.stringify({
        stack: { framework: 'next', frameworkVersion: '16.3.0-canary.11', cacheComponents: true },
        codebase: { findings: [] },
        project: { defaultResourceConfig: {} },
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, recsPath, '--signals', signalsPath, '--repo-root', SKILL_ROOT], { cwd: SKILL_ROOT });
    const out = JSON.parse(stdout);

    assert.equal(out.summary.verifiedRecommendations, 0);
    assert.equal(out.summary.withheldRecommendations, 1);
    assert.equal(out.regenPlan[0].regenTrigger, 'semantic_safety');
    assert.ok(out.regenPlan[0].topFailures.some((f) => f.claimType === 'next_cache_life_cdn_header_semantics'));
    assert.deepEqual(out.renderableRecommendations, []);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('verify-and-regen CLI: applies sanitizers before grading customer-facing recs', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-verify-sanitizers-'));
  try {
    const recsPath = join(scratch, 'recommendations.json');
    const signalsPath = join(scratch, 'signals.json');
    const rec = {
      candidateRef: 'slow_route:/login',
      what: 'Cache login content.',
      why: 'This route handles 6.28M/mo function invocations.',
      fix: 'Add Runtime Cache around the CMS lookup in `lib/grade-recommendation.mjs` and keep the existing response path unchanged.',
      currentBehavior: '```ts\nexport function gradeRecommendation() {}\n```',
      desiredBehavior: '```ts\nexport function gradeRecommendation() {}\n```',
      verify: 'Expect function invocations to drop sharply and p95 latency to fall.',
      bucket: 'performance',
      effort: 'low',
      impactTier: 'high',
      priority: 100,
      o11ySignal: 'inv=100000,p95=900ms',
      affectedFiles: ['lib/grade-recommendation.mjs'],
      findingRefs: ['lib/grade-recommendation.mjs:1'],
      citations: ['https://vercel.com/docs/caching/runtime-cache'],
    };
    await Promise.all([
      writeFile(recsPath, JSON.stringify([rec]), 'utf-8'),
      writeFile(signalsPath, JSON.stringify({
        stack: { framework: 'next', frameworkVersion: '16.3.0-canary.11', cacheComponents: false },
        codebase: { findings: [] },
        project: { defaultResourceConfig: {} },
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, recsPath, '--signals', signalsPath, '--repo-root', SKILL_ROOT], { cwd: SKILL_ROOT });
    const out = JSON.parse(stdout);
    assert.equal(out.summary.verifiedRecommendations, 1);
    assert.equal(out.renderableRecommendations[0].why, 'This route handles 6.28M function invocations in this window.');
    assert.match(out.renderableRecommendations[0].verify, /function invocation count may stay flat/);
    assert.ok(out.renderableRecommendations[0].sanitizerTrail.some((t) => t.startsWith('window-units:')));
    assert.ok(out.renderableRecommendations[0].sanitizerTrail.some((t) => t.startsWith('function-duration-invocations:')));
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('verify-and-regen CLI: holds back recommendations that still need review', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-verify-needs-review-'));
  try {
    const recsPath = join(scratch, 'recommendations.json');
    const signalsPath = join(scratch, 'signals.json');
    const rec = {
      candidateRef: 'slow_route:/products',
      what: 'Cache the product CMS lookup with the Next.js cache directive.',
      why: 'lib/grade-recommendation.mjs:1 is the verified loader file; observability shows function invocations: 100,000 and 95th percentile duration: 900ms while the same public product data is recomputed on every request.',
      fix: 'Add `"use cache"` inside the product CMS lookup, keep the same input arguments, and verify the project has a Next.js version that supports the directive before applying.',
      currentBehavior: '```ts\nexport async function loadProducts() {\n  return fetchProductsFromCms();\n}\n```',
      desiredBehavior: '```ts\nexport async function loadProducts() {\n  "use cache";\n  return fetchProductsFromCms();\n}\n```',
      verify: 'Re-run metrics and confirm 95th percentile duration falls.',
      bucket: 'performance',
      effort: 'low',
      impactTier: 'high',
      priority: 100,
      affectedFiles: ['lib/grade-recommendation.mjs'],
      findingRefs: ['lib/grade-recommendation.mjs:1'],
      citations: ['https://vercel.com/docs/caching/runtime-cache'],
    };
    await Promise.all([
      writeFile(recsPath, JSON.stringify([rec]), 'utf-8'),
      writeFile(signalsPath, JSON.stringify({
        stack: { framework: 'next', frameworkVersion: '14.2.5' },
        codebase: { findings: [] },
        project: { defaultResourceConfig: {} },
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, recsPath, '--signals', signalsPath, '--repo-root', SKILL_ROOT], { cwd: SKILL_ROOT });
    const out = JSON.parse(stdout);

    assert.equal(out.summary.verifiedRecommendations, 0);
    assert.equal(out.summary.withheldRecommendations, 1);
    assert.equal(out.withheldRecommendations[0].reason, 'needs_review');
    assert.deepEqual(out.renderableRecommendations, []);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
