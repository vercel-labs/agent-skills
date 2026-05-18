import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/observability-events-attribution.mjs';

test('observability_events_attribution: metadata sane', () => {
  assert.equal(metadata.id, 'observability_events_attribution');
  assert.equal(metadata.scope, 'account');
  assert.equal(metadata.billingDimension, 'observability-events');
});

test('observability_events_attribution: fires when Observability Events > 20% of bill', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 400 },
        { name: 'Edge Requests', billedCost: 200 },
        { name: 'Observability Events', billedCost: 280 }, // 280/880 = 31.8%
      ],
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'observability_events_attribution');
  assert.equal(out[0].scope, 'account');
  assert.equal(out[0].evidence.eventsBilled, 280);
  assert.equal(out[0].evidence.totalBilled, 880);
  assert.ok(out[0].evidence.observabilityEventsShare > 0.30);
  assert.equal(out[0].evidence.critical, true);
});

test('observability_events_attribution: lower priority below critical threshold', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 700 },
        { name: 'Observability Events', billedCost: 200 }, // ~22%
      ],
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].evidence.critical, false);
  assert.ok(out[0].priority < 70);
});

test('observability_events_attribution: silent below 20% share', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 900 },
        { name: 'Observability Events', billedCost: 100 }, // 10%
      ],
    },
  };
  assert.deepEqual(gate(signals), []);
});

test('observability_events_attribution: silent when usage missing', () => {
  assert.deepEqual(gate({}), []);
  assert.deepEqual(gate({ usage: null }), []);
  assert.deepEqual(gate({ usage: { services: [] } }), []);
});

test('observability_events_attribution: silent when Observability Events line is absent', () => {
  const signals = {
    usage: { services: [{ name: 'Function Duration', billedCost: 500 }] },
  };
  assert.deepEqual(gate(signals), []);
});

test('observability_events_attribution: deterministic — same input → byte-identical output', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 400 },
        { name: 'Observability Events', billedCost: 280 },
      ],
    },
  };
  assert.deepEqual(gate(signals), gate(signals));
});
