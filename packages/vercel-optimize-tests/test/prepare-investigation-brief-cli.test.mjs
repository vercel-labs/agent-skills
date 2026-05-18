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
const SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'prepare-investigation-brief.mjs');

const merged = {
  stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
  codebase: {
    stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
    routes: [
      { routePath: '/', file: 'app/layout.tsx', type: 'layout' },
      { routePath: '/docs', file: 'app/docs/page.tsx', type: 'page' },
    ],
  },
};

test('prepare-investigation-brief CLI: manifest includes label, file-aware ref, and pre-resolved records', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-prepare-list-'));
  try {
    const mergedPath = join(scratch, 'merged.json');
    const investigationPath = join(scratch, 'investigation.json');
    await Promise.all([
      writeFile(mergedPath, JSON.stringify(merged), 'utf-8'),
      writeFile(investigationPath, JSON.stringify({
        toLaunch: [
          { kind: 'slow_route', route: '/docs', o11ySignal: 'inv=1000,p95=900ms' },
          { kind: 'image_optimization', files: ['app/hero.tsx'], o11ySignal: 'image transformations: 2000' },
        ],
        platform: [],
        preResolvedRecords: [
          { abstain: true, candidateRef: 'slow_route:/fast-now', reason: 'metric mismatch' },
        ],
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, mergedPath, investigationPath, '--list']);
    const manifest = JSON.parse(stdout);

    assert.equal(manifest.totalBriefs, 2);
    assert.equal(manifest.briefs[0].candidateRef, 'slow_route:/docs');
    assert.equal(manifest.briefs[0].label, 'Slow route on /docs');
    assert.equal(manifest.briefs[1].candidateRef, 'image_optimization:<account>#app/hero.tsx');
    assert.equal(manifest.briefs[1].label, 'Image optimization on app/hero.tsx');
    assert.equal(manifest.preResolvedRecords[0].candidateRef, 'slow_route:/fast-now');
    assert.equal(manifest.fanoutPlan.totalFamilies, 2);
    assert.equal(manifest.fanoutPlan.families[0].primaryBrief.candidateRef, 'slow_route:/docs');
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('prepare-investigation-brief CLI: manifest groups same-file candidates into fanout families', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-prepare-family-'));
  try {
    const mergedPath = join(scratch, 'merged.json');
    const investigationPath = join(scratch, 'investigation.json');
    await Promise.all([
      writeFile(mergedPath, JSON.stringify(merged), 'utf-8'),
      writeFile(investigationPath, JSON.stringify({
        toLaunch: [
          { kind: 'uncached_route', route: '/docs', files: ['app/docs/page.tsx'], o11ySignal: 'inv=1000,cache=0%,get=100%' },
          { kind: 'uncached_route', route: '/docs?variant=tree', files: ['app/docs/page.tsx'], o11ySignal: 'inv=900,cache=0%,get=100%' },
        ],
        platform: [],
      }), 'utf-8'),
    ]);

    const { stdout } = await exec('node', [SCRIPT, mergedPath, investigationPath, '--list']);
    const manifest = JSON.parse(stdout);

    assert.equal(manifest.totalBriefs, 2);
    assert.equal(manifest.fanoutPlan.totalFamilies, 1);
    assert.equal(manifest.fanoutPlan.families[0].totalBriefs, 2);
    assert.equal(manifest.fanoutPlan.families[0].relatedBriefs[0].candidateRef, 'uncached_route:/docs?variant=tree');
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});

test('prepare-investigation-brief CLI: output files refuse stale overwrites unless --force', async () => {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-prepare-force-'));
  try {
    const mergedPath = join(scratch, 'merged.json');
    const investigationPath = join(scratch, 'investigation.json');
    const outPath = join(scratch, 'brief.md');
    await Promise.all([
      writeFile(mergedPath, JSON.stringify(merged), 'utf-8'),
      writeFile(investigationPath, JSON.stringify({
        toLaunch: [{ kind: 'slow_route', route: '/docs', o11ySignal: 'inv=1000,p95=900ms' }],
        platform: [],
      }), 'utf-8'),
      writeFile(outPath, 'stale brief\n', 'utf-8'),
    ]);

    await assert.rejects(
      exec('node', [SCRIPT, mergedPath, investigationPath, '--group', 'toLaunch', '--index', '0', '--out', outPath, '--deterministic']),
      /output file already exists/,
    );

    await exec('node', [SCRIPT, mergedPath, investigationPath, '--group', 'toLaunch', '--index', '0', '--out', outPath, '--deterministic', '--force']);
    const brief = await readFile(outPath, 'utf-8');
    assert.match(brief, /candidateRef: `slow_route:\/docs`/);
    assert.doesNotMatch(brief, /stale brief/);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
});
