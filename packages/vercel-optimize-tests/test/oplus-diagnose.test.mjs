// Schema probe is unreliable (returns OK on teams whose queries fail with
// payment_required). Diagnose AFTER running queries so the agent can surface
// the choice from references/observability-plus.md.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnoseObservabilityPlus } from '../../../skills/vercel-optimize/scripts/collect-signals.mjs';

test('oplus diag: probe failed → no_oplus_probe', () => {
  const r = diagnoseObservabilityPlus({}, false);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'no_oplus_probe');
});

test('oplus diag: queries all returned payment_required → payment_required blocker', () => {
  // Live example-dashboard failure: schema probe OK but every per-route query is payment_required.
  const metrics = {
    fnDurationP95ByRoute: { ok: false, code: 'payment_required' },
    requestsByRouteCache: { ok: false, code: 'payment_required' },
    fnStartTypeByRoute: { ok: false, code: 'payment_required' },
    fnGbHrByRoute: { ok: false, code: 'payment_required' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'payment_required');
  assert.match(r.detail, /Route-level metrics were recognized/);
  assert.match(r.detail, /4\/4/);
});

test('oplus diag: payment_required with subscription-required text → no_oplus_probe', () => {
  const metrics = {
    observabilityPlusCanary: {
      ok: false,
      code: 'payment_required',
      message: 'A subscription to Observability Plus is required',
    },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'no_oplus_probe');
  assert.match(r.detail, /route-level Observability Plus data/);
});

test('oplus diag: queries all hit daily quota → daily_quota_exceeded blocker', () => {
  const metrics = {
    fnDurationP95ByRoute: { ok: false, code: 'DAILY_QUOTA_EXCEEDED' },
    requestsByRouteCache: { ok: false, code: 'DAILY_QUOTA_EXCEEDED' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'daily_quota_exceeded');
  assert.match(r.detail, /daily Observability query limit/);
  assert.match(r.detail, /UTC midnight/);
});

test('oplus diag: queries all FORBIDDEN → forbidden blocker (auth scope mismatch)', () => {
  const metrics = {
    a: { ok: false, code: 'FORBIDDEN' },
    b: { ok: false, code: 'FORBIDDEN' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.blocker, 'forbidden');
  assert.match(r.detail, /vercel switch/);
});

test('oplus diag: queries all PROJECT_NOT_FOUND → project_not_found blocker', () => {
  const metrics = {
    a: { ok: false, code: 'PROJECT_NOT_FOUND' },
    b: { ok: false, code: 'PROJECT_NOT_FOUND' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.blocker, 'project_not_found');
});

test('oplus diag: queries all NOT_LINKED → not_linked blocker with link remediation', () => {
  const metrics = {
    a: { ok: false, code: 'NOT_LINKED' },
    b: { ok: false, code: 'not_linked' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'not_linked');
  assert.match(r.detail, /vercel link --yes --project/);
  assert.match(r.detail, /--cwd <project-dir>/);
});

test('oplus diag: queries succeeded with rows → usable, no blocker', () => {
  const metrics = {
    a: { ok: true, rows: [{ route: '/x', value: 100 }] },
    b: { ok: true, rows: [{ route: '/y', value: 50 }] },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, true);
  assert.equal(r.blocker, null);
});

test('oplus diag: queries succeeded but every row count = 0 → usable but no_traffic blocker', () => {
  // Customer paid for Observability Plus but no traffic in the window —
  // remediation (wait) differs from payment_required (upgrade).
  const metrics = {
    a: { ok: true, rows: [] },
    b: { ok: true, rows: [] },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, true, 'Observability Plus IS usable — there is just no data to read');
  assert.equal(r.blocker, 'no_traffic');
});

test('oplus diag: mixed success + payment_required → still usable when any query returned rows', () => {
  // Any successful query → usable, regardless of partial failures.
  const metrics = {
    a: { ok: true, rows: [{ value: 100 }] },
    b: { ok: false, code: 'payment_required' },
    c: { ok: false, code: 'payment_required' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, true);
  assert.equal(r.blocker, null);
});

test('oplus diag: mixed success + daily quota → still usable when any query returned rows', () => {
  const metrics = {
    a: { ok: true, rows: [{ value: 100 }] },
    b: { ok: false, code: 'DAILY_QUOTA_EXCEEDED' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.usable, true);
  assert.equal(r.blocker, null);
});

test('oplus diag: probe OK but no metrics attempted → no_oplus_probe (defensive)', () => {
  const r = diagnoseObservabilityPlus({}, true);
  assert.equal(r.usable, false);
  assert.equal(r.blocker, 'no_oplus_probe');
});

test('oplus diag: unknown failure code falls back to all_failed_other', () => {
  const metrics = {
    a: { ok: false, code: 'EXIT_1' },
    b: { ok: false, code: 'EXIT_1' },
  };
  const r = diagnoseObservabilityPlus(metrics, true);
  assert.equal(r.blocker, 'all_failed_other');
  assert.match(r.detail, /exit_1/);
});
