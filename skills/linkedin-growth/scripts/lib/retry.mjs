import { getSetting } from './settings.mjs';

// Distinct accounts that have already sent an invite to this lead (success=1).
// The lead's current owner is among them, since it sent the request that just failed.
export function attemptedAccounts(db, leadHashedUrl) {
  return db
    .prepare(
      `SELECT DISTINCT account FROM runs
       WHERE lead_hashed_url = ? AND action = 'invite' AND success = 1`,
    )
    .all(leadHashedUrl)
    .map((r) => r.account)
    .filter(Boolean);
}

// The Core error message returned when a profile URL resolves to no LinkedIn member.
const PERSON_NOT_FOUND_MESSAGE = 'not an existing LinkedIn person';

// Count the most recent consecutive `check_status` runs for a lead that failed with
// personNotFound. Used to terminate a lead only after a short streak, so a single
// transient miss does not close an otherwise-reachable person.
export function countTrailingPersonNotFound(db, leadHashedUrl) {
  const rows = db
    .prepare(
      `SELECT success, error_message FROM runs
       WHERE lead_hashed_url = ? AND action = 'check_status'
       ORDER BY started_at DESC, id DESC
       LIMIT 10`,
    )
    .all(leadHashedUrl);
  let streak = 0;
  for (const row of rows) {
    const isPersonNotFound = !row.success && (row.error_message ?? '').includes(PERSON_NOT_FOUND_MESSAGE);
    if (!isPersonNotFound) break;
    streak++;
  }
  return streak;
}

// The configured cap on how many distinct accounts may attempt one lead.
// 'all' resolves to the current count of active accounts.
export function resolveMaxAttempts(db) {
  const raw = getSetting(db, 'max_connect_attempts', '1');
  if (raw === 'all') {
    return db.prepare('SELECT COUNT(*) AS c FROM accounts WHERE paused = 0').get().c;
  }
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

// Applied when an account's attempt on a lead failed (we withdrew a stale pending, OR
// the person declined / let it expire). Either hands the lead to another account for a
// fresh attempt, or marks it terminally 'exhausted'.
//
// Reassignment picks the least-loaded active account that has NOT yet tried this lead,
// so retries spread work the same way the import round-robin does.
export function resolveFailedAttempt(db, lead) {
  const tried = new Set(attemptedAccounts(db, lead.hashed_url));
  const maxAttempts = resolveMaxAttempts(db);

  const eligible = db
    .prepare(
      `SELECT a.name AS name,
              (SELECT COUNT(*) FROM leads l
               WHERE l.owner_account = a.name AND l.status IN ('not_connected','pending')) AS load
       FROM accounts a
       WHERE a.paused = 0
       ORDER BY load ASC, a.name ASC`,
    )
    .all()
    .filter((a) => !tried.has(a.name));

  if (tried.size < maxAttempts && eligible.length > 0) {
    const next = eligible[0].name;
    db.prepare(
      `UPDATE leads SET owner_account = ?, status = 'not_connected', sent_at = NULL,
         status_updated_at = datetime('now'), error_type = NULL, error_message = NULL
       WHERE hashed_url = ?`,
    ).run(next, lead.hashed_url);
    return { outcome: 'reassigned', account: next, attempt_number: tried.size + 1 };
  }

  db.prepare(
    `UPDATE leads SET status = 'exhausted', status_updated_at = datetime('now')
     WHERE hashed_url = ?`,
  ).run(lead.hashed_url);
  return { outcome: 'exhausted', attempts: tried.size };
}
