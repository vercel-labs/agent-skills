import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gate, metadata } from '../../../skills/vercel-optimize/lib/gates/build-minutes-fanout.mjs';

test('build_minutes_fanout: metadata sane', () => {
  assert.equal(metadata.id, 'build_minutes_fanout');
  assert.equal(metadata.scope, 'account');
  assert.equal(metadata.billingDimension, 'build');
});

test('build_minutes_fanout: fires when Build Minutes > 15% of bill', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 400 },
        { name: 'Edge Requests', billedCost: 200 },
        { name: 'Build Minutes', billedCost: 200 }, // 200/800 = 25%
      ],
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].kind, 'build_minutes_fanout');
  assert.ok(out[0].evidence.buildShare > 0.15);
  assert.equal(out[0].evidence.scannerFindings, 0);
});

test('build_minutes_fanout: fires on scanner finding even at low share', () => {
  const signals = {
    usage: {
      services: [
        { name: 'Function Duration', billedCost: 900 },
        { name: 'Build Minutes', billedCost: 50 }, // 5%, below floor
      ],
    },
    codebase: {
      findings: [
        { pattern: 'turbo-force-bypass', subtype: 'force-flag', file: 'package.json', line: 5 },
      ],
    },
  };
  const out = gate(signals);
  assert.equal(out.length, 1);
  assert.equal(out[0].evidence.scannerFindings, 1);
  assert.deepEqual(out[0].evidence.scannerSubtypes, ['force-flag']);
});

test('build_minutes_fanout: confidence is higher when scanner agrees with billing signal', () => {
  const signalsBillingOnly = {
    usage: { services: [{ name: 'Build Minutes', billedCost: 250 }, { name: 'X', billedCost: 750 }] },
  };
  const signalsBoth = {
    ...signalsBillingOnly,
    codebase: { findings: [{ pattern: 'turbo-force-bypass', subtype: 'cache-disabled', file: 'turbo.json' }] },
  };
  const outBilling = gate(signalsBillingOnly);
  const outBoth = gate(signalsBoth);
  assert.ok(outBoth[0].confidence > outBilling[0].confidence);
  assert.ok(outBoth[0].priority > outBilling[0].priority);
});

test('build_minutes_fanout: silent when both share is low AND no scanner finding', () => {
  const signals = {
    usage: { services: [{ name: 'Function Duration', billedCost: 1000 }, { name: 'Build Minutes', billedCost: 50 }] },
  };
  assert.deepEqual(gate(signals), []);
});

test('build_minutes_fanout: silent when usage is missing', () => {
  assert.deepEqual(gate({}), []);
});

test('build_minutes_fanout: deterministic', () => {
  const signals = {
    usage: { services: [{ name: 'Build Minutes', billedCost: 400 }, { name: 'Function Duration', billedCost: 600 }] },
  };
  assert.deepEqual(gate(signals), gate(signals));
});
