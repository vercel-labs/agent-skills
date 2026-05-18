import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { annotateCodebaseScan, mergeSignals } from '../../../skills/vercel-optimize/scripts/merge-signals.mjs';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'merge-signals.mjs');

const signals = {
  schemaVersion: '1.2',
  projectId: 'prj_123',
  metrics: { fnDurationP95ByRoute: { ok: true, rows: [] } },
};

const codebase = {
  schemaVersion: '1.0',
  rootDir: '/repo/apps/app',
  stack: { framework: 'next', frameworkVersion: '16.0.0' },
  routes: [{ routePath: '/', file: 'src/app/page.tsx', type: 'page' }],
  findings: [],
};

test('mergeSignals: keeps collect output top-level and attaches codebase scan', () => {
  const merged = mergeSignals(signals, codebase);
  assert.equal(merged.projectId, 'prj_123');
  assert.equal(merged.metrics.fnDurationP95ByRoute.ok, true);
  assert.deepEqual(merged.codebase.routes, codebase.routes);
});

test('merge-signals CLI: writes deterministic merged JSON', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vo-merge-signals-'));
  const signalsPath = join(root, 'signals.json');
  const codebasePath = join(root, 'codebase.json');
  const outPath = join(root, 'merged.json');
  await Promise.all([
    writeFile(signalsPath, JSON.stringify(signals), 'utf-8'),
    writeFile(codebasePath, JSON.stringify(codebase), 'utf-8'),
  ]);

  await exec('node', [SCRIPT, signalsPath, codebasePath, '--out', outPath]);
  const merged = JSON.parse(await readFile(outPath, 'utf-8'));
  assert.equal(merged.projectId, 'prj_123');
  assert.equal(merged.codebase.stack.framework, 'next');
});

test('merge-signals CLI: refuses stale output unless forced', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vo-merge-signals-stale-'));
  const signalsPath = join(root, 'signals.json');
  const codebasePath = join(root, 'codebase.json');
  const outPath = join(root, 'merged.json');
  await Promise.all([
    writeFile(signalsPath, JSON.stringify(signals), 'utf-8'),
    writeFile(codebasePath, JSON.stringify(codebase), 'utf-8'),
    writeFile(outPath, '{}', 'utf-8'),
  ]);

  await assert.rejects(
    exec('node', [SCRIPT, signalsPath, codebasePath, '--out', outPath]),
    /output file already exists/
  );
  await exec('node', [SCRIPT, signalsPath, codebasePath, '--out', outPath, '--force']);
  const merged = JSON.parse(await readFile(outPath, 'utf-8'));
  assert.equal(merged.codebase.routes.length, 1);
});

test('mergeSignals: rejects non-scan codebase input', () => {
  assert.throws(
    () => mergeSignals(signals, { routes: [] }),
    /scan-codebase output/
  );
});

test('annotateCodebaseScan: attaches route observability to scanner findings', () => {
  const merged = annotateCodebaseScan({
    metrics: {
      fnStatusByRoute: { rows: [{ route: '/', http_status: '200', value: 1234 }] },
      fnDurationP95ByRoute: { rows: [{ route: '/', value: 678.4 }] },
      requestsByRouteCache: {
        rows: [
          { route: '/', cache_result: 'HIT', value: 100 },
          { route: '/', cache_result: 'MISS', value: 25 },
        ],
      },
    },
  }, {
    ...codebase,
    findings: [{ pattern: 'missing-cache-headers', file: 'src/app/page.tsx', route: '/', trafficIndependent: false }],
  });

  assert.equal(merged.findings[0].o11ySignal, 'inv=1234,p95=678ms,cache=80%');
});

test('annotateCodebaseScan: marks unmapped and cold scanner findings', () => {
  const merged = annotateCodebaseScan({
    metrics: {
      fnStatusByRoute: { rows: [{ route: '/active', http_status: '200', value: 20 }] },
    },
  }, {
    ...codebase,
    findings: [
      { pattern: 'missing-cache-headers', file: 'src/app/page.tsx', trafficIndependent: false },
      { pattern: 'missing-cache-headers', file: 'src/app/cold/page.tsx', route: '/cold', trafficIndependent: false },
    ],
  });

  assert.equal(merged.findings[0].o11ySignal, 'NO-ROUTE-MAPPING');
  assert.equal(merged.findings[1].o11ySignal, 'COLD-PATH');
});

test('annotateCodebaseScan: does not attach dynamic-route metrics to unrelated static scanner routes', () => {
  const merged = annotateCodebaseScan({
    metrics: {
      fnStatusByRoute: {
        rows: [
          { route: '/docs/llm-digest/[...slug]', http_status: '200', value: 6302730 },
          { route: '/docs/[[...slug]]', http_status: '200', value: 141382 },
        ],
      },
      fnDurationP95ByRoute: {
        rows: [
          { route: '/docs/llm-digest/[...slug]', value: 28 },
          { route: '/docs/[[...slug]]', value: 1028 },
        ],
      },
    },
  }, {
    ...codebase,
    findings: [
      {
        pattern: 'missing-cache-headers',
        file: 'app/(docs-site)/docs/[version]/llms.txt/route.ts',
        route: '/docs/[version]/llms.txt',
        trafficIndependent: false,
      },
      {
        pattern: 'missing-cache-headers',
        file: 'app/(docs-site)/docs/llms-full.txt/route.ts',
        route: '/docs/llms-full.txt',
        trafficIndependent: false,
      },
    ],
  });

  assert.equal(merged.findings[0].o11ySignal, 'COLD-PATH');
  assert.equal(merged.findings[1].o11ySignal, 'COLD-PATH');
});
