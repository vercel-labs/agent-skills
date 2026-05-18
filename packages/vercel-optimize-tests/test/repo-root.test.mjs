// Regression: fixture-site launched from `apps/fixture-site` but recs referenced
// `apps/fixture-site/app/...`, so verify needs the monorepo root.

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pickProbeFile, detectRepoRoot, resolveRepoRoot, deriveRootFromSignals } from '../../../skills/vercel-optimize/lib/repo-root.mjs';

let scratch;
test('setup: create scratch monorepo', async () => {
  scratch = await mkdtemp(join(tmpdir(), 'vercel-optimize-repo-root-'));
  // Shape: <scratch>/apps/fixture-site/app/event/[code]/page.tsx + .vercel marker.
  await mkdir(join(scratch, 'apps', 'fixture-site', 'app', 'event', '[code]'), { recursive: true });
  await writeFile(join(scratch, 'apps', 'fixture-site', 'app', 'event', '[code]', 'page.tsx'), 'export default function Page() {}\n');
  await mkdir(join(scratch, 'apps', 'fixture-site', '.vercel'), { recursive: true });
});

after(async () => {
  if (scratch) await rm(scratch, { recursive: true, force: true });
});

test('pickProbeFile: returns first affectedFiles entry of first non-abstaining rec', () => {
  const recs = [
    { abstain: true, candidateRef: 'x', reason: 'r' },
    { affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'], findingRefs: [] },
  ];
  assert.equal(pickProbeFile(recs), 'apps/fixture-site/app/event/[code]/page.tsx');
});

test('pickProbeFile: falls back to findingRefs when no affectedFiles', () => {
  const recs = [{ affectedFiles: [], findingRefs: ['apps/x/file.ts:42'] }];
  assert.equal(pickProbeFile(recs), 'apps/x/file.ts');
});

test('pickProbeFile: returns null when nothing useful', () => {
  assert.equal(pickProbeFile([]), null);
  assert.equal(pickProbeFile([{ abstain: true }]), null);
});

test('detectRepoRoot: finds the monorepo root from within an app dir', async () => {
  const appDir = join(scratch, 'apps', 'fixture-site');
  const detected = await detectRepoRoot('apps/fixture-site/app/event/[code]/page.tsx', appDir);
  assert.equal(detected, scratch);
});

test('detectRepoRoot: returns null when probe is unreachable', async () => {
  const detected = await detectRepoRoot('nope/never/exists.ts', scratch);
  assert.equal(detected, null);
});

test('resolveRepoRoot: source=supplied when path already correct', async () => {
  const recs = [{ affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'] }];
  const r = await resolveRepoRoot(recs, scratch);
  assert.equal(r.source, 'supplied');
  assert.equal(r.root, scratch);
});

test('resolveRepoRoot: source=corrected when supplied is wrong but parent works', async () => {
  const recs = [{ affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'] }];
  const wrongRoot = join(scratch, 'apps', 'fixture-site');
  const r = await resolveRepoRoot(recs, wrongRoot);
  assert.equal(r.source, 'corrected');
  assert.equal(r.root, scratch);
});

test('resolveRepoRoot: source=auto-detected when nothing supplied', async () => {
  const recs = [{ affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'] }];
  const r = await resolveRepoRoot(recs, null, join(scratch, 'apps', 'fixture-site'));
  assert.equal(r.source, 'auto-detected');
  assert.equal(r.root, scratch);
});

test('resolveRepoRoot: source=default when no probe file available', async () => {
  const r = await resolveRepoRoot([{ abstain: true }], null, scratch);
  assert.equal(r.source, 'default');
});

test('deriveRootFromSignals: derives repo-root from project.rootDirectory + cwd suffix', () => {
  const signals = { project: { rootDirectory: 'apps/fixture-site' } };
  const root = deriveRootFromSignals(signals, '/workspace/acme-monorepo/apps/fixture-site');
  assert.equal(root, '/workspace/acme-monorepo');
});

test('deriveRootFromSignals: handles cwd deeper than the offset', () => {
  const signals = { project: { rootDirectory: 'apps/fixture-site' } };
  const root = deriveRootFromSignals(signals, '/workspace/acme-monorepo/apps/fixture-site/app/event');
  assert.equal(root, '/workspace/acme-monorepo');
});

test('deriveRootFromSignals: returns null when cwd does not match offset', () => {
  const signals = { project: { rootDirectory: 'apps/other-app' } };
  const root = deriveRootFromSignals(signals, '/workspace/acme-monorepo/apps/fixture-site');
  assert.equal(root, null);
});

test('deriveRootFromSignals: returns null without rootDirectory', () => {
  assert.equal(deriveRootFromSignals({}, '/tmp'), null);
  assert.equal(deriveRootFromSignals({ project: {} }, '/tmp'), null);
  assert.equal(deriveRootFromSignals({ project: { rootDirectory: null } }, '/tmp'), null);
});

test('resolveRepoRoot: API rootDirectory wins over walk-up heuristic', async () => {
  // API answer wins over walk-up even when walk-up would also work.
  const signals = { project: { rootDirectory: 'apps/fixture-site' } };
  const recs = [{ affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'] }];
  const r = await resolveRepoRoot(recs, null, join(scratch, 'apps', 'fixture-site'), signals);
  assert.equal(r.source, 'api');
  assert.equal(r.root, scratch);
  assert.equal(r.apiOffset, 'apps/fixture-site');
});

test('resolveRepoRoot: falls back to walk-up when API rootDirectory absent', async () => {
  const recs = [{ affectedFiles: ['apps/fixture-site/app/event/[code]/page.tsx'] }];
  const r = await resolveRepoRoot(recs, null, join(scratch, 'apps', 'fixture-site'), { project: {} });
  assert.equal(r.source, 'auto-detected');
  assert.equal(r.root, scratch);
});
