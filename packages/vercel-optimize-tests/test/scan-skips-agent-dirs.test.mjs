// Regression: an end-to-end run scanned the project-installed skill under .claude/skills and flagged the
// skill's own scanner source as a finding. Agent skill directories must be skipped.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = join(dirname(fileURLToPath(import.meta.url)), '../../../skills/vercel-optimize');

test('scan-codebase: skips .claude and .agents skill directories', () => {
  const repo = mkdtempSync(join(tmpdir(), 'scan-skip-'));
  writeFileSync(join(repo, 'package.json'), JSON.stringify({ name: 'x', dependencies: { next: '16.0.0' } }));
  for (const dir of ['.claude/skills/vercel-optimize/lib', '.agents/skills/vercel-optimize/lib']) {
    mkdirSync(join(repo, dir), { recursive: true });
    cpSync(join(SKILL, 'lib/scanners'), join(repo, dir, 'scanners'), { recursive: true });
  }
  const out = execFileSync(process.execPath, [join(SKILL, 'scripts/scan-codebase.mjs'), repo], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  assert.doesNotMatch(out, /\.claude|\.agents/);
});
