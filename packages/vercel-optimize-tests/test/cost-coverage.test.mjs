import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyService, computeCostCoverage, renderCostCoverageMarkdown } from '../../../skills/vercel-optimize/lib/cost-coverage.mjs';
import { gates } from '../../../skills/vercel-optimize/lib/gates/index.mjs';

const allDims = new Set(['function-duration', 'edge-requests', 'isr', 'speed-insights', 'image-optimization']);

test('classifyService: covered services map to their dimension', () => {
  assert.deepEqual(classifyService('Function Duration', allDims), { covered: true, dim: 'function-duration' });
  assert.deepEqual(classifyService('Edge Requests', allDims), { covered: true, dim: 'edge-requests' });
  assert.deepEqual(classifyService('ISR Reads', allDims), { covered: true, dim: 'isr' });
});

test('classifyService: uncovered services flagged with family', () => {
  const sandbox = classifyService('Sandbox Provisioned Memory', allDims);
  assert.equal(sandbox.covered, false);
  assert.equal(sandbox.family, 'sandbox');
  assert.equal(sandbox.actionable, true);
});

test('classifyService: fixed costs flagged actionable=false', () => {
  const seats = classifyService('Additional Team Seats', allDims);
  assert.equal(seats.covered, false);
  assert.equal(seats.actionable, false);
});

test('classifyService: unknown service names default to unknown family', () => {
  const x = classifyService('Some Brand New Line Item', allDims);
  assert.equal(x.covered, false);
  assert.equal(x.family, 'unknown');
});

test('classifyService: a service with a dim NOT in activeDims is uncovered', () => {
  const noIsr = new Set(['function-duration']);
  assert.equal(classifyService('ISR Reads', noIsr).covered, false);
});

test('computeCostCoverage: registered ISR gate covers ISR Reads and Writes line items', () => {
  const usage = {
    services: [
      { name: 'ISR Reads', billedCost: 20 },
      { name: 'ISR Writes', billedCost: 30 },
    ],
  };
  const c = computeCostCoverage(usage, gates);
  assert.equal(c.coveredBilled, 50);
  assert.equal(c.uncoveredBilled, 0);
});

test('computeCostCoverage: sums covered + uncovered + ranks gaps', () => {
  const usage = {
    services: [
      { name: 'Sandbox Provisioned Memory', billedCost: 500000 },
      { name: 'Function Duration', billedCost: 100000 },
      { name: 'AI Gateway', billedCost: 200000 },
      { name: 'Edge Requests', billedCost: 50000 },
      { name: 'Build Minutes', billedCost: 90000 },
      { name: 'Additional Team Seats', billedCost: 28000 },
    ],
  };
  const fakeGates = [
    { metadata: { billingDimension: 'function-duration' } },
    { metadata: { billingDimension: 'edge-requests' } },
  ];
  const c = computeCostCoverage(usage, fakeGates);
  assert.equal(c.totalBilled, 968000);
  assert.equal(c.coveredBilled, 150000);
  assert.equal(c.uncoveredBilled, 818000);
  // Seats excluded from actionable topGaps.
  assert.equal(c.topGaps[0].name, 'Sandbox Provisioned Memory');
  assert.ok(c.topGaps.every((g) => g.name !== 'Additional Team Seats'));
});

test('renderCostCoverageMarkdown: emits a Coverage gaps subsection with table', () => {
  const usage = {
    services: [
      { name: 'Sandbox Provisioned Memory', billedCost: 500000 },
      { name: 'Function Duration', billedCost: 100000 },
    ],
  };
  const c = computeCostCoverage(usage, [{ metadata: { billingDimension: 'function-duration' } }]);
  const md = renderCostCoverageMarkdown(c).join('\n');
  assert.match(md, /### Coverage gaps/);
  assert.match(md, /Sandbox Provisioned Memory/);
  assert.match(md, /not analyzed in this run/);
  assert.doesNotMatch(md, /lib\/gates|CONTRIBUTING|one-file PR/);
});

test('renderCostCoverageMarkdown: empty when no actionable gaps above 1% share', () => {
  const usage = {
    services: [
      { name: 'Function Duration', billedCost: 10000 },
      { name: 'Sandbox Storage', billedCost: 50 },
    ],
  };
  const c = computeCostCoverage(usage, [{ metadata: { billingDimension: 'function-duration' } }]);
  assert.deepEqual(renderCostCoverageMarkdown(c), []);
});
