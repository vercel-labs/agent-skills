#!/usr/bin/env node
import { parseArgs, requireFlag, intFlag, boolFlag } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail, info } from './lib/output.mjs';
import { defaults } from './lib/config.mjs';

const { positional, flags } = parseArgs();
const cmd = positional[0];

const CRON_TIME_RE = /^\d{2}:\d{2}$/;

try {
  switch (cmd) {
    case 'list':
      list();
      break;
    case 'add':
      add();
      break;
    case 'update':
      update();
      break;
    case 'pause':
      setPaused(true);
      break;
    case 'resume':
      setPaused(false);
      break;
    case 'rename':
      rename();
      break;
    case 'remove':
      remove();
      break;
    default:
      fail(
        'Usage:\n' +
          '  account.mjs list\n' +
          '  account.mjs add --name <db-name> --cli-account "<linkedin-cli name>"\n' +
          '      [--daily-invite-limit 35] [--min-invite-interval 15]\n' +
          '      [--active-start 09:00] [--active-end 18:00]\n' +
          '      [--max-pending-days 10] [--pending-batch-size 5]\n' +
          '  account.mjs update --name <db-name> [--daily-invite-limit N] [--min-invite-interval N]\n' +
          '      [--active-start HH:MM] [--active-end HH:MM] [--max-pending-days N]\n' +
          '      [--pending-batch-size N] [--cli-account "<name>"]\n' +
          '  account.mjs pause --name <db-name>\n' +
          '  account.mjs resume --name <db-name>\n' +
          '  account.mjs rename --name <old> --new-name <new>\n' +
          '  account.mjs remove --name <db-name> [--force]',
        5,
      );
  }
} catch (err) {
  fail(err.message);
}

function list() {
  withDb(
    (db) => {
      const rows = db
        .prepare(
          `SELECT name, cli_account, paused, daily_invite_limit, min_invite_interval_minutes,
                  active_start, active_end, max_pending_days, pending_batch_size,
                  last_action_at, created_at
           FROM accounts ORDER BY name`,
        )
        .all()
        .map((r) => ({ ...r, paused: !!r.paused }));
      ok(rows);
    },
    { readonly: true },
  );
}

function add() {
  const name = requireFlag(flags, 'name');
  const cliAccount = requireFlag(flags, 'cli-account');
  const d = defaults();
  const dailyLimit = intFlag(flags, 'daily-invite-limit', d.daily_invite_limit);
  const inviteInterval = intFlag(flags, 'min-invite-interval', d.min_invite_interval_minutes);
  const activeStart = String(flags['active-start'] ?? d.active_start);
  const activeEnd = String(flags['active-end'] ?? d.active_end);
  const maxPending = intFlag(flags, 'max-pending-days', d.max_pending_days);
  const pendingBatch = intFlag(flags, 'pending-batch-size', d.pending_batch_size);

  validateWindow(activeStart, activeEnd);
  if (dailyLimit < 1 || dailyLimit > 200) throw new Error('--daily-invite-limit out of range (1-200)');
  if (inviteInterval < 1 || inviteInterval > 1440) throw new Error('--min-invite-interval out of range (1-1440)');
  if (maxPending < 1 || maxPending > 365) throw new Error('--max-pending-days out of range (1-365)');
  if (pendingBatch < 1 || pendingBatch > 100) throw new Error('--pending-batch-size out of range (1-100)');

  withDb((db) => {
    try {
      db.prepare(
        `INSERT INTO accounts
           (name, cli_account, daily_invite_limit, min_invite_interval_minutes,
            active_start, active_end, max_pending_days, pending_batch_size)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(name, cliAccount, dailyLimit, inviteInterval, activeStart, activeEnd, maxPending, pendingBatch);
    } catch (e) {
      if (String(e).includes('UNIQUE')) throw new Error(`Account '${name}' already exists`);
      throw e;
    }
    ok({
      name,
      cli_account: cliAccount,
      paused: false,
      daily_invite_limit: dailyLimit,
      min_invite_interval_minutes: inviteInterval,
      active_start: activeStart,
      active_end: activeEnd,
      max_pending_days: maxPending,
      pending_batch_size: pendingBatch,
    });
  });
}

function validateWindow(start, end) {
  if (!CRON_TIME_RE.test(start)) throw new Error('--active-start must be HH:MM (24h)');
  if (!CRON_TIME_RE.test(end)) throw new Error('--active-end must be HH:MM (24h)');
  if (start >= end) throw new Error('--active-start must be earlier than --active-end');
}

function update() {
  const name = requireFlag(flags, 'name');
  const sets = [];
  const vals = [];
  if (flags['cli-account'] !== undefined) {
    sets.push('cli_account = ?');
    vals.push(String(flags['cli-account']));
  }
  if (flags['daily-invite-limit'] !== undefined) {
    const n = intFlag(flags, 'daily-invite-limit');
    if (n < 1 || n > 200) throw new Error('--daily-invite-limit out of range');
    sets.push('daily_invite_limit = ?');
    vals.push(n);
  }
  if (flags['min-invite-interval'] !== undefined) {
    const n = intFlag(flags, 'min-invite-interval');
    if (n < 1 || n > 1440) throw new Error('--min-invite-interval out of range (1-1440)');
    sets.push('min_invite_interval_minutes = ?');
    vals.push(n);
  }
  if (flags['pending-batch-size'] !== undefined) {
    const n = intFlag(flags, 'pending-batch-size');
    if (n < 1 || n > 100) throw new Error('--pending-batch-size out of range (1-100)');
    sets.push('pending_batch_size = ?');
    vals.push(n);
  }
  if (flags['active-start'] !== undefined) {
    const v = String(flags['active-start']);
    if (!CRON_TIME_RE.test(v)) throw new Error('--active-start must be HH:MM');
    sets.push('active_start = ?');
    vals.push(v);
  }
  if (flags['active-end'] !== undefined) {
    const v = String(flags['active-end']);
    if (!CRON_TIME_RE.test(v)) throw new Error('--active-end must be HH:MM');
    sets.push('active_end = ?');
    vals.push(v);
  }
  if (flags['max-pending-days'] !== undefined) {
    const n = intFlag(flags, 'max-pending-days');
    if (n < 1 || n > 365) throw new Error('--max-pending-days out of range');
    sets.push('max_pending_days = ?');
    vals.push(n);
  }
  if (sets.length === 0) throw new Error('No fields to update');

  withDb((db) => {
    const current = db.prepare('SELECT active_start, active_end FROM accounts WHERE name = ?').get(name);
    if (!current) throw new Error(`Account '${name}' not found`);
    const start = flags['active-start'] !== undefined ? String(flags['active-start']) : current.active_start;
    const end = flags['active-end'] !== undefined ? String(flags['active-end']) : current.active_end;
    if (start >= end) throw new Error('active_start must be earlier than active_end');

    vals.push(name);
    db.prepare(`UPDATE accounts SET ${sets.join(', ')} WHERE name = ?`).run(...vals);
    const updated = db.prepare('SELECT * FROM accounts WHERE name = ?').get(name);
    updated.paused = !!updated.paused;
    ok(updated);
  });
}

function setPaused(paused) {
  const name = requireFlag(flags, 'name');
  withDb((db) => {
    const r = db.prepare('UPDATE accounts SET paused = ? WHERE name = ?').run(paused ? 1 : 0, name);
    if (r.changes === 0) throw new Error(`Account '${name}' not found`);
    ok({ name, paused });
  });
}

function rename() {
  const oldName = requireFlag(flags, 'name');
  const newName = requireFlag(flags, 'new-name');
  withDb((db) => {
    const tx = db.transaction(() => {
      const r = db.prepare('UPDATE accounts SET name = ? WHERE name = ?').run(newName, oldName);
      if (r.changes === 0) throw new Error(`Account '${oldName}' not found`);
    });
    try {
      tx();
    } catch (e) {
      if (String(e).includes('UNIQUE')) throw new Error(`Account '${newName}' already exists`);
      throw e;
    }
    ok({ renamed_from: oldName, renamed_to: newName });
  });
}

function remove() {
  const name = requireFlag(flags, 'name');
  const force = boolFlag(flags, 'force');
  withDb((db) => {
    const n = db
      .prepare('SELECT COUNT(*) AS c FROM leads WHERE owner_account = ?')
      .get(name).c;
    if (n > 0 && !force) {
      throw new Error(`Account '${name}' owns ${n} leads — pass --force to delete the account and reassign-to-nothing (leads remain but become orphaned).`);
    }
    if (n > 0) info(`warning: ${n} leads remain with owner_account='${name}' (orphaned).`);
    const r = db.prepare('DELETE FROM accounts WHERE name = ?').run(name);
    if (r.changes === 0) throw new Error(`Account '${name}' not found`);
    ok({ removed: name, orphaned_leads: n });
  });
}
