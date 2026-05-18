// Voice-drift guards: prose must use canonical product names, not engineering shorthand.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildBrief } from '../../../skills/vercel-optimize/lib/investigation-brief.mjs';
import { renderReport } from '../../../skills/vercel-optimize/lib/render-report.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize');

// "Observability Plus" shorthand must not appear in prose. Code identifiers
// like OPLUS_REQUIRED / no_oplus_probe are fine — word-boundary regex skips them.
const FORBIDDEN_RE = /\b(OPlus|Oplus|O-Plus|O11y(?:\s+Plus)?)\b|obs\+/;

async function readAllMarkdown(dir) {
  const out = [];
  for (const entry of await readdir(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.md')) continue;
    const path = join(entry.parentPath ?? entry.path ?? dir, entry.name);
    if (/node_modules|\/test\//.test(path)) continue;
    // voice.md documents the term to ban it.
    if (path.endsWith('/references/voice.md')) continue;
    out.push(path);
  }
  return out;
}

test('voice drift: no markdown file uses Observability Plus shorthand', async () => {
  const files = await readAllMarkdown(ROOT);
  assert.ok(files.length > 0, 'sanity check — found markdown files');
  for (const path of files) {
    const content = await readFile(path, 'utf-8');
    const match = content.match(FORBIDDEN_RE);
    assert.ok(!match, `${path.replace(ROOT, '.')} contains "${match?.[0]}" — use "Observability Plus" instead`);
  }
});

test('voice drift: Observability Plus blocker question uses exact plain copy', async () => {
  const content = await readFile(join(ROOT, 'references', 'observability-plus.md'), 'utf-8');
  assert.match(content, /"header": "Observability Plus"/);
  assert.match(
    content,
    /"question": "Enable Observability Plus and re-run, or continue with a limited scanner-only audit\?"/
  );
  assert.match(content, /"label": "Enable and re-run"/);
  assert.match(content, /"label": "Run scanner-only"/);
  assert.doesNotMatch(content, /\b(O11y|OPlus|Oplus|O-Plus|perf|CWV)\b|obs\+/);
});

test('voice drift: Observability Plus post-choice copy avoids IDs and pricing language', async () => {
  const content = await readFile(join(ROOT, 'references', 'observability-plus.md'), 'utf-8');
  assert.match(content, /If the user chooses \*\*Enable and re-run\*\*/);
  assert.match(
    content,
    /Enable Observability Plus from the Vercel dashboard's Observability tab, then tell me to rerun\./
  );
  assert.match(content, /Do not include raw team IDs, org IDs, project IDs, pricing language/);
  assert.doesNotMatch(content, /paid add-on|paid feature|just say the word/i);
});

test('voice drift: generated brief does not contain "OPlus" shorthand', () => {
  const md = buildBrief({
    candidate: {
      kind: 'slow_route',
      route: '/x',
      scope: 'route',
      o11ySignal: 'inv=10000,p95=800ms',
      question: 'Why is /x slow?',
      evidence: { deepDive: {} },
    },
    candidateIndex: 0,
    candidateGroup: 'toLaunch',
    files: ['src/x.ts'],
    signals: {
      stack: { framework: 'next', frameworkVersion: '15.0.0', hasAppRouter: true },
      codebase: { stack: {}, routes: [] },
    },
    citations: { urls: [], ruleSkillRefs: [] },
    playbookId: null,
    playbookBody: null,
    frameworkPlaybookId: null,
    frameworkPlaybookBody: null,
    generatedAt: null,
  });
  assert.ok(!FORBIDDEN_RE.test(md), 'investigation brief leaks Observability Plus shorthand into sub-agent prompt');
});

test('voice drift: rendered report does not contain "OPlus" shorthand', () => {
  const md = renderReport({
    recommendations: [],
    gated: [],
    abstentions: [],
    signals: {
      stack: { framework: 'next', frameworkVersion: '15.0.0' },
      plan: { plan: 'pro', reason: '...' },
      observabilityPlus: false,
      observabilityPlusBlocker: 'payment_required',
      observabilityPlusBlockerDetail: 'Route-level metrics were recognized for this team, but these queries are not usable.',
    },
    opts: { projectName: 'test', generatedAt: null },
  });
  assert.ok(!FORBIDDEN_RE.test(md), 'rendered report leaks Observability Plus shorthand');
});
