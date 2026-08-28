#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { parseArgs, requireFlag } from './lib/args.mjs';
import { ok, fail } from './lib/output.mjs';
import { withDb } from './lib/db.mjs';
import { getAccountOrFail } from './lib/account.mjs';
import { SKILL_ROOT } from './lib/paths.mjs';

const { flags } = parseArgs();

try {
  const accountName = requireFlag(flags, 'account');
  const account = withDb((db) => getAccountOrFail(db, accountName), { readonly: true });
  if (account.paused) {
    ok({ account: account.name, skipped: 'paused' });
    process.exit(0);
  }

  const isJson = process.argv.includes('--json');
  const phaseFlags = isJson ? ['--account', accountName, '--json'] : ['--account', accountName];

  const invite = runChild('network-invite.mjs', phaseFlags);
  const pending = runChild('network-pending.mjs', phaseFlags);

  ok({
    account: accountName,
    invite: invite.parsed?.data ?? null,
    pending: pending.parsed?.data ?? null,
    exit: { invite: invite.code, pending: pending.code },
  });
} catch (err) {
  fail(err.message);
}

function runChild(script, args) {
  const r = spawnSync(process.execPath, [join(SKILL_ROOT, 'scripts', script), ...args], {
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  let parsed = null;
  try {
    parsed = JSON.parse(r.stdout.toString());
  } catch {
    /* not JSON — normal in human mode */
  }
  return { code: r.status, parsed, stdout: r.stdout.toString() };
}
