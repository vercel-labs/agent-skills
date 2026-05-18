import { test } from 'node:test';
import assert from 'node:assert/strict';
import { impactMagnitude, stripDollarLiterals, applyDollarStrip } from '../../../skills/vercel-optimize/lib/impact-magnitude.mjs';

test('impactMagnitude: maps to bucket phrases, never to precise dollars', () => {
  // high tier = 0.4x; values shown are post-multiplier.
  const tiers = [
    { args: { currentCost: 10, impactTier: 'high' }, expected: 'negligible' },
    { args: { currentCost: 100, impactTier: 'high' }, expected: 'small' },
    { args: { currentCost: 1000, impactTier: 'high' }, expected: 'medium' },
    { args: { currentCost: 10_000, impactTier: 'high' }, expected: 'large' },
    { args: { currentCost: 100_000, impactTier: 'high' }, expected: 'very-large' },
  ];
  for (const { args, expected } of tiers) {
    const out = impactMagnitude(args);
    assert.equal(out.magnitude, expected, `cost=${args.currentCost} tier=${args.impactTier}`);
    assert.ok(!/\$\d/.test(out.phrase), 'phrase must not contain $N literal');
  }
});

test('stripDollarLiterals: strips money shapes, preserves $1 placeholders', () => {
  const cases = [
    { in: 'Save $340/mo by caching',              out: 'Save the billed cost by caching', n: 1 },
    { in: 'Costs $1.5K per month',                out: 'Costs the billed cost per month', n: 1 },
    { in: '$0.05/1K transforms',                  out: 'the billed cost transforms', n: 1 },
    { in: 'WHERE id = $1::int',                   out: 'WHERE id = $1::int', n: 0 },
    { in: 'Plain text with no money',             out: 'Plain text with no money', n: 0 },
    { in: 'Reduces $1,234 in monthly billing',    out: 'Reduces the billed cost in monthly billing', n: 1 },
  ];
  for (const c of cases) {
    const { text, stripped } = stripDollarLiterals(c.in);
    assert.equal(text, c.out, `input: ${c.in}`);
    assert.equal(stripped, c.n);
  }
});

test('applyDollarStrip: mutates rec fields, records sanitizerTrail', () => {
  const rec = {
    what: 'Save $340/mo',
    why: 'Function invocations happen on every request',
    fix: 'Add Cache-Control. Saves $200/mo.',
  };
  applyDollarStrip(rec);
  assert.equal(rec.what, 'Save the billed cost');
  assert.equal(rec.fix, 'Add Cache-Control. Saves the billed cost.');
  assert.ok(rec.sanitizerTrail);
  assert.ok(rec.sanitizerTrail.some((t) => t.startsWith('$-strip')));
});

test('applyDollarStrip: preserves dollar literals inside code fences', () => {
  const rec = {
    fix: 'Query: ```sql\nSELECT * FROM x WHERE cost > $5\n```\nThis saves $100/mo.',
  };
  applyDollarStrip(rec);
  assert.ok(rec.fix.includes('cost > $5'), 'fence content preserved');
  assert.ok(rec.fix.includes('the billed cost'), 'non-fence stripped');
  assert.ok(!rec.fix.includes('$100/mo'));
});
