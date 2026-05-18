// The brief is a literal LLM prompt body — these tests guard determinism,
// section coverage, and isolation (no leakage of other candidates' data).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBrief,
  resolveFiles,
  inferPlaybook,
  citationSubset,
  KIND_INTERPRETATION_HINTS,
} from '../../../skills/vercel-optimize/lib/investigation-brief.mjs';

const baseStack = {
  framework: 'next',
  frameworkVersion: '15.4.10',
  hasAppRouter: true,
  hasPagesRouter: false,
  orm: 'none',
  isMonorepo: false,
};

const slowRouteCandidate = {
  kind: 'slow_route',
  scope: 'route',
  route: '/dashboard/[sessionId]',
  files: [],
  priority: 5253,
  confidence: 0.94,
  o11ySignal: 'inv=4923,p95=1067ms',
  question: 'What is the concrete bottleneck in /dashboard/[sessionId]?',
  evidence: {
    metric: 'fnDurationP95ByRoute',
    route: '/dashboard/[sessionId]',
    deepDive: {
      latency: { p50: 120, p75: 164, p95: 1066.4623, p99: 2695 },
      ttfb: { p50: 128, p95: 576 },
      cpu: { p95: 116 },
      startTypeSplit: [
        { function_start_type: 'hot', value: 4893 },
        { function_start_type: 'cold', value: 19 },
      ],
    },
  },
};

const baseSignals = {
  stack: baseStack,
  codebase: {
    stack: baseStack,
    routes: [
      { routePath: '/dashboard/[sessionId]', file: 'src/app/(app)/dashboard/[sessionId]/page.tsx', type: 'page' },
      { routePath: '/admin', file: 'src/app/(admin)/admin/page.tsx', type: 'page' },
    ],
  },
};

test('resolveFiles: returns existing candidate.files unchanged', () => {
  const c = { ...slowRouteCandidate, files: ['src/manual.ts'] };
  assert.deepEqual(resolveFiles(c, baseSignals), ['src/manual.ts']);
});

test('resolveFiles: looks up by route when candidate.files is empty', () => {
  assert.deepEqual(
    resolveFiles(slowRouteCandidate, baseSignals),
    ['src/app/(app)/dashboard/[sessionId]/page.tsx'],
  );
});

test('resolveFiles: uses trailing dynamic partial match when scanner route has one extra leaf', () => {
  const signals = {
    stack: baseStack,
    codebase: {
      stack: baseStack,
      routes: [
        {
          routePath: '/event/[code]/[location]/register',
          file: 'src/app/event/[code]/[location]/register/page.tsx',
          type: 'page',
        },
      ],
    },
  };
  const c = { kind: 'slow_route', route: '/event/[code]/[location]', files: [] };
  assert.deepEqual(
    resolveFiles(c, signals),
    ['src/app/event/[code]/[location]/register/page.tsx'],
  );
});

test('resolveFiles: exact dynamic route beats partial descendant match', () => {
  const signals = {
    stack: baseStack,
    codebase: {
      stack: baseStack,
      routes: [
        {
          routePath: '/event/[code]/[location]',
          file: 'src/app/event/[code]/[location]/page.tsx',
          type: 'page',
        },
        {
          routePath: '/event/[code]/[location]/register',
          file: 'src/app/event/[code]/[location]/register/page.tsx',
          type: 'page',
        },
      ],
    },
  };
  const c = { kind: 'slow_route', route: '/event/[code]/[location]', files: [] };
  assert.deepEqual(
    resolveFiles(c, signals),
    ['src/app/event/[code]/[location]/page.tsx'],
  );
});

test('resolveFiles: caps 12 non-layout files plus 3 closest ancestor layouts', () => {
  const workspaceImports = Array.from({ length: 10 }, (_, i) => `packages/ui/file-${i}.tsx`);
  const signals = {
    stack: baseStack,
    codebase: {
      stack: baseStack,
      routes: [
        { routePath: '/', file: 'src/app/layout.tsx', type: 'layout' },
        { routePath: '/event', file: 'src/app/event/layout.tsx', type: 'layout' },
        { routePath: '/event/[code]', file: 'src/app/event/[code]/layout.tsx', type: 'layout' },
        { routePath: '/event/[code]/[location]', file: 'src/app/event/[code]/[location]/layout.tsx', type: 'layout' },
        {
          routePath: '/event/[code]/[location]/register',
          file: 'src/app/event/[code]/[location]/register/page.tsx',
          type: 'page',
          workspaceImports,
        },
      ],
    },
  };
  assert.deepEqual(
    resolveFiles({ kind: 'slow_route', route: '/event/[code]/[location]/register', files: [] }, signals),
    [
      'src/app/event/[code]/[location]/register/page.tsx',
      ...workspaceImports,
      'src/app/event/[code]/[location]/layout.tsx',
      'src/app/event/[code]/layout.tsx',
      'src/app/event/layout.tsx',
    ],
  );
});

test('resolveFiles: returns [] when route has no scanner mapping (legitimate data gap)', () => {
  const c = { kind: 'slow_route', route: '/unknown/route', files: [] };
  assert.deepEqual(resolveFiles(c, baseSignals), []);
});

test('resolveFiles: returns [] for account-scope candidates with no route', () => {
  const c = { kind: 'platform_fluid_compute', scope: 'account', files: [] };
  assert.deepEqual(resolveFiles(c, baseSignals), []);
});

test('inferPlaybook: ecommerce on stripe + cart routes', () => {
  const sig = {
    stack: { deps: { stripe: '14.0.0' } },
    codebase: { routes: [{ routePath: '/cart' }, { routePath: '/checkout' }] },
  };
  assert.equal(inferPlaybook(sig), 'ecommerce');
});

test('inferPlaybook: saas on admin route presence', () => {
  const sig = {
    stack: { deps: {} },
    codebase: { routes: [{ routePath: '/admin' }, { routePath: '/dashboard' }] },
  };
  assert.equal(inferPlaybook(sig), 'saas');
});

test('inferPlaybook: api-service when every route is /api/*', () => {
  const sig = {
    stack: { deps: {} },
    codebase: { routes: [{ routePath: '/api/a' }, { routePath: '/api/b' }] },
  };
  assert.equal(inferPlaybook(sig), 'api-service');
});

test('inferPlaybook: returns null when no signals match', () => {
  const sig = {
    stack: { deps: {} },
    codebase: { routes: [{ routePath: '/' }] },
  };
  assert.equal(inferPlaybook(sig), null);
});

test('inferPlaybook: ai-application on @ai-sdk/openai dep', () => {
  const sig = {
    stack: { deps: { '@ai-sdk/openai': '1.0.0' } },
    codebase: { routes: [{ routePath: '/chat' }] },
  };
  assert.equal(inferPlaybook(sig), 'ai-application');
});

test('inferPlaybook: ai-application on @vercel/sandbox dep', () => {
  const sig = {
    stack: { deps: { '@vercel/sandbox': '1.0.0' } },
    codebase: { routes: [{ routePath: '/agent' }] },
  };
  assert.equal(inferPlaybook(sig), 'ai-application');
});

test('inferPlaybook: ai-application via usage signal (no AI deps, but AI Gateway SKU active)', () => {
  const sig = {
    stack: { deps: {} },
    codebase: { routes: [{ routePath: '/' }] },
    usage: { services: [{ name: 'AI Gateway', billedCost: 100 }] },
  };
  assert.equal(inferPlaybook(sig), 'ai-application');
});

test('inferPlaybook: ai-application wins over saas when both apply (AI dashboard)', () => {
  const sig = {
    stack: { deps: { '@ai-sdk/openai': '1.0.0', '@clerk/nextjs': '6.0.0' } },
    codebase: { routes: [{ routePath: '/dashboard' }, { routePath: '/chat' }] },
  };
  assert.equal(inferPlaybook(sig), 'ai-application');
});

test('inferPlaybook: ai-application does NOT fire when usage billedCost is zero', () => {
  const sig = {
    stack: { deps: {} },
    codebase: { routes: [{ routePath: '/' }] },
    usage: { services: [{ name: 'AI Gateway', billedCost: 0 }] },
  };
  assert.equal(inferPlaybook(sig), null);
});

test('citationSubset: filters by version (next@13 excludes use-cache)', async () => {
  const subset = await citationSubset('uncached_route', 'next', '13.5.0');
  const useCacheRef = subset.urls.find((e) => e.url.includes('use-cache'));
  assert.equal(useCacheRef, undefined, 'use-cache URL must NOT appear for next@13');
});

test('citationSubset: filters by kind (cwv_poor excludes ISR-only URLs)', async () => {
  const subset = await citationSubset('cwv_poor', 'next', '15.4.0');
  const isrUrl = subset.urls.find((e) => e.url.includes('incremental-static-regeneration'));
  assert.equal(isrUrl, undefined, 'ISR doc should not appear in cwv_poor subset');
});

test('citationSubset: includes wildcard-version URLs (e.g. Vercel platform docs)', async () => {
  const subset = await citationSubset('slow_route', 'next', '13.0.0');
  const fluid = subset.urls.find((e) => e.url.includes('fluid-compute'));
  assert.ok(fluid, 'Fluid Compute doc applies to any version + slow_route');
});

const stubCitations = {
  urls: [
    { url: 'https://vercel.com/docs/functions/fluid-compute', topic: 'Fluid Compute', appliesTo: ['slow_route'], applicableFrameworks: ['*'] },
  ],
  ruleSkillRefs: [
    { skill: 'vercel-react-best-practices', rule: 'async-parallel', topic: 'Promise.all', applicableFrameworks: ['*'] },
  ],
};

test('buildBrief: contains every required section', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/app/(app)/dashboard/[sessionId]/page.tsx'],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: 'saas',
    playbookBody: '# SaaS\n\n(body)',
    generatedAt: null,
  });
  assert.match(md, /^# Investigation brief — slow_route/, 'title');
  assert.match(md, /## Candidate/);
  assert.match(md, /## Stack context/);
  assert.match(md, /## Deep-dive evidence/);
  assert.match(md, /## Citation library/);
  assert.match(md, /## Playbook hint/);
  assert.match(md, /## Investigation protocol/);
  assert.match(md, /## Required output/);
  assert.match(md, /## Critical rules/);
});

test('buildBrief: labels layout files separately from route and workspace files', () => {
  const signals = {
    stack: baseStack,
    codebase: {
      stack: baseStack,
      routes: [
        { routePath: '/dashboard/[sessionId]', file: 'src/app/dashboard/[sessionId]/page.tsx', type: 'page' },
        { routePath: '/', file: 'src/app/layout.tsx', type: 'layout' },
        { routePath: '/dashboard', file: 'src/app/dashboard/layout.tsx', type: 'layout' },
      ],
    },
  };
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [
      'src/app/dashboard/[sessionId]/page.tsx',
      'packages/dashboard/data.ts',
      'src/app/dashboard/layout.tsx',
    ],
    signals,
    citations: stubCitations,
    generatedAt: null,
  });
  assert.match(md, /Capped at 12 non-layout files \+ up to 3 layouts/);
  assert.match(md, /`src\/app\/dashboard\/\[sessionId\]\/page\.tsx` \(route\)/);
  assert.match(md, /`packages\/dashboard\/data\.ts` \(workspace import\)/);
  assert.match(md, /`src\/app\/dashboard\/layout\.tsx` \(layout\)/);
});

test('buildBrief: includes repo/app roots and absolute read paths', () => {
  const signals = {
    stack: baseStack,
    codebase: {
      rootDir: '/repo/apps/web',
      monorepoRoot: '/repo',
      stack: baseStack,
      routes: [
        { routePath: '/dashboard/[sessionId]', file: 'src/app/dashboard/[sessionId]/page.tsx', type: 'page' },
      ],
    },
  };
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [
      'src/app/dashboard/[sessionId]/page.tsx',
      'packages/dashboard/data.ts',
    ],
    signals,
    citations: stubCitations,
    generatedAt: null,
  });
  assert.match(md, /Repo root:\*\* `\/repo`/);
  assert.match(md, /App root:\*\* `\/repo\/apps\/web`/);
  assert.match(md, /`apps\/web\/src\/app\/dashboard\/\[sessionId\]\/page\.tsx` \(route\) \(scan path: `src\/app\/dashboard\/\[sessionId\]\/page\.tsx`\) — open `\/repo\/apps\/web\/src\/app\/dashboard\/\[sessionId\]\/page\.tsx`/);
  assert.match(md, /`packages\/dashboard\/data\.ts` \(workspace import\) — open `\/repo\/packages\/dashboard\/data\.ts`/);
  assert.match(md, /do not use the scan path in JSON/);
});

test('buildBrief: is deterministic when generatedAt is null', () => {
  const args = {
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/app/(app)/dashboard/[sessionId]/page.tsx'],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: 'saas',
    playbookBody: '# SaaS\n\n(body)',
    generatedAt: null,
  };
  assert.equal(buildBrief(args), buildBrief(args));
});

test('buildBrief: embeds the deepDive JSON verbatim (the only ground-truth)', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  // Spot-check exact numerics — must be verbatim or the sub-agent will guess.
  assert.match(md, /"p95": 1066\.4623/);
  assert.match(md, /"p99": 2695/);
  assert.match(md, /"function_start_type": "cold"/);
});

test('buildBrief: per-kind interpretation hints render for known kinds', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  assert.match(md, /How to read the evidence for this candidate kind/);
  assert.ok(md.includes(KIND_INTERPRETATION_HINTS.slow_route[0]));
});

test('buildBrief: cache candidates include cache-policy guidance', () => {
  const md = buildBrief({
    candidate: {
      kind: 'uncached_route',
      scope: 'route',
      route: '/api/models',
      priority: 100,
      confidence: 0.9,
      o11ySignal: 'requests=100000,cache=0%,get=100%',
      question: 'Why is /api/models bypassing the cache?',
      evidence: {
        deepDive: {
          methodDistribution: [{ request_method: 'GET', value: 100000 }],
          cacheBreakdown: [{ cache_result: 'BYPASS', value: 100000 }],
        },
      },
    },
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['app/api/models/route.ts'],
    signals: {
      stack: { ...baseStack, cacheComponents: true },
      codebase: { stack: baseStack, routes: [{ routePath: '/api/models', file: 'app/api/models/route.ts', type: 'route' }] },
    },
    citations: stubCitations,
    generatedAt: null,
  });
  assert.match(md, /## Cache-policy decision/);
  assert.match(md, /Do not default to `no-store`/);
  assert.match(md, /Whole public GET response/);
  assert.match(md, /use cache: remote/);
  assert.match(md, /Runtime Cache/);
});

test('buildBrief: renders support topics without making them recommendations', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    supportTopics: [{
      id: 'function-duration-io-and-after',
      title: 'Function duration, I/O, and post-response work',
      body: '## Investigation Brief\nCheck wall-clock vs CPU.\n\n## Evidence To Check\nUse `cpu.p95`.\n\n## Do Not Recommend When\nDo not parallelize dependent awaits.\n\n## Verification\nName the moved await.',
    }],
    generatedAt: null,
  });
  assert.match(md, /## Support topics \(investigation guardrails\)/);
  assert.match(md, /They do not create recommendations/);
  assert.match(md, /Function duration, I\/O, and post-response work/);
});

test('buildBrief: critical rules include the voice + AI-slop ban (rule #6)', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/x.ts'],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  // Voice rule must propagate to sub-agents on every host.
  assert.match(md, /Vercel voice/);
  assert.match(md, /Sharp teammate, clear, competent, no fluff/);
  assert.match(md, /arrows in prose/);
  assert.match(md, /leverage/);
  assert.match(md, /fluid compute/);
  assert.match(md, /BotID/);
  assert.match(md, /references\/voice\.md/);
});

test('buildBrief: portable — no host-specific tool names in the brief', () => {
  // Brief ships verbatim to multiple hosts (Claude Code, Codex CLI, Cursor,
  // Copilot...) — `Read`/`Agent`/`Bash` tool strings are Claude-Code-specific.
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/x.ts'],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  for (const banned of ['`Read` tool', '`Agent` tool', '`Bash` tool', '`Write` tool', '`Task` tool']) {
    assert.ok(!md.includes(banned), `brief leaks Claude-Code-specific tool name "${banned}"`);
  }
});

test('buildBrief: NO leakage of other candidates or full library', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/app/(app)/dashboard/[sessionId]/page.tsx'],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  // /admin only appears via inferPlaybook (saas hint); playbook=null here.
  assert.ok(!md.includes('/admin'), `leaked /admin into a slow_route brief: ${md.slice(0, 200)}`);
  assert.ok(!md.includes('https://vercel.com/docs/incremental-static-regeneration'));
});

test('buildBrief: includes abstention escape hatch with the candidateRef pre-filled', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  assert.match(md, /"abstain": true, "candidateRef": "slow_route:\/dashboard\/\[sessionId\]"/);
});

test('buildBrief: includes the version constraint in critical rules', () => {
  const md = buildBrief({
    candidate: slowRouteCandidate,
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  assert.match(md, /next@15\.4\.10/);
});

test('buildBrief: empty files → tells the agent it has no source files (not a missing field)', () => {
  const md = buildBrief({
    candidate: { ...slowRouteCandidate, route: null },
    candidateIndex: 0,
    candidateGroup: 'platform',
    files: [],
    signals: baseSignals,
    citations: stubCitations,
    playbookId: null,
    playbookBody: null,
    generatedAt: null,
  });
  assert.match(md, /none mapped to this candidate/);
});

test('buildBrief: every gate kind has an interpretation hint (drift detector)', () => {
  // Drift catch: new gate kinds must have a hint entry.
  // oversized_memory + deploy_regression removed May 2026.
  const kinds = [
    'slow_route', 'uncached_route', 'cold_start',
    'route_errors', 'external_api_slow', 'isr_overrevalidation',
    'cwv_poor', 'middleware_heavy',
    'platform_fluid_compute', 'platform_bot_protection',
  ];
  for (const k of kinds) {
    assert.ok(
      Array.isArray(KIND_INTERPRETATION_HINTS[k]) && KIND_INTERPRETATION_HINTS[k].length > 0,
      `KIND_INTERPRETATION_HINTS missing entry for ${k}`,
    );
  }
});
