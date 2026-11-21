#!/usr/bin/env node
import { parseArgs, requireFlag, intFlag } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';

const { positional, flags } = parseArgs();
const cmd = positional[0];

try {
  switch (cmd) {
    case 'list':
      list();
      break;
    case 'show':
      show();
      break;
    case 'reset':
      reset();
      break;
    case 'set-status':
      setStatus();
      break;
    case 'reassign':
      reassign();
      break;
    case 'delete':
      remove();
      break;
    default:
      fail(
        'Usage:\n' +
          '  lead.mjs list [--account X] [--status not_connected|pending|connected|exhausted|error] [--list "List Name"] [--limit N]\n' +
          '  lead.mjs show <hashed-url|public-url|"Full Name">\n' +
          '  lead.mjs reset <hashed-url>           (error -> not_connected)\n' +
          '  lead.mjs set-status <hashed-url> --to <status>\n' +
          '  lead.mjs reassign <hashed-url> --to <account-name>\n' +
          '  lead.mjs delete <hashed-url>',
        5,
      );
  }
} catch (err) {
  fail(err.message);
}

function list() {
  const limit = intFlag(flags, 'limit', 50);
  const where = [];
  const vals = [];
  if (flags.account) {
    where.push('owner_account = ?');
    vals.push(String(flags.account));
  }
  if (flags.status) {
    where.push('status = ?');
    vals.push(String(flags.status));
  }
  if (flags.list) {
    where.push('list_name = ?');
    vals.push(String(flags.list));
  }
  const sql = `SELECT hashed_url, full_name, position, location, owner_account, status,
                      sent_at, status_updated_at, list_name
               FROM leads
               ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
               ORDER BY status_updated_at DESC
               LIMIT ?`;
  vals.push(limit);
  withDb(
    (db) => {
      const rows = db.prepare(sql).all(...vals);
      ok(rows);
    },
    { readonly: true },
  );
}

function show() {
  const key = positional[1];
  if (!key) throw new Error('Pass the lead identifier as a positional argument');
  withDb(
    (db) => {
      const lead =
        db.prepare('SELECT * FROM leads WHERE hashed_url = ? OR public_url = ?').get(key, key) ??
        db.prepare('SELECT * FROM leads WHERE LOWER(full_name) = LOWER(?)').get(key);
      if (!lead) throw new Error(`Lead '${key}' not found`);
      const runs = db
        .prepare(
          `SELECT id, account, action, started_at, finished_at, success, error_message
           FROM runs WHERE lead_hashed_url = ? ORDER BY started_at DESC LIMIT 25`,
        )
        .all(lead.hashed_url);
      // Accounts that have already sent this lead an invite (the cross-account retry trail).
      const attempted = db
        .prepare(
          `SELECT DISTINCT account FROM runs
           WHERE lead_hashed_url = ? AND action = 'invite' AND success = 1`,
        )
        .all(lead.hashed_url)
        .map((r) => r.account)
        .filter(Boolean);
      ok({ lead, attempted_accounts: attempted, recent_runs: runs });
    },
    { readonly: true },
  );
}

function reset() {
  const key = positional[1];
  if (!key) throw new Error('Pass the lead hashed_url as a positional argument');
  withDb((db) => {
    const r = db
      .prepare(
        `UPDATE leads SET status='not_connected', error_type=NULL, error_message=NULL,
           status_updated_at=datetime('now')
         WHERE hashed_url = ? AND status = 'error'`,
      )
      .run(key);
    if (r.changes === 0) throw new Error(`Lead '${key}' not found or not in error state`);
    ok({ hashed_url: key, status: 'not_connected' });
  });
}

function setStatus() {
  const key = positional[1];
  const target = requireFlag(flags, 'to');
  const allowed = ['not_connected', 'pending', 'connected', 'exhausted', 'error'];
  if (!allowed.includes(target)) throw new Error(`--to must be one of ${allowed.join(', ')}`);
  withDb((db) => {
    const r = db
      .prepare(
        `UPDATE leads SET status = ?, status_updated_at = datetime('now')
         WHERE hashed_url = ?`,
      )
      .run(target, key);
    if (r.changes === 0) throw new Error(`Lead '${key}' not found`);
    ok({ hashed_url: key, status: target });
  });
}

function reassign() {
  const key = positional[1];
  const target = requireFlag(flags, 'to');
  withDb((db) => {
    const acc = db.prepare('SELECT name FROM accounts WHERE name = ?').get(target);
    if (!acc) throw new Error(`Account '${target}' not found`);
    const r = db
      .prepare(
        `UPDATE leads SET owner_account = ?, status_updated_at = datetime('now')
         WHERE hashed_url = ?`,
      )
      .run(target, key);
    if (r.changes === 0) throw new Error(`Lead '${key}' not found`);
    ok({ hashed_url: key, owner_account: target });
  });
}

function remove() {
  const key = positional[1];
  withDb((db) => {
    const r = db.prepare('DELETE FROM leads WHERE hashed_url = ?').run(key);
    if (r.changes === 0) throw new Error(`Lead '${key}' not found`);
    ok({ deleted: key });
  });
}
