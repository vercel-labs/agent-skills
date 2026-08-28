function isJsonRequested() {
  return process.argv.includes('--json');
}

export function emit(payload) {
  if (isJsonRequested()) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  } else {
    process.stdout.write(`${formatHuman(payload)}\n`);
  }
}

export function ok(data) {
  emit({ success: true, data });
}

export function fail(error, exitCode = 1) {
  const body = { success: false, error: typeof error === 'string' ? { message: error } : error };
  if (isJsonRequested()) {
    process.stdout.write(`${JSON.stringify(body)}\n`);
  } else {
    process.stderr.write(`error: ${body.error.message || JSON.stringify(body.error)}\n`);
  }
  process.exit(exitCode);
}

export function info(message) {
  if (!isJsonRequested()) process.stderr.write(`${message}\n`);
}

function formatHuman(payload) {
  if (payload && typeof payload === 'object' && 'success' in payload) {
    if (!payload.success) return `error: ${payload.error?.message ?? JSON.stringify(payload.error)}`;
    return formatValue(payload.data);
  }
  return formatValue(payload);
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every((row) => row && typeof row === 'object')) {
    return formatTable(value);
  }
  return JSON.stringify(value, null, 2);
}

function formatTable(rows) {
  if (rows.length === 0) return '(no rows)';
  const cols = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const widths = cols.map((c) =>
    Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)),
  );
  const fmt = (vals) => vals.map((v, i) => String(v).padEnd(widths[i])).join('  ');
  const head = fmt(cols);
  const sep = widths.map((w) => '-'.repeat(w)).join('  ');
  const body = rows.map((r) => fmt(cols.map((c) => r[c] ?? ''))).join('\n');
  return `${head}\n${sep}\n${body}`;
}
