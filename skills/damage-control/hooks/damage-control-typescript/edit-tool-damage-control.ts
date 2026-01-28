/**
 * Claude Code Edit Tool Damage Control
 * =====================================
 *
 * Blocks edits to protected files via PreToolUse hook on Edit tool.
 * Loads protectedPaths from patterns.yaml.
 *
 * Requires: bun add yaml
 *
 * Exit codes:
 *   0 = Allow edit
 *   2 = Block edit (stderr fed back to Claude)
 */

import { existsSync, readFileSync } from "fs";
import { dirname, join, basename } from "path";
import { homedir } from "os";
import { parse as parseYaml } from "yaml";

interface Config {
  zeroAccessPaths: string[];
  readOnlyPaths: string[];
}

function isGlobPattern(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?') || pattern.includes('[');
}

function matchGlob(str: string, pattern: string): boolean {
  // Convert glob pattern to regex (case-insensitive for security)
  const regexPattern = pattern.toLowerCase()
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // Escape special regex chars
    .replace(/\*/g, '.*')                   // * matches anything
    .replace(/\?/g, '.');                   // ? matches single char

  try {
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(str.toLowerCase());
  } catch {
    return false;
  }
}

function matchPath(filePath: string, pattern: string): boolean {
  const expandedPattern = pattern.replace(/^~/, homedir());
  const normalized = filePath.replace(/^~/, homedir());

  if (isGlobPattern(pattern)) {
    // Glob pattern matching (case-insensitive for security)
    const fileBasename = basename(normalized);
    if (matchGlob(fileBasename, expandedPattern) || matchGlob(fileBasename, pattern)) {
      return true;
    }
    // Also try full path match
    if (matchGlob(normalized, expandedPattern)) {
      return true;
    }
    return false;
  } else {
    // Prefix matching (original behavior for directories)
    if (normalized.startsWith(expandedPattern) || normalized === expandedPattern.replace(/\/$/, "")) {
      return true;
    }
    return false;
  }
}

interface HookInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
  };
}

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
    return { zeroAccessPaths: [], readOnlyPaths: [] };
  }

  const content = readFileSync(configPath, "utf-8");
  const config = parseYaml(content) as Partial<Config>;

  return {
    zeroAccessPaths: config.zeroAccessPaths || [],
    readOnlyPaths: config.readOnlyPaths || [],
  };
}

function checkPath(filePath: string, config: Config): { blocked: boolean; reason: string } {
  // Check zero-access paths first
  for (const zeroPath of config.zeroAccessPaths) {
    if (matchPath(filePath, zeroPath)) {
      return { blocked: true, reason: `zero-access path ${zeroPath} (no operations allowed)` };
    }
  }

  // Check read-only paths
  for (const readonlyPath of config.readOnlyPaths) {
    if (matchPath(filePath, readonlyPath)) {
      return { blocked: true, reason: `read-only path ${readonlyPath}` };
    }
  }

  return { blocked: false, reason: "" };
}

async function main(): Promise<void> {
  const config = loadConfig();

  let inputText = "";
  for await (const chunk of Bun.stdin.stream()) {
    inputText += new TextDecoder().decode(chunk);
  }

  let input: HookInput;
  try {
    input = JSON.parse(inputText);
  } catch (e) {
    console.error(`Error: Invalid JSON input: ${e}`);
    process.exit(1);
  }

  // Only check Edit tool
  if (input.tool_name !== "Edit") {
    process.exit(0);
  }

  const filePath = input.tool_input?.file_path || "";
  if (!filePath) {
    process.exit(0);
  }

  const { blocked, reason } = checkPath(filePath, config);
  if (blocked) {
    console.error(`SECURITY: Blocked edit to ${reason}: ${filePath}`);
    process.exit(2);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(`Hook error: ${e}`);
  process.exit(0);
});
