#!/usr/bin/env node
import { parseArgs, requireFlag, boolFlag } from './lib/args.mjs';
import { openDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';

const { flags } = parseArgs();

try {
  const sql = requireFlag(flags, 'sql');
  if (containsWrite(sql)) {
    throw new Error('query.mjs is read-only — write/DDL statements are not allowed');
  }
  const db = openDb({ readonly: true });
  try {
    if (boolFlag(flags, 'explain')) {
      const plan = db.prepare(`EXPLAIN QUERY PLAN ${sql}`).all();
      ok({ explain: plan });
    } else {
      const rows = db.prepare(sql).all();
      ok(rows);
    }
  } finally {
    db.close();
  }
} catch (err) {
  fail(err.message);
}

function containsWrite(sql) {
  const stripped = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .toUpperCase();
  if (!/^(SELECT|WITH|PRAGMA|EXPLAIN)\b/.test(stripped)) return true;
  return /\b(INSERT|UPDATE|DELETE|REPLACE|DROP|ALTER|CREATE|TRUNCATE|ATTACH|DETACH|REINDEX|VACUUM)\b/.test(
    stripped,
  );
}
