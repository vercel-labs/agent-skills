import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/cache-components-suspense-dedupe.mjs';

const f = (path, content) => ({ path, content });

test('cache-components-suspense-dedupe: metadata sane', () => {
  assert.equal(metadata.id, 'cache-components-suspense-dedupe');
  assert.equal(metadata.trafficIndependent, false);
});

test('cache-components-suspense-dedupe: fires on repeated fetch literal across 2+ Suspense boundaries', () => {
  const findings = scan({
    files: [
      f('app/dashboard/page.tsx',
        `'use cache'
import { Suspense } from 'react';

async function User() {
  const u = await fetch('https://api.example.com/profile');
  return <div>{u.name}</div>;
}
async function Org() {
  const u = await fetch('https://api.example.com/profile');
  return <div>{u.org}</div>;
}
export default function Page() {
  return (
    <>
      <Suspense fallback={<div />}><User /></Suspense>
      <Suspense fallback={<div />}><Org /></Suspense>
    </>
  );
}`),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'fetch-literal');
  assert.match(findings[0].evidence, /profile/);
});

test('cache-components-suspense-dedupe: fires on repeated helper call across 2+ Suspense boundaries', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `'use cache'
import { Suspense } from 'react';

async function A() {
  const d = await getUserData();
  return <span>{d.id}</span>;
}
async function B() {
  const d = await getUserData();
  return <span>{d.email}</span>;
}
export default function Page() {
  return (<>
    <Suspense><A /></Suspense>
    <Suspense><B /></Suspense>
  </>);
}`),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].subtype, 'helper-call');
  assert.match(findings[0].evidence, /getUserData/);
});

test('cache-components-suspense-dedupe: SILENT when only one Suspense boundary', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `'use cache'
import { Suspense } from 'react';
async function A() {
  return await fetch('/api/x');
}
export default function Page() {
  return <Suspense><A /></Suspense>;
}`),
    ],
  });
  assert.equal(findings.length, 0);
});

test('cache-components-suspense-dedupe: SILENT when no repeated call across boundaries', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `'use cache'
import { Suspense } from 'react';
async function A() { return await fetch('/api/a'); }
async function B() { return await fetch('/api/b'); }
export default function Page() {
  return (<>
    <Suspense><A /></Suspense>
    <Suspense><B /></Suspense>
  </>);
}`),
    ],
  });
  assert.equal(findings.length, 0);
});

test('cache-components-suspense-dedupe: SILENT without "use cache" directive', () => {
  const findings = scan({
    files: [
      f('app/page.tsx',
        `import { Suspense } from 'react';
async function A() { return await fetch('/api/x'); }
async function B() { return await fetch('/api/x'); }
export default function Page() {
  return (<>
    <Suspense><A /></Suspense>
    <Suspense><B /></Suspense>
  </>);
}`),
    ],
  });
  assert.equal(findings.length, 0);
});
