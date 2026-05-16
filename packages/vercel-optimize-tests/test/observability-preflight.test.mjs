import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyObservabilityPlusConfiguration } from '../../../skills/vercel-optimize/lib/vercel.mjs';

test('classifyObservabilityPlusConfiguration: enabled when configuration endpoint returns disabled-project list without this project', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: true,
    data: {
      disabledProjects: [{ id: 'prj_other', name: 'other', disabledAt: 123 }],
    },
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, true);
  assert.equal(r.access, true);
  assert.equal(r.blocker, null);
});

test('classifyObservabilityPlusConfiguration: project_disabled when this project is excluded', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: true,
    data: {
      disabledProjects: [{ id: 'prj_target', name: 'site', disabledAt: 123 }],
    },
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, true);
  assert.equal(r.access, false);
  assert.equal(r.blocker, 'project_disabled');
  assert.deepEqual(r.disabledProject, {
    id: 'prj_target',
    name: 'site',
    disabledAt: 123,
  });
});

test('classifyObservabilityPlusConfiguration: no_oplus_probe on public API not-enabled response', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: false,
    code: 'not_found',
    message: 'Observability Plus is not enabled',
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, true);
  assert.equal(r.access, false);
  assert.equal(r.blocker, 'no_oplus_probe');
  assert.match(r.detail, /^Route-level metrics are unavailable/);
  assert.match(r.detail, /not enabled/);
});

test('classifyObservabilityPlusConfiguration: no_oplus_probe on CLI OPLUS_REQUIRED response', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: false,
    code: 'OPLUS_REQUIRED',
    stderr: 'Error: Observability Plus is not enabled (404)',
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, true);
  assert.equal(r.access, false);
  assert.equal(r.blocker, 'no_oplus_probe');
});

test('classifyObservabilityPlusConfiguration: generic 404 not-enabled text is inconclusive', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: false,
    code: 'not_found',
    message: 'This project is not enabled.',
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, false);
  assert.equal(r.access, null);
  assert.equal(r.blocker, 'unknown');
});

test('classifyObservabilityPlusConfiguration: forbidden is inconclusive and keeps metrics fallback available', () => {
  const r = classifyObservabilityPlusConfiguration({
    ok: false,
    code: 'FORBIDDEN',
  }, { projectId: 'prj_target' });

  assert.equal(r.ok, false);
  assert.equal(r.access, null);
  assert.equal(r.blocker, 'forbidden');
});
