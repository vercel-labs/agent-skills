import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/use-cache-date-stamp.mjs';

const f = (path, content) => ({ path, content });

test('use-cache-date-stamp: metadata sane', () => {
  assert.equal(metadata.id, 'use-cache-date-stamp');
  assert.equal(metadata.trafficIndependent, false);
});

test('use-cache-date-stamp: catches module-scope new Date() in a "use cache" file', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `'use cache'
const buildTime = new Date();
export default function Page() { return <footer>{buildTime.getFullYear()}</footer>; }`),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].pattern, 'use-cache-date-stamp');
  assert.equal(findings[0].subtype, 'module-scope');
  assert.equal(findings[0].evidence, 'new Date(');
});

test('use-cache-date-stamp: catches Date.now() inside a cached function body', () => {
  const findings = scan({
    files: [
      f('app/lib/data.ts',
        `'use cache'
export async function fetchData() {
  const ts = Date.now();
  return { ts, data: await db.read() };
}`),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].evidence, 'Date.now(');
});

test('use-cache-date-stamp: SILENT on Date.now() inside useEffect', () => {
  const findings = scan({
    files: [
      f('app/components/clock.tsx',
        `'use cache'
'use client'
import { useEffect, useState } from 'react';
export default function Clock() {
  const [t, setT] = useState(0);
  useEffect(() => { setT(Date.now()); }, []);
  return <span>{t}</span>;
}`),
    ],
  });
  assert.equal(findings.length, 0);
});

test('use-cache-date-stamp: SILENT when no "use cache" directive present', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `export default function Page() { return <footer>{new Date().getFullYear()}</footer>; }`),
    ],
  });
  assert.equal(findings.length, 0);
});

test('use-cache-date-stamp: catches Math.random() in a "use cache" file', () => {
  const findings = scan({
    files: [
      f('app/lib/jitter.ts',
        `'use cache'
export function jitter() { return Math.random() * 100; }`),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].evidence, 'Math.random(');
});

test('use-cache-date-stamp: SILENT on file with neither directive nor primitive', () => {
  assert.equal(scan({ files: [f('a.ts', 'export const x = 1;')] }).length, 0);
});

test('use-cache-date-stamp: multiple primitives in same file produce multiple findings', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `'use cache'
const a = new Date();
const b = Date.now();
const c = Math.random();`),
    ],
  });
  assert.equal(findings.length, 3);
});
