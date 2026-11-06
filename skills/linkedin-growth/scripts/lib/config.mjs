import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SKILL_ROOT } from './paths.mjs';

let cached = null;

export function defaults() {
  if (!cached) {
    const raw = readFileSync(join(SKILL_ROOT, 'config', 'defaults.json'), 'utf8');
    cached = JSON.parse(raw);
  }
  return cached;
}

export function qualificationPromptPath() {
  return join(SKILL_ROOT, 'config', 'qualification-prompt.md');
}
