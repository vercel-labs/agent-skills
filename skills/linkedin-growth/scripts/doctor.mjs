#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { platform } from 'node:os';
import { parseArgs, boolFlag } from './lib/args.mjs';
import { ok, fail } from './lib/output.mjs';
import { runCommand, runLinkedin, parseCliAccounts } from './lib/cli.mjs';
import { SKILL_ROOT, dbPath, dataDir } from './lib/paths.mjs';

const { flags } = parseArgs();
const fix = boolFlag(flags, 'fix');

const checks = [];

async function check(name, fn) {
  try {
    const result = await fn();
    checks.push({ name, ok: true, ...result });
  } catch (err) {
    checks.push({ name, ok: false, message: err.message, ...(err.extra ?? {}) });
  }
}

function fail2(message, extra) {
  const e = new Error(message);
  if (extra) e.extra = extra;
  throw e;
}

await check('node', async () => {
  const major = Number(process.versions.node.split('.')[0]);
  if (major < 20) fail2(`Node ${process.versions.node} is too old; need >= 20`);
  return { version: process.versions.node };
});

await check('skill-deps', async () => {
  const nm = join(SKILL_ROOT, 'node_modules');
  if (!existsSync(nm)) {
    if (fix) {
      const r = await runCommand('npm', ['install', '--omit=dev'], { timeoutMs: 300000 });
      if (!r.ok) fail2(`npm install failed: ${r.stderr || r.error}`);
      return { installed: true };
    }
    fail2('node_modules missing — run: npm install --omit=dev (or rerun doctor with --fix)');
  }
  return {};
});

await check('linkedin-cli', async () => {
  const r = await runCommand('linkedin', ['--version'], { timeoutMs: 15000 });
  if (!r.ok) {
    fail2('linkedin-cli not installed — run: npm install -g @linkedapi/linkedin-cli', {
      remediation: 'npm install -g @linkedapi/linkedin-cli',
    });
  }
  return { version: (r.stdout || '').trim() };
});

await check('cli-accounts', async () => {
  const r = await runLinkedin(['account', 'list'], { timeoutMs: 15000 });
  if (!r.ok) fail2(`linkedin account list failed: ${r.stderr || r.error || 'exit ' + r.exitCode}`);
  const accounts = parseCliAccounts(r.stdout);
  if (accounts.length === 0) {
    fail2(
      'No LinkedIn accounts registered in linkedin-cli — run: linkedin setup --linked-api-token=... --identification-token=...',
    );
  }
  return { count: accounts.length, accounts };
});

await check('db', async () => {
  const { openDb } = await import('./lib/db.mjs');
  const db = openDb();
  const v = db.prepare('SELECT MAX(version) AS v FROM schema_version').get().v;
  db.close();
  return { path: dbPath(), schema_version: v };
});

await check('db-accounts', async () => {
  const { openDb } = await import('./lib/db.mjs');
  const db = openDb({ readonly: true });
  const n = db.prepare('SELECT COUNT(*) AS c FROM accounts').get().c;
  db.close();
  if (n === 0) {
    fail2('0 accounts in DB — register each linkedin-cli account: node scripts/account.mjs add');
  }
  return { count: n };
});

await check('scheduler', async () => {
  const p = platform();
  if (p === 'darwin') {
    const r = await runCommand('which', ['launchctl'], { timeoutMs: 5000 });
    if (!r.ok) fail2('launchctl not found on PATH');
    return { kind: 'launchd' };
  }
  if (p === 'linux') {
    const r = await runCommand('systemctl', ['--user', '--version'], { timeoutMs: 5000 });
    if (r.ok) return { kind: 'systemd-user' };
    const c = await runCommand('which', ['crontab'], { timeoutMs: 5000 });
    if (c.ok) return { kind: 'cron', note: 'systemd-user unavailable; will use crontab' };
    fail2('neither systemctl --user nor crontab available');
  }
  if (p === 'win32') {
    const r = await runCommand('schtasks', ['/Query', '/?'], { timeoutMs: 5000 });
    if (!r.ok) fail2('schtasks not available on PATH');
    return { kind: 'schtasks' };
  }
  fail2(`unsupported platform: ${p}`);
});

await check('data-dir', async () => {
  return { path: dataDir() };
});

const allOk = checks.every((c) => c.ok);
if (allOk) {
  ok({ ok: true, checks });
} else {
  const data = { ok: false, checks };
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ success: true, data })}\n`);
    process.exit(0);
  } else {
    for (const c of checks) {
      const mark = c.ok ? 'OK ' : 'FAIL';
      const info = c.ok
        ? Object.entries(c)
            .filter(([k]) => !['name', 'ok'].includes(k))
            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
            .join(' ')
        : c.message;
      process.stdout.write(`[${mark}] ${c.name}  ${info}\n`);
    }
    process.exit(1);
  }
}
