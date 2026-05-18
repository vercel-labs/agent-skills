// Contradiction-detection: prevents "enable fluid compute" when project
// already has Fluid on. Layers: project-facts derives facts, verify-claim rejects.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveProjectFacts, findRecContradictions } from '../../../skills/vercel-optimize/lib/project-facts.mjs';
import { verifyClaim } from '../../../skills/vercel-optimize/lib/verify-claim.mjs';
import { extractClaims } from '../../../skills/vercel-optimize/lib/extract-claims.mjs';

const fluidOnSignals = {
  project: {
    defaultResourceConfig: {
      fluid: true,
      elasticConcurrencyEnabled: true,
      functionDefaultMemoryType: 'standard',
      functionDefaultRegions: ['iad1'],
    },
  },
};

const fluidOffSignals = {
  project: {
    defaultResourceConfig: {
      fluid: false,
      functionDefaultMemoryType: 'standard',
      functionDefaultRegions: ['iad1'],
    },
  },
};

const noProjectSignals = {};

test('deriveProjectFacts: emits Fluid + concurrency + memory + regions when on', () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const ids = facts.map((f) => f.id);
  assert.ok(ids.includes('fluid_compute'));
  assert.ok(ids.includes('in_function_concurrency'));
  assert.ok(ids.includes('memory_standard'));
  assert.ok(ids.includes('function_regions'));
});

test('deriveProjectFacts: empty when project config absent (auth scope mismatch)', () => {
  assert.deepEqual(deriveProjectFacts(noProjectSignals), []);
});

test('deriveProjectFacts: empty when project.error set', () => {
  const sig = { project: { error: 'FORBIDDEN', defaultResourceConfig: { fluid: true } } };
  assert.deepEqual(deriveProjectFacts(sig), []);
});

test('deriveProjectFacts: Fluid fact omitted when fluid=false', () => {
  const facts = deriveProjectFacts(fluidOffSignals);
  assert.ok(!facts.some((f) => f.id === 'fluid_compute'));
});

test('findRecContradictions: catches "enable fluid compute" in what', () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = {
    what: 'Enable fluid compute and parallelize fetches on /event/[code].',
    fix: '1) Enable fluid compute. 2) Use Promise.all.',
  };
  const hits = findRecContradictions(rec, facts);
  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, 'fluid_compute');
});

test('findRecContradictions: case-insensitive', () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = { what: 'ENABLE Fluid Compute on the project.' };
  assert.equal(findRecContradictions(rec, facts).length, 1);
});

test('findRecContradictions: legitimate evidence-citing in why does NOT trigger', () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = {
    what: 'Parallelize the homepage content fetches.',
    why: 'Even with fluid compute enabled, the 32% cold rate suggests init cost is high.',
    fix: 'Wrap the loader in React.cache() and split the awaits.',
  };
  // why is not scanned — citing an already-on fact as evidence is fine.
  assert.equal(findRecContradictions(rec, facts).length, 0);
});

test('findRecContradictions: ignores when no facts available', () => {
  const rec = { what: 'Enable fluid compute.' };
  assert.equal(findRecContradictions(rec, []).length, 0);
});

test('extractClaims: emits a does_not_contradict_project_config claim when facts present', () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = { what: 'Use Promise.all.', citations: [], affectedFiles: [] };
  const claims = extractClaims(rec, { framework: 'next', version: '16.0.0', projectFacts: facts });
  assert.ok(claims.some((c) => c.type === 'does_not_contradict_project_config'));
});

test('extractClaims: no contradiction claim when no facts', () => {
  const rec = { what: 'Use Promise.all.', citations: [], affectedFiles: [] };
  const claims = extractClaims(rec, { framework: 'next', version: '16.0.0', projectFacts: [] });
  assert.ok(!claims.some((c) => c.type === 'does_not_contradict_project_config'));
});

test('verifyClaim: failed disposition on contradiction', async () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = { what: 'Enable fluid compute on the project.' };
  const claim = { type: 'does_not_contradict_project_config', rec, projectFacts: facts };
  const res = await verifyClaim(claim);
  assert.equal(res.disposition, 'failed');
  assert.match(res.reason, /fluid_compute/);
});

test('verifyClaim: verified on clean rec', async () => {
  const facts = deriveProjectFacts(fluidOnSignals);
  const rec = { what: 'Parallelize sequential awaits in the homepage loader.' };
  const claim = { type: 'does_not_contradict_project_config', rec, projectFacts: facts };
  const res = await verifyClaim(claim);
  assert.equal(res.disposition, 'verified');
});
