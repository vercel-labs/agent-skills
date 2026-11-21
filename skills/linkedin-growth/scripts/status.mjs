#!/usr/bin/env node
import { parseArgs } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';
import { startOfLocalDayUtc } from './lib/time.mjs';
import { getSetting } from './lib/settings.mjs';

const { flags } = parseArgs();

try {
  const accountFilter = flags.account ? String(flags.account) : null;
  const sinceArg = flags.since ? String(flags.since) : null;
  const sinceClause = sinceArg ? parseSince(sinceArg) : null;

  const dayStartUtc = startOfLocalDayUtc();
  const data = withDb(
    (db) => {
      const accounts = db
        .prepare(
          accountFilter
            ? 'SELECT * FROM accounts WHERE name = ? ORDER BY name'
            : 'SELECT * FROM accounts ORDER BY name',
        )
        .all(...(accountFilter ? [accountFilter] : []))
        .map((a) => ({ ...a, paused: !!a.paused }));

      if (accountFilter && accounts.length === 0) {
        throw new Error(`Account '${accountFilter}' not found`);
      }

      const perAccount = accounts.map((acc) => {
        const statuses = countByStatus(db, acc.name);
        const sentToday = db
          .prepare(
            `SELECT COUNT(*) AS c FROM runs
             WHERE account = ? AND action = 'invite' AND success = 1
               AND started_at >= ?`,
          )
          .get(acc.name, dayStartUtc).c;
        const imported = sinceClause
          ? db
              .prepare(
                `SELECT COUNT(*) AS c FROM leads WHERE owner_account = ? AND created_at >= ?`,
              )
              .get(acc.name, sinceClause).c
          : null;
        const recentErrors = db
          .prepare(
            `SELECT hashed_url, full_name, error_type, error_message, status_updated_at
             FROM leads
             WHERE owner_account = ? AND status = 'error'
             ORDER BY status_updated_at DESC
             LIMIT 5`,
          )
          .all(acc.name);
        return {
          name: acc.name,
          paused: acc.paused,
          daily_limit: acc.daily_invite_limit,
          min_invite_interval_minutes: acc.min_invite_interval_minutes,
          active_hours: `${acc.active_start}-${acc.active_end}`,
          effective_max_per_day: effectiveMaxPerDay(acc),
          max_pending_days: acc.max_pending_days,
          pending_batch_size: acc.pending_batch_size,
          last_action_at: acc.last_action_at,
          sent_today: sentToday,
          remaining_today: Math.max(0, acc.daily_invite_limit - sentToday),
          statuses,
          imported_since: imported,
          recent_errors: recentErrors,
        };
      });

      const totals = accounts.length > 1 ? aggregate(perAccount) : null;
      const maxConnectAttempts = getSetting(db, 'max_connect_attempts', '1');

      return {
        since: sinceClause,
        retry_policy: { max_connect_attempts: maxConnectAttempts },
        accounts: perAccount,
        totals,
      };
    },
    { readonly: true },
  );

  ok(data);
} catch (err) {
  fail(err.message);
}

// The real daily invite ceiling is the tighter of the configured limit and what the
// interval allows inside the active window: floor(window_minutes / interval) + 1.
function effectiveMaxPerDay(acc) {
  const [sh, sm] = acc.active_start.split(':').map(Number);
  const [eh, em] = acc.active_end.split(':').map(Number);
  const windowMin = eh * 60 + em - (sh * 60 + sm);
  const byInterval = Math.floor(windowMin / acc.min_invite_interval_minutes) + 1;
  return Math.min(acc.daily_invite_limit, byInterval);
}

function countByStatus(db, account) {
  const rows = db
    .prepare(
      `SELECT status, COUNT(*) AS c FROM leads
       WHERE owner_account = ?
       GROUP BY status`,
    )
    .all(account);
  const out = {
    not_connected: 0,
    pending: 0,
    connected: 0,
    exhausted: 0,
    error: 0,
  };
  for (const r of rows) out[r.status] = r.c;
  out.total = rows.reduce((s, r) => s + r.c, 0);
  return out;
}

function aggregate(perAccount) {
  const totals = { not_connected: 0, pending: 0, connected: 0, exhausted: 0, error: 0, total: 0 };
  let sentToday = 0;
  for (const a of perAccount) {
    for (const k of Object.keys(totals)) totals[k] += a.statuses[k] ?? 0;
    sentToday += a.sent_today;
  }
  return { statuses: totals, sent_today: sentToday };
}

function parseSince(s) {
  const m = /^(\d+)([dwm])$/i.exec(s.trim());
  if (m) {
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    const days = unit === 'd' ? n : unit === 'w' ? n * 7 : n * 30;
    return new Date(Date.now() - days * 86400000).toISOString().replace('T', ' ').slice(0, 19);
  }
  if (!Number.isNaN(Date.parse(s))) return new Date(s).toISOString().replace('T', ' ').slice(0, 19);
  throw new Error(`--since must be ISO timestamp or shorthand like 7d, 2w, 1m (got: ${s})`);
}
