// Shared scanner + sanitizer helpers. Keep tiny — add only when duplicated 3+ times.

// 1-based line number of `idx` in a multi-line string.
export function lineOf(text, idx) {
  return text.slice(0, idx).split('\n').length;
}

export function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// `slow_route:/api/products` → `/api/products`.
export function extractRoute(rec) {
  if (typeof rec?.candidateRef !== 'string') return null;
  const m = rec.candidateRef.match(/^[^:]+:(.+)$/);
  return m ? m[1] : null;
}

// Cross-platform path helpers for consistent scoping and output.
// All emitted paths in signals (files[].path, routes[].file, workspacePackages[].dir, etc)
// MUST use POSIX separators so route globs, SKIP logic, matchers, and verifiers
// (which assume /) behave identically on Windows and Unix.
// Using platform path.relative/join is fine internally; normalize on boundary.
export function toPosixPath(p) {
  return String(p ?? '').replace(/\\/g, '/');
}

export function pathSegments(p) {
  return toPosixPath(p).split('/').filter((seg) => seg.length > 0);
}
