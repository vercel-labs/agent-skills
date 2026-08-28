#!/usr/bin/env node
import { parseArgs, requireFlag, intFlag } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail, info } from './lib/output.mjs';
import { runLinkedin } from './lib/cli.mjs';
import { getAccountOrFail, sleep, isFatalExitCode, trimBasicInfoForStorage } from './lib/account.mjs';
import { recordRunStart, recordRunFinish } from './lib/runs.mjs';
import { defaults } from './lib/config.mjs';
import { startOfLocalDayUtc } from './lib/time.mjs';

const { flags } = parseArgs();

try {
  await main();
} catch (err) {
  fail(err.message);
}

async function main() {
  const accountName = requireFlag(flags, 'account');
  const delay = intFlag(flags, 'delay-seconds', defaults().invite_delay_seconds);
  const userLimit = intFlag(flags, 'limit', undefined);

  const account = withDb((db) => getAccountOrFail(db, accountName), { readonly: true });
  if (account.paused) {
    ok({ skipped: 'paused', account: account.name });
    return;
  }

  const dayStartUtc = startOfLocalDayUtc();
  const sentToday = withDb(
    (db) =>
      db
        .prepare(
          `SELECT COUNT(*) AS c FROM runs
           WHERE account = ? AND action = 'invite' AND success = 1
             AND started_at >= ?`,
        )
        .get(account.name, dayStartUtc).c,
    { readonly: true },
  );
  const remainingByPolicy = Math.max(0, account.daily_invite_limit - sentToday);
  const budget = userLimit !== undefined ? Math.min(userLimit, remainingByPolicy) : remainingByPolicy;
  if (budget === 0) {
    ok({
      account: account.name,
      sent_today: sentToday,
      daily_limit: account.daily_invite_limit,
      processed: 0,
      message: 'daily invite limit reached',
    });
    return;
  }

  // Prefer never-tried leads, then least-recently-attempted, so a lead that keeps failing
  // transiently rotates to the back instead of blocking the whole queue. (NULL last_try
  // sorts first in SQLite ASC.)
  const leads = withDb(
    (db) =>
      db
        .prepare(
          `SELECT l.hashed_url, l.public_url, l.full_name,
                  (SELECT MAX(r.started_at) FROM runs r
                   WHERE r.lead_hashed_url = l.hashed_url AND r.action = 'invite') AS last_try
           FROM leads l
           WHERE l.owner_account = ? AND l.status = 'not_connected'
           ORDER BY last_try ASC, l.created_at ASC
           LIMIT ?`,
        )
        .all(account.name, budget),
    { readonly: true },
  );

  if (leads.length === 0) {
    ok({ account: account.name, processed: 0, message: 'no not_connected leads' });
    return;
  }

  const summary = {
    processed: 0, pending: 0, connected: 0, transient: 0, limited: 0,
    restricted_backoff: 0, restricted_closed: 0, restricted_deferred: 0,
    errors: 0, aborted: false,
  };
  for (const lead of leads) {
    // Prefer the hashed member URL (stable across name / vanity-URL changes) so a reassigned
    // lead whose stored public slug has gone stale still opens. Falls back to public_url for
    // `st` leads, where the hashed_url IS the public URL.
    const personUrl = lead.hashed_url || lead.public_url;
    const def = {
      actionType: 'st.openPersonPage',
      personUrl,
      basicInfo: true,
      then: { actionType: 'st.sendConnectionRequest' },
    };

    let runId;
    withDb((db) => {
      runId = recordRunStart(db, {
        leadHashedUrl: lead.hashed_url,
        account: account.name,
        action: 'invite',
      });
    });

    info(`[invite] ${lead.full_name} <${personUrl}>`);
    const cli = await runLinkedin(['workflow', 'run'], {
      cliAccount: account.cli_account,
      input: JSON.stringify(def),
    });

    if (isFatalExitCode(cli.exitCode)) {
      withDb((db) =>
        recordRunFinish(db, runId, {
          success: false,
          rawResponse: cli.json,
          errorMessage: `fatal exit ${cli.exitCode}: ${cli.stderr || cli.error || ''}`.trim(),
        }),
      );
      summary.aborted = true;
      summary.abort_reason = `linkedin-cli exit ${cli.exitCode}`;
      break;
    }

    const outcome = classifyInviteResult(cli);

    if (outcome.status === 'limited') {
      // The account hit its connection-request limit (platform-side, action category).
      // This is NOT a verdict on the lead — leave it not_connected and back off so we
      // don't burn the rest of the queue against the same wall. The lead is retried on a
      // later wake-up, once the account's limit recovers (or is raised).
      withDb((db) =>
        recordRunFinish(db, runId, {
          success: false,
          rawResponse: cli.json,
          errorMessage: outcome.errorMessage ?? 'account action limit reached',
        }),
      );
      summary.limited++;
      summary.aborted = true;
      summary.abort_reason = 'account invite limit reached';
      break;
    }

    if (outcome.status === 'restricted') {
      // LinkedIn returned "restricted sending a connection request". Two distinct causes,
      // same message — disambiguate by pattern (see classifyRestricted):
      //   - streak (back-to-back, no successes between) => the account's weekly invite
      //     limit. NOT the lead's fault: leave it not_connected, back off, do not count it.
      //   - isolated (account otherwise sending fine) => this person restricts invites.
      //     Count it against the lead; after RESTRICTED_LEAD_ATTEMPTS isolated hits, close
      //     the lead (terminal 'exhausted') so it never hangs forever.
      withDb((db) =>
        recordRunFinish(db, runId, {
          success: false,
          rawResponse: cli.json,
          errorMessage: outcome.errorMessage ?? 'connection request not allowed',
        }),
      );
      const decision = withDb((db) => classifyRestricted(db, account.name, lead.hashed_url));
      if (decision === 'streak') {
        summary.restricted_backoff++;
        summary.aborted = true;
        summary.abort_reason = 'account restricted (likely weekly invite limit)';
        break;
      }
      if (decision === 'terminate') {
        withDb((db) =>
          db
            .prepare(
              `UPDATE leads SET status='exhausted', status_updated_at=datetime('now'),
                 error_type='requestNotAllowed', error_message=? WHERE hashed_url=?`,
            )
            .run(outcome.errorMessage ?? null, lead.hashed_url),
        );
        summary.restricted_closed++;
      } else {
        summary.restricted_deferred++; // left not_connected, retried much later
      }
      summary.processed++;
      if (summary.processed < leads.length) await sleep(delay * 1000);
      continue;
    }

    const sent = outcome.status === 'pending' || outcome.status === 'connected';
    withDb((db) => {
      recordRunFinish(db, runId, {
        success: sent,
        rawResponse: cli.json,
        errorMessage: outcome.errorMessage ?? null,
      });
      applyInviteOutcome(db, lead, outcome, cli.json);
    });

    summary.processed++;
    if (outcome.status === 'pending') summary.pending++;
    else if (outcome.status === 'connected') summary.connected++;
    else if (outcome.status === 'transient') summary.transient++;
    else summary.errors++;

    if (summary.processed < leads.length) {
      await sleep(delay * 1000);
    }
  }

  withDb((db) =>
    db.prepare("UPDATE accounts SET last_action_at = datetime('now') WHERE name = ?").run(account.name),
  );

  ok({
    account: account.name,
    daily_limit: account.daily_invite_limit,
    sent_today_before: sentToday,
    budget,
    ...summary,
  });
}

// Five kinds of outcome:
//   pending/connected — the request was sent (or they were already connected).
//   limited           — the account hit its platform-side limit for the connection-request
//                       action category. NOT a verdict on the lead → keep it not_connected
//                       and back off (the caller aborts the rest of this account's cycle).
//                       The lead is retried on a later wake-up.
//   restricted        — LinkedIn "restricted sending a connection request". Ambiguous between
//                       the account's weekly invite limit (streak) and a person who restricts
//                       invites (isolated). The caller disambiguates via classifyRestricted.
//   transient         — an infra/session hiccup (no parseable response, CLI error, or the
//                       profile page never opened). NOT a verdict on the lead → keep it
//                       not_connected and retry later. Common on a cold first run.
//   error             — a real per-person failure: the profile opened but
//                       sendConnectionRequest returned a definite failure. Terminal.
function classifyInviteResult(cli) {
  // No parseable JSON, or the CLI itself failed (non-fatal exit) → transient.
  if (!cli.json || cli.exitCode !== 0) {
    return {
      status: 'transient',
      errorType: 'transient',
      errorMessage: (cli.stderr || cli.error || `no response (exit ${cli.exitCode})`)
        .toString()
        .trim()
        .slice(0, 200),
    };
  }
  const body = cli.json;
  if (body.success === false) {
    const topErrType = (body.error?.type ?? '').toLowerCase();
    if (isLimitError(topErrType)) {
      return {
        status: 'limited',
        errorType: body.error?.type || 'limitExceeded',
        errorMessage: body.error?.message ?? 'account action limit reached',
      };
    }
    return { status: 'transient', errorType: body.error?.type ?? 'requestError', errorMessage: body.error?.message ?? 'request error' };
  }
  // completion = the st.openPersonPage result. The chained sendConnectionRequest result is
  // at completion.then (sibling) or completion.data.then (nested). Accept either.
  const completion = body.data ?? {};
  const then = completion.then ?? completion.data?.then;
  if (then && then.success === true) return { status: 'pending' };
  const thenErrType = (then?.error?.type ?? '').toLowerCase();
  if (thenErrType.includes('alreadypending')) return { status: 'pending' };
  if (thenErrType.includes('alreadyconnected')) return { status: 'connected' };
  if (then && then.success === false) {
    if (thenErrType.includes('noteslimitexceeded')) {
      return {
        status: 'limited',
        errorType: then.error?.type || 'noteLimitExceeded',
        errorMessage: then.error?.message ?? 'account personalized invite note limit reached',
      };
    }

    // Account-level rate / action-category limit (platform-side) → back off, don't burn
    // the lead. It stays not_connected and is retried on a later wake-up.
    if (isLimitError(thenErrType)) {
      return {
        status: 'limited',
        errorType: then.error?.type || 'limitExceeded',
        errorMessage: then.error?.message ?? 'account action limit reached',
      };
    }
    // "LinkedIn has restricted sending a connection request" — ambiguous: either the account's
    // weekly invite limit (comes in a streak) or this person restricting invites (isolated).
    // The caller (classifyRestricted) disambiguates by pattern; never burn it blindly here.
    if (thenErrType.includes('requestnotallowed')) {
      return {
        status: 'restricted',
        errorType: then.error?.type || 'requestNotAllowed',
        errorMessage: then.error?.message ?? 'LinkedIn restricted sending a connection request',
      };
    }
    // The profile opened but the request was genuinely refused for this person → terminal.
    return {
      status: 'error',
      errorType: then.error?.type || 'unknown',
      errorMessage: then.error?.message ?? 'connection request failed',
    };
  }
  // No `then` result at all → the profile page never opened (session/page issue) → transient.
  return {
    status: 'transient',
    errorType: completion.error?.type ?? 'openFailed',
    errorMessage: completion.error?.message ?? 'profile did not open',
  };
}

// An account-level limit on an action category (e.g. "configured limit for this action
// category has been exceeded", a rate limit, or too-many-requests). Signals back-off, not
// a per-lead failure. `type` is already lower-cased by the caller.
function isLimitError(type) {
  return type.includes('limit') || type.includes('toomany');
}

// How many ISOLATED requestNotAllowed hits a single lead may take before we close it.
const RESTRICTED_LEAD_ATTEMPTS = 2;

// Disambiguate a fresh requestNotAllowed (already recorded as a failed run) for this account:
//   'streak'    — 2+ requestNotAllowed in a row with no successful invite since → the
//                 account's weekly invite limit. Back off; do NOT blame the lead.
//   'terminate' — isolated, and this lead has now hit the cap → close it (terminal).
//   'defer'     — isolated, lead under the cap → leave not_connected, retry much later.
function classifyRestricted(db, account, hashedUrl) {
  const RNA = '%restricted sending a connection request%';
  const lastOk = db
    .prepare(`SELECT MAX(started_at) AS t FROM runs WHERE account = ? AND action = 'invite' AND success = 1`)
    .get(account).t;
  const streak = db
    .prepare(
      `SELECT COUNT(*) AS c FROM runs
       WHERE account = ? AND action = 'invite' AND success = 0
         AND error_message LIKE ? AND started_at > COALESCE(?, '0')`,
    )
    .get(account, RNA, lastOk).c;
  if (streak >= 2) return 'streak';
  const leadHits = db
    .prepare(
      `SELECT COUNT(*) AS c FROM runs
       WHERE lead_hashed_url = ? AND action = 'invite' AND error_message LIKE ?`,
    )
    .get(hashedUrl, RNA).c;
  return leadHits >= RESTRICTED_LEAD_ATTEMPTS ? 'terminate' : 'defer';
}

function applyInviteOutcome(db, lead, outcome, payload) {
  // payload = cli.json = { success, data: <openPersonPage completion> }
  // The completion is { actionType, success, data: { ...personInfo, publicUrl }, then }.
  const completion = payload?.data ?? {};
  const personData = completion?.data ?? {};
  const basicInfo = trimBasicInfoForStorage(completion);
  const publicUrl = personData?.publicUrl ?? lead.public_url ?? null;

  if (outcome.status === 'pending') {
    db.prepare(
      `UPDATE leads SET status='pending', sent_at = datetime('now'),
         status_updated_at = datetime('now'), public_url = COALESCE(?, public_url),
         basic_info_json = ?, error_type = NULL, error_message = NULL
       WHERE hashed_url = ?`,
    ).run(publicUrl, basicInfo, lead.hashed_url);
  } else if (outcome.status === 'connected') {
    db.prepare(
      `UPDATE leads SET status='connected', sent_at = datetime('now'),
         status_updated_at = datetime('now'), public_url = COALESCE(?, public_url),
         basic_info_json = ?, error_type = NULL, error_message = NULL
       WHERE hashed_url = ?`,
    ).run(publicUrl, basicInfo, lead.hashed_url);
  } else if (outcome.status === 'transient' || outcome.status === 'limited') {
    // Infra/session hiccup or an account-level limit — leave the lead not_connected so it
    // retries. The failed attempt is captured in the runs table for audit; we don't touch
    // the lead's status. (The main loop also handles `limited` by aborting the cycle.)
    return;
  } else {
    db.prepare(
      `UPDATE leads SET status='error', status_updated_at = datetime('now'),
         error_type = ?, error_message = ?, basic_info_json = COALESCE(?, basic_info_json)
       WHERE hashed_url = ?`,
    ).run(outcome.errorType ?? 'unknown', outcome.errorMessage ?? null, basicInfo, lead.hashed_url);
  }
}
