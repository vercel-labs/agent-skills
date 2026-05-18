// Two-tier plan inference: commitment-category first, then usage>$0 → Pro
// (closes the live example-dashboard gap where commitments=[] but team billed Pro PAYG).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterUsageByProject, inferPlan } from '../../../skills/vercel-optimize/lib/vercel.mjs';

test('inferPlan: commitment category=Spend → Pro', () => {
  const r = inferPlan({ commitments: [{ category: 'Spend' }] });
  assert.equal(r.plan, 'pro');
  assert.match(r.reason, /category=Spend/);
});

test('inferPlan: commitment category=Usage → Enterprise', () => {
  const r = inferPlan({ commitments: [{ category: 'Usage' }] });
  assert.equal(r.plan, 'enterprise');
  assert.match(r.reason, /category=Usage/);
});

test('inferPlan: commitment with alternate field names (commitmentCategory)', () => {
  const r = inferPlan({ commitments: [{ commitmentCategory: 'Spend' }] });
  assert.equal(r.plan, 'pro');
});

test('inferPlan: commitments=[] + usage > $0 → Pro pay-as-you-go (the example-dashboard case)', () => {
  // Live failure reproduced: contract.commitments=[] but $1804/mo billed.
  const r = inferPlan({ commitments: [] }, { usageTotalCost: 1804.59 });
  assert.equal(r.plan, 'pro');
  assert.match(r.reason, /pay-as-you-go/);
  assert.match(r.reason, /1804\.59/);
});

test('inferPlan: commitments=[] + usage=$0 → uncertain (Hobby or unbilled Pro)', () => {
  const r = inferPlan({ commitments: [] }, { usageTotalCost: 0 });
  assert.equal(r.plan, 'uncertain');
  assert.match(r.reason, /could be Hobby/);
});

test('inferPlan: commitments=[] + usage unavailable → uncertain (lower fidelity)', () => {
  const r = inferPlan({ commitments: [] }, { usageTotalCost: null });
  assert.equal(r.plan, 'uncertain');
  assert.match(r.reason, /usage unavailable/);
});

test('inferPlan: no opts arg backwards-compat → uncertain when commitments=[]', () => {
  const r = inferPlan({ commitments: [] });
  assert.equal(r.plan, 'uncertain');
});

test('inferPlan: usage fallback does NOT override an explicit commitment', () => {
  const r = inferPlan(
    { commitments: [{ category: 'Usage' }] },
    { usageTotalCost: 1000 },
  );
  assert.equal(r.plan, 'enterprise', 'commitment category wins over usage fallback');
});

test('inferPlan: unknown commitment category → uncertain (with the category in reason)', () => {
  const r = inferPlan({ commitments: [{ category: 'Mystery' }] });
  assert.equal(r.plan, 'uncertain');
  assert.match(r.reason, /Mystery/);
});

test('inferPlan: null/undefined contract → uncertain', () => {
  assert.equal(inferPlan(null).plan, 'uncertain');
  assert.equal(inferPlan(undefined).plan, 'uncertain');
});

test('filterUsageByProject: supports current CLI --group-by project shape', () => {
  const usage = {
    groupBy: {
      dimension: 'project',
      data: [
        {
          name: 'other-app',
          services: [{ name: 'Edge Requests', billedCost: 10 }],
          totals: { billedCost: 10 },
        },
        {
          name: 'fixture-site',
          services: [{ name: 'Function Invocations', billedCost: 42 }],
          totals: { billedCost: 42 },
        },
      ],
    },
    services: [{ name: 'Function Invocations', billedCost: 52 }],
    totals: { billedCost: 52 },
  };

  const r = filterUsageByProject(usage, 'prj_123', 'fixture-site');
  assert.equal(r.matched, true);
  assert.equal(r.filtered.totals.billedCost, 42);
  assert.deepEqual(r.filtered.services, [{ name: 'Function Invocations', billedCost: 42 }]);
  assert.equal(r.filtered.groupBy.data.length, 1);
});
