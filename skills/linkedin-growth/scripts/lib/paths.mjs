import { homedir, platform } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';

const APP_NAME = 'linkedapi-linkedin-growth';

export const SKILL_ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

export function dataDir() {
  if (process.env.LEADS_DATA_DIR) return process.env.LEADS_DATA_DIR;
  if (platform() === 'win32') {
    const base = process.env.APPDATA || join(homedir(), 'AppData', 'Roaming');
    return join(base, APP_NAME);
  }
  const xdg = process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share');
  return join(xdg, APP_NAME);
}

export function dbPath() {
  if (process.env.LEADS_DB_PATH) return process.env.LEADS_DB_PATH;
  return join(dataDir(), 'db.sqlite');
}

export function logsDir() {
  return join(dataDir(), 'logs');
}

export function tmpDir() {
  return join(dataDir(), 'tmp');
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
  return path;
}
