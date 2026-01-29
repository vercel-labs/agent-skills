/**
 * Claude Code Security Firewall - Bun/TypeScript Implementation
 * ==============================================================
 *
 * Blocks dangerous commands before execution via PreToolUse hook.
 * Loads patterns from patterns.yaml for easy customization.
 *
 * Requires: bun add yaml (or npm install yaml)
 *
 * Exit codes:
 *   0 = Allow command (or JSON output with permissionDecision)
 *   2 = Block command (stderr fed back to Claude)
 *
 * JSON output for ask patterns:
 *   {"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask", "permissionDecisionReason": "..."}}
 */

import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { homedir } from "os";
import { parse as parseYaml } from "yaml";

// =============================================================================
// GLOB PATTERN UTILITIES
// =============================================================================

function isGlobPattern(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?') || pattern.includes('[');
}

function globToRegex(globPattern: string): string {
  // Convert glob pattern to regex for matching in commands
  let result = "";
  for (const char of globPattern) {
    if (char === '*') {
      result += '[^\\s/]*';  // Match any chars except whitespace and path sep
    } else if (char === '?') {
      result += '[^\\s/]';   // Match single char except whitespace and path sep
    } else if ('.+^${}()|[]\\'.includes(char)) {
      result += '\\' + char;
    } else {
      result += char;
    }
  }
  return result;
}

// =============================================================================
// OPERATION PATTERNS - Edit these to customize what operations are blocked
// =============================================================================
// {path} will be replaced with the escaped path at runtime

type PatternTuple = [string, string]; // [pattern, operation]

// Operations blocked for READ-ONLY paths (all modifications)
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

// Combined patterns for read-only paths (block ALL modifications)
const READ_ONLY_BLOCKED: PatternTuple[] = [
  ...WRITE_PATTERNS,
  ...APPEND_PATTERNS,
  ...EDIT_PATTERNS,
  ...MOVE_COPY_PATTERNS,
  ...DELETE_PATTERNS,
  ...PERMISSION_PATTERNS,
  ...TRUNCATE_PATTERNS,
];

// Patterns for no-delete paths (block ONLY delete operations)
const NO_DELETE_BLOCKED: PatternTuple[] = DELETE_PATTERNS;

// =============================================================================
// TYPES
// =============================================================================

interface Pattern {
  pattern: string;
  reason: string;
  ask?: boolean;
}

interface Config {
  bashToolPatterns: Pattern[];
  zeroAccessPaths: string[];
  readOnlyPaths: string[];
  noDeletePaths: string[];
}

interface HookInput {
  tool_name: string;
  tool_input: {
    command?: string;
    [key: string]: unknown;
  };
}

// =============================================================================
// CONFIGURATION
// =============================================================================

function getConfigPath(): string {
  // 1. Check project hooks directory (installed location)
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (projectDir) {
    const projectConfig = join(projectDir, ".claude", "hooks", "damage-control", "patterns.yaml");
    if (existsSync(projectConfig)) {
      return projectConfig;
    }
  }

  // 2. Check script's own directory (installed location)
  const scriptDir = dirname(Bun.main);
  const localConfig = join(scriptDir, "patterns.yaml");
  if (existsSync(localConfig)) {
    return localConfig;
  }

  // 3. Check skill root directory (development location)
  const skillRoot = join(scriptDir, "..", "..", "patterns.yaml");
  if (existsSync(skillRoot)) {
    return skillRoot;
  }

  return localConfig; // Default, even if it doesn't exist
}

function loadConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    console.error(`Warning: Config not found at ${configPath}`);
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
// PATH CHECKING
// =============================================================================

function checkPathPatterns(
  command: string,
  path: string,
  patterns: PatternTuple[],
  pathType: string
): { blocked: boolean; reason: string } {
  /**
   * Supports both:
   * - Literal paths: ~/.bashrc, /etc/hosts (prefix matching)
   * - Glob patterns: *.lock, *.md, src/* (glob matching)
   */
  if (isGlobPattern(path)) {
    // Glob pattern - convert to regex for command matching
    const globRegex = globToRegex(path);
    for (const [patternTemplate, operation] of patterns) {
      try {
        // Build a regex that matches: operation ... glob_pattern
        const cmdPrefix = patternTemplate.replace("{path}", "");
        if (cmdPrefix) {
          const regex = new RegExp(cmdPrefix + globRegex, "i");
          if (regex.test(command)) {
            return {
              blocked: true,
              reason: `Blocked: ${operation} operation on ${pathType} ${path}`,
            };
          }
        }
      } catch {
        continue;
      }
    }
  } else {
    // Original literal path matching (prefix-based)
    const expanded = path.replace(/^~/, homedir());
    const escapedExpanded = expanded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const escapedOriginal = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    for (const [patternTemplate, operation] of patterns) {
      // Check both expanded path (/Users/x/.ssh/) and original tilde form (~/.ssh/)
      const patternExpanded = patternTemplate.replace("{path}", escapedExpanded);
      const patternOriginal = patternTemplate.replace("{path}", escapedOriginal);
      try {
        const regexExpanded = new RegExp(patternExpanded);
        const regexOriginal = new RegExp(patternOriginal);
        if (regexExpanded.test(command) || regexOriginal.test(command)) {
          return {
            blocked: true,
            reason: `Blocked: ${operation} operation on ${pathType} ${path}`,
          };
        }
      } catch {
        continue;
      }
    }
  }

  return { blocked: false, reason: "" };
}

function checkCommand(
  command: string,
  config: Config
): { blocked: boolean; ask: boolean; reason: string } {
  // 1. Check against patterns from YAML (may block or ask)
  for (const { pattern, reason, ask: shouldAsk } of config.bashToolPatterns) {
    try {
      const regex = new RegExp(pattern, "i");
      if (regex.test(command)) {
        if (shouldAsk) {
          return { blocked: false, ask: true, reason }; // Ask for confirmation
        } else {
          return { blocked: true, ask: false, reason: `Blocked: ${reason}` }; // Block
        }
      }
    } catch {
      continue;
    }
  }

  // 2. Check for ANY access to zero-access paths (including reads)
  for (const zeroPath of config.zeroAccessPaths) {
    if (isGlobPattern(zeroPath)) {
      // Convert glob to regex for command matching
      const globRegex = globToRegex(zeroPath);
      try {
        const regex = new RegExp(globRegex, 'i');
        if (regex.test(command)) {
          return {
            blocked: true,
            ask: false,
            reason: `Blocked: zero-access pattern ${zeroPath} (no operations allowed)`,
          };
        }
      } catch {
        continue;
      }
    } else {
      // Original literal path matching
      const expanded = zeroPath.replace(/^~/, homedir());
      // Check both expanded path (/Users/x/.ssh/) and original tilde form (~/.ssh/)
      if (command.includes(expanded) || command.includes(zeroPath)) {
        return {
          blocked: true,
          ask: false,
          reason: `Blocked: zero-access path ${zeroPath} (no operations allowed)`,
        };
      }
    }
  }

  // 3. Check for modifications to read-only paths (reads allowed)
  for (const readonlyPath of config.readOnlyPaths) {
    const result = checkPathPatterns(command, readonlyPath, READ_ONLY_BLOCKED, "read-only path");
    if (result.blocked) {
      return { ...result, ask: false };
    }
  }

  // 4. Check for deletions on no-delete paths (read/write/edit allowed)
  for (const noDeletePath of config.noDeletePaths) {
    const result = checkPathPatterns(command, noDeletePath, NO_DELETE_BLOCKED, "no-delete path");
    if (result.blocked) {
      return { ...result, ask: false };
    }
  }

  return { blocked: false, ask: false, reason: "" };
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const config = loadConfig();

  // Read stdin
  let inputText = "";
  for await (const chunk of Bun.stdin.stream()) {
    inputText += new TextDecoder().decode(chunk);
  }

  // Parse input
  let input: HookInput;
  try {
    input = JSON.parse(inputText);
  } catch (e) {
    console.error(`Error: Invalid JSON input: ${e}`);
    process.exit(1);
  }

  // Only check Bash commands
  if (input.tool_name !== "Bash") {
    process.exit(0);
  }

  const command = input.tool_input?.command || "";
  if (!command) {
    process.exit(0);
  }

  // Check the command
  const { blocked, ask, reason } = checkCommand(command, config);

  if (blocked) {
    console.error(`SECURITY: ${reason}`);
    console.error(
      `Command: ${command.slice(0, 100)}${command.length > 100 ? "..." : ""}`
    );
    process.exit(2);
  } else if (ask) {
    // Output JSON to trigger confirmation dialog
    const output = {
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: reason,
      },
    };
    console.log(JSON.stringify(output));
    process.exit(0);
  } else {
    process.exit(0);
  }
}

main().catch((e) => {
  console.error(`Hook error: ${e}`);
  process.exit(0); // Fail open
});
