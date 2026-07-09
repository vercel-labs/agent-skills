#!/usr/bin/env node
//
// The scheduler heartbeat, in two roles selected by the --account flag:
//
//   DISPATCHER (no --account): launched by the OS timer every few minutes. It is
//     lightweight and NEVER blocks. For each active account that is inside its active
//     window and not already being processed, it spawns a DETACHED worker and returns
//     immediately. Because it never waits on a worker, a slow account — or one that is busy
//     with another workflow the user launched on the same LinkedIn session — can never hold
//     up the next tick or any other account. Accounts are therefore processed in parallel.
//
//   WORKER (--account <name>): does the work for ONE account, holding a per-account lock for
//     its whole lifetime:
//       1. INVITE (top priority): if under the daily quota AND at least
//          `min_invite_interval_minutes` since the last successful send, send ONE invite.
//          It always runs BEFORE any pending work, so pending can never delay a connect.
//       2. PENDING (fills the rest): drain due pending checks in small batches until none
//          remain or a soft time budget elapses. The budget only decides whether to START
//          another batch — a batch already running is never interrupted.
//
// Nothing here is ever killed by a timeout. If an operation is slow because the account is
// busy, the worker simply keeps holding its lock; the next dispatcher ticks see a LIVE
// worker and skip that account, so no work piles up and nothing is force-terminated. When
// the op returns, the worker finishes and the normal cadence resumes on the next tick.
//
// The per-account lock is reclaimed ONLY when its owning process is actually dead (PID
// probe), never on a timer — so a long-but-alive run is never preempted or double-started,
// and a crashed run self-heals on the next tick. Each operation is persisted to the DB the
// moment it completes, and quotas are recomputed from the runs table each tick (bounded to
// the local calendar day), so state stays correct across interruptions.
//
import {
  existsSync, writeFileSync, readFileSync, unlinkSync, openSync, closeSync,
  appendFileSync, readdirSync, statSync,
} from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { withDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';
import { parseArgs } from './lib/args.mjs';
import { dataDir, ensureDir, logsDir, SKILL_ROOT } from './lib/paths.mjs';
import { defaults } from './lib/config.mjs';
import {
  startOfLocalDayUtc, localHHMM, parseDbUtc, minutesSince,
} from './lib/time.mjs';

const { flags } = parseArgs();

try {
  if (flags.account) {
    await runWorker(String(flags.account));
  } else {
    dispatch();
  }
} catch (err) {
  fail(err.message);
}

// Spawn one detached worker per eligible account, then exit. Never waits on a worker.
function dispatch() {
  ensureDir(dataDir());
  const now = new Date();
  const nowHHMM = localHHMM(now);

  const accounts = withDb(
    (db) =>
      db
        .prepare('SELECT name, active_start, active_end FROM accounts WHERE paused = 0 ORDER BY name')
        .all(),
    { readonly: true },
  );

  const dispatched = [];
  const skipped = {};
  for (const acc of accounts) {
    if (nowHHMM < acc.active_start || nowHHMM > acc.active_end) {
      skipped[acc.name] = 'outside_active_window';
    } else if (lockHeldByLiveProcess(acc.name)) {
      skipped[acc.name] = 'previous_run_still_active';
    } else {
      spawnWorker(acc.name);
      dispatched.push(acc.name);
    }
  }

  pruneLogs();
  ok({
    now: now.toISOString(),
    local_time: nowHHMM,
    dispatched,
    ...(Object.keys(skipped).length ? { skipped } : {}),
  });
}

// Fire-and-forget: the worker is detached and fully owns its lifetime. The dispatcher does
// not keep a handle to it, so the dispatcher (the OS-timer job) exits right away.
function spawnWorker(account) {
  const child = spawn(
    process.execPath,
    [join(SKILL_ROOT, 'scripts', 'tick.mjs'), '--account', account, '--json'],
    { detached: true, stdio: 'ignore' },
  );
  child.unref();
}

async function runWorker(account) {
  if (!acquireLock(account)) {
    ok({ account, skipped: 'already_running' });
    return;
  }
  try {
    const now = new Date();
    const nowHHMM = localHHMM(now);
    const dayStartUtc = startOfLocalDayUtc(now);

    const acc = withDb(
      (db) => db.prepare('SELECT * FROM accounts WHERE name = ? AND paused = 0').get(account),
      { readonly: true },
    );
    if (!acc) {
      ok({ account, skipped: 'not_active' });
      return;
    }
    if (nowHHMM < acc.active_start || nowHHMM > acc.active_end) {
      ok({ account, skipped: 'outside_active_window' });
      return;
    }

    const stats = readStats(acc, dayStartUtc);
    const did = [];
    const skipped = {};

    // 1) INVITE — highest priority, before any pending work so it can never be delayed.
    if (stats.notConnected === 0) {
      skipped.invite = 'no_not_connected_leads';
    } else if (stats.sentToday >= acc.daily_invite_limit) {
      skipped.invite = 'daily_quota_reached';
    } else {
      const elapsed = minutesSince(parseDbUtc(stats.lastSentAt), now);
      if (elapsed >= acc.min_invite_interval_minutes) {
        await runChild('network-invite.mjs', account, ['--limit', '1']);
        did.push({ op: 'invite', sent_today_before: stats.sentToday, daily_limit: acc.daily_invite_limit });
      } else {
        skipped.invite = `paced_waiting (${Math.round(acc.min_invite_interval_minutes - elapsed)}min left)`;
      }
    }

    // 2) PENDING — drain due checks; never count-capped, only bounded by a soft time budget
    //    that gates STARTING another batch. A batch already running is never interrupted.
    const budgetMs = defaults().pending_tick_budget_seconds * 1000;
    const batch = defaults().pending_drain_batch;
    const startMs = Date.now();
    let due = stats.duePending;
    let prevDue = Infinity;
    let drained = 0;
    while (due > 0 && due < prevDue && Date.now() - startMs < budgetMs) {
      await runChild('network-pending.mjs', account, ['--limit', String(batch)]);
      prevDue = due;
      due = readDuePending(acc);
      drained += Math.max(0, prevDue - due);
    }
    if (drained > 0 || stats.duePending > 0) {
      did.push({ op: 'pending', drained, due_remaining: due });
    } else {
      skipped.pending = 'no_due_pending';
    }

    logWorker(account, { did, ...(Object.keys(skipped).length ? { skipped } : {}) });
    ok({ account, did, ...(Object.keys(skipped).length ? { skipped } : {}) });
  } finally {
    releaseLock(account);
  }
}

function readStats(acc, dayStartUtc) {
  return withDb(
    (db) => ({
      sentToday: db
        .prepare(
          `SELECT COUNT(*) AS c FROM runs
           WHERE account = ? AND action = 'invite' AND success = 1 AND started_at >= ?`,
        )
        .get(acc.name, dayStartUtc).c,
      // Pace on the last SUCCESSFUL send, not on any attempt. A transient/failed attempt did
      // not send a request, so it must not consume the interval — otherwise a cold first run
      // stalls the account for a full interval.
      lastSentAt: db
        .prepare(
          `SELECT MAX(started_at) AS t FROM runs
           WHERE account = ? AND action = 'invite' AND success = 1 AND started_at >= ?`,
        )
        .get(acc.name, dayStartUtc).t,
      notConnected: db
        .prepare(`SELECT COUNT(*) AS c FROM leads WHERE owner_account = ? AND status = 'not_connected'`)
        .get(acc.name).c,
      duePending: readDuePending(acc),
    }),
    { readonly: true },
  );
}

function readDuePending(acc) {
  return withDb(
    (db) =>
      db
        .prepare(
          `SELECT COUNT(*) AS c FROM leads
           WHERE owner_account = ? AND status = 'pending' AND sent_at IS NOT NULL
             AND sent_at < datetime('now', ?)`,
        )
        .get(acc.name, `-${acc.max_pending_days} days`).c,
    { readonly: true },
  );
}

// Run a child script for this account and wait for it to finish. No timeout: a slow op
// (e.g. the account is busy with another workflow) is allowed to take as long as it needs —
// the per-account lock keeps later ticks from starting a second op in the meantime.
function runChild(script, account, extraArgs) {
  return new Promise((resolve) => {
    const logFile = join(
      ensureDir(logsDir()),
      `${account}-${new Date().toISOString().slice(0, 10)}.log`,
    );
    appendFileSync(logFile, `\n=== ${new Date().toISOString()} ${account} ${script} ===\n`);
    const child = spawn(
      process.execPath,
      [join(SKILL_ROOT, 'scripts', script), '--account', account, '--json', ...extraArgs],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let out = '';
    let err = '';
    child.stdout.on('data', (b) => (out += b.toString()));
    child.stderr.on('data', (b) => (err += b.toString()));
    child.on('error', (e) => {
      appendFileSync(logFile, `spawn error: ${e.message}\n`);
      resolve(-1);
    });
    child.on('close', (code) => {
      if (out) appendFileSync(logFile, out);
      if (err) appendFileSync(logFile, err);
      appendFileSync(logFile, `\n--- exit ${code} ---\n`);
      resolve(code);
    });
  });
}

function logWorker(account, summary) {
  try {
    const logFile = join(
      ensureDir(logsDir()),
      `${account}-${new Date().toISOString().slice(0, 10)}.log`,
    );
    appendFileSync(logFile, `\n[worker ${new Date().toISOString()}] ${JSON.stringify(summary)}\n`);
  } catch {
    /* logging is best-effort */
  }
}

// --- Per-account lock: liveness-based, never time-based. ---
function lockPath(account) {
  return join(dataDir(), `tick-${account}.lock`);
}

function isProcessAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM'; // exists but owned by another user
  }
}

function lockHeldByLiveProcess(account) {
  const p = lockPath(account);
  if (!existsSync(p)) return false;
  try {
    return isProcessAlive(Number(readFileSync(p, 'utf8')));
  } catch {
    return false;
  }
}

function acquireLock(account) {
  const p = lockPath(account);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = openSync(p, 'wx');
      writeFileSync(fd, String(process.pid));
      closeSync(fd);
      return true;
    } catch {
      // Lock exists. Reclaim it only if its owner is dead; a live worker keeps it.
      try {
        if (isProcessAlive(Number(readFileSync(p, 'utf8')))) return false;
        unlinkSync(p);
      } catch {
        return false;
      }
    }
  }
  return false;
}

function releaseLock(account) {
  const p = lockPath(account);
  try {
    if (!existsSync(p)) return;
    if (Number(readFileSync(p, 'utf8')) === process.pid) unlinkSync(p);
  } catch {
    /* ignore */
  }
}

function pruneLogs() {
  const dir = logsDir();
  if (!existsSync(dir)) return;
  const cutoff = Date.now() - defaults().log_retention_days * 86400 * 1000;
  for (const f of readdirSync(dir)) {
    const path = join(dir, f);
    try {
      if (statSync(path).mtimeMs < cutoff) unlinkSync(path);
    } catch {
      /* ignore */
    }
  }
}
