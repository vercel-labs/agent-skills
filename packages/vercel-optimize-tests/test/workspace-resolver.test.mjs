import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  detectMonorepoRoot,
  parsePnpmWorkspaceYaml,
  listWorkspacePackages,
  buildResolver,
  extractImportSpecifiers,
  resolveWorkspaceImports,
} from '../../../skills/vercel-optimize/lib/workspace-resolver.mjs';

let scratch;

test('setup: create scratch monorepo', async () => {
  scratch = await mkdtemp(join(tmpdir(), 'vercel-optimize-ws-'));
  // Shape: pnpm-workspace.yaml + apps/fixture-site (consumer) +
  // packages/content-kit (@acme/content-kit with exports map).
  await mkdir(join(scratch, 'apps', 'fixture-site', 'app'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'mixed'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'cycle'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'components', 'shadcn'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'lib', 'utilities'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'server'), { recursive: true });
  await mkdir(join(scratch, 'packages', 'content-kit', 'lib', 'capped'), { recursive: true });
  await writeFile(join(scratch, 'pnpm-workspace.yaml'),
    "packages:\n  - 'apps/*'\n  - 'packages/*'\n");
  await writeFile(join(scratch, 'apps', 'fixture-site', 'package.json'),
    JSON.stringify({ name: 'fixture-site', dependencies: { '@acme/content-kit': 'workspace:*' } }));
  await writeFile(join(scratch, 'apps', 'fixture-site', 'app', 'page.tsx'), `
import { Homepage } from '@acme/content-kit/components/homepage';
import { getEventForHero } from '@acme/content-kit/utilities/event-for-hero';
import { something } from 'react';
export default function Page() { return null; }
`);
  await writeFile(join(scratch, 'packages', 'content-kit', 'package.json'), JSON.stringify({
    name: '@acme/content-kit',
    version: '0.0.1',
    type: 'module',
    exports: {
      './components/homepage': './components/pages/homepage/index.ts',
      './components/mixed': './components/pages/mixed/index.ts',
      './components/cycle': './components/pages/cycle/a.ts',
      './components': ['./components/index.ts', './components/shadcn/index.ts'],
      './data-entry': './lib/data/data.ts',
      './data-capped': './lib/capped/data.ts',
      './utilities/*': './lib/utilities/*.ts',
      './auth': { import: './lib/auth/auth.ts', default: './lib/auth/auth.ts' },
    },
  }));
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'index.ts'),
    'export * from "./barrel-1";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'barrel-1.ts'),
    'export * from "./barrel-2";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'barrel-2.ts'),
    'export { Homepage } from "./homepage";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'homepage.tsx'),
    'export function Homepage() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep.ts'),
    'export * from "./too-deep-2";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep-2.ts'),
    'export * from "./too-deep-3";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep-3.ts'),
    'export * from "./too-deep-4";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep-4.ts'),
    'export * from "./too-deep-leaf";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep-leaf.tsx'),
    'export function TooDeep() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'mixed', 'index.ts'),
    'export { MixedLeaf } from "./mixed-leaf";\nexport const runtime = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'mixed', 'mixed-leaf.tsx'),
    'export function MixedLeaf() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'cycle', 'a.ts'),
    'export * from "./b";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'pages', 'cycle', 'b.ts'),
    'export * from "./a";\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'index.ts'), `
export * from './arrow-back-link';
export * from './shared-layout';
export * from './force-transparent-header';
export * from './main';
`);
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'arrow-back-link.tsx'),
    'export function ArrowBackLink() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'shared-layout.tsx'),
    'export function SharedLayout() { return null; }\nexport function sharedGenerateMetadata() { return {}; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'force-transparent-header.tsx'),
    'export function ForceTransparentHeader() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'main.tsx'),
    'export function Main() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'components', 'shadcn', 'index.ts'),
    'export function Shadcn() { return null; }\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'utilities', 'event-for-hero.ts'),
    'export function getEventForHero() {}\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'data.ts'),
    'import "./fetch";\nexport const data = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'fetch.ts'),
    'import "./service";\nexport const fetchData = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'service.ts'),
    'import "./metadata";\nimport "./server";\nexport const service = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'metadata.ts'),
    'export const metadata = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'data', 'server', 'index.ts'),
    'export const server = true;\n');
  await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'capped', 'data.ts'),
    'import "./actions";\nimport "./content";\nimport "./loader";\nimport "./metadata";\nimport "./service";\nexport const capped = true;\n');
  for (const name of ['actions', 'content', 'loader']) {
    await writeFile(join(scratch, 'packages', 'content-kit', 'lib', 'capped', `${name}.ts`),
      `export const ${name} = true;\n`);
  }
});

after(async () => { if (scratch) await rm(scratch, { recursive: true, force: true }); });

test('detectMonorepoRoot: finds via pnpm-workspace.yaml', async () => {
  const root = await detectMonorepoRoot(join(scratch, 'apps', 'fixture-site', 'app'));
  assert.equal(root, scratch);
});

test('detectMonorepoRoot: returns null when no markers up the tree', async () => {
  const root = await detectMonorepoRoot('/');
  assert.equal(root, null);
});

test('parsePnpmWorkspaceYaml: extracts globs', () => {
  const globs = parsePnpmWorkspaceYaml("packages:\n  - 'apps/*'\n  - \"packages/*\"\n  - tooling/*\n");
  assert.deepEqual(globs, ['apps/*', 'packages/*', 'tooling/*']);
});

test('parsePnpmWorkspaceYaml: ignores comments + blank lines', () => {
  const globs = parsePnpmWorkspaceYaml("# top comment\npackages:\n\n  - 'apps/*'\n  # nested comment\n  - 'packages/*'\n");
  assert.deepEqual(globs, ['apps/*', 'packages/*']);
});

test('listWorkspacePackages: enumerates all packages with a name', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const names = pkgs.map((p) => p.name).sort();
  assert.deepEqual(names, ['@acme/content-kit', 'fixture-site']);
});

test('buildResolver: exact-match exports key resolves to declared target', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const out = resolve('@acme/content-kit/components/homepage');
  assert.equal(out, join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'index.ts'));
});

test('buildResolver: wildcard exports key fills in *', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const out = resolve('@acme/content-kit/utilities/event-for-hero');
  assert.equal(out, join(scratch, 'packages', 'content-kit', 'lib', 'utilities', 'event-for-hero.ts'));
});

test('buildResolver: conditional-exports object (import/default) resolves', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const out = resolve('@acme/content-kit/auth');
  assert.equal(out, join(scratch, 'packages', 'content-kit', 'lib', 'auth', 'auth.ts'));
});

test('buildResolver: array exports resolve to the first target', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const out = resolve('@acme/content-kit/components');
  assert.equal(out, join(scratch, 'packages', 'content-kit', 'components', 'index.ts'));
});

test('buildResolver: returns null for non-workspace imports', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  assert.equal(resolve('react'), null);
  assert.equal(resolve('@anthropic/sdk'), null);
});

test('buildResolver: returns null when subpath not in exports map', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  assert.equal(resolve('@acme/content-kit/some/unmapped/path'), null);
});

test('extractImportSpecifiers: catches static + dynamic + side-effect imports', () => {
  // require() is intentionally not caught.
  const text = `
import { A } from 'foo';
import B from 'bar';
import * as C from 'baz';
import 'side-effect';
export { D } from 'qux';
const e = await import('quux');
const f = require('cjs');
`;
  const out = extractImportSpecifiers(text);
  assert.ok(out.includes('foo'));
  assert.ok(out.includes('bar'));
  assert.ok(out.includes('baz'));
  assert.ok(out.includes('side-effect'));
  assert.ok(out.includes('qux'));
  assert.ok(out.includes('quux'));
  assert.ok(!out.includes('cjs'));
});

test('resolveWorkspaceImports: returns workspace-resolved files only', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'page.tsx');
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.ok(out.length >= 5);
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/index.ts')));
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/barrel-1.ts')));
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/barrel-2.ts')));
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/homepage.tsx')));
  assert.ok(out.some((p) => p.endsWith('lib/utilities/event-for-hero.ts')));
});

test('resolveWorkspaceImports: follows pure barrels to depth 3', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'pure-barrel.tsx');
  await writeFile(filePath, "import { Homepage } from '@acme/content-kit/components/homepage';\n");
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/homepage.tsx')));
});

test('resolveWorkspaceImports: stops pure barrel traversal after depth 3', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'too-deep.tsx');
  await writeFile(filePath, "import '@acme/content-kit/components/homepage/too-deep';\n");
  const out = await resolveWorkspaceImports(filePath, (specifier) => {
    if (specifier === '@acme/content-kit/components/homepage/too-deep') {
      return join(scratch, 'packages', 'content-kit', 'components', 'pages', 'homepage', 'too-deep.ts');
    }
    return resolve(specifier);
  });
  assert.ok(out.some((p) => p.endsWith('components/pages/homepage/too-deep-3.ts')));
  assert.ok(!out.some((p) => p.endsWith('components/pages/homepage/too-deep-leaf.tsx')));
});

test('resolveWorkspaceImports: does not recurse mixed barrels', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'mixed.tsx');
  await writeFile(filePath, "import { MixedLeaf } from '@acme/content-kit/components/mixed';\n");
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.ok(out.some((p) => p.endsWith('components/pages/mixed/index.ts')));
  assert.ok(!out.some((p) => p.endsWith('components/pages/mixed/mixed-leaf.tsx')));
});

test('resolveWorkspaceImports: avoids cycles in barrel exports', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'cycle.tsx');
  await writeFile(filePath, "import '@acme/content-kit/components/cycle';\n");
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.equal(out.filter((p) => p.endsWith('components/pages/cycle/a.ts')).length, 1);
  assert.equal(out.filter((p) => p.endsWith('components/pages/cycle/b.ts')).length, 1);
});

test('resolveWorkspaceImports: suffix fan-out follows matching files to depth 2', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'data.tsx');
  await writeFile(filePath, "import '@acme/content-kit/data-entry';\n");
  const out = await resolveWorkspaceImports(filePath, resolve, { perSpecifierCap: 10 });
  assert.ok(out.some((p) => p.endsWith('lib/data/data.ts')));
  assert.ok(out.some((p) => p.endsWith('lib/data/fetch.ts')));
  assert.ok(out.some((p) => p.endsWith('lib/data/service.ts')));
  assert.ok(!out.some((p) => p.endsWith('lib/data/metadata.ts')));
});

test('resolveWorkspaceImports: per-specifier cap limits fan-out additions to 3', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'data-capped.tsx');
  await writeFile(filePath, "import '@acme/content-kit/data-capped';\n");
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.deepEqual(
    out.map((p) => p.replace(scratch + '/', '')),
    [
      'packages/content-kit/lib/capped/data.ts',
      'packages/content-kit/lib/capped/actions.ts',
      'packages/content-kit/lib/capped/content.ts',
      'packages/content-kit/lib/capped/loader.ts',
    ],
  );
});

test('resolveWorkspaceImports: resolves relative directory imports', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'data-dir.tsx');
  await writeFile(filePath, "import '@acme/content-kit/data-entry';\n");
  const out = await resolveWorkspaceImports(filePath, resolve, { perSpecifierCap: 10, suffixFanoutDepth: 3 });
  assert.ok(out.some((p) => p.endsWith('lib/data/server/index.ts')));
});

test('resolveWorkspaceImports: name-aware barrel fan-out handles large component barrels', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const filePath = join(scratch, 'apps', 'fixture-site', 'app', 'layout.tsx');
  await writeFile(filePath, "import { SharedLayout, ForceTransparentHeader, sharedGenerateMetadata } from '@acme/content-kit/components';\n");
  const out = await resolveWorkspaceImports(filePath, resolve);
  assert.ok(out.some((p) => p.endsWith('components/index.ts')));
  assert.ok(out.some((p) => p.endsWith('components/shared-layout.tsx')));
  assert.ok(out.some((p) => p.endsWith('components/force-transparent-header.tsx')));
  assert.ok(!out.some((p) => p.endsWith('components/arrow-back-link.tsx')));
});

test('resolveWorkspaceImports: empty array when file not readable', async () => {
  const pkgs = await listWorkspacePackages(scratch);
  const resolve = buildResolver(pkgs);
  const out = await resolveWorkspaceImports('/nonexistent/path.tsx', resolve);
  assert.deepEqual(out, []);
});
