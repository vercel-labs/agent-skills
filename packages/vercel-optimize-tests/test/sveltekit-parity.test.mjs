import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/sveltekit-prerender-missing.mjs';
import { inferFrameworkPlaybook, buildBrief } from '../../../skills/vercel-optimize/lib/investigation-brief.mjs';
import { libraryForStack } from '../../../skills/vercel-optimize/lib/citations.mjs';

const stubFile = (path, content) => ({ path, content });

test('sveltekit-prerender-missing: flags +page.svelte without prerender export', () => {
  const findings = scan({
    files: [stubFile('src/routes/blog/[slug]/+page.svelte', '<script lang="ts">\n  export let data;\n</script>\n<h1>{data.post.title}</h1>')],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].file, 'src/routes/blog/[slug]/+page.svelte');
  assert.equal(findings[0].pattern, 'sveltekit-prerender-missing');
});

test('sveltekit-prerender-missing: silent on routes with prerender = true', () => {
  const findings = scan({
    files: [stubFile('src/routes/blog/+page.server.ts', "export const prerender = true;\nexport const load = async () => ({})")],
  });
  assert.equal(findings.length, 0);
});

test('sveltekit-prerender-missing: silent on routes with config = { isr: ... }', () => {
  const findings = scan({
    files: [stubFile('src/routes/products/+page.server.ts', "export const config = { isr: { expiration: 60 } };\nexport const load = async () => ({})")],
  });
  assert.equal(findings.length, 0);
});

test('sveltekit-prerender-missing: silent on routes with explicit ssr = true', () => {
  const findings = scan({
    files: [stubFile('src/routes/dashboard/+page.svelte', '<script>\n  export const ssr = true;\n</script>')],
  });
  assert.equal(findings.length, 0);
});

test('sveltekit-prerender-missing: metadata trafficIndependent flag is false', () => {
  // Only HOT static pages matter; cold pages with the pattern are noise.
  assert.equal(metadata.trafficIndependent, false);
});

test('inferFrameworkPlaybook: picks sveltekit for sveltekit stack', () => {
  assert.equal(inferFrameworkPlaybook({ stack: { framework: 'sveltekit' } }), 'sveltekit');
});

test('inferFrameworkPlaybook: null for next', () => {
  assert.equal(inferFrameworkPlaybook({ stack: { framework: 'next' } }), null);
});

test('inferFrameworkPlaybook: null when framework unknown', () => {
  assert.equal(inferFrameworkPlaybook({}), null);
});

test('citation library: SvelteKit has framework-shaped doc coverage (>=8 URLs)', async () => {
  const { urls } = await libraryForStack('sveltekit', '2.0.0');
  const skSpecific = urls.filter((e) => e.applicableFrameworks.some((p) => p.startsWith('sveltekit')));
  assert.ok(skSpecific.length >= 8, `expected >=8 SvelteKit URLs, got ${skSpecific.length}`);
});

test('citation library: Astro has at least 3 framework-shaped URLs', async () => {
  const { urls } = await libraryForStack('astro', '4.0.0');
  const astroSpecific = urls.filter((e) => e.applicableFrameworks.some((p) => p.startsWith('astro')));
  assert.ok(astroSpecific.length >= 3, `expected >=3 Astro URLs, got ${astroSpecific.length}`);
});

test('citation library: Nuxt has at least 3 framework-shaped URLs', async () => {
  const { urls } = await libraryForStack('nuxt', '3.10.0');
  const nuxtSpecific = urls.filter((e) => e.applicableFrameworks.some((p) => p.startsWith('nuxt')));
  assert.ok(nuxtSpecific.length >= 3, `expected >=3 Nuxt URLs, got ${nuxtSpecific.length}`);
});

test('buildBrief: framework playbook section renders when frameworkPlaybookBody is passed', () => {
  const md = buildBrief({
    candidate: { kind: 'slow_route', route: '/x', evidence: { deepDive: {} } },
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/routes/x/+page.server.ts'],
    signals: { stack: { framework: 'sveltekit', frameworkVersion: '2.0.0' } },
    citations: { urls: [], ruleSkillRefs: [] },
    playbookId: 'saas',
    playbookBody: '# SaaS\n\n(body)',
    frameworkPlaybookId: 'sveltekit',
    frameworkPlaybookBody: '# SvelteKit\n\n(framework body)',
    generatedAt: null,
  });
  assert.match(md, /Framework-specific playbook \(`sveltekit`\)/);
  assert.match(md, /framework body/);
});

test('buildBrief: no framework section when frameworkPlaybookId is null', () => {
  const md = buildBrief({
    candidate: { kind: 'slow_route', route: '/x', evidence: { deepDive: {} } },
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: [],
    signals: { stack: { framework: 'next', frameworkVersion: '15.4.10' } },
    citations: { urls: [], ruleSkillRefs: [] },
    playbookId: null,
    playbookBody: null,
    frameworkPlaybookId: null,
    frameworkPlaybookBody: null,
    generatedAt: null,
  });
  assert.ok(!md.includes('Framework-specific playbook'));
});
