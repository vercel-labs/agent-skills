import { canonicalizeRoute } from '../route-normalize.mjs';

export const FLAGS_ENDPOINT = '/.well-known/vercel/flags';
export const VERCEL_FLAGS_PACKAGES = [
  '@vercel/flags',
  '@vercel/flags/next',
  '@vercel/flags/sveltekit',
  '@vercel/flags/nuxt',
];

export function applyHardGates(candidates, signals = {}) {
  const allowed = [];
  const gated = [];
  for (const candidate of candidates) {
    if (isFlagsEndpointCandidate(candidate)) {
      gated.push({
        ...candidate,
        gatedReason: flagsEndpointReason(signals),
      });
      continue;
    }
    allowed.push(candidate);
  }
  return { allowed, gated };
}

export function isFlagsEndpointCandidate(candidate) {
  if (!candidate || candidate.scope === 'account') return false;
  const route = normalizeRoute(candidate.route);
  return route === FLAGS_ENDPOINT;
}

function normalizeRoute(route) {
  if (typeof route !== 'string') return null;
  const normalized = canonicalizeRoute(route).replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

function flagsEndpointReason(signals) {
  const packages = signals.stack?.vercelFlagsPackages;
  if (Array.isArray(packages) && packages.length > 0) {
    return `hardGated: ${FLAGS_ENDPOINT} is the Vercel Flags endpoint (${packages.join(', ')} detected), not an optimization target`;
  }
  return `hardGated: ${FLAGS_ENDPOINT} is the Vercel Flags endpoint, not an optimization target`;
}
