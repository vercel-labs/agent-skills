// Regression: live example-dashboard emitted "Verify Fluid Compute is on" rec because
// the renderer didn't surface signals.project.defaultResourceConfig.fluid.
// Fix renders project config in Strengths + guards the gate from firing
// when project config failed to load.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderReport } from '../../../skills/vercel-optimize/lib/render-report.mjs';
import { gate as platformFluidGate } from '../../../skills/vercel-optimize/lib/gates/platform-fluid-compute.mjs';

const baseSignals = {
  stack: { framework: 'nuxt', frameworkVersion: '4.4.5', orm: 'none' },
  plan: { plan: 'pro', reason: '...' },
  observabilityPlus: false,
};

test('renderReport: surfaces Fluid Compute enabled from project.defaultResourceConfig', () => {
  const signals = {
    ...baseSignals,
    project: {
      id: 'prj_x',
      defaultResourceConfig: {
        fluid: true,
        functionDefaultRegions: ['fra1', 'iad1'],
        functionDefaultTimeout: 300,
        functionDefaultMemoryType: 'standard',
        elasticConcurrencyEnabled: true,
      },
    },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.match(md, /Fluid Compute is enabled/);
  assert.match(md, /In-function concurrency is enabled/);
  assert.match(md, /## Configuration notes/);
  assert.match(md, /memory tier: Standard/);
  assert.match(md, /fra1, iad1/);
});

test('renderReport: warns when memory tier is Performance (might be over-provisioned)', () => {
  const signals = {
    ...baseSignals,
    project: { defaultResourceConfig: { functionDefaultMemoryType: 'performance' } },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.match(md, /## Configuration notes/);
  assert.match(md, /\*\*Performance \(4GB\)\*\*/);
  assert.match(md, /verify this is intentional/);
});

test('renderReport: does NOT claim Fluid is on when project config failed (auth scope mismatch)', () => {
  // Live example-dashboard: PROJECT_NOT_FOUND from team-scoped API. Renderer must not fabricate.
  const signals = {
    ...baseSignals,
    project: { error: 'PROJECT_NOT_FOUND' },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.ok(!md.includes('Fluid Compute is enabled'), 'must not claim Fluid is on when project config failed');
  assert.ok(!md.includes('In-function concurrency'), 'must not claim concurrency when project config failed');
});

test('renderReport: omits Fluid line when defaultResourceConfig.fluid is false (let the gate fire if applicable)', () => {
  const signals = {
    ...baseSignals,
    project: { defaultResourceConfig: { fluid: false } },
  };
  const md = renderReport({ recommendations: [], gated: [], signals });
  assert.ok(!md.includes('Fluid Compute is enabled'));
});

test('platform_fluid_compute gate: does NOT fire when project.error is set (cannot verify)', () => {
  const signals = {
    project: { error: 'PROJECT_NOT_FOUND' },
    metrics: {
      // Synthetic slow-hot route that would otherwise trigger the fallback branch.
      fnDurationP95ByRoute: { rows: [{ route: '/x', value: 2000 }] },
      requestsByRouteCache: { rows: [{ route: '/x', cache_result: 'MISS', value: 5000 }] },
    },
  };
  assert.deepEqual(platformFluidGate(signals), [], 'silent when project config unknown');
});

test('platform_fluid_compute gate: does NOT fire when fluid is already enabled', () => {
  const signals = {
    project: { defaultResourceConfig: { fluid: true } },
    metrics: {
      fnDurationP95ByRoute: { rows: [{ route: '/x', value: 2000 }] },
      requestsByRouteCache: { rows: [{ route: '/x', cache_result: 'MISS', value: 5000 }] },
    },
  };
  assert.deepEqual(platformFluidGate(signals), [], 'silent when fluid already on');
});

test('platform_fluid_compute gate: FIRES when fluid is false AND there is evidence', () => {
  const signals = {
    project: { defaultResourceConfig: { fluid: false } },
    metrics: {
      fnDurationP95ByRoute: { rows: [{ route: '/x', value: 2000 }] },
      requestsByRouteCache: { rows: [{ route: '/x', cache_result: 'MISS', value: 5000 }] },
    },
  };
  const cands = platformFluidGate(signals);
  assert.equal(cands.length, 1);
  assert.equal(cands[0].kind, 'platform_fluid_compute');
});
