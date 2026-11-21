import Database from 'better-sqlite3';
import { dbPath, ensureDir, dataDir } from './paths.mjs';
import { dirname } from 'node:path';

// MIGRATIONS ARE APPEND-ONLY AND IMMUTABLE. Once an entry has shipped, never edit it —
// existing databases record the highest applied version and will not re-run earlier
// entries, so an in-place edit silently diverges fresh DBs from upgraded ones. To change
// the schema, ADD a new entry. Each entry is either a SQL string (run with db.exec) or a
// function(db) for logic that must inspect the current schema (e.g. ALTER TABLE guarded
// by PRAGMA table_info). Entry index + 1 is its version number.
const MIGRATIONS = [
  // 1: initial schema
  `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS accounts (
    name TEXT PRIMARY KEY,
    cli_account TEXT NOT NULL,
    paused INTEGER NOT NULL DEFAULT 0,
    daily_invite_limit INTEGER NOT NULL DEFAULT 35,
    min_invite_interval_minutes INTEGER NOT NULL DEFAULT 15,
    active_start TEXT NOT NULL DEFAULT '09:00',
    active_end TEXT NOT NULL DEFAULT '18:00',
    max_pending_days INTEGER NOT NULL DEFAULT 10,
    pending_batch_size INTEGER NOT NULL DEFAULT 5,
    last_action_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    hashed_url TEXT PRIMARY KEY,
    public_url TEXT,
    full_name TEXT NOT NULL,
    position TEXT,
    location TEXT,
    list_name TEXT,
    reasoning TEXT,
    owner_account TEXT NOT NULL REFERENCES accounts(name) ON UPDATE CASCADE,
    basic_info_json TEXT,
    status TEXT NOT NULL DEFAULT 'not_connected',
    sent_at TEXT,
    status_updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    error_type TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_leads_owner_status ON leads(owner_account, status);
  CREATE INDEX IF NOT EXISTS idx_leads_status_sent ON leads(status, sent_at);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
  CREATE INDEX IF NOT EXISTS idx_leads_public_url ON leads(public_url);

  CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_hashed_url TEXT REFERENCES leads(hashed_url) ON DELETE SET NULL,
    account TEXT,
    action TEXT NOT NULL,
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    finished_at TEXT,
    success INTEGER,
    raw_response_json TEXT,
    error_message TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_runs_lead ON runs(lead_hashed_url);
  CREATE INDEX IF NOT EXISTS idx_runs_account_started ON runs(account, started_at);

  CREATE TABLE IF NOT EXISTS import_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    last_assigned_account TEXT
  );
  INSERT OR IGNORE INTO import_state (id, last_assigned_account) VALUES (1, NULL);

  CREATE TABLE IF NOT EXISTS import_batches (
    id TEXT PRIMARY KEY,
    list_name TEXT NOT NULL,
    searcher_account TEXT NOT NULL,
    search_url TEXT,
    search_type TEXT NOT NULL,
    candidate_count INTEGER NOT NULL DEFAULT 0,
    qualified_count INTEGER,
    committed_count INTEGER,
    skipped_existing_count INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    committed_at TEXT,
    state TEXT NOT NULL DEFAULT 'pending_qualification'
  );
  `,
  // 2: reconcile the accounts table for databases created before columns were added/renamed
  //    during early development. No-op on a fresh DB (entry 1 already has the full schema).
  reconcileAccountsTable,
  // 3: global key/value settings (e.g. max_connect_attempts for cross-account retry).
  `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  INSERT OR IGNORE INTO settings (key, value) VALUES ('max_connect_attempts', '1');
  `,
];

// Brings any older `accounts` table up to the current schema by adding whatever columns
// are missing and folding renamed columns forward. Idempotent and safe on a fresh DB.
function reconcileAccountsTable(db) {
  const cols = new Set(db.prepare('PRAGMA table_info(accounts)').all().map((c) => c.name));
  const addColumn = (name, ddl) => {
    if (!cols.has(name)) {
      db.exec(`ALTER TABLE accounts ADD COLUMN ${ddl}`);
      cols.add(name);
    }
  };

  addColumn('min_invite_interval_minutes', 'min_invite_interval_minutes INTEGER NOT NULL DEFAULT 15');
  addColumn('active_start', "active_start TEXT NOT NULL DEFAULT '09:00'");
  addColumn('active_end', "active_end TEXT NOT NULL DEFAULT '18:00'");
  addColumn('pending_batch_size', 'pending_batch_size INTEGER NOT NULL DEFAULT 5');
  addColumn('last_action_at', 'last_action_at TEXT');

  // Fold older columns forward (kept in place — old SQLite can't easily DROP COLUMN, and
  // no code reads them anymore, so they are harmless).
  if (cols.has('cron_time')) {
    db.exec('UPDATE accounts SET active_start = cron_time');
  }
  if (cols.has('last_run_at')) {
    db.exec('UPDATE accounts SET last_action_at = last_run_at WHERE last_action_at IS NULL');
  }
}

export function openDb({ readonly = false } = {}) {
  const path = dbPath();
  ensureDir(dirname(path));
  ensureDir(dataDir());
  // A readonly connection never migrates, and a readonly open on a missing file throws.
  // So before opening readonly, briefly open a writable connection to create the file (if
  // missing) AND apply any pending migrations (e.g. after a skill upgrade). This keeps read
  // commands correct without a separate `db.mjs init` step.
  if (readonly) {
    const w = new Database(path);
    w.pragma('journal_mode = WAL');
    w.pragma('busy_timeout = 5000');
    migrate(w);
    w.close();
  }
  const db = new Database(path, { readonly, fileMustExist: readonly });
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  // Per-account workers run concurrently now, so several short writes can land at once.
  // Wait (don't fail) up to 5s for the write lock instead of throwing SQLITE_BUSY.
  db.pragma('busy_timeout = 5000');
  if (!readonly) migrate(db);
  return db;
}

export function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);
  const current = db.prepare('SELECT MAX(version) AS v FROM schema_version').get()?.v ?? 0;
  for (let i = current; i < MIGRATIONS.length; i++) {
    const version = i + 1;
    const migration = MIGRATIONS[i];
    db.transaction(() => {
      if (typeof migration === 'function') migration(db);
      else db.exec(migration);
      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(version);
    })();
  }
  return MIGRATIONS.length;
}

export function withDb(fn, opts) {
  const db = openDb(opts);
  try {
    return fn(db);
  } finally {
    db.close();
  }
}
