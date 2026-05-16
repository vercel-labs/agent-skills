import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..', '..', 'skills', 'vercel-optimize');

test('collection docs keep JSON stdout separate from status logs', async () => {
  const skill = await readFile(join(ROOT, 'SKILL.md'), 'utf-8');
  const commands = [
    ...skill.matchAll(/^node scripts\/collect-signals\.mjs[^\n]*> "\$RUN_DIR\/vercel-signals\.json"[^\n]*$/gm),
  ].map((match) => match[0]);

  assert.ok(commands.length >= 2, 'expected documented collect-signals commands that write vercel-signals.json');
  for (const command of commands) {
    assert.match(command, /2> "\$RUN_DIR\/collect\.stderr"/, `collect-signals command must keep stderr separate: ${command}`);
  }

  assert.match(skill, /JSON\.parse\(require\("fs"\)\.readFileSync\(process\.argv\[1\], "utf8"\)\)/);
  assert.match(skill, /Do not combine streams/);
});

test('Observability Plus scanner-only instructions preserve separate stderr logs', async () => {
  const reference = await readFile(join(ROOT, 'references', 'observability-plus.md'), 'utf-8');
  assert.match(
    reference,
    /collect-signals\.mjs \[projectId\] --continue-without-observability > "\$RUN_DIR\/vercel-signals\.json" 2> "\$RUN_DIR\/collect\.stderr"/
  );
  assert.match(reference, /Do not add a preface; the heading is the opening line/);
});
