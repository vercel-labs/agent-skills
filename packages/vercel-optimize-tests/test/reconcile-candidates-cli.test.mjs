import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'reconcile-candidates.mjs');

test('reconcile-candidates CLI: emits deterministic pre-resolved records', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-reconcile-cli-'));
  try {
    const investigationPath = join(scratch, 'investigation.json');
    const outPath = join(scratch, 'reconciled.json');
    await writeFile(investigationPath, JSON.stringify({
      schemaVersion: '1.0',
      toLaunch: [
        {
          kind: 'slow_route',
          route: '/docs',
          o11ySignal: 'inv=10000,p95=900ms',
          evidence: { deepDive: { latency: { p95: 220 } } },
        },
        {
          kind: 'slow_route',
          route: '/blog',
          o11ySignal: 'inv=10000,p95=900ms',
          evidence: { deepDive: { latency: { p95: 900 } } },
        },
      ],
      platform: [],
    }), 'utf-8');

    const { stderr } = await exec('node', [SCRIPT, investigationPath, '--out', outPath, '--no-timestamp']);
    const out = JSON.parse(await readFile(outPath, 'utf-8'));

    assert.match(stderr, /dropped 1 candidate/);
    assert.equal(out.reconciledAt, null);
    assert.deepEqual(out.toLaunch.map((c) => c.route), ['/blog']);
    assert.equal(out.preResolvedRecords.length, 1);
    assert.equal(out.preResolvedRecords[0].candidateRef, 'slow_route:/docs');
    assert.equal(out.preResolvedRecords[0].reconciliation.reasonCode, 'metric_mismatch');
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
