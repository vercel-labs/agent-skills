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
const RECONCILE = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'reconcile-candidates.mjs');
const PREPARE = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'prepare-investigation-brief.mjs');
const COLLECT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'collect-sub-agent-outputs.mjs');
const RENDER = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'render-report.mjs');

test('reconciled pre-resolved records flow through collect and render', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-reconcile-pipeline-'));
  try {
    const mergedPath = join(scratch, 'merged.json');
    const gatePath = join(scratch, 'gate.json');
    const investigationPath = join(scratch, 'investigation.json');
    const reconciledPath = join(scratch, 'reconciled.json');
    const manifestPath = join(scratch, 'manifest.json');
    const recsPath = join(scratch, 'recommendations.json');

    const signals = {
      project: { name: 'demo' },
      stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
      observabilityPlus: true,
      plan: { plan: 'pro' },
      codebase: {
        stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
        routes: [{ routePath: '/docs', file: 'app/docs/page.tsx', type: 'page' }],
      },
      metrics: {},
    };
    const gate = {
      toLaunch: [{ kind: 'slow_route', route: '/docs' }],
      platform: [],
      gated: [],
      budget: { maxCandidates: 6, source: 'default' },
    };
    const investigation = {
      toLaunch: [{
        kind: 'slow_route',
        route: '/docs',
        o11ySignal: 'inv=10000,p95=900ms',
        evidence: { deepDive: { latency: { p95: 220 } } },
      }],
      platform: [],
    };

    await Promise.all([
      writeFile(mergedPath, JSON.stringify(signals), 'utf-8'),
      writeFile(gatePath, JSON.stringify(gate), 'utf-8'),
      writeFile(investigationPath, JSON.stringify(investigation), 'utf-8'),
    ]);

    await exec('node', [RECONCILE, investigationPath, '--gate', gatePath, '--out', reconciledPath, '--no-timestamp']);
    const { stdout: manifestJson } = await exec('node', [PREPARE, mergedPath, reconciledPath, '--list']);
    await writeFile(manifestPath, manifestJson, 'utf-8');
    await exec('node', [COLLECT, '--manifest', manifestPath, '--out', recsPath]);
    const { stdout: report } = await exec('node', [RENDER, recsPath, gatePath, mergedPath, '--project', 'demo', '--no-timestamp']);

    const recs = JSON.parse(await readFile(recsPath, 'utf-8'));
    assert.equal(recs.length, 1);
    assert.equal(recs[0].candidateRef, 'slow_route:/docs');
    assert.match(report, /## Observations from investigation/);
    assert.match(report, /metric mismatch/i);
    assert.match(report, /## Investigated, no change recommended/);
    assert.match(report, /Slow route on \/docs/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
