import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'collect-sub-agent-outputs.mjs');

async function withScratch(fn) {
  const scratch = await mkdtemp(join(tmpdir(), 'vo-collect-agent-outputs-'));
  try {
    return await fn(scratch);
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

async function writeManifest(root, briefs = [
  { group: 'toLaunch', index: 0, candidateRef: 'slow_route:/a' },
  { group: 'toLaunch', index: 1, candidateRef: 'uncached_route:/b' },
]) {
  const manifestPath = join(root, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify({ schemaVersion: '1.0', briefs }), 'utf-8');
  return manifestPath;
}

test('collect-sub-agent-outputs: extracts prose/fenced JSON and orders by manifest', async () => {
  await withScratch(async (scratch) => {
    const manifestPath = await writeManifest(scratch);
    const outputs = join(scratch, 'outputs');
    await mkdir(outputs);
    await writeFile(join(outputs, 'z-toLaunch-1.md'), [
      'The route is POST-heavy.',
      '```json',
      '{"abstain":true,"candidateRef":"uncached_route:/b","reason":"POST-only route, no cacheable response."}',
      '```',
    ].join('\n'));
    await writeFile(join(outputs, 'a-random.md'), [
      'I found the source.',
      '{"what":"Start the data promise earlier","candidateRef":"slow_route:/a","affectedFiles":["app/page.tsx"]}',
      'Done.',
    ].join('\n'));

    const { stdout, stderr } = await exec('node', [SCRIPT, '--manifest', manifestPath, outputs]);
    const records = JSON.parse(stdout);
    assert.deepEqual(records.map((r) => r.candidateRef), ['slow_route:/a', 'uncached_route:/b']);
    assert.equal(records[1].abstain, true);
    assert.match(stderr, /1 recommendation draft\(s\), 1 found no supported change/);
  });
});

test('collect-sub-agent-outputs: balanced extraction handles braces inside strings', async () => {
  await withScratch(async (scratch) => {
    const out = join(scratch, 'out.md');
    await writeFile(out, 'prefix {"abstain":true,"candidateRef":"slow_route:/x","reason":"body used {cached} marker"} suffix');

    const { stdout } = await exec('node', [SCRIPT, out]);
    const records = JSON.parse(stdout);
    assert.equal(records[0].reason, 'body used {cached} marker');
  });
});

test('collect-sub-agent-outputs: unwraps recommendation envelopes', async () => {
  await withScratch(async (scratch) => {
    const out = join(scratch, 'out.json');
    await writeFile(out, JSON.stringify({
      data: {
        recommendations: [
          { what: 'Add route-level cache headers', candidateRef: 'uncached_route:/products' },
        ],
      },
    }), 'utf-8');

    const { stdout } = await exec('node', [SCRIPT, out]);
    const records = JSON.parse(stdout);
    assert.deepEqual(records.map((r) => r.candidateRef), ['uncached_route:/products']);
  });
});

test('collect-sub-agent-outputs: fills candidateRef from manifest filename when unambiguous', async () => {
  await withScratch(async (scratch) => {
    const manifestPath = await writeManifest(scratch, [
      { group: 'toLaunch', index: 0, candidateRef: 'slow_route:/a' },
    ]);
    const out = join(scratch, 'toLaunch-0.md');
    await writeFile(out, '{"what":"Start promises before awaiting","affectedFiles":["app/page.tsx"]}', 'utf-8');

    const { stdout } = await exec('node', [SCRIPT, '--manifest', manifestPath, out]);
    const records = JSON.parse(stdout);
    assert.equal(records[0].candidateRef, 'slow_route:/a');
  });
});

test('collect-sub-agent-outputs: rejects manifest candidateRef mismatches', async () => {
  await withScratch(async (scratch) => {
    const manifestPath = await writeManifest(scratch, [
      { group: 'toLaunch', index: 0, candidateRef: 'slow_route:/a' },
    ]);
    const out = join(scratch, 'out.json');
    await writeFile(out, '{"what":"Wrong candidate","candidateRef":"slow_route:/other"}', 'utf-8');

    await assert.rejects(
      exec('node', [SCRIPT, '--manifest', manifestPath, out]),
      (err) => {
        assert.equal(err.code, 2);
        assert.match(err.stderr, /unknown candidateRef slow_route:\/other/);
        assert.match(err.stderr, /missing output for candidateRef slow_route:\/a/);
        return true;
      },
    );
  });
});

test('collect-sub-agent-outputs: parse failures warn by default and fail in strict mode', async () => {
  await withScratch(async (scratch) => {
    const good = join(scratch, 'good.json');
    const bad = join(scratch, 'bad.md');
    await writeFile(good, '{"abstain":true,"candidateRef":"slow_route:/x","reason":"no source mechanism"}', 'utf-8');
    await writeFile(bad, 'not json', 'utf-8');

    const { stdout, stderr } = await exec('node', [SCRIPT, good, bad]);
    assert.equal(JSON.parse(stdout).length, 1);
    assert.match(stderr, /parse failed/);

    await assert.rejects(
      exec('node', [SCRIPT, '--strict', good, bad]),
      (err) => {
        assert.equal(err.code, 2);
        assert.match(err.stderr, /no valid JSON object or array found/);
        return true;
      },
    );
  });
});

test('collect-sub-agent-outputs: --out writes 2-space JSON with trailing newline', async () => {
  await withScratch(async (scratch) => {
    const source = join(scratch, 'source.json');
    const outPath = join(scratch, 'recommendations.json');
    await writeFile(source, '{"abstain":true,"candidateRef":"slow_route:/x","reason":"no fit"}', 'utf-8');

    const { stdout } = await exec('node', [SCRIPT, source, '--out', outPath]);
    assert.equal(stdout, '');
    const written = await readFile(outPath, 'utf-8');
    assert.ok(written.endsWith('\n'));
    assert.match(written, /\n  \{\n    "abstain": true,/);
  });
});

test('collect-sub-agent-outputs: includes pre-resolved records from manifest', async () => {
  await withScratch(async (scratch) => {
    const manifestPath = await writeManifest(scratch, [
      { group: 'toLaunch', index: 0, candidateRef: 'slow_route:/a' },
    ]);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
    manifest.preResolvedRecords = [
      {
        abstain: true,
        candidateRef: 'cache_header_gap:/api/og',
        reason: 'Static scanner finding had no matching metric signal.',
      },
    ];
    await writeFile(manifestPath, JSON.stringify(manifest), 'utf-8');

    const out = join(scratch, 'toLaunch-0.md');
    await writeFile(out, '{"what":"Start promises before awaiting","affectedFiles":["app/page.tsx"]}', 'utf-8');

    const { stdout } = await exec('node', [SCRIPT, '--manifest', manifestPath, out]);
    const records = JSON.parse(stdout);
    assert.deepEqual(records.map((r) => r.candidateRef), [
      'cache_header_gap:/api/og',
      'slow_route:/a',
    ]);
    assert.equal(records[0].abstain, true);
  });
});
