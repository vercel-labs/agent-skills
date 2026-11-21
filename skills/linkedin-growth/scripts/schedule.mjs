#!/usr/bin/env node
import { writeFileSync, existsSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { platform, homedir, userInfo } from 'node:os';
import { spawnSync } from 'node:child_process';
import { parseArgs, intFlag } from './lib/args.mjs';
import { ok, fail, info } from './lib/output.mjs';
import { SKILL_ROOT, logsDir, ensureDir, dataDir } from './lib/paths.mjs';
import { defaults } from './lib/config.mjs';

const SERVICE_ID = 'io.linkedapi.linkedin-growth.tick';

const { positional, flags } = parseArgs();
const cmd = positional[0];

try {
  switch (cmd) {
    case 'install':
      install();
      break;
    case 'uninstall':
      uninstall();
      break;
    case 'status':
      status();
      break;
    case 'detect':
      ok({ kind: detectScheduler() });
      break;
    default:
      fail(
        'Usage:\n' +
          '  schedule.mjs install [--interval-minutes 5]\n' +
          '  schedule.mjs uninstall\n' +
          '  schedule.mjs status\n' +
          '  schedule.mjs detect',
        5,
      );
  }
} catch (err) {
  fail(err.message);
}

function detectScheduler() {
  const p = platform();
  if (p === 'darwin') return 'launchd';
  if (p === 'win32') return 'schtasks';
  if (p === 'linux') {
    const r = spawnSync('systemctl', ['--user', '--version'], { stdio: 'ignore' });
    if (r.status === 0) return 'systemd-user';
    const c = spawnSync('which', ['crontab'], { stdio: 'ignore' });
    if (c.status === 0) return 'cron';
    throw new Error('No supported scheduler on Linux (need systemctl --user or crontab)');
  }
  throw new Error(`Unsupported platform: ${p}`);
}

function tickCommand() {
  const node = process.execPath;
  const script = join(SKILL_ROOT, 'scripts', 'tick.mjs');
  return { node, script };
}

// Background schedulers (launchd / systemd / cron) run with a minimal PATH that usually
// excludes /usr/local/bin and node-manager bin dirs — so a bare `linkedin` spawn would fail
// with ENOENT and every scheduled invite would silently fail. Bake the install-time PATH
// (the user's shell PATH, which has `linkedin`) into the job, and make sure the directory of
// the `linkedin` binary is included.
function jobPath() {
  const parts = (process.env.PATH || '').split(':').filter(Boolean);
  const r = spawnSync('which', ['linkedin'], { stdio: 'pipe' });
  if (r.status === 0) {
    const dir = r.stdout.toString().trim().replace(/\/linkedin$/, '');
    if (dir && !parts.includes(dir)) parts.unshift(dir);
  }
  return parts.join(':');
}

function install() {
  const intervalMinutes = intFlag(flags, 'interval-minutes', defaults().tick_interval_minutes);
  if (intervalMinutes < 1 || intervalMinutes > 60) {
    throw new Error('--interval-minutes must be between 1 and 60');
  }
  ensureDir(logsDir());
  const kind = detectScheduler();
  switch (kind) {
    case 'launchd':
      installLaunchd(intervalMinutes);
      break;
    case 'systemd-user':
      installSystemd(intervalMinutes);
      break;
    case 'cron':
      installCron(intervalMinutes);
      break;
    case 'schtasks':
      installSchtasks(intervalMinutes);
      break;
  }
  ok({ installed: kind, interval_minutes: intervalMinutes, service_id: SERVICE_ID });
}

function uninstall() {
  const kind = detectScheduler();
  switch (kind) {
    case 'launchd':
      uninstallLaunchd();
      break;
    case 'systemd-user':
      uninstallSystemd();
      break;
    case 'cron':
      uninstallCron();
      break;
    case 'schtasks':
      uninstallSchtasks();
      break;
  }
  ok({ uninstalled: kind, service_id: SERVICE_ID });
}

function status() {
  const kind = detectScheduler();
  let installed = false;
  let detail = null;
  switch (kind) {
    case 'launchd': {
      const path = launchdPlistPath();
      installed = existsSync(path);
      detail = installed ? { plist: path } : null;
      break;
    }
    case 'systemd-user': {
      const { servicePath, timerPath } = systemdPaths();
      installed = existsSync(timerPath) && existsSync(servicePath);
      detail = installed ? { service: servicePath, timer: timerPath } : null;
      break;
    }
    case 'cron': {
      const current = currentCrontab();
      installed = current.includes(SERVICE_ID);
      detail = installed ? { crontab_marker: SERVICE_ID } : null;
      break;
    }
    case 'schtasks': {
      const r = spawnSync('schtasks', ['/Query', '/TN', SERVICE_ID], { stdio: 'pipe' });
      installed = r.status === 0;
      break;
    }
  }
  ok({ kind, installed, ...(detail ?? {}) });
}

// --- launchd ---
function launchdPlistPath() {
  return join(homedir(), 'Library', 'LaunchAgents', `${SERVICE_ID}.plist`);
}

function installLaunchd(intervalMinutes) {
  const { node, script } = tickCommand();
  const plistPath = launchdPlistPath();
  mkdirSync(join(homedir(), 'Library', 'LaunchAgents'), { recursive: true });
  const stdoutLog = join(logsDir(), 'tick.stdout.log');
  const stderrLog = join(logsDir(), 'tick.stderr.log');
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${SERVICE_ID}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${node}</string>
    <string>${script}</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>${jobPath()}</string>
  </dict>
  <key>StartInterval</key><integer>${intervalMinutes * 60}</integer>
  <key>RunAtLoad</key><false/>
  <key>StandardOutPath</key><string>${stdoutLog}</string>
  <key>StandardErrorPath</key><string>${stderrLog}</string>
</dict>
</plist>
`;
  writeFileSync(plistPath, plist);
  spawnSync('launchctl', ['bootout', `gui/${userInfo().uid}/${SERVICE_ID}`], { stdio: 'ignore' });
  const r = spawnSync('launchctl', ['bootstrap', `gui/${userInfo().uid}`, plistPath], {
    stdio: 'pipe',
  });
  if (r.status !== 0) {
    info(r.stderr.toString());
    throw new Error(`launchctl bootstrap failed (exit ${r.status})`);
  }
}

function uninstallLaunchd() {
  const path = launchdPlistPath();
  spawnSync('launchctl', ['bootout', `gui/${userInfo().uid}/${SERVICE_ID}`], { stdio: 'ignore' });
  if (existsSync(path)) unlinkSync(path);
}

// --- systemd user ---
function systemdPaths() {
  const base = join(homedir(), '.config', 'systemd', 'user');
  return {
    base,
    servicePath: join(base, `${SERVICE_ID}.service`),
    timerPath: join(base, `${SERVICE_ID}.timer`),
  };
}

function installSystemd(intervalMinutes) {
  const { node, script } = tickCommand();
  const { base, servicePath, timerPath } = systemdPaths();
  mkdirSync(base, { recursive: true });
  const service = `[Unit]
Description=Linked API linkedin-growth tick

[Service]
Type=oneshot
Environment=PATH=${jobPath()}
ExecStart=${node} ${script}
StandardOutput=append:${join(logsDir(), 'tick.stdout.log')}
StandardError=append:${join(logsDir(), 'tick.stderr.log')}
`;
  const timer = `[Unit]
Description=Linked API linkedin-growth tick timer

[Timer]
OnBootSec=1min
OnUnitActiveSec=${intervalMinutes}min
Persistent=true
Unit=${SERVICE_ID}.service

[Install]
WantedBy=timers.target
`;
  writeFileSync(servicePath, service);
  writeFileSync(timerPath, timer);
  spawnSync('systemctl', ['--user', 'daemon-reload'], { stdio: 'inherit' });
  const r = spawnSync('systemctl', ['--user', 'enable', '--now', `${SERVICE_ID}.timer`], {
    stdio: 'inherit',
  });
  if (r.status !== 0) throw new Error('systemctl --user enable failed');
}

function uninstallSystemd() {
  const { servicePath, timerPath } = systemdPaths();
  spawnSync('systemctl', ['--user', 'disable', '--now', `${SERVICE_ID}.timer`], { stdio: 'ignore' });
  if (existsSync(timerPath)) unlinkSync(timerPath);
  if (existsSync(servicePath)) unlinkSync(servicePath);
  spawnSync('systemctl', ['--user', 'daemon-reload'], { stdio: 'ignore' });
}

// --- cron fallback ---
function currentCrontab() {
  const r = spawnSync('crontab', ['-l'], { stdio: 'pipe' });
  return r.status === 0 ? r.stdout.toString() : '';
}

function installCron(intervalMinutes) {
  const { node, script } = tickCommand();
  const existing = currentCrontab()
    .split('\n')
    .filter((l) => !l.includes(SERVICE_ID))
    .filter((l) => l.length > 0);
  const minutes = intervalMinutes === 1 ? '*' : `*/${intervalMinutes}`;
  // PATH is set inline so the spawned `linkedin` binary is found (cron's default PATH is minimal).
  const line = `${minutes} * * * * PATH="${jobPath()}" ${node} ${script} >> ${join(logsDir(), 'tick.cron.log')} 2>&1 # ${SERVICE_ID}`;
  const next = [...existing, line, ''].join('\n');
  const r = spawnSync('crontab', ['-'], { input: next, stdio: ['pipe', 'inherit', 'inherit'] });
  if (r.status !== 0) throw new Error('crontab update failed');
}

function uninstallCron() {
  const next = currentCrontab()
    .split('\n')
    .filter((l) => !l.includes(SERVICE_ID))
    .join('\n');
  spawnSync('crontab', ['-'], { input: next, stdio: ['pipe', 'inherit', 'inherit'] });
}

// --- Windows schtasks ---
function installSchtasks(intervalMinutes) {
  const { node, script } = tickCommand();
  spawnSync('schtasks', ['/Delete', '/F', '/TN', SERVICE_ID], { stdio: 'ignore' });
  const r = spawnSync(
    'schtasks',
    [
      '/Create',
      '/SC', 'MINUTE',
      '/MO', String(intervalMinutes),
      '/TN', SERVICE_ID,
      '/TR', `"${node}" "${script}"`,
      '/F',
    ],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) throw new Error('schtasks /Create failed');
}

function uninstallSchtasks() {
  spawnSync('schtasks', ['/Delete', '/F', '/TN', SERVICE_ID], { stdio: 'inherit' });
}
