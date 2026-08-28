#!/usr/bin/env node
import { parseArgs, requireFlag, intFlag } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail, info } from './lib/output.mjs';
import { runLinkedin } from './lib/cli.mjs';
import { getAccountOrFail, isFatalExitCode } from './lib/account.mjs';
import { recordRunStart, recordRunFinish } from './lib/runs.mjs';
import { resolveFailedAttempt, countTrailingPersonNotFound } from './lib/retry.mjs';

// How many consecutive personNotFound status checks before a lead is closed terminally.
// We query the stable hashed member URL, so a streak means the member is genuinely gone
// (deleted/deactivated) rather than a stale public slug — there is nothing left to retry.
const PERSON_NOT_FOUND_ATTEMPTS = 2;

const { flags } = parseArgs();

try {
  await main();
} catch (err) {
  fail(err.message);
}

async function main() {
  const accountName = requireFlag(flags, 'account');
  const account = withDb((db) => getAccountOrFail(db, accountName), { readonly: true });
  if (account.paused) {
    ok({ skipped: 'paused', account: account.name });
    return;
  }
  const minDays = intFlag(flags, 'min-days', account.max_pending_days);
  const limit = intFlag(flags, 'limit', undefined);

  const leads = withDb(
    (db) =>
      db
        .prepare(
          `SELECT hashed_url, public_url, full_name, sent_at
           FROM leads
           WHERE owner_account = ? AND status = 'pending'
             AND sent_at IS NOT NULL
             AND sent_at < datetime('now', ?)
           ORDER BY sent_at ASC
           ${limit !== undefined ? 'LIMIT ?' : ''}`,
        )
        .all(...(limit !== undefined ? [account.name, `-${minDays} days`, limit] : [account.name, `-${minDays} days`])),
    { readonly: true },
  );

  if (leads.length === 0) {
    ok({ account: account.name, min_days: minDays, processed: 0 });
    return;
  }

  const summary = {
    processed: 0,
    connected: 0,
    reassigned: 0,
    exhausted: 0,
    errors: 0,
    aborted: false,
  };

  for (const lead of leads) {
    // Prefer the hashed member URL: it is stable across name / vanity-URL changes, whereas a
    // stored public slug goes dead the moment the person renames (then `connection status`
    // returns personNotFound forever). Fall back to public_url for `st` leads, where the
    // hashed_url IS the public URL.
    const personUrl = lead.hashed_url || lead.public_url;

    let runId;
    withDb((db) => {
      runId = recordRunStart(db, {
        leadHashedUrl: lead.hashed_url,
        account: account.name,
        action: 'check_status',
      });
    });

    info(`[check] ${lead.full_name} <${personUrl}>`);
    const cli = await runLinkedin(['connection', 'status', personUrl], {
      cliAccount: account.cli_account,
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

    const statusBody = cli.json ?? {};
    if (statusBody.success === false) {
      const errorType = statusBody.error?.type;
      const errorMessage = statusBody.error?.message ?? `exit ${cli.exitCode}`;
      withDb((db) =>
        recordRunFinish(db, runId, { success: false, rawResponse: cli.json, errorMessage }),
      );
      summary.processed++;

      // personNotFound means the URL no longer resolves to a LinkedIn member. We query the
      // stable hashed member URL above, so this is a permanent condition (deleted/deactivated
      // account), not a stale public slug — retrying it every cycle just burns workflow runs
      // and never resolves. After a short streak, close the lead terminally instead of
      // leaving it pending forever. Other (transient) errors keep the previous behaviour.
      const shouldExhaust =
        errorType === 'personNotFound' &&
        withDb((db) => countTrailingPersonNotFound(db, lead.hashed_url)) >= PERSON_NOT_FOUND_ATTEMPTS;
      if (shouldExhaust) {
        withDb((db) =>
          db
            .prepare(
              `UPDATE leads SET status='exhausted', status_updated_at = datetime('now'),
                 error_type='personNotFound', error_message=? WHERE hashed_url = ?`,
            )
            .run(errorMessage, lead.hashed_url),
        );
        summary.exhausted++;
      } else {
        summary.errors++;
      }
      continue;
    }
    const status = statusBody.data?.connectionStatus ?? statusBody.data?.status;
    withDb((db) =>
      recordRunFinish(db, runId, { success: true, rawResponse: cli.json, errorMessage: null }),
    );

    if (status === 'connected') {
      withDb((db) =>
        db
          .prepare(
            `UPDATE leads SET status='connected', status_updated_at = datetime('now')
             WHERE hashed_url = ?`,
          )
          .run(lead.hashed_url),
      );
      summary.processed++;
      summary.connected++;
    } else if (status === 'notConnected') {
      // The person declined or the request expired without connecting — a failed
      // attempt by this account. Retry from another account or exhaust.
      const res = withDb((db) => resolveFailedAttempt(db, lead));
      summary.processed++;
      summary[res.outcome === 'reassigned' ? 'reassigned' : 'exhausted']++;
    } else if (status === 'pending') {
      const withdrawRunId = withDb((db) =>
        recordRunStart(db, {
          leadHashedUrl: lead.hashed_url,
          account: account.name,
          action: 'withdraw',
        }),
      );
      const withdraw = await runLinkedin(['connection', 'withdraw', personUrl], {
        cliAccount: account.cli_account,
      });
      const wOk = withdraw.ok && withdraw.json?.success !== false;
      withDb((db) =>
        recordRunFinish(db, withdrawRunId, {
          success: wOk,
          rawResponse: withdraw.json,
          errorMessage: wOk
            ? null
            : withdraw.json?.error?.message ?? `exit ${withdraw.exitCode}`,
        }),
      );
      if (isFatalExitCode(withdraw.exitCode)) {
        summary.aborted = true;
        summary.abort_reason = `linkedin-cli exit ${withdraw.exitCode}`;
        break;
      }
      if (wOk) {
        // Stale request cancelled — a failed attempt. Retry from another account or exhaust.
        const res = withDb((db) => resolveFailedAttempt(db, lead));
        summary[res.outcome === 'reassigned' ? 'reassigned' : 'exhausted']++;
      } else {
        summary.errors++;
      }
      summary.processed++;
    } else {
      summary.processed++;
      summary.errors++;
    }
  }

  ok({ account: account.name, min_days: minDays, ...summary });
}
