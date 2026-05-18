import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { redactSensitiveText } from '../../../skills/vercel-optimize/lib/vercel.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize');

test('redactSensitiveText: removes auth tokens from CLI-visible text', () => {
  const raw = [
    'VERCEL_TOKEN=vercel_secret_1234567890abcdef vercel metrics',
    'vercel metrics --token vercel_secret_abcdef1234567890',
    'Authorization: Bearer abcdefghijklmnopqrstuvwxyz.1234567890',
    '{"token":"secret-json-token-abcdef123456"}',
  ].join('\n');

  const redacted = redactSensitiveText(raw);

  assert.doesNotMatch(redacted, /vercel_secret|abcdefghijklmnopqrstuvwxyz|secret-json-token/);
  assert.match(redacted, /VERCEL_TOKEN=\[REDACTED\]/);
  assert.match(redacted, /--token \[REDACTED\]/);
  assert.match(redacted, /Authorization: \[REDACTED\]/);
  assert.match(redacted, /"token":"\[REDACTED\]"/);
});

test('collect-signals status logs do not print raw project or team IDs', async () => {
  const src = await readFile(join(ROOT, 'scripts', 'collect-signals.mjs'), 'utf-8');

  assert.doesNotMatch(src, /projectId=\$\{project\.projectId\}/);
  assert.doesNotMatch(src, /orgId=\$\{project\.orgId/);
  assert.match(src, /project link resolved/);
});
