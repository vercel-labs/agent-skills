import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/region-misconfig.mjs';

const route = (path) => ({ routePath: path, file: 'x', type: 'page' });

function manyRoutes(n) {
  return Array.from({ length: n }, (_, i) => route(`/r${i}`));
}

test('region_misconfig: metadata sane', () => {
  assert.equal(metadata.id, 'region_misconfig');
  assert.equal(metadata.scope, 'account');
});

test('region_misconfig: fires when single-region pin found on a 20+ route project', () => {
  const signals = {
    codebase: {
      routes: manyRoutes(25),
      findings: [
        { pattern: 'region-pin-in-config', regions: ['iad1'], file: 'vercel.json', subtype: 'vercel-json-single' },
      ],
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'region_misconfig');
  assert.deepEqual(out[0].evidence.pinnedRegions, ['iad1']);
  assert.equal(out[0].evidence.dataGap, 'region-grouped-TTFB-unavailable');
});

test('region_misconfig: silent below route floor (small projects)', () => {
  const signals = {
    codebase: {
      routes: manyRoutes(10),
      findings: [
        { pattern: 'region-pin-in-config', regions: ['iad1'], file: 'vercel.json' },
      ],
    },
  };
  assert.deepEqual(gate(signals), []);
});

test('region_misconfig: silent on multi-region configs', () => {
  const signals = {
    codebase: {
      routes: manyRoutes(30),
      findings: [
        { pattern: 'region-pin-in-config', regions: ['iad1', 'sfo1', 'fra1'], file: 'vercel.json' },
      ],
    },
  };
  assert.deepEqual(gate(signals), []);
});

test('region_misconfig: silent when no scanner findings', () => {
  const signals = {
    codebase: { routes: manyRoutes(30), findings: [] },
  };
  assert.deepEqual(gate(signals), []);
});

test('region_misconfig: lower priority when multiple distinct single-region pins exist', () => {
  const homogeneous = {
    codebase: {
      routes: manyRoutes(30),
      findings: [
        { pattern: 'region-pin-in-config', regions: ['iad1'], file: 'a/page.tsx' },
        { pattern: 'region-pin-in-config', regions: ['iad1'], file: 'b/page.tsx' },
      ],
    },
  };
  const mixed = {
    codebase: {
      routes: manyRoutes(30),
      findings: [
        { pattern: 'region-pin-in-config', regions: ['iad1'], file: 'a/page.tsx' },
        { pattern: 'region-pin-in-config', regions: ['sfo1'], file: 'b/page.tsx' },
      ],
    },
  };
  const out1 = gate(homogeneous);
  const out2 = gate(mixed);
  assert.ok(out1[0].priority > out2[0].priority);
});

test('region_misconfig: deterministic', () => {
  const signals = {
    codebase: {
      routes: manyRoutes(25),
      findings: [{ pattern: 'region-pin-in-config', regions: ['iad1'], file: 'vercel.json' }],
    },
  };
  assert.deepEqual(gate(signals), gate(signals));
});
