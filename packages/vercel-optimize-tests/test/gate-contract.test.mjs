import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCandidate, validateCandidates, CandidateContractError } from '../../../skills/vercel-optimize/lib/gates/contract.mjs';
import { gate as scannerGate } from '../../../skills/vercel-optimize/lib/gates/scanner-driven.mjs';

const routeCandidate = {
  kind: 'slow_route',
  scope: 'route',
  route: '/api/products',
  files: [],
  priority: 100,
  confidence: 0.9,
  reason: 'slow route',
  question: 'What is slow?',
};

test('validateCandidate: accepts route, host, file, and account candidate shapes', () => {
  assert.equal(validateCandidate(routeCandidate).ok, true);
  assert.equal(validateCandidate({ ...routeCandidate, route: null, hostname: 'api.example.com' }).ok, true);
  assert.equal(validateCandidate({
    ...routeCandidate,
    kind: 'source_maps',
    scope: 'file',
    route: null,
    files: ['next.config.js'],
  }).ok, true);
  assert.equal(validateCandidate({
    ...routeCandidate,
    kind: 'platform_bot_protection',
    scope: 'account',
    route: null,
  }).ok, true);
});

test('validateCandidates: hard-fails route scope without route or hostname', () => {
  assert.throws(
    () => validateCandidates([{ ...routeCandidate, route: null }]),
    CandidateContractError,
  );
});

test('validateCandidates: hard-fails account scope with a route', () => {
  assert.throws(
    () => validateCandidates([{ ...routeCandidate, scope: 'account' }]),
    /account-scoped candidates must not set route/,
  );
});

test('validateCandidates: hard-fails unknown scope and missing priority', () => {
  const { priority, ...withoutPriority } = routeCandidate;
  assert.throws(
    () => validateCandidates([{ ...withoutPriority, scope: 'workspace' }]),
    /scope must be one of route, file, account[\s\S]*priority must be a finite number/,
  );
});

test('scanner-driven: groups route findings separately instead of mixing routes', () => {
  const out = scannerGate({
    codebase: {
      findings: [
        { pattern: 'missing-cache-headers', file: 'src/app/api/a/route.ts', line: 1, route: '/api/a', o11ySignal: 'inv=1000,cache=0%', trafficIndependent: false },
        { pattern: 'max-age-without-s-maxage', file: 'src/app/api/b/route.ts', line: 1, route: '/api/b', o11ySignal: 'inv=2000,cache=10%', trafficIndependent: false },
      ],
    },
  });
  assert.equal(out.length, 2);
  const byRoute = Object.fromEntries(out.map((c) => [c.route, c]));
  assert.deepEqual(byRoute['/api/a'].files, ['src/app/api/a/route.ts']);
  assert.deepEqual(byRoute['/api/b'].files, ['src/app/api/b/route.ts']);
  assert.ok(out.every((c) => c.scope === 'route'));
});

test('scanner-driven: keeps file-scoped traffic-independent findings out of route candidates', () => {
  const out = scannerGate({
    codebase: {
      findings: [
        { pattern: 'missing-cache-headers', file: 'src/app/api/a/route.ts', line: 1, route: '/api/a', o11ySignal: 'inv=1000,cache=0%', trafficIndependent: false },
        { pattern: 'missing-cache-headers', file: 'src/lib/build-config.ts', line: 1, trafficIndependent: true },
      ],
    },
  });
  assert.equal(out.length, 2);
  const fileScoped = out.find((c) => c.scope === 'file');
  const routeScoped = out.find((c) => c.scope === 'route');
  assert.equal(routeScoped.route, '/api/a');
  assert.deepEqual(routeScoped.files, ['src/app/api/a/route.ts']);
  assert.equal(fileScoped.route, null);
  assert.deepEqual(fileScoped.files, ['src/lib/build-config.ts']);
});

test('scanner-driven: drops non-traffic-independent findings without observability annotation', () => {
  const out = scannerGate({
    codebase: {
      findings: [
        { pattern: 'missing-cache-headers', file: 'src/app/api/a/route.ts', line: 1, route: '/api/a', trafficIndependent: false },
        { pattern: 'missing-cache-headers', file: 'src/app/api/b/route.ts', line: 1, route: '/api/b', o11ySignal: 'scanner-only', trafficIndependent: false },
        { pattern: 'missing-cache-headers', file: 'src/lib/build-config.ts', line: 1, trafficIndependent: true },
      ],
    },
  });
  assert.equal(out.length, 1);
  assert.equal(out[0].scope, 'file');
  assert.deepEqual(out[0].files, ['src/lib/build-config.ts']);
});

test('scanner-driven: drops cache-header findings when observed cache hit rate is healthy', () => {
  const out = scannerGate({
    codebase: {
      findings: [
        { pattern: 'missing-cache-headers', file: 'src/app/feed.xml/route.ts', line: 1, route: '/feed.xml', o11ySignal: 'requests=300241,cache=100%', trafficIndependent: false },
        { pattern: 'missing-cache-headers', file: 'src/app/api/a/route.ts', line: 1, route: '/api/a', o11ySignal: 'inv=1000,cache=0%', trafficIndependent: false },
      ],
    },
  });
  assert.equal(out.length, 1);
  assert.equal(out[0].route, '/api/a');
});

test('scanner-driven: applies thresholds per grouped route', () => {
  const out = scannerGate({
    codebase: {
      findings: [
        { pattern: 'unoptimized-image', file: 'src/app/a/page.tsx', line: 1, route: '/a', o11ySignal: 'inv=1000', trafficIndependent: false },
        { pattern: 'unoptimized-image', file: 'src/app/b/page.tsx', line: 1, route: '/b', o11ySignal: 'inv=1000', trafficIndependent: false },
      ],
    },
  });
  assert.deepEqual(out, []);
});
