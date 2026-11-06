#!/usr/bin/env node
import { parseArgs, boolFlag } from './lib/args.mjs';
import { openDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';

const { flags } = parseArgs();
const examples = boolFlag(flags, 'examples');

try {
  const db = openDb({ readonly: true });
  const tables = db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`,
    )
    .all()
    .map((r) => r.name);
  const schema = tables.map((t) => ({
    table: t,
    columns: db.prepare(`PRAGMA table_info(${t})`).all(),
    indexes: db.prepare(`PRAGMA index_list(${t})`).all(),
  }));
  db.close();

  const enums = {
    'leads.status': ['not_connected', 'pending', 'connected', 'exhausted', 'error'],
    'runs.action': ['invite', 'check_status', 'withdraw'],
    'import_batches.state': ['pending_qualification', 'committed', 'aborted'],
  };

  const notes = {
    'leads.status':
      "not_connected = awaiting/ready for an invite from owner_account (attempt 1..N); " +
      "pending = invite sent, awaiting acceptance; connected = success (terminal); " +
      "exhausted = tried up to max_connect_attempts accounts, none accepted (terminal); " +
      'error = an invite failed technically (reset with lead.mjs reset).',
    'settings.max_connect_attempts':
      "global retry policy: how many DISTINCT accounts may try one lead. '1' = no retry. " +
      "'all' = every active account. On a failed attempt (we withdrew a stale pending, or the " +
      'person declined/expired) the lead is reassigned to the least-loaded untried account, ' +
      'or marked exhausted.',
  };

  ok({
    schema,
    enums,
    notes,
    examples: examples ? exampleQueries() : undefined,
    timezone_notes: {
      all_timestamps: 'stored as SQLite datetime() in UTC',
      filter_today: "use date('now') in WHERE clauses",
      filter_relative: "use datetime('now', '-7 days') etc.",
    },
  });
} catch (err) {
  fail(err.message);
}

function exampleQueries() {
  return [
    {
      question: 'How many pending invites does a given account have? (replace <account>)',
      sql: "SELECT COUNT(*) AS c FROM leads WHERE owner_account = '<account>' AND status = 'pending'",
    },
    {
      question: 'Leads imported in the last 7 days per account',
      sql:
        "SELECT owner_account, COUNT(*) AS c FROM leads " +
        "WHERE created_at >= datetime('now','-7 days') GROUP BY owner_account",
    },
    {
      question: 'Invites sent today per account',
      sql:
        "SELECT account, COUNT(*) AS c FROM runs " +
        "WHERE action='invite' AND success=1 AND started_at >= date('now') GROUP BY account",
    },
    {
      question: 'Lists with the best connection conversion',
      sql:
        "SELECT list_name, COUNT(*) AS total, " +
        "100.0 * SUM(CASE WHEN status='connected' THEN 1 ELSE 0 END) / COUNT(*) AS conv_pct " +
        "FROM leads GROUP BY list_name HAVING total >= 10 ORDER BY conv_pct DESC",
    },
    {
      question: 'Pending leads older than 7 days for a given account (replace <account>)',
      sql:
        "SELECT full_name, sent_at FROM leads " +
        "WHERE owner_account='<account>' AND status='pending' " +
        "AND sent_at < datetime('now','-7 days') ORDER BY sent_at",
    },
    {
      question: 'Most common error types in the last 30 days',
      sql:
        "SELECT error_type, COUNT(*) AS c FROM leads " +
        "WHERE status='error' AND status_updated_at >= datetime('now','-30 days') " +
        'GROUP BY error_type ORDER BY c DESC',
    },
  ];
}
