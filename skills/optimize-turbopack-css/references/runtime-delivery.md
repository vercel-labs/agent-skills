# Runtime CSS delivery

Use more than one measurement plane. Turbopack can repartition assets or ask the
browser to preload component-graph CSS without adding a persistent stylesheet
node.

## Measurement planes

| Plane | What it answers | Preferred source |
| --- | --- | --- |
| Generated inventory | How much CSS did the build emit? | Unique files under `.next/static` |
| Manifest attribution | Which files does Next associate with a route? | `entryCSSFiles` in client-reference manifests |
| Applied CSS | Which external stylesheets affect the current document? | `document.styleSheets` |
| Requested CSS | What did the browser actually fetch, including preloads? | Resource Timing or CDP Network events |

Keep these values separate. Asset count and aggregate bytes diagnose the graph;
they are not a route payload. Manifest attribution is useful for budgets but is
not a complete browser network trace.

## Analyze a complete Next build

Preserve the complete `.next` output, including `static/` and `server/app/`,
then run:

```bash
SKILL_DIR="<directory containing the loaded SKILL.md>"
bash "$SKILL_DIR/scripts/audit-css.sh" \
  --next-build turbo=/tmp/next-turbo \
  --next-build webpack=/tmp/next-webpack \
  --json /tmp/css-audit.json
```

The `routeCss` result reports:

- Manifest-attributed CSS per route.
- CSS attributed to non-error entries as `applied`.
- Root or segment error-boundary CSS as `preloadedOnly`.
- Common delivered and common applied sets.
- Inlined manifest entries separately from external asset totals.

`entryCSSFiles` is an internal build artifact and can change between Next.js
patches. If parsing finds no routes, inspect the installed manifest format and
fall back to rendered HTML plus a browser trace.

Turbopack lists CSS cumulatively along the layout chain, while webpack lists it
per module, and from Next.js 16.2 the built-in global-error entry carries the
root layout's CSS. The analyzer unions files per route, skips the built-in
global-error entry, and counts a file as preload-only only when it appears
solely under error boundaries, so cumulative listing does not inflate route
totals. Take the union per route in custom tooling instead of summing entries.

The `documents` result applies the class-name metrics to prerendered HTML and
RSC files under `server/app`, where long CSS Modules class names also repeat.

## Measure a cold browser navigation

Treat the browser pass as a sample and manifest attribution as the complete
route view. Manifests cover every route the build emits, including routes
behind sign-in, without running the app. A browser pass shows only what one
session fetched on the routes it visited. Pick routes that cover each root
layout, the largest manifest-attributed routes, and routes that render CMS or
other runtime content, and record which routes, sessions, and interactions the
pass covered.

Use a production server, disable the browser cache, navigate directly, and wait
for hydration and network idle. Capture all three Resource Timing sizes:

- `decodedBodySize`: uncompressed response body.
- `encodedBodySize`: compressed response body.
- `transferSize`: response body plus protocol/header overhead as exposed by the
  browser.

Example Playwright logic:

```js
const cdp = await page.context().newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
await page.goto(url, { waitUntil: 'networkidle' });

const result = await page.evaluate(() => {
  const requested = performance
    .getEntriesByType('resource')
    .filter((entry) => entry.name.includes('.css'));
  const applied = [...document.styleSheets]
    .map((sheet) => sheet.href)
    .filter(Boolean);

  return {
    applied,
    requested: requested.map((entry) => ({
      url: entry.name,
      decoded: entry.decodedBodySize,
      encoded: entry.encodedBodySize,
      transferred: entry.transferSize,
      initiator: entry.initiatorType
    }))
  };
});
```

Do not rely on the final `<head>` or initial HTML alone. React/Next may create
short-lived preload work that is removed before inspection. Use CDP
`Network.requestWillBeSent` when the initiator or precise timing matters.

A cold navigation measures the initial payload only. CSS that arrives after an
interaction, such as `next/dynamic` components, dialogs, and `<Link>` hovers,
needs its own capture: perform the interaction, read Resource Timing again, and
report the new requests separately from the initial navigation.

## Measure authenticated routes

Sign in with a dedicated test account once in a setup step, save the session,
and start each measurement in a new context that loads it. Every measured route
then begins with a direct, cold navigation instead of a sign-in redirect.

```js
// Setup: complete the app's sign-in flow once.
const setup = await browser.newContext();
const login = await setup.newPage();
// ...sign in...
await setup.storageState({ path: '/tmp/css-audit-session.json' });
await setup.close();

// Measurement: a fresh context per route with the saved session.
const context = await browser.newContext({
  storageState: '/tmp/css-audit-session.json'
});
const page = await context.newPage();
```

- Keep the state file outside the repository and never commit it. It holds
  live session cookies.
- Use a test account, never a real customer account.
- Save one session per role or plan that changes which layouts or components
  render, because each can load different CSS.
- Storage state saves cookies and local storage. Pass `indexedDB: true` to
  `storageState()` (Playwright 1.51 and later) when the app keeps tokens in
  IndexedDB. Session storage is not saved, so apps that keep tokens there must
  sign in on the measurement page and then navigate directly to the measured
  route, which starts a fresh Resource Timing buffer.

Deployment protection is a separate layer from the app's sign-in. When
measuring a protected deployment instead of a local production server, pass the
platform's automation bypass, such as Vercel's `x-vercel-protection-bypass`
header set to the `VERCEL_AUTOMATION_BYPASS_SECRET` value, and still sign in to
the app.

If no test account is available, ask the user for one. Never try to bypass the
app's sign-in. Without an account, rely on manifest attribution for
authenticated routes and report them as not measured in a browser.

## Audit shared client graphs

When successful routes request unrelated CSS, inspect:

1. Root and segment error boundaries.
2. Client providers imported by root layouts.
3. Side-effect imports that register web components.
4. Component barrels imported from universal layouts or fallbacks.
5. Route prefetching and framework fallbacks. Hovering over or prefetching a
   `<Link>` preloads the target route's CSS.

Keep last-resort error UI self-contained. Avoid importing the full design
system, app-wide providers, or shared components when native HTML, a small CSS
Module, and plain text meet the fallback contract.

Global-error, not-found, error, and loading CSS attach to successful routes
under webpack too, and a Next.js maintainer describes the not-found preload as
intentional and non-blocking. Treat those as delivery behavior to measure, not a
Turbopack regression by default. CSS for nested `next/dynamic` components can
load after hydration, so server HTML alone undercounts it.

Move web-component registration and other side-effect client imports to the
nearest layout that owns their content. Verify both route manifests and browser
requests afterward: graph scoping can improve client JavaScript and manifest totals
without removing every transient preload.

## Check inlined CSS

With `experimental.inlineCss`, Turbopack's cumulative manifests can embed the
same stylesheet several times in each prerendered page (open Next.js issues
#98110, #98079, and #95141). Count `<style>` blocks and repeated stylesheet text
in prerendered HTML under `.next/server/app` before and after changes.

## Inspect bundler decisions

On Next.js 16.1 and later, `next experimental-analyze` filters bundle output by
route and CSS type and shows import chains; `--output` writes the analysis to
`.next/diagnostics/analyze`. With `cssChunking: 'graph'` on 16.3 and later, the
undocumented `TURBOPACK_DEBUG_CSS_CHUNKING=1` environment variable writes chunk
groups, global order, and per-module sizes to JSON.

Treat `'graph'` as a trade-off between CSS bytes per route and request count,
not as a selector-size fix, and measure it on rendered routes.

## Interpret changes

- Raw CSS can fall substantially while gzip or Brotli moves only slightly;
  repeated selectors compress well but still cost parse and style-processing
  work.
- Asset count can rise after a successful optimization because Turbopack
  repartitioned the graph. Prioritize unique aggregate bytes, route sets, and
  browser transfer over count alone.
- Long CSS Modules class names inflate raw CSS, HTML, and RSC payloads far more
  than compressed bytes. Check class-name metrics before attributing that
  pattern to selector lowering.
- `oklch()` and `lab()` fallbacks can grow gzip faster than raw bytes, so a
  small raw-versus-gzip gap does not rule out lowering.
- Measure style recalculation cost with the selector statistics in Chrome
  DevTools performance traces when raw CSS changes substantially. Compression
  hides transfer cost, not parse or matching cost.
- Third-party component styles may repeat resets or visibility helpers in each
  component. Treat this as an upstream package floor unless the package owner
  can consolidate it without breaking component isolation.

Use separate CI budgets for generated inventory and manifest-attributed route
sets. Add a browser-network smoke budget only when the route and server
compression are stable enough to make it deterministic.
