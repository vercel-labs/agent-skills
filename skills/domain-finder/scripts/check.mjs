#!/usr/bin/env node
// Portable Fastly Domain Research API checker.
//
// Auth: one env var — FASTLY_KEY.
// Get one at: https://manage.fastly.com/account/personal/tokens
//
// Input: domains via stdin (newline-separated), CLI args, or --file <path>
//   echo "foo.com\nbar.ai" | node check.mjs
//   node check.mjs foo.com bar.ai
//   node check.mjs --file candidates.txt
//
// Output:
//   default → human-readable: "✓ AVAILABLE  foo.com" / "$ FOR_SALE  foo.com  USD 2495 (HugeDomains)"
//   --json  → machine: {"results":[{"domain":"foo.com","category":"available", ...}, ...]}
//   --available-only → only print free ones (works in both modes)
//
// Fastly status decoding:
//   "undelegated inactive"           → available (free to register)
//   "marketed priced active"         → for_sale (aftermarket; offers[] has price)
//   "active" / contains "active"     → registered (in active use)
//   anything else (rate_limited etc) → error

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { homedir } from "node:os";

const args = process.argv.slice(2);
const VALUE_FLAGS = new Set(["--file", "--delay"]);
const flag = (name) => args.includes(name);
const flagValue = (name) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
};
const positional = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--")) {
    if (VALUE_FLAGS.has(a)) i++; // skip the flag's value
    continue;
  }
  positional.push(a);
}

const JSON_OUT = flag("--json");
const AVAILABLE_ONLY = flag("--available-only");
const DELAY_MS = Number(flagValue("--delay") ?? 250);

// ── Auth ────────────────────────────────────────────────────────────────
loadKeyFromEnvFiles();
const FASTLY_KEY = process.env.FASTLY_KEY;
if (!FASTLY_KEY) {
  die(
    [
      "FASTLY_KEY not set. Set it one of these ways:",
      "",
      "  1. Export in your shell (persist in ~/.zshrc or ~/.bashrc):",
      "     export FASTLY_KEY=<your-token>",
      "",
      "  2. Drop into a .env.local or .env file in this dir or any parent dir:",
      "     FASTLY_KEY=<your-token>",
      "",
      "Get a free token: https://manage.fastly.com/account/personal/tokens",
    ].join("\n"),
  );
}

// ── Read input ──────────────────────────────────────────────────────────
const domains = await collectDomains(positional, flagValue("--file"));
if (domains.length === 0) die("No domains given. Pipe via stdin, pass args, or use --file.");

// ── Run ─────────────────────────────────────────────────────────────────
if (!JSON_OUT) process.stderr.write(`Checking ${domains.length} domain(s) via Fastly...\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];

for (let i = 0; i < domains.length; i++) {
  let r;
  try {
    r = await checkOne(domains[i]);
  } catch (e) {
    r = { domain: domains[i], status: "fetch_error", error: String(e).slice(0, 200) };
  }
  const category = classify(r);
  const enriched = { ...r, category };
  results.push(enriched);
  if (!JSON_OUT) printLine(i + 1, domains.length, enriched);
  if (i + 1 < domains.length) await sleep(DELAY_MS);
}

// ── Output ──────────────────────────────────────────────────────────────
if (JSON_OUT) {
  const filtered = AVAILABLE_ONLY ? results.filter((r) => r.category === "available") : results;
  process.stdout.write(`${JSON.stringify({ results: filtered }, null, 2)}\n`);
} else {
  const counts = countByCategory(results);
  process.stderr.write(
    `\n${counts.available} available · ${counts.for_sale} for sale · ${counts.registered} registered · ${counts.error} errors\n`,
  );
}

// ═══════════════════════════════════════════════════════════════════════
// helpers

function die(msg) {
  process.stderr.write(`error: ${msg}\n`);
  process.exit(1);
}

// Walk from cwd up to home (or root) looking for .env.local / .env with FASTLY_KEY.
// Stops at the first file that contains the key, so closer files win.
function loadKeyFromEnvFiles() {
  if (process.env.FASTLY_KEY) return;
  const stop = homedir();
  let dir = process.cwd();
  const filenames = [".env.local", ".env"];
  // Hard cap on dir-walk depth as a safety net.
  for (let i = 0; i < 12; i++) {
    for (const name of filenames) {
      const path = join(dir, name);
      if (existsSync(path) && readKeyFromFile(path)) return;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    if (dir === stop) break;
    dir = parent;
  }
  // Also try ~/.config/domain-finder/key (one-line file).
  const xdg = join(homedir(), ".config", "domain-finder", "key");
  if (existsSync(xdg)) {
    try {
      const v = readFileSync(xdg, "utf8").trim();
      if (v) process.env.FASTLY_KEY = v;
    } catch {
      /* ignore */
    }
  }
}

function readKeyFromFile(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*FASTLY_KEY\s*=\s*(.+?)\s*$/);
      if (m) {
        process.env.FASTLY_KEY = m[1].replace(/^["']|["']$/g, "");
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}

async function collectDomains(positional, filePath) {
  const out = [];
  if (filePath) {
    const text = readFileSync(resolve(filePath), "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (t && !t.startsWith("#")) out.push(t);
    }
  }
  if (positional.length) out.push(...positional);
  if (!process.stdin.isTTY) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const text = Buffer.concat(chunks).toString("utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (t && !t.startsWith("#")) out.push(t);
    }
  }
  return [...new Set(out)];
}

async function checkOne(domain) {
  const url = `https://api.fastly.com/domain-management/v1/tools/status?domain=${encodeURIComponent(domain)}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { "Fastly-Key": FASTLY_KEY, Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") || "2") * 1000;
      await sleep(retryAfter * (attempt + 1));
      continue;
    }
    if (!res.ok) {
      return {
        domain,
        status: `http_${res.status}`,
        error: (await res.text()).slice(0, 200),
      };
    }
    return await res.json(); // { domain, zone, status, tags, offers? }
  }
  return { domain, status: "rate_limited" };
}

function classify(r) {
  const s = String(r.status ?? "");
  if (s.startsWith("http_") || s === "rate_limited" || s === "fetch_error") return "error";
  if (s.includes("marketed")) return "for_sale";
  if (s === "undelegated inactive" || s === "inactive undelegated") return "available";
  if (s.includes("undelegated") && !s.includes("active")) return "available";
  if (s.includes("active")) return "registered";
  return "unknown";
}

function printLine(idx, total, r) {
  const cat = r.category;
  if (AVAILABLE_ONLY && cat !== "available") return;
  const prefix = `[${idx}/${total}]`.padEnd(8);
  const sym =
    cat === "available"
      ? "✓ AVAILABLE  "
      : cat === "for_sale"
        ? "$ FOR_SALE   "
        : cat === "registered"
          ? "· registered "
          : cat === "error"
            ? "! ERROR      "
            : "? unknown    ";
  let extra = "";
  if (cat === "for_sale" && Array.isArray(r.offers) && r.offers.length > 0) {
    const cheapest = r.offers.reduce((a, b) =>
      Number(a.price) < Number(b.price) ? a : b,
    );
    extra = `  ${cheapest.currency} ${Number(cheapest.price).toLocaleString()} (${cheapest.vendor})`;
  } else if (cat === "error") {
    extra = `  ${r.status}${r.error ? ` — ${r.error.slice(0, 60)}` : ""}`;
  }
  process.stdout.write(`${prefix} ${sym}${r.domain}${extra}\n`);
}

function countByCategory(results) {
  const c = { available: 0, for_sale: 0, registered: 0, error: 0, unknown: 0 };
  for (const r of results) c[r.category] = (c[r.category] || 0) + 1;
  return c;
}
