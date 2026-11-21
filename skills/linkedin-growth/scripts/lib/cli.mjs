import { spawn } from 'node:child_process';

const LINKEDAPI_CLIENT = 'skill:linkedin-growth';

export function runLinkedin(args, { cliAccount, input, timeoutMs } = {}) {
  // oclif requires the command/topic tokens first, then flags:
  // `linkedin <command> --json -q --account "<name>"`. Flags before the command
  // make oclif treat the first flag as the command name (exit 2).
  const finalArgs = [...args, '--json', '-q'];
  if (cliAccount) finalArgs.push('--account', cliAccount);
  return runCommand('linkedin', finalArgs, {
    input,
    timeoutMs,
    env: { ...process.env, LINKEDAPI_CLIENT },
  });
}

export function runCommand(command, args, { input, timeoutMs, env } = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: env ?? process.env,
    });
    let stdout = '';
    let stderr = '';
    let killed = false;
    // No timeout by default: long-running LinkedIn scrapes (e.g. a max Sales
    // Navigator search) must run to completion. Callers that need a fast-fail
    // probe (such as the doctor health checks) opt in by passing timeoutMs.
    const timer =
      timeoutMs === undefined
        ? undefined
        : setTimeout(() => {
            killed = true;
            child.kill('SIGKILL');
          }, timeoutMs);

    child.stdout.on('data', (b) => (stdout += b.toString()));
    child.stderr.on('data', (b) => (stderr += b.toString()));
    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      resolve({ ok: false, exitCode: -1, stdout, stderr, error: err.message });
    });
    child.on('close', (code) => {
      if (timer) clearTimeout(timer);
      resolve({
        ok: code === 0 && !killed,
        exitCode: code ?? -1,
        stdout,
        stderr,
        killed,
        json: tryParse(stdout),
      });
    });

    if (input !== undefined) {
      child.stdin.write(input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }
  });
}

// `linkedin account list` ignores --json and prints a human table:
//   * Jane Doe (id_abc...123)
//     John Smith (id_def...456)
// The leading `*` marks the active account. Returns the account display names.
export function parseCliAccounts(stdout) {
  return stdout
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^no accounts/i.test(l))
    .map((l) => {
      const withoutMarker = l.replace(/^\*\s*/, '');
      const m = withoutMarker.match(/^(.*?)\s*\([^()]*\)\s*$/);
      return m ? m[1].trim() : null;
    })
    .filter(Boolean);
}

function tryParse(s) {
  const trimmed = s.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}
