import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  loadSupportTopics,
  parseSupportTopic,
  renderSupportTopics,
  supportTopicSubset,
  validateSupportTopics,
} from '../../../skills/vercel-optimize/lib/support-topics.mjs';

const next15Signals = {
  stack: {
    framework: 'next',
    frameworkVersion: '15.4.10',
    hasAppRouter: true,
    hasPagesRouter: false,
  },
  codebase: {
    stack: {
      framework: 'next',
      frameworkVersion: '15.4.10',
      hasAppRouter: true,
      hasPagesRouter: false,
    },
  },
};

test('support topics: every checked-in topic passes schema and citation validation', async () => {
  const result = await validateSupportTopics();
  assert.deepEqual(result.errors, []);
  assert.ok(result.topics.length >= 10, 'initial topic pack should cover more than a thin three-topic slice');
});

test('supportTopicSubset: selects uncached-route topics deterministically', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/api/products', evidence: { patterns: [] } },
    signals: next15Signals,
  });
  assert.deepEqual(
    topics.map((t) => t.id),
    [
      'cdn-cache-auth-safety',
      'next-route-handler-get-cache-defaults',
      'next-fetch-revalidate-floor',
    ],
  );
});

test('supportTopicSubset: filters version-specific topics out for older Next.js versions', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/api/products' },
    signals: {
      stack: { framework: 'next', frameworkVersion: '13.5.0', hasAppRouter: true },
      codebase: { stack: { framework: 'next', frameworkVersion: '13.5.0', hasAppRouter: true } },
    },
  });
  assert.ok(topics.some((t) => t.id === 'cdn-cache-auth-safety'));
  assert.ok(!topics.some((t) => t.id === 'nextjs-version-cache-semantics'));
});

test('supportTopicSubset: does not leak unrelated topics into a candidate brief', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'cwv_poor', route: '/pricing' },
    signals: next15Signals,
  });
  assert.deepEqual(topics.map((t) => t.id), ['core-web-vitals-client-bottlenecks']);
  assert.ok(!topics.some((t) => t.id.includes('cache')));
});

test('supportTopicSubset: omits Next-only external API topics for non-Next stacks', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'external_api_slow', hostname: 'api.example.com' },
    signals: {
      stack: { framework: 'sveltekit', frameworkVersion: '2.0.0' },
      codebase: { stack: { framework: 'sveltekit', frameworkVersion: '2.0.0' } },
    },
  });
  assert.deepEqual(topics.map((t) => t.id), [
    'external-api-critical-path-platform',
    'runtime-cache-reusable-data',
  ]);
  assert.ok(!topics.some((t) => t.id === 'external-api-critical-path'));
});

test('supportTopicSubset: prefers Next 16 remote-cache guardrail for external API candidates', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'external_api_slow', hostname: 'api.example.com' },
    signals: {
      stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
      codebase: { stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true } },
    },
  });
  assert.deepEqual(topics.map((t) => t.id), [
    'external-api-critical-path',
    'use-cache-remote-shared-origin-data',
    'external-api-critical-path-platform',
  ]);
});

test('renderSupportTopics: renders bounded investigation guardrails', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'middleware_heavy', scope: 'account' },
    signals: next15Signals,
  });
  const md = renderSupportTopics(topics).join('\n');
  assert.match(md, /## Support topics \(investigation guardrails\)/);
  assert.match(md, /Middleware edge cost/);
  assert.match(md, /They do not create recommendations/);
});

test('supportTopicSubset: selects metric-specific Core Web Vitals guardrails', async () => {
  const lcpTopics = await supportTopicSubset({
    candidate: { kind: 'cwv_poor', route: '/pricing', evidence: { issues: [{ metric: 'LCP', value: 3200 }] } },
    signals: { stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true } },
  });
  assert.deepEqual(lcpTopics.map((t) => t.id), [
    'core-web-vitals-client-bottlenecks',
    'next-image-lcp-preload-sizes',
    'next-script-third-party-strategy',
  ]);

  const clsTopics = await supportTopicSubset({
    candidate: { kind: 'cwv_poor', route: '/pricing', evidence: { issues: [{ metric: 'CLS', value: 0.2 }] } },
    signals: { stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true } },
  });
  assert.deepEqual(clsTopics.map((t) => t.id), [
    'core-web-vitals-client-bottlenecks',
    'next-font-cls-self-hosting',
  ]);
});

test('supportTopicSubset: selects route-pattern topics only for matching routes', async () => {
  const notFoundTopics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/404', evidence: { patterns: [] } },
    signals: next15Signals,
  });
  assert.ok(notFoundTopics.some((t) => t.id === 'not-found-catchall-request-waste'));

  const normalTopics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/api/products', evidence: { patterns: [] } },
    signals: next15Signals,
  });
  assert.ok(!normalTopics.some((t) => t.id === 'not-found-catchall-request-waste'));
});

test('supportTopicSubset: selects high-impact framework topics for SvelteKit, Nuxt, and Astro', async () => {
  const svelteTopics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/blog' },
    signals: { stack: { framework: 'sveltekit', frameworkVersion: '2.0.0' } },
  });
  assert.ok(svelteTopics.some((t) => t.id === 'sveltekit-isr-prerender-safety'));

  const nuxtTopics = await supportTopicSubset({
    candidate: { kind: 'uncached_route', route: '/blog' },
    signals: { stack: { framework: 'nuxt', frameworkVersion: '3.12.0' } },
  });
  assert.ok(nuxtTopics.some((t) => t.id === 'nuxt-route-rules-cache-isr'));

  const astroTopics = await supportTopicSubset({
    candidate: { kind: 'rendering_candidate', route: '/blog' },
    signals: { stack: { framework: 'astro', frameworkVersion: '4.0.0' } },
  });
  assert.deepEqual(astroTopics.map((t) => t.id), ['astro-output-mode-and-isr']);
});

test('supportTopicSubset: selects Cache Components for Next 16 rendering candidates', async () => {
  const topics = await supportTopicSubset({
    candidate: { kind: 'rendering_candidate', route: '/products/[slug]' },
    signals: {
      stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true },
      codebase: { stack: { framework: 'next', frameworkVersion: '16.0.0', hasAppRouter: true } },
    },
  });
  assert.deepEqual(topics.map((t) => t.id), [
    'cache-components-static-shell-boundaries',
    'dynamic-rendering-traps',
  ]);
});

test('parseSupportTopic: rejects non-JSON array frontmatter', () => {
  assert.throws(() => parseSupportTopic(`---
id: bad-topic
title: Bad Topic
status: active
candidateKinds: [uncached_route]
frameworks: ["*"]
priority: 1
citations: ["https://vercel.com/docs/caching/cdn-cache"]
maxBriefChars: 500
---

## Investigation Brief
x

## Evidence To Check
x

## Do Not Recommend When
x

## Verification
x
`, '/tmp/bad-topic.md'), /strict JSON array syntax/);
});

test('loadSupportTopics: stable sorted source order', async () => {
  const topics = await loadSupportTopics({ includeDraft: true });
  const ids = topics.map((t) => t.id);
  assert.deepEqual(ids, [...ids].sort());
});
