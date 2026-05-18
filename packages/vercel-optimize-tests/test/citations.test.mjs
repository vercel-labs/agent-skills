import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadLibrary,
  isKnownUrl,
  lookupUrl,
  lookupSkillRule,
  matchesFrameworkVersion,
  libraryForStack,
  sanitizeCitations,
} from '../../../skills/vercel-optimize/lib/citations.mjs';

test('loadLibrary returns version + entries', async () => {
  const lib = await loadLibrary();
  assert.equal(lib.version, '1.1.0');
  assert.ok(lib.urls.length >= 30, 'expected >=30 URL entries');
  assert.ok(lib.ruleSkillRefs.length >= 10, 'expected >=10 rule refs');
});

test('isKnownUrl true for in-library URL', async () => {
  assert.equal(
    await isKnownUrl('https://vercel.com/docs/caching/cdn-cache'),
    true
  );
});

test('isKnownUrl false for fabricated URL', async () => {
  assert.equal(
    await isKnownUrl('https://vercel.com/docs/fake-page-does-not-exist'),
    false
  );
});

test('isKnownUrl false for stale Next.js hyphenated cache API URLs', async () => {
  assert.equal(
    await isKnownUrl('https://nextjs.org/docs/app/api-reference/functions/cache-life'),
    false
  );
  assert.equal(
    await isKnownUrl('https://nextjs.org/docs/app/api-reference/functions/revalidate-tag'),
    false
  );
});

test('lookupSkillRule resolves rule names', async () => {
  const r = await lookupSkillRule('vercel-react-best-practices:async-parallel');
  assert.ok(r);
  assert.equal(r.rule, 'async-parallel');
});

test('matchesFrameworkVersion: wildcard', () => {
  assert.equal(matchesFrameworkVersion('*', 'next', '13.0.0'), true);
  assert.equal(matchesFrameworkVersion('next@*', 'next', '13.0.0'), true);
  assert.equal(matchesFrameworkVersion('next@*', 'sveltekit', '2.0.0'), false);
});

test('matchesFrameworkVersion: exact major', () => {
  assert.equal(matchesFrameworkVersion('next@14', 'next', '14.0.0'), true);
  assert.equal(matchesFrameworkVersion('next@14', 'next', '14.2.5'), true);
  assert.equal(matchesFrameworkVersion('next@14', 'next', '15.0.0'), false);
  assert.equal(matchesFrameworkVersion('next@14', 'next', '13.5.0'), false);
});

test('matchesFrameworkVersion: >= range', () => {
  assert.equal(matchesFrameworkVersion('next@>=15.0.0', 'next', '15.0.0'), true);
  assert.equal(matchesFrameworkVersion('next@>=15.0.0', 'next', '15.2.1'), true);
  assert.equal(matchesFrameworkVersion('next@>=15.0.0', 'next', '16.0.0'), true);
  assert.equal(matchesFrameworkVersion('next@>=15.0.0', 'next', '14.99.99'), false);
});

test('matchesFrameworkVersion: union', () => {
  const p = 'next@14 || next@>=15.0.0';
  assert.equal(matchesFrameworkVersion(p, 'next', '14.0.0'), true);
  assert.equal(matchesFrameworkVersion(p, 'next', '15.0.0'), true);
  assert.equal(matchesFrameworkVersion(p, 'next', '13.0.0'), false);
});

test('libraryForStack filters by framework', async () => {
  const { urls } = await libraryForStack('next', '13.0.0');
  // 'use cache' is Next 15+ only.
  const useCache = urls.find(u =>
    u.url === 'https://nextjs.org/docs/app/api-reference/directives/use-cache'
  );
  assert.equal(useCache, undefined, "'use cache' must not appear for Next 13");
});

test("libraryForStack: 'use cache' surfaces for Next 15", async () => {
  const { urls } = await libraryForStack('next', '15.2.1');
  const useCache = urls.find(u =>
    u.url === 'https://nextjs.org/docs/app/api-reference/directives/use-cache'
  );
  assert.ok(useCache, "'use cache' must appear for Next 15+");
});

test('sanitizeCitations strips unknown URL', async () => {
  const rec = { citations: [
    'https://vercel.com/docs/caching/cdn-cache',
    'https://example.com/totally-fake',
  ]};
  const { rec: out, strippedUnknown, strippedVersion } = await sanitizeCitations(rec, 'next', '15.0.0');
  assert.equal(out.citations.length, 1);
  assert.equal(strippedUnknown.length, 1);
  assert.equal(strippedVersion.length, 0);
  assert.equal(strippedUnknown[0], 'https://example.com/totally-fake');
});

test('sanitizeCitations strips version-mismatched URL', async () => {
  const rec = { citations: [
    'https://nextjs.org/docs/app/api-reference/directives/use-cache',
  ]};
  const { rec: out, strippedVersion } = await sanitizeCitations(rec, 'next', '13.4.0');
  assert.equal(out.citations.length, 0);
  assert.equal(strippedVersion.length, 1);
});

test('sanitizeCitations: skill-rule refs are version-aware', async () => {
  // server-after-nonblocking is next@>=15.0.0 (after() is 15+).
  const rec = { citations: ['vercel-react-best-practices:server-after-nonblocking'] };
  const { strippedVersion: vNext14 } = await sanitizeCitations(rec, 'next', '14.0.0');
  // sanitizeCitations mutates the rec — reset before re-running.
  rec.citations = ['vercel-react-best-practices:server-after-nonblocking'];
  const { rec: outNext15 } = await sanitizeCitations(rec, 'next', '15.0.0');

  assert.equal(vNext14.length, 1, 'after() should not match Next 14');
  assert.equal(outNext15.citations.length, 1, 'after() should match Next 15');
});
