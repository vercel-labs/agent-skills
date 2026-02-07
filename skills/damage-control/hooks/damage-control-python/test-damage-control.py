# /// script
# requires-python = ">=3.8"
# dependencies = ["pyyaml"]
# ///
"""
Damage Control Test Runner - Python/UV
=======================================

Tests damage control hooks via CLI or interactive mode.

Usage:
  # Interactive mode - test Bash, Edit, Write hooks interactively
  uv run test-damage-control.py -i
  uv run test-damage-control.py --interactive

  # CLI mode - test a single command
  uv run test-damage-control.py <hook> <tool_name> <command_or_path> [--expect-blocked|--expect-allowed]

Examples:
  # Interactive mode
  uv run test-damage-control.py -i

  # Test bash hook blocks rm -rf
  uv run test-damage-control.py bash Bash "rm -rf /tmp" --expect-blocked

  # Test edit hook blocks zero-access path
  uv run test-damage-control.py edit Edit "~/.ssh/id_rsa" --expect-blocked

  # Test bash allows safe command
  uv run test-damage-control.py bash Bash "ls -la" --expect-allowed

Exit codes:
  0 = Test passed (expectation matched)
  1 = Test failed (expectation not matched)
"""

import subprocess
import json
import sys
import os
import re
from pathlib import Path
from typing import Dict, Any, List, Tuple, Optional

import yaml


# Import patterns and utilities from the bash tool script (avoid duplication)
# Using importlib to import from hyphenated filename
import importlib.util
import fnmatch

spec = importlib.util.spec_from_file_location(
    "bash_tool",
    Path(__file__).parent / "bash-tool-damage-control.py"
)
bash_tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bash_tool)

READ_ONLY_BLOCKED = bash_tool.READ_ONLY_BLOCKED
NO_DELETE_BLOCKED = bash_tool.NO_DELETE_BLOCKED


def is_glob_pattern(pattern: str) -> bool:
    """Check if pattern contains glob wildcards."""
    return '*' in pattern or '?' in pattern or '[' in pattern


def match_path(file_path: str, pattern: str) -> bool:
    """Match file path against pattern, supporting both prefix and glob matching."""
    expanded_pattern = os.path.expanduser(pattern)
    normalized = os.path.normpath(file_path)
    expanded_normalized = os.path.expanduser(normalized)

    if is_glob_pattern(pattern):
        # Glob pattern matching (case-insensitive for security)
        basename = os.path.basename(expanded_normalized)
        basename_lower = basename.lower()
        pattern_lower = pattern.lower()
        expanded_pattern_lower = expanded_pattern.lower()

        # Match against basename for patterns like *.pem, .env*
        if fnmatch.fnmatch(basename_lower, expanded_pattern_lower):
            return True
        if fnmatch.fnmatch(basename_lower, pattern_lower):
            return True
        # Also try full path match for patterns like /path/*.pem
        if fnmatch.fnmatch(expanded_normalized.lower(), expanded_pattern_lower):
            return True
        return False
    else:
        # Prefix matching (original behavior for directories)
        if expanded_normalized.startswith(expanded_pattern) or expanded_normalized == expanded_pattern.rstrip('/'):
            return True
        return False


def glob_to_regex(glob_pattern: str) -> str:
    """Convert a glob pattern to a regex pattern for matching in commands."""
    result = ""
    for char in glob_pattern:
        if char == '*':
            result += r'[^\s/]*'  # Match any chars except whitespace and path sep
        elif char == '?':
            result += r'[^\s/]'   # Match single char except whitespace and path sep
        elif char in r'\.^$+{}[]|()':
            result += '\\' + char
        else:
            result += char
    return result


# ============================================================================
# CONFIG LOADING
# ============================================================================

def get_script_dir() -> Path:
    return Path(__file__).parent


def get_config_path() -> Path:
    """Get path to patterns.yaml, checking multiple locations."""
    script_dir = get_script_dir()

    # 1. Check script's own directory (installed location)
    local_config = script_dir / "patterns.yaml"
    if local_config.exists():
        return local_config

    # 2. Check skill root directory (development location)
    skill_root = script_dir.parent.parent / "patterns.yaml"
    if skill_root.exists():
        return skill_root

    return local_config  # Default, even if it doesn't exist


def load_config() -> Dict[str, Any]:
    """Load patterns from YAML config file."""
    config_path = get_config_path()

    if not config_path.exists():
        return {"bashToolPatterns": [], "zeroAccessPaths": [], "readOnlyPaths": [], "noDeletePaths": []}

    with open(config_path, "r") as f:
        return yaml.safe_load(f) or {}


# ============================================================================
# DIRECT CHECKING (for interactive mode - no subprocess needed)
# ============================================================================

def check_bash_command(command: str, config: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Check bash command against patterns. Returns (blocked, list of reasons)."""
    reasons = []

    # 1. Check bashToolPatterns
    for item in config.get("bashToolPatterns", []):
        pattern = item.get("pattern", "")
        reason = item.get("reason", "Blocked by pattern")
        try:
            if re.search(pattern, command, re.IGNORECASE):
                reasons.append(reason)
        except re.error:
            continue

    # 2. Check zeroAccessPaths (any access blocked) - supports glob patterns
    for zero_path in config.get("zeroAccessPaths", []):
        if is_glob_pattern(zero_path):
            # Convert glob to regex for command matching
            glob_regex = glob_to_regex(zero_path)
            try:
                if re.search(glob_regex, command, re.IGNORECASE):
                    reasons.append(f"zero-access pattern: {zero_path}")
            except re.error:
                continue
        else:
            # Original literal path matching
            expanded = os.path.expanduser(zero_path)
            escaped = re.escape(expanded)
            if re.search(escaped, command) or re.search(re.escape(zero_path), command):
                reasons.append(f"zero-access path: {zero_path}")

    # 3. Check readOnlyPaths (modifications blocked)
    for readonly in config.get("readOnlyPaths", []):
        expanded = os.path.expanduser(readonly)
        escaped = re.escape(expanded)
        for pattern_template, operation in READ_ONLY_BLOCKED:
            pattern = pattern_template.replace("{path}", escaped)
            try:
                if re.search(pattern, command):
                    reasons.append(f"{operation} on read-only path: {readonly}")
            except re.error:
                continue

    # 4. Check noDeletePaths (deletions blocked)
    for no_delete in config.get("noDeletePaths", []):
        expanded = os.path.expanduser(no_delete)
        escaped = re.escape(expanded)
        for pattern_template, operation in NO_DELETE_BLOCKED:
            pattern = pattern_template.replace("{path}", escaped)
            try:
                if re.search(pattern, command):
                    reasons.append(f"{operation} on no-delete path: {no_delete}")
            except re.error:
                continue

    return len(reasons) > 0, reasons


def check_file_path(file_path: str, config: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """Check file path for Edit/Write tools. Returns (blocked, list of reasons)."""
    reasons = []

    # Check zeroAccessPaths - supports glob patterns
    for zero_path in config.get("zeroAccessPaths", []):
        if match_path(file_path, zero_path):
            reasons.append(f"zero-access path: {zero_path}")

    # Check readOnlyPaths - supports glob patterns
    for readonly in config.get("readOnlyPaths", []):
        if match_path(file_path, readonly):
            reasons.append(f"read-only path: {readonly}")

    return len(reasons) > 0, reasons


# ============================================================================
# INTERACTIVE MODE
# ============================================================================

def print_banner():
    """Print interactive mode banner."""
    print("\n" + "=" * 60)
    print("  Damage Control Interactive Tester")
    print("=" * 60)
    print("  Test commands and paths against security patterns.")
    print("  Type 'quit' or 'q' to exit.")
    print("=" * 60 + "\n")


def prompt_tool_selection() -> Optional[str]:
    """Prompt user to select which tool to test."""
    print("Select tool to test:")
    print("  [1] Bash  - Test shell commands")
    print("  [2] Edit  - Test file paths for edit operations")
    print("  [3] Write - Test file paths for write operations")
    print("  [q] Quit")
    print()

    while True:
        choice = input("Tool [1/2/3/q]> ").strip().lower()

        if choice in ('q', 'quit'):
            return None
        elif choice == '1' or choice == 'bash':
            return 'Bash'
        elif choice == '2' or choice == 'edit':
            return 'Edit'
        elif choice == '3' or choice == 'write':
            return 'Write'
        else:
            print("Invalid choice. Enter 1, 2, 3, or q.")


def run_interactive_mode():
    """Run interactive testing mode."""
    config = load_config()
    print_banner()

    # Show loaded config summary
    bash_patterns = len(config.get("bashToolPatterns", []))
    zero_paths = len(config.get("zeroAccessPaths", []))
    readonly_paths = len(config.get("readOnlyPaths", []))
    nodelete_paths = len(config.get("noDeletePaths", []))
    print(f"Loaded: {bash_patterns} bash patterns, {zero_paths} zero-access, {readonly_paths} read-only, {nodelete_paths} no-delete paths\n")

    while True:
        tool = prompt_tool_selection()
        if tool is None:
            print("\nGoodbye!")
            break

        print()
        if tool == 'Bash':
            prompt_text = "Command> "
        else:
            prompt_text = "Path> "

        # Get input
        try:
            user_input = input(prompt_text).strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not user_input or user_input.lower() in ('q', 'quit'):
            print("\nGoodbye!")
            break

        # Test the input
        if tool == 'Bash':
            blocked, reasons = check_bash_command(user_input, config)
        else:
            blocked, reasons = check_file_path(user_input, config)

        # Print result
        print()
        if blocked:
            print(f"\033[91mBLOCKED\033[0m - {len(reasons)} pattern(s) matched:")
            for reason in reasons:
                print(f"   - {reason}")
        else:
            print(f"\033[92mALLOWED\033[0m - No dangerous patterns matched")
        print()


# ============================================================================
# CLI MODE HELPERS
# ============================================================================

def get_hook_path(hook_type: str) -> Path:
    """Get path to hook script."""
    hooks = {
        "bash": "bash-tool-damage-control.py",
        "edit": "edit-tool-damage-control.py",
        "write": "write-tool-damage-control.py",
    }
    if hook_type not in hooks:
        print(f"Error: Unknown hook type '{hook_type}'. Use: {list(hooks.keys())}")
        sys.exit(1)
    return get_script_dir() / hooks[hook_type]


def build_tool_input(tool_name: str, value: str) -> dict:
    """Build tool_input based on tool type."""
    if tool_name == "Bash":
        return {"command": value}
    elif tool_name in ("Edit", "Write"):
        # Expand ~ for paths
        return {"file_path": os.path.expanduser(value)}
    else:
        return {"command": value}


def run_test(hook_type: str, tool_name: str, value: str, expectation: str) -> bool:
    """Run a single test and return True if passed.

    expectation can be: "blocked" or "allowed" (exit code based)
    """
    hook_path = get_hook_path(hook_type)
    tool_input = build_tool_input(tool_name, value)

    input_json = json.dumps({
        "tool_name": tool_name,
        "tool_input": tool_input
    })

    try:
        result = subprocess.run(
            ["uv", "run", str(hook_path)],
            input=input_json,
            capture_output=True,
            text=True,
            timeout=10
        )
        exit_code = result.returncode
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()
    except subprocess.TimeoutExpired:
        print("TIMEOUT")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

    # Handle PreToolUse hooks (exit code based)
    blocked = exit_code == 2
    expect_blocked = expectation == "blocked"
    passed = blocked == expect_blocked

    expected = "BLOCKED" if expect_blocked else "ALLOWED"
    actual = "BLOCKED" if blocked else "ALLOWED"

    if passed:
        print(f"PASS: {expected} - {value}")
    else:
        print(f"FAIL: Expected {expected}, got {actual} - {value}")
        if stderr:
            print(f"  stderr: {stderr[:200]}")

    return passed


def main():
    # Check for interactive mode
    if len(sys.argv) >= 2 and sys.argv[1].lower() in ('-i', '--interactive'):
        run_interactive_mode()
        sys.exit(0)

    # CLI mode requires at least 4 args
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)

    hook_type = sys.argv[1].lower()
    tool_name = sys.argv[2]
    value = sys.argv[3]

    # Default expectation
    expectation = "blocked"

    if len(sys.argv) > 4:
        flag = sys.argv[4].lower()
        if flag == "--expect-allowed":
            expectation = "allowed"
        elif flag == "--expect-blocked":
            expectation = "blocked"

    passed = run_test(hook_type, tool_name, value, expectation)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
