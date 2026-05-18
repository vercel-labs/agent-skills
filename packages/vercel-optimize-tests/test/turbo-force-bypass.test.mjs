import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/turbo-force-bypass.mjs';

const f = (path, content) => ({ path, content });

test('turbo-force-bypass: metadata sane', () => {
  assert.equal(metadata.id, 'turbo-force-bypass');
  assert.equal(metadata.trafficIndependent, true);
});

test('turbo-force-bypass: catches TURBO_FORCE=true in package.json build script', () => {
  const pkg = JSON.stringify({
    scripts: {
      build: 'TURBO_FORCE=true turbo run build',
    },
  });
  const findings = scan({ files: [f('package.json', pkg)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'force-flag');
  assert.match(findings[0].evidence, /TURBO_FORCE=true/);
});

test('turbo-force-bypass: catches --force flag on turbo run', () => {
  const pkg = JSON.stringify({
    scripts: { build: 'turbo run build --force' },
  });
  const findings = scan({ files: [f('package.json', pkg)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'force-flag');
});

test('turbo-force-bypass: catches tasks.build.cache:false in turbo.json', () => {
  const turbo = JSON.stringify({
    tasks: {
      build: {
        cache: false,
        outputs: ['.next/**'],
      },
    },
  });
  const findings = scan({ files: [f('turbo.json', turbo)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'cache-disabled');
});

test('turbo-force-bypass: catches monorepo without ignoreCommand', () => {
  const turbo = JSON.stringify({ tasks: { build: {} } });
  const vercel = JSON.stringify({ buildCommand: 'turbo run build' });
  const findings = scan({
    files: [
      f('turbo.json', turbo),
      f('vercel.json', vercel),
    ],
  });
  // Two files referenced (turbo.json + vercel.json) — only one finding for no-ignore-step.
  const noIgnoreStep = findings.filter((x) => x.subtype === 'no-ignore-step');
  assert.equal(noIgnoreStep.length, 1);
  assert.equal(noIgnoreStep[0].file, 'vercel.json');
});

test('turbo-force-bypass: SILENT when ignoreCommand is configured', () => {
  const turbo = JSON.stringify({ tasks: { build: {} } });
  const vercel = JSON.stringify({
    buildCommand: 'turbo run build',
    ignoreCommand: 'npx turbo-ignore',
  });
  const findings = scan({
    files: [
      f('turbo.json', turbo),
      f('vercel.json', vercel),
    ],
  });
  assert.equal(findings.length, 0);
});

test('turbo-force-bypass: SILENT on a clean turbo.json without force flags', () => {
  const turbo = JSON.stringify({
    tasks: {
      build: { cache: true, outputs: ['.next/**'] },
    },
  });
  const findings = scan({ files: [f('turbo.json', turbo)] });
  assert.equal(findings.length, 0);
});

test('turbo-force-bypass: SILENT when package.json has no scripts section', () => {
  const findings = scan({ files: [f('package.json', JSON.stringify({ name: 'x' }))] });
  assert.equal(findings.length, 0);
});

test('turbo-force-bypass: tolerates malformed JSON without throwing', () => {
  const findings = scan({ files: [f('package.json', '{not json}')] });
  assert.equal(findings.length, 0);
});
