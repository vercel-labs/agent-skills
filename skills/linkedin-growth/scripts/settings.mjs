#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { parseArgs } from './lib/args.mjs';
import { withDb } from './lib/db.mjs';
import { ok, fail } from './lib/output.mjs';
import { getSetting, setSetting, allSettings } from './lib/settings.mjs';

const { positional, flags } = parseArgs();
const cmd = positional[0];

// Known settings with validation. Extend here as new global settings are added.
const VALIDATORS = {
  max_connect_attempts: (v) => {
    if (v === 'all') return 'all';
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 50) {
      throw new Error("max_connect_attempts must be a positive integer (1-50) or 'all'");
    }
    return String(n);
  },
  // Free-text definition of the user's ideal lead (who to keep / who to filter out).
  // Consumed by the qualification step during import.
  icp_definition: (v) => {
    const t = String(v).trim();
    if (!t) throw new Error('icp_definition cannot be empty');
    if (t.length > 12000) throw new Error('icp_definition is too long (max 12000 chars)');
    return t;
  },
};

try {
  switch (cmd) {
    case 'list':
      withDb((db) => ok(allSettings(db)), { readonly: true });
      break;
    case 'get': {
      const key = positional[1];
      if (!key) throw new Error('Usage: settings.mjs get <key>');
      withDb((db) => ok({ key, value: getSetting(db, key, null) }), { readonly: true });
      break;
    }
    case 'set': {
      const key = positional[1];
      // Value source, in priority order:
      //   --stdin       read from stdin (preferred for multi-line text like the ICP — no file)
      //   --file <path> read from a file
      //   <value>       inline positional
      // The value is stored in the DB (settings table); --file/--stdin are just transports.
      const raw = flags.stdin
        ? readFileSync(0, 'utf8')
        : flags.file
          ? readFileSync(String(flags.file), 'utf8')
          : positional[2];
      if (!key || raw === undefined) {
        throw new Error(
          'Usage: settings.mjs set <key> <value>   (or: set <key> --stdin   |   set <key> --file <path>)',
        );
      }
      const validate = VALIDATORS[key];
      const value = validate ? validate(raw) : String(raw);
      withDb((db) => {
        setSetting(db, key, value);
        ok({ key, value });
      });
      break;
    }
    default:
      fail(
        'Usage:\n' +
          '  settings.mjs list\n' +
          '  settings.mjs get <key>\n' +
          '  settings.mjs set max_connect_attempts <1-50|all>\n' +
          "  settings.mjs set icp_definition --stdin    (pipe the ICP text in; stored in the DB)\n" +
          "  settings.mjs set icp_definition '<text>'   (short inline alternative)",
        5,
      );
  }
} catch (err) {
  fail(err.message);
}
