// Drift-catcher: every metric query must use the same TIME_WINDOW constant.
// `vercel metrics` defaults --since to 1h, which silently mismatches rollups.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TIME_WINDOW, QUERIES } from '../../../skills/vercel-optimize/lib/queries.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

test('TIME_WINDOW: constant exported and equal to "14d"', () => {
  assert.equal(TIME_WINDOW, '14d');
});

test('QUERIES: no entry hard-pins a different `since` value', () => {
  // Registry doesn't accept per-entry `since` — always TIME_WINDOW at the call site.
  for (const q of QUERIES) {
    assert.equal(
      q.since,
      undefined,
      `query ${q.id} pinned a per-entry since='${q.since}' — must use TIME_WINDOW only`
    );
  }
});

test('collect-signals.mjs: passes TIME_WINDOW (not a string literal) to queryMetric', async () => {
  const src = await readFile(join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'collect-signals.mjs'), 'utf-8');
  assert.ok(src.includes("import { QUERIES, TIME_WINDOW") || src.includes("TIME_WINDOW"),
    'collect-signals must import TIME_WINDOW');
  // Reject any literal `since: 'Nd'` as a regression.
  const literalSince = src.match(/since:\s*['"][0-9]+[a-z]+['"]/g);
  assert.equal(literalSince, null,
    `collect-signals.mjs must not hard-pin since to a literal; found: ${literalSince}`);
});
