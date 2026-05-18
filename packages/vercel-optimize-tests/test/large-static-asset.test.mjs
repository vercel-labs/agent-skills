// fs.stat-based scanner — tests use tmp dirs because the lib walks public/ directly.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/large-static-asset.mjs';

async function withTmpProject(fn) {
  const root = await mkdtemp(join(tmpdir(), 'vo-large-asset-'));
  try {
    await mkdir(join(root, 'public'), { recursive: true });
    await fn(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('large-static-asset: flags files >=500KB', async () => {
  await withTmpProject(async (root) => {
    await writeFile(join(root, 'public', 'hero.mp4'), Buffer.alloc(2_000_000));
    await writeFile(join(root, 'public', 'small.png'), Buffer.alloc(100_000));
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 1);
    assert.equal(findings[0].pattern, 'large-static-asset');
    assert.match(findings[0].file, /public\/hero\.mp4$/);
    assert.equal(findings[0].sizeBytes, 2_000_000);
    assert.match(findings[0].evidence, /2\.00 MB/);
  });
});

test('large-static-asset: silent on assets below 500KB', async () => {
  await withTmpProject(async (root) => {
    await writeFile(join(root, 'public', 'logo.svg'), Buffer.alloc(50_000));
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 0);
  });
});

test('large-static-asset: skips small-but-noisy extensions (ico, manifest, html, txt, xml, json)', async () => {
  await withTmpProject(async (root) => {
    await writeFile(join(root, 'public', 'favicon.ico'), Buffer.alloc(1_000_000));
    await writeFile(join(root, 'public', 'sitemap.xml'), Buffer.alloc(1_000_000));
    await writeFile(join(root, 'public', 'robots.txt'), Buffer.alloc(1_000_000));
    await writeFile(join(root, 'public', 'manifest.webmanifest'), Buffer.alloc(1_000_000));
    await writeFile(join(root, 'public', 'something.json'), Buffer.alloc(1_000_000));
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 0);
  });
});

test('large-static-asset: skips .well-known/', async () => {
  await withTmpProject(async (root) => {
    await mkdir(join(root, 'public', '.well-known'), { recursive: true });
    await writeFile(join(root, 'public', '.well-known', 'apple-developer-merchantid.txt'), Buffer.alloc(2_000_000));
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 0);
  });
});

test('large-static-asset: caps at TOP_N=20 and sorts by size desc', async () => {
  await withTmpProject(async (root) => {
    for (let i = 0; i < 25; i++) {
      await writeFile(join(root, 'public', `vid${i}.mp4`), Buffer.alloc(600_000 + i * 1000));
    }
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 20);
    for (let i = 0; i < findings.length - 1; i++) {
      assert.ok(findings[i].sizeBytes >= findings[i + 1].sizeBytes, 'sorted desc');
    }
  });
});

test('large-static-asset: walks nested directories', async () => {
  await withTmpProject(async (root) => {
    await mkdir(join(root, 'public', 'videos', '2024'), { recursive: true });
    await writeFile(join(root, 'public', 'videos', '2024', 'intro.mp4'), Buffer.alloc(800_000));
    const findings = await scan({ rootDir: root });
    assert.equal(findings.length, 1);
    assert.match(findings[0].file, /public\/videos\/2024\/intro\.mp4$/);
  });
});

test('large-static-asset: returns [] when public/ does not exist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vo-no-public-'));
  try {
    const findings = await scan({ rootDir: root });
    assert.deepEqual(findings, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('large-static-asset: metadata trafficIndependent=true (file size is fixed)', () => {
  // File size is fixed regardless of traffic — scanner-driven gate emits even
  // without route-mapping.
  assert.equal(metadata.trafficIndependent, true);
});
