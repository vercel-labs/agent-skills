/**
 * Damage Control Test Runner - Bun/TypeScript
 * ============================================
 *
 * Tests damage control hooks via CLI or interactive mode.
 *
 * Usage:
 *   # Interactive mode - test Bash, Edit, Write hooks interactively
 *   bun run test-damage-control.ts -i
 *   bun run test-damage-control.ts --interactive
 *
 *   # CLI mode - test a single command
 *   bun run test-damage-control.ts <hook> <tool_name> <command_or_path> [--expect-blocked|--expect-allowed]
 *
 * Examples:
 *   # Interactive mode
 *   bun run test-damage-control.ts -i
 *
 *   # Test bash hook blocks rm -rf
 *   bun run test-damage-control.ts bash Bash "rm -rf /tmp" --expect-blocked
 *
 *   # Test edit hook blocks zero-access path
 *   bun run test-damage-control.ts edit Edit "~/.ssh/id_rsa" --expect-blocked
 *
 *   # Test bash allows safe command
 *   bun run test-damage-control.ts bash Bash "ls -la" --expect-allowed
 *
 * Exit codes:
 *   0 = Test passed (expectation matched)
 *   1 = Test failed (expectation not matched)
 */

import { spawn } from "bun";
import { dirname, join } from "path";
import { homedir } from "os";
import { existsSync, readFileSync } from "fs";
import { parse as parseYaml } from "yaml";
import { createInterface } from "readline";

// Import patterns from bash-tool-damage-control.ts
// We re-define them here since TypeScript imports are compile-time
type PatternTuple = [string, string];

const WRITE_PATTERNS: PatternTuple[] = [
  [">\\s*{path}", "write"],
  ["\\btee\\s+(?!.*-a).*{path}", "write"],
];

const APPEND_PATTERNS: PatternTuple[] = [
  [">>\\s*{path}", "append"],
  ["\\btee\\s+-a\\s+.*{path}", "append"],
  ["\\btee\\s+.*-a.*{path}", "append"],
];

const EDIT_PATTERNS: PatternTuple[] = [
  ["\\bsed\\s+-i.*{path}", "edit"],
  ["\\bperl\\s+-[^\\s]*i.*{path}", "edit"],
  ["\\bawk\\s+-i\\s+inplace.*{path}", "edit"],
];

const MOVE_COPY_PATTERNS: PatternTuple[] = [
  ["\\bmv\\s+.*\\s+{path}", "move"],
  ["\\bcp\\s+.*\\s+{path}", "copy"],
];

const DELETE_PATTERNS: PatternTuple[] = [
  ["\\brm\\s+.*{path}", "delete"],
  ["\\bunlink\\s+.*{path}", "delete"],
  ["\\brmdir\\s+.*{path}", "delete"],
  ["\\bshred\\s+.*{path}", "delete"],
];

const PERMISSION_PATTERNS: PatternTuple[] = [
  ["\\bchmod\\s+.*{path}", "chmod"],
  ["\\bchown\\s+.*{path}", "chown"],
  ["\\bchgrp\\s+.*{path}", "chgrp"],
];

const TRUNCATE_PATTERNS: PatternTuple[] = [
  ["\\btruncate\\s+.*{path}", "truncate"],
  [":\\s*>\\s*{path}", "truncate"],
];

const READ_ONLY_BLOCKED: PatternTuple[] = [
  ...WRITE_PATTERNS,
  ...APPEND_PATTERNS,
  ...EDIT_PATTERNS,
  ...MOVE_COPY_PATTERNS,
  ...DELETE_PATTERNS,
  ...PERMISSION_PATTERNS,
  ...TRUNCATE_PATTERNS,
];

const NO_DELETE_BLOCKED: PatternTuple[] = DELETE_PATTERNS;

// =============================================================================
// TYPES
// =============================================================================

interface Pattern {
  pattern: string;
  reason: string;
}

interface Config {
  bashToolPatterns: Pattern[];
  zeroAccessPaths: string[];
  readOnlyPaths: string[];
  noDeletePaths: string[];
}

// =============================================================================
// CONFIG LOADING
// =============================================================================

function getScriptDir(): string {
  return dirname(Bun.main);
}

function getConfigPath(): string {
  const scriptDir = getScriptDir();

  // 1. Check script's own directory (installed location)
  const localConfig = join(scriptDir, "patterns.yaml");
  if (existsSync(localConfig)) {
    return localConfig;
  }

  // 2. Check skill root directory (development location)
  const skillRoot = join(scriptDir, "..", "..", "patterns.yaml");
  if (existsSync(skillRoot)) {
    return skillRoot;
  }

  return localConfig; // Default, even if it doesn't exist
}

function loadConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return { bashToolPatterns: [], zeroAccessPaths: [], readOnlyPaths: [], noDeletePaths: [] };
  }

  const content = readFileSync(configPath, "utf-8");
  const config = parseYaml(content) as Partial<Config>;

  return {
    bashToolPatterns: config.bashToolPatterns || [],
    zeroAccessPaths: config.zeroAccessPaths || [],
    readOnlyPaths: config.readOnlyPaths || [],
    noDeletePaths: config.noDeletePaths || [],
  };
}

// =============================================================================
// DIRECT CHECKING (for interactive mode)
// =============================================================================

function checkBashCommand(command: string, config: Config): { blocked: boolean; reasons: string[] } {
  const reasons: string[] = [];

  // 1. Check bashToolPatterns
  for (const { pattern, reason } of config.bashToolPatterns) {
    try {
      const regex = new RegExp(pattern, "i");
      if (regex.test(command)) {
        reasons.push(reason);
      }
    } catch {
      continue;
    }
  }

  // 2. Check zeroAccessPaths (any access blocked)
  for (const zeroPath of config.zeroAccessPaths) {
    const expanded = zeroPath.replace(/^~/, homedir());
    const escaped = expanded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      const regex = new RegExp(escaped);
      if (regex.test(command)) {
        reasons.push(`zero-access path: ${zeroPath}`);
      }
    } catch {
      continue;
    }
  }

  // 3. Check readOnlyPaths (modifications blocked)
  for (const readonly of config.readOnlyPaths) {
    const expanded = readonly.replace(/^~/, homedir());
    const escaped = expanded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const [patternTemplate, operation] of READ_ONLY_BLOCKED) {
      const pattern = patternTemplate.replace("{path}", escaped);
      try {
        const regex = new RegExp(pattern);
        if (regex.test(command)) {
          reasons.push(`${operation} on read-only path: ${readonly}`);
        }
      } catch {
        continue;
      }
    }
  }

  // 4. Check noDeletePaths (deletions blocked)
  for (const noDelete of config.noDeletePaths) {
    const expanded = noDelete.replace(/^~/, homedir());
    const escaped = expanded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const [patternTemplate, operation] of NO_DELETE_BLOCKED) {
      const pattern = patternTemplate.replace("{path}", escaped);
      try {
        const regex = new RegExp(pattern);
        if (regex.test(command)) {
          reasons.push(`${operation} on no-delete path: ${noDelete}`);
        }
      } catch {
        continue;
      }
    }
  }

  return { blocked: reasons.length > 0, reasons };
}

function checkFilePath(filePath: string, config: Config): { blocked: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const normalized = filePath.replace(/^~/, homedir());

  // Check zeroAccessPaths
  for (const zeroPath of config.zeroAccessPaths) {
    const expanded = zeroPath.replace(/^~/, homedir());
    if (normalized.startsWith(expanded) || normalized === expanded.replace(/\/$/, "")) {
      reasons.push(`zero-access path: ${zeroPath}`);
    }
  }

  // Check readOnlyPaths
  for (const readonly of config.readOnlyPaths) {
    const expanded = readonly.replace(/^~/, homedir());
    if (normalized.startsWith(expanded) || normalized === expanded.replace(/\/$/, "")) {
      reasons.push(`read-only path: ${readonly}`);
    }
  }

  return { blocked: reasons.length > 0, reasons };
}

// =============================================================================
// INTERACTIVE MODE
// =============================================================================

function printBanner(): void {
  console.log("\n" + "=".repeat(60));
  console.log("  Damage Control Interactive Tester");
  console.log("=".repeat(60));
  console.log("  Test commands and paths against security patterns.");
  console.log("  Type 'quit' or 'q' to exit.");
  console.log("=".repeat(60) + "\n");
}

async function prompt(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function promptToolSelection(rl: ReturnType<typeof createInterface>): Promise<string | null> {
  console.log("Select tool to test:");
  console.log("  [1] Bash  - Test shell commands");
  console.log("  [2] Edit  - Test file paths for edit operations");
  console.log("  [3] Write - Test file paths for write operations");
  console.log("  [q] Quit");
  console.log();

  while (true) {
    const choice = (await prompt(rl, "Tool [1/2/3/q]> ")).trim().toLowerCase();

    if (choice === "q" || choice === "quit") {
      return null;
    } else if (choice === "1" || choice === "bash") {
      return "Bash";
    } else if (choice === "2" || choice === "edit") {
      return "Edit";
    } else if (choice === "3" || choice === "write") {
      return "Write";
    } else {
      console.log("Invalid choice. Enter 1, 2, 3, or q.");
    }
  }
}

async function runInteractiveMode(): Promise<void> {
  const config = loadConfig();
  printBanner();

  // Show loaded config summary
  const bashPatterns = config.bashToolPatterns.length;
  const zeroPaths = config.zeroAccessPaths.length;
  const readonlyPaths = config.readOnlyPaths.length;
  const nodeletePaths = config.noDeletePaths.length;
  console.log(`Loaded: ${bashPatterns} bash patterns, ${zeroPaths} zero-access, ${readonlyPaths} read-only, ${nodeletePaths} no-delete paths\n`);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      const tool = await promptToolSelection(rl);
      if (tool === null) {
        console.log("\nGoodbye!");
        break;
      }

      console.log();
      const promptText = tool === "Bash" ? "Command> " : "Path> ";

      const userInput = (await prompt(rl, promptText)).trim();

      if (!userInput || userInput.toLowerCase() === "q" || userInput.toLowerCase() === "quit") {
        console.log("\nGoodbye!");
        break;
      }

      // Test the input
      let blocked: boolean;
      let reasons: string[];

      if (tool === "Bash") {
        const result = checkBashCommand(userInput, config);
        blocked = result.blocked;
        reasons = result.reasons;
      } else {
        const result = checkFilePath(userInput, config);
        blocked = result.blocked;
        reasons = result.reasons;
      }

      // Print result
      console.log();
      if (blocked) {
        console.log(`\x1b[91mBLOCKED\x1b[0m - ${reasons.length} pattern(s) matched:`);
        for (const reason of reasons) {
          console.log(`   - ${reason}`);
        }
      } else {
        console.log(`\x1b[92mALLOWED\x1b[0m - No dangerous patterns matched`);
      }
      console.log();
    }
  } finally {
    rl.close();
  }
}

// =============================================================================
// CLI MODE HELPERS
// =============================================================================

function getHookPath(hookType: string): string {
  const hooks: Record<string, string> = {
    bash: "bash-tool-damage-control.ts",
    edit: "edit-tool-damage-control.ts",
    write: "write-tool-damage-control.ts",
  };

  if (!(hookType in hooks)) {
    console.error(`Error: Unknown hook type '${hookType}'. Use: ${Object.keys(hooks).join(", ")}`);
    process.exit(1);
  }

  return join(getScriptDir(), hooks[hookType]);
}

function buildToolInput(toolName: string, value: string): Record<string, string> {
  if (toolName === "Bash") {
    return { command: value };
  } else if (toolName === "Edit" || toolName === "Write") {
    // Expand ~ for paths
    const expanded = value.replace(/^~/, homedir());
    return { file_path: expanded };
  }
  return { command: value };
}

async function runTest(
  hookType: string,
  toolName: string,
  value: string,
  expectation: string
): Promise<boolean> {
  const hookPath = getHookPath(hookType);
  const toolInput = buildToolInput(toolName, value);

  const inputJson = JSON.stringify({
    tool_name: toolName,
    tool_input: toolInput,
  });

  try {
    const proc = spawn({
      cmd: ["bun", "run", hookPath],
      stdin: new Response(inputJson),
      stdout: "pipe",
      stderr: "pipe",
    });

    // Wait for completion
    const exitCode = await proc.exited;
    const stderrText = await new Response(proc.stderr).text();

    // Handle PreToolUse hooks (exit code based)
    const blocked = exitCode === 2;
    const expectBlocked = expectation === "blocked";
    const passed = blocked === expectBlocked;

    const expected = expectBlocked ? "BLOCKED" : "ALLOWED";
    const actual = blocked ? "BLOCKED" : "ALLOWED";

    if (passed) {
      console.log(`PASS: ${expected} - ${value}`);
    } else {
      console.log(`FAIL: Expected ${expected}, got ${actual} - ${value}`);
      if (stderrText) {
        console.log(`  stderr: ${stderrText.slice(0, 200)}`);
      }
    }

    return passed;
  } catch (e) {
    console.error(`ERROR: ${e}`);
    return false;
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Check for interactive mode
  if (args.length >= 1 && (args[0] === "-i" || args[0] === "--interactive")) {
    await runInteractiveMode();
    process.exit(0);
  }

  // CLI mode requires at least 3 args
  if (args.length < 3) {
    console.log(`
Damage Control Test Runner - Bun/TypeScript

Usage:
  # Interactive mode
  bun run test-damage-control.ts -i
  bun run test-damage-control.ts --interactive

  # CLI mode
  bun run test-damage-control.ts <hook> <tool_name> <command_or_path> [--expect-blocked|--expect-allowed]

Examples:
  bun run test-damage-control.ts -i
  bun run test-damage-control.ts bash Bash "rm -rf /tmp" --expect-blocked
  bun run test-damage-control.ts edit Edit "~/.ssh/id_rsa" --expect-blocked
  bun run test-damage-control.ts bash Bash "ls -la" --expect-allowed
`);
    process.exit(1);
  }

  const hookType = args[0].toLowerCase();
  const toolName = args[1];
  const value = args[2];

  // Default expectation
  let expectation = "blocked";

  if (args.length > 3) {
    const flag = args[3].toLowerCase();
    if (flag === "--expect-allowed") {
      expectation = "allowed";
    } else if (flag === "--expect-blocked") {
      expectation = "blocked";
    }
  }

  const passed = await runTest(hookType, toolName, value, expectation);
  process.exit(passed ? 0 : 1);
}

main();
