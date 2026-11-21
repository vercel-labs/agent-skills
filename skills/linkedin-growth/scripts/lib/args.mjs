export function parseArgs(argv = process.argv.slice(2)) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const key = a.slice(2);
        const next = argv[i + 1];
        if (next === undefined || next.startsWith('--')) {
          flags[key] = true;
        } else {
          flags[key] = next;
          i++;
        }
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

export function requireFlag(flags, name) {
  const v = flags[name];
  if (v === undefined || v === true || v === '') {
    throw new Error(`Missing required flag: --${name}`);
  }
  return String(v);
}

export function intFlag(flags, name, fallback) {
  if (flags[name] === undefined) return fallback;
  const n = Number(flags[name]);
  if (!Number.isFinite(n)) throw new Error(`Invalid number for --${name}`);
  return n;
}

export function boolFlag(flags, name, fallback = false) {
  if (flags[name] === undefined) return fallback;
  if (flags[name] === true) return true;
  const v = String(flags[name]).toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return Boolean(flags[name]);
}
