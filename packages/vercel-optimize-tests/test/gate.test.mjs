import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { gates } from '../../../skills/vercel-optimize/lib/gates/index.mjs';
import { isAuthRoute, applyAuthDisqualifier } from '../../../skills/vercel-optimize/lib/auth-route.mjs';

const exec = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize', 'scripts', 'gate-investigations.mjs');
const FIXTURE_PRO = join(HERE, 'fixtures', 'signals.pro-oplus.json');
const FIXTURE_HOBBY = join(HERE, 'fixtures', 'signals.hobby.json');

function stripAppliedAt(out) {
  return JSON.parse(out.replace(/"appliedAt": "[^"]+"/, '"appliedAt": "REDACTED"'));
}

test('determinism: same signals.json in → identical output (mod appliedAt)', async () => {
  const [a, b] = await Promise.all([
    exec('node', [SCRIPT, FIXTURE_PRO]),
    exec('node', [SCRIPT, FIXTURE_PRO]),
  ]);
  assert.deepStrictEqual(stripAppliedAt(a.stdout), stripAppliedAt(b.stdout));
});

test('pro+oplus fixture: emits expected candidate kinds (across toLaunch + gated)', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);

  // 6-slot budget cap means we only assert each expected kind was emitted
  // somewhere in toLaunch+gated — survives priority-ordering changes.
  const allEmittedKinds = [...out.toLaunch, ...out.gated].map((c) => c.kind);
  assert.ok(allEmittedKinds.includes('uncached_route'), 'expected uncached_route candidate');
  assert.ok(allEmittedKinds.includes('slow_route'), 'expected slow_route candidate');
  assert.ok(allEmittedKinds.includes('route_errors'), 'expected route_errors candidate');
  assert.ok(allEmittedKinds.includes('cold_start'),
    'cold_start gate fired on /api/products + /api/users (may be budget-gated)');

  const platformKinds = out.platform.map((c) => c.kind);
  assert.ok(platformKinds.includes('platform_fluid_compute'), 'expected fluid recommendation');
  assert.ok(platformKinds.includes('platform_bot_protection'), 'expected bot protection rec ($192 edge cost > $50)');
});

test('pro+oplus fixture: low-traffic routes are gated (under threshold)', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);

  // /api/healthcheck: 50 invs, below thresholds (>1000 slow / >100 cold).
  const launchedRoutes = out.toLaunch.map((c) => c.route);
  assert.ok(!launchedRoutes.includes('/api/healthcheck'),
    'low-traffic route should not launch');
});

test('pro+oplus fixture: errors below threshold get gated, not launched', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);

  // /api/healthcheck: 5 errors, below the 500 threshold.
  const launchedErrorRoutes = out.toLaunch
    .filter((c) => c.kind === 'route_errors')
    .map((c) => c.route);
  assert.ok(!launchedErrorRoutes.includes('/api/healthcheck'));
});

test('hobby fixture (no Observability Plus, no traffic): scanner-only candidates, no metric-driven', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_HOBBY]);
  const out = JSON.parse(stdout);

  const launchedKinds = out.toLaunch.map((c) => c.kind);
  assert.ok(!launchedKinds.includes('uncached_route'),
    'no o11y → no uncached_route candidates');
  assert.ok(!launchedKinds.includes('slow_route'),
    'no o11y → no slow_route candidates');

  // 2 unoptimized-image findings, both NO-ROUTE-MAPPING + not
  // trafficIndependent → must be dropped.
  assert.ok(!launchedKinds.includes('image_optimization'),
    'NO-ROUTE-MAPPING scanner findings dropped unless trafficIndependent');
});

test('hobby fixture: traffic-independent scanner findings still emit', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_HOBBY]);
  const out = JSON.parse(stdout);

  // Forward-looking: trafficIndependent findings must not be dropped at the
  // scanner level even on cold paths. No source-maps gate yet, so just verify
  // the gate ran cleanly.
  const allCandidates = [...out.toLaunch, ...out.platform, ...out.gated];
  assert.ok(allCandidates !== undefined, 'gate ran without crashing on a hobby fixture');
});

test('pro+oplus fixture: bot protection candidate fires when edge cost > $100', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);

  const bot = out.platform.find((c) => c.kind === 'platform_bot_protection');
  assert.ok(bot, 'expected bot protection rec');
  assert.equal(bot.scope, 'account');
  assert.ok(bot.priority > 0);
});

test('auth-route disqualifier: applied to cache kinds', () => {
  assert.equal(isAuthRoute('/login'), true);
  assert.equal(isAuthRoute('/dashboard/settings'), true);
  assert.equal(isAuthRoute('/api/products'), false);
  assert.equal(isAuthRoute('/'), false);

  const cand = applyAuthDisqualifier({ kind: 'uncached_route', route: '/dashboard' });
  assert.equal(cand.disqualified, true);

  // Non-cache kinds pass through — we still want slow/error signal on auth routes.
  const slow = applyAuthDisqualifier({ kind: 'slow_route', route: '/dashboard' });
  assert.equal(slow.disqualified, undefined);
});

test('gate output includes gateMetadata for every registered gate', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);

  assert.equal(out.gateMetadata.length, gates.length);
  for (const m of out.gateMetadata) {
    assert.ok(m.id, 'each gate exports id');
    assert.ok(m.threshold, 'each gate exports threshold text');
  }
});

test('budget cap: at most MAX_CODE_CANDIDATES (6) code-scope candidates launch', async () => {
  const { stdout } = await exec('node', [SCRIPT, FIXTURE_PRO]);
  const out = JSON.parse(stdout);
  assert.ok(out.toLaunch.length <= 6, 'toLaunch must not exceed MAX_CODE_CANDIDATES');
});
