import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  collectBuildSignals,
  normalizeMachineType,
  MAX_DETAIL_FETCHES,
} from '../../../skills/vercel-optimize/lib/build-signals.mjs';

const NOW = 1_700_000_000_000;

function listRow(i, extra = {}) {
  return {
    uid: `dpl_${String(i).padStart(3, '0')}`,
    created: NOW - i * 60_000,
    readyState: 'READY',
    target: 'production',
    source: 'git',
    meta: { githubCommitRef: 'main' },
    ...extra,
  };
}

function fakeRun({ pages, details = {}, failFirst = false }) {
  const calls = [];
  const run = async (args) => {
    calls.push(args[1]);
    const path = args[1];
    if (path.startsWith('/v7/deployments')) {
      if (failFirst) return { ok: false, code: 'FORBIDDEN' };
      const m = path.match(/until=(\d+)/);
      const pageIndex = m ? Number(m[1]) : 0;
      return { ok: true, data: pages[pageIndex] };
    }
    const id = decodeURIComponent(path.split('/')[3].split('?')[0]);
    return details[id] ?? { ok: true, data: { duration: { timeForBilling: 180_000 }, resourceConfig: { buildMachine: 'turbo' } } };
  };
  return { run, calls };
}

test('normalizeMachineType: accepts strings and object shapes, rejects unknown', () => {
  assert.equal(normalizeMachineType('Turbo'), 'turbo');
  assert.equal(normalizeMachineType({ cores: 8, memory: 16384, purchaseType: 'enhanced', machineSelectionType: 'elastic' }), 'enhanced');
  assert.equal(normalizeMachineType({ type: 'enhanced' }), 'enhanced');
  assert.equal(normalizeMachineType({ default: 'standard' }), 'standard');
  assert.equal(normalizeMachineType('elastic'), 'elastic');
  assert.equal(normalizeMachineType('mega'), null);
  assert.equal(normalizeMachineType(null), null);
  assert.equal(normalizeMachineType({}), null);
});

test('collectBuildSignals: requires a project', async () => {
  assert.deepEqual(await collectBuildSignals({}), { ok: false, code: 'NO_PROJECT' });
});

test('collectBuildSignals: lists, sorts newest first, and attaches billing detail', async () => {
  const { run, calls } = fakeRun({
    pages: [{ deployments: [listRow(2), listRow(0), listRow(1, { readyState: 'CANCELED' })], pagination: { next: null } }],
    details: { dpl_002: { ok: true, data: { duration: { timeForBilling: 240_000 }, resourceConfig: { buildMachine: { type: 'turbo' } }, buildSkipped: false } } },
  });
  const out = await collectBuildSignals({ projectId: 'prj_1', orgId: 'team_1', now: NOW, run });
  assert.equal(out.ok, true);
  assert.deepEqual(out.deployments.map((d) => d.id), ['dpl_000', 'dpl_001', 'dpl_002']);
  assert.equal(out.builtCount, 2);
  assert.equal(out.detailedCount, 2);
  const d2 = out.deployments.find((d) => d.id === 'dpl_002');
  assert.equal(d2.timeForBillingMs, 240_000);
  assert.equal(d2.buildMachine, 'turbo');
  assert.equal(d2.branch, 'main');
  // Canceled deployments are listed but never fetched in detail.
  assert.equal(out.deployments.find((d) => d.id === 'dpl_001').timeForBillingMs, null);
  assert.ok(calls[0].includes('projectId=prj_1') && calls[0].includes('teamId=team_1'));
  assert.ok(calls.every((c) => !c.includes('dpl_001')));
});

test('collectBuildSignals: omits teamId for user-owned projects', async () => {
  const { run, calls } = fakeRun({ pages: [{ deployments: [listRow(0)], pagination: {} }] });
  await collectBuildSignals({ projectId: 'prj_1', orgId: 'usr_1', now: NOW, run });
  assert.ok(calls.every((c) => !c.includes('teamId')));
});

test('collectBuildSignals: paginates with until and caps detail fetches', async () => {
  const page0 = { deployments: Array.from({ length: 100 }, (_, i) => listRow(i)), pagination: { next: 1 } };
  const page1 = { deployments: Array.from({ length: 30 }, (_, i) => listRow(100 + i)), pagination: { next: null } };
  const { run, calls } = fakeRun({ pages: [page0, page1] });
  const out = await collectBuildSignals({ projectId: 'prj_1', now: NOW, run });
  assert.equal(out.listedCount, 130);
  assert.equal(out.builtCount, 130);
  assert.equal(out.detailedCount, MAX_DETAIL_FETCHES);
  assert.equal(calls.filter((c) => c.startsWith('/v13/')).length, MAX_DETAIL_FETCHES);
  assert.equal(out.listTruncated, false);
});

test('collectBuildSignals: returns the error when the first list page fails', async () => {
  const { run } = fakeRun({ pages: [], failFirst: true });
  assert.deepEqual(await collectBuildSignals({ projectId: 'prj_1', now: NOW, run }), { ok: false, code: 'FORBIDDEN' });
});

test('collectBuildSignals: records per-deployment detail failures without failing the run', async () => {
  const { run } = fakeRun({
    pages: [{ deployments: [listRow(0), listRow(1)], pagination: {} }],
    details: { dpl_000: { ok: false, code: 'NOT_FOUND' } },
  });
  const out = await collectBuildSignals({ projectId: 'prj_1', now: NOW, run });
  assert.equal(out.ok, true);
  assert.equal(out.detailFailures, 1);
  assert.equal(out.detailedCount, 1);
  assert.equal(out.deployments[0].detailError, 'NOT_FOUND');
});

test('collectBuildSignals: reads the live v13 shape and never keeps the hook secret', async () => {
  const SECRET = 'hookSecretValue123';
  const { run } = fakeRun({
    pages: [{ deployments: [listRow(0), listRow(1)], pagination: {} }],
    details: {
      dpl_000: { ok: true, data: {
        duration: { timeForBilling: 120_000, cpuTimeForBilling: 960_000, timeToContainerExit: 101_953 },
        resourceConfig: { buildMachine: { cores: 8, memory: 16384, defaultPurchaseType: 'standard', purchaseType: 'enhanced', machineSelectionType: 'elastic', selectionSource: 'elastic-algorithm' } },
        source: 'git',
        meta: { deployHookName: 'cms-publish', deployHookRef: 'main', deployHookId: SECRET, githubCommitRef: 'main' },
      } },
      dpl_001: { ok: true, data: {
        duration: { timeForBilling: 120_000, cpuTimeForBilling: 3_600_000 },
        resourceConfig: { buildMachine: { cores: 30, memory: 61440, purchaseType: 'turbo', machineSelectionType: 'fixed', selectionSource: 'project-setting' } },
        source: 'git',
        meta: { repoPushedAt: '1793014958000', githubCommitRef: 'main' },
      } },
    },
  });
  const out = await collectBuildSignals({ projectId: 'prj_1', now: NOW, run });
  const [hook, push] = out.deployments;
  assert.equal(hook.buildMachine, 'enhanced');
  assert.equal(hook.buildCores, 8);
  assert.equal(hook.buildMemoryMb, 16384);
  assert.equal(hook.machineSelection, 'elastic');
  assert.equal(hook.cpuTimeForBillingMs, 960_000);
  assert.equal(hook.triggeredByDeployHook, true);
  assert.equal(push.buildMachine, 'turbo');
  assert.equal(push.machineSelection, 'fixed');
  assert.equal(push.triggeredByDeployHook, false);
  assert.ok(!JSON.stringify(out).includes(SECRET), 'deployHookId must never reach signals');
});

import { redactProjectSecrets } from '../../../skills/vercel-optimize/lib/build-signals.mjs';

test('redactProjectSecrets: strips Deploy Hook ids and URLs, keeps names and refs', () => {
  const cfg = {
    id: 'prj_1',
    resourceConfig: { buildMachineType: 'turbo' },
    link: { type: 'github', repo: 'r', deployHooks: [{ id: 'hookSecretA', name: 'cms-publish', ref: 'main', createdAt: 1, url: 'https://api.vercel.com/v1/integrations/deploy/prj_1/hookSecretA' }] },
  };
  const out = redactProjectSecrets(cfg);
  assert.deepEqual(out.link.deployHooks, [{ name: 'cms-publish', ref: 'main', createdAt: 1 }]);
  assert.equal(out.link.repo, 'r');
  assert.equal(out.resourceConfig.buildMachineType, 'turbo');
  assert.ok(!JSON.stringify(out).includes('hookSecretA'));
  // Input is not mutated, and configs without hooks pass through unchanged.
  assert.equal(cfg.link.deployHooks[0].id, 'hookSecretA');
  const plain = { id: 'prj_2', link: { type: 'github' } };
  assert.equal(redactProjectSecrets(plain), plain);
  assert.equal(redactProjectSecrets(null), null);
});
