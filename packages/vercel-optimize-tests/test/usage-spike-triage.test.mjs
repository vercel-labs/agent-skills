import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/usage-spike-triage.mjs';

test('usage_spike_triage: metadata sane', () => {
  assert.equal(metadata.id, 'usage_spike_triage');
  assert.equal(metadata.scope, 'account');
});

test('usage_spike_triage: fires on a single-day total spike > 2× mean', () => {
  // 5 days, day-4 is ~4× mean
  const days = [
    { date: '2026-05-08', services: [{ name: 'Function Duration', billedCost: 50 }] },
    { date: '2026-05-09', services: [{ name: 'Function Duration', billedCost: 60 }] },
    { date: '2026-05-10', services: [{ name: 'Function Duration', billedCost: 55 }] },
    { date: '2026-05-11', services: [{ name: 'Function Duration', billedCost: 70 }] },
    { date: '2026-05-12', services: [{ name: 'Function Duration', billedCost: 500 }] }, // spike
  ];
  const out = gate({ usage: { breakdown: { data: days } } });
  assert.ok(out.length >= 1);
  const total = out.find((c) => c.evidence.skuName === 'total');
  assert.ok(total);
  assert.equal(total.evidence.spikeDay, 4);
  assert.ok(total.evidence.multiplier > 2);
});

test('usage_spike_triage: emits SKU-level candidate when a single SKU spikes > 3× mean', () => {
  const days = [
    { services: [{ name: 'ISR Writes', billedCost: 5 }] },
    { services: [{ name: 'ISR Writes', billedCost: 6 }] },
    { services: [{ name: 'ISR Writes', billedCost: 7 }] },
    { services: [{ name: 'ISR Writes', billedCost: 100 }] }, // 100 vs mean ~30
    { services: [{ name: 'ISR Writes', billedCost: 4 }] },
  ];
  const out = gate({ usage: { breakdown: { data: days } } });
  const skuCandidate = out.find((c) => c.evidence.skuName === 'ISR Writes');
  assert.ok(skuCandidate, 'expected a SKU-level candidate for ISR Writes');
  assert.equal(skuCandidate.evidence.spikeDay, 3);
  assert.ok(skuCandidate.evidence.multiplier > 3);
});

test('usage_spike_triage: silent when daily breakdown is absent (project-scoped path)', () => {
  const signals = { usage: { services: [{ name: 'X', billedCost: 100 }] } };
  assert.deepEqual(gate(signals), []);
});

test('usage_spike_triage: silent on uniform daily values', () => {
  const days = [
    { services: [{ name: 'Function Duration', billedCost: 50 }] },
    { services: [{ name: 'Function Duration', billedCost: 52 }] },
    { services: [{ name: 'Function Duration', billedCost: 48 }] },
    { services: [{ name: 'Function Duration', billedCost: 51 }] },
  ];
  assert.deepEqual(gate({ usage: { breakdown: { data: days } } }), []);
});

test('usage_spike_triage: silent when window is too short to baseline (< 3 days)', () => {
  const days = [
    { services: [{ name: 'Function Duration', billedCost: 10 }] },
    { services: [{ name: 'Function Duration', billedCost: 1000 }] },
  ];
  assert.deepEqual(gate({ usage: { breakdown: { data: days } } }), []);
});

test('usage_spike_triage: deterministic', () => {
  const days = [
    { services: [{ name: 'Edge Requests', billedCost: 10 }] },
    { services: [{ name: 'Edge Requests', billedCost: 12 }] },
    { services: [{ name: 'Edge Requests', billedCost: 11 }] },
    { services: [{ name: 'Edge Requests', billedCost: 200 }] },
  ];
  const signals = { usage: { breakdown: { data: days } } };
  assert.deepEqual(gate(signals), gate(signals));
});
