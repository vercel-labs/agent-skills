#!/usr/bin/env node
import { parseArgs } from './lib/args.mjs';
import { openDb, migrate } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';
import { dbPath } from './lib/paths.mjs';

const { positional } = parseArgs();
const cmd = positional[0] ?? 'init';

try {
  if (cmd === 'init' || cmd === 'migrate') {
    const db = openDb();
    const applied = migrate(db);
    const version = db.prepare('SELECT MAX(version) AS v FROM schema_version').get().v;
    db.close();
    ok({ path: dbPath(), schema_version: version, migrations_applied: applied });
  } else if (cmd === 'version') {
    const db = openDb({ readonly: true });
    const row = db.prepare('SELECT MAX(version) AS v FROM schema_version').get();
    db.close();
    ok({ path: dbPath(), schema_version: row?.v ?? 0 });
  } else if (cmd === 'path') {
    ok({ path: dbPath() });
  } else {
    fail(`unknown command: ${cmd}. Use: init | migrate | version | path`, 5);
  }
} catch (err) {
  fail(err.message);
}
