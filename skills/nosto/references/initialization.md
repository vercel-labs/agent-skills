# Nosto — Initialization & Loading

## Modern: `@nosto/nosto-js`

```bash
npm install @nosto/nosto-js
```

```ts
import { init, nostojs, isNostoLoaded, getSettings } from "@nosto/nosto-js";

await init({
  merchantId: "shopify-12345",
  // Optional fields below
  env: "production",                              // BackendEnvironment
  options: { /* ScriptLoadOptions */ },           // forwarded to script loader
  scriptLoader: (src, opts) => myCustomLoader(src),
  shopifyInternational: { language: "en", marketId: 1 },
});

// Run code once the client API is ready (callback is queued if init is still loading):
nostojs(async api => {
  console.log(isNostoLoaded(), getSettings());
});
```

`init()` resolves once the embed script has loaded. `nostojs(cb)` queues `cb` if the script isn't ready yet, then runs it with the `client.API` object.

### `InitProps` (key fields)

| Field | Type | Purpose |
|---|---|---|
| `merchantId` | `string` | Account ID from Nosto admin, e.g. `shopify-12345` |
| `env` | `"production" \| "staging"` | Backend environment |
| `options` | `ScriptLoadOptions` | Forwarded to the script loader (CSP nonce, attributes) |
| `scriptLoader` | `(src, opts) => Promise<void>` | Override default loader (use for nonces, custom CDNs) |
| `shopifyInternational` | `{ language, marketId }` | Shopify Markets multi-market resolution |

## Legacy: embed `<script>` + stub

Use when modifying a theme directly (no bundler):

```html
<!-- Stub: queues nostojs() calls until script loads -->
<script>
  (function() {
    var name = "nostojs";
    window[name] = window[name] || function(cb) {
      (window[name].q = window[name].q || []).push(cb);
    };
  })();
</script>

<!-- Optional: pre-script configuration -->
<script>
  nostojs(api => api.setAutoLoad(false));
</script>

<!-- The Nosto client script -->
<script src="https://connect.nosto.com/include/shopify-12345" async></script>
```

The stub MUST come before the async script so that any pre-script `nostojs(...)` calls survive. Don't call `window.nosto.*` directly — those are internals and can change between releases.

## Cookie consent / GDPR

Three valid patterns, in order of preference:

### 1. Don't load Nosto until consent

The cleanest option — the embed script never runs, no `2c.cId` cookie is set.

```ts
if (cookieConsent.marketing) {
  await init({ merchantId: "shopify-12345" });
}
```

### 2. Load with tracking disabled, enable on consent

Use when the script must load early (e.g. for non-tracking features) but tracking gates on consent:

```js
nostojs(api => api.visit.setDoNotTrack(true));

// Later, after the visitor accepts marketing cookies:
cookieConsent.on("accept", () => {
  nostojs(api => api.visit.setDoNotTrack(false));
});
```

`setDoNotTrack(true)` BEFORE any tracking call prevents the visitor cookie from being set. Toggling later does not retroactively delete an already-set cookie.

### 3. Per-event opt-out via `marketing_permission` / `newsletter`

For triggered email/push, the visitor must have consented. Pass `marketing_permission: true` on `customer()` or `setCustomer()`, and `newsletter: true` inside `addOrder().info`. Without these flags, Nosto treats the contact as opted-out for triggered messages even if the cookie is set.

## Auto-load control

By default, the client auto-fires the recommendation request after DOMContentLoaded. To take manual control:

```js
nostojs(api => api.setAutoLoad(false));

// Later, when the DOM and session are ready:
nostojs(api => api.load());
```

Use this for SPAs, deferred hydration, or when the cart/customer data is fetched async.

## Debug toolbar

Append `?nostodebug=true` to any storefront URL (use an incognito window). The toolbar shows fired events, resolved placements, segments, A/B variations, and tagging detection. Use this to verify integrations before going live.

## Multi-store

One Nosto implementation per store. Account IDs are platform-prefixed (`shopify-12345`, `bigcommerce-67890`). For Shopify Markets, pass `shopifyInternational: { language, marketId }` so Nosto resolves the correct market catalog.
