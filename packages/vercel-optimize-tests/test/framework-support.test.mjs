import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyFrameworkSupport,
  frameworkLabel,
} from '../../../skills/vercel-optimize/lib/framework-support.mjs';

test('classifyFrameworkSupport: core frameworks continue by default', () => {
  for (const framework of ['next', 'sveltekit', 'nuxt']) {
    const r = classifyFrameworkSupport({ framework });
    assert.equal(r.ok, true);
    assert.equal(r.status, 'supported');
    assert.equal(r.blocker, null);
    assert.match(r.detail, /route-to-file/);
  }
});

test('classifyFrameworkSupport: Astro is limited, not a hard blocker', () => {
  const r = classifyFrameworkSupport({ framework: 'astro' });
  assert.equal(r.ok, true);
  assert.equal(r.status, 'limited');
  assert.equal(r.blocker, null);
  assert.match(r.detail, /limited/i);
});

test('classifyFrameworkSupport: Hono blocks metric-backed code recommendations', () => {
  const r = classifyFrameworkSupport({ framework: 'hono' });
  assert.equal(r.ok, false);
  assert.equal(r.status, 'unsupported');
  assert.equal(r.blocker, 'unsupported_framework');
  assert.equal(r.label, 'Hono');
  assert.match(r.detail, /Supported frameworks: Next\.js, SvelteKit, Nuxt/);
});

test('frameworkLabel: normalizes aliases', () => {
  assert.equal(frameworkLabel('nextjs'), 'Next.js');
  assert.equal(frameworkLabel('svelte'), 'SvelteKit');
});
