import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/region-pin-in-config.mjs';

const f = (path, content) => ({ path, content });

test('region-pin-in-config: metadata sane', () => {
  assert.equal(metadata.id, 'region-pin-in-config');
  assert.equal(metadata.trafficIndependent, true);
});

test('region-pin-in-config: catches single-region pin in vercel.json', () => {
  const vercel = JSON.stringify({ regions: ['iad1'] });
  const findings = scan({ files: [f('vercel.json', vercel)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'vercel-json-single');
  assert.deepEqual(findings[0].regions, ['iad1']);
});

test('region-pin-in-config: catches multi-region list in vercel.json', () => {
  const vercel = JSON.stringify({ regions: ['iad1', 'sfo1', 'fra1'] });
  const findings = scan({ files: [f('vercel.json', vercel)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'vercel-json-list');
  assert.deepEqual(findings[0].regions, ['iad1', 'sfo1', 'fra1']);
});

test('region-pin-in-config: catches segment-level preferredRegion string', () => {
  const file = `export const preferredRegion = 'fra1';\nexport default function Page() { return null; }`;
  const findings = scan({ files: [f('app/page.tsx', file)] });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'segment-preferred');
  assert.deepEqual(findings[0].regions, ['fra1']);
});

test('region-pin-in-config: catches segment-level preferredRegion array', () => {
  const file = `export const preferredRegion = ['iad1', 'sfo1'];\nexport default function Page() {}`;
  const findings = scan({ files: [f('app/page.tsx', file)] });
  assert.equal(findings.length, 1);
  assert.deepEqual(findings[0].regions, ['iad1', 'sfo1']);
});

test('region-pin-in-config: SILENT when vercel.json has no regions field', () => {
  const findings = scan({ files: [f('vercel.json', JSON.stringify({ buildCommand: 'next build' }))] });
  assert.equal(findings.length, 0);
});

test('region-pin-in-config: SILENT on page.tsx without preferredRegion', () => {
  const findings = scan({ files: [f('app/page.tsx', `export default function Page() {}`)] });
  assert.equal(findings.length, 0);
});
