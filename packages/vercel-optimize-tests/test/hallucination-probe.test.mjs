import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCitations, isKnownUrl } from '../../../skills/vercel-optimize/lib/citations.mjs';
import { applyDollarStrip } from '../../../skills/vercel-optimize/lib/impact-magnitude.mjs';

test('fabricated URL is stripped by unknown-citation sanitizer', async () => {
  const rec = {
    citations: [
      'https://vercel.com/docs/some-page-that-was-invented-by-the-llm',
      'https://vercel.com/docs/caching/cdn-cache',
    ],
  };

  const { rec: out, strippedUnknown } = await sanitizeCitations(rec, 'next', '15.0.0');

  assert.equal(out.citations.length, 1, 'real URL kept');
  assert.equal(out.citations[0], 'https://vercel.com/docs/caching/cdn-cache');
  assert.equal(strippedUnknown.length, 1, 'fabricated URL stripped');
  assert.equal(strippedUnknown[0], 'https://vercel.com/docs/some-page-that-was-invented-by-the-llm');
});

test("'use cache' citation recommended to Next 13 user gets stripped", async () => {
  // 'use cache' is Next 15+ only.
  const rec = {
    citations: ['https://nextjs.org/docs/app/api-reference/directives/use-cache'],
  };

  const { rec: out, strippedVersion } = await sanitizeCitations(rec, 'next', '13.4.0');

  assert.equal(out.citations.length, 0, 'invalid citation removed');
  assert.equal(strippedVersion.length, 1, 'version-mismatch stripped');
});

test("after() citation recommended to Next 14 user gets stripped (15+ only)", async () => {
  const rec = {
    citations: ['https://nextjs.org/docs/app/api-reference/functions/after'],
  };
  const { rec: out, strippedVersion } = await sanitizeCitations(rec, 'next', '14.2.0');
  assert.equal(out.citations.length, 0);
  assert.equal(strippedVersion.length, 1);
});

test('all-citation rec marked needsReview when every URL got stripped', async () => {
  const rec = {
    citations: [
      'https://example.com/totally-fake',
      'https://nextjs.org/docs/app/api-reference/directives/use-cache',
    ],
  };
  // Next 13 user citing a fake URL + a Next 15 feature → both stripped.
  // The caller is expected to set needsReview when citations==[];
  // sanitizeCitations doesn't mutate that field (see recommendations.md).
  const { rec: out } = await sanitizeCitations(rec, 'next', '13.4.0');
  assert.equal(out.citations.length, 0);
});

test('$N money literal in `what` field gets replaced with "the billed cost"', () => {
  const rec = {
    what: 'Add Cache-Control to cut $340/mo from Edge Requests',
    why: 'Function invocations happen on every request',
  };
  applyDollarStrip(rec);
  assert.ok(!rec.what.includes('$340/mo'), 'precise dollar amount must be stripped');
  assert.ok(rec.what.includes('the billed cost'));
  assert.ok(rec.sanitizerTrail.some((t) => t.startsWith('$-strip:')));
});

test('Postgres $1 placeholder inside backticks is preserved', () => {
  const rec = {
    fix: 'Use parameterized query: `SELECT * FROM users WHERE id = $1`. This saves $200/mo.',
  };
  applyDollarStrip(rec);
  assert.ok(rec.fix.includes('the billed cost'));
  // $1 is preserved because the regex skips single-digit literals (no decimal/suffix).
  assert.ok(rec.fix.includes('$1'), 'Postgres placeholder preserved');
});

test('triple-backtick code fence with $5 example is preserved', () => {
  const rec = {
    fix: 'Filter expensive items: ```sql\nSELECT * FROM items WHERE price > $5\n```\nReduces $100/mo of compute.',
  };
  applyDollarStrip(rec);
  assert.ok(rec.fix.includes('price > $5'));
  assert.ok(rec.fix.includes('the billed cost'));
  assert.ok(!rec.fix.includes('$100/mo'));
});

test('skill-rule citation format is recognized as valid', async () => {
  // skill:rule refs aren't URLs — the harness resolves them through lookupSkillRule.
  const known = await isKnownUrl('vercel-react-best-practices:async-parallel');
  assert.equal(known, false, "skill-rule isn't a URL in the library");

  const rec = { citations: ['vercel-react-best-practices:async-parallel'] };
  const { rec: out, strippedUnknown } = await sanitizeCitations(rec, 'next', '15.0.0');
  assert.equal(strippedUnknown.length, 0, 'skill-rule reference accepted');
  assert.equal(out.citations.length, 1);
});
