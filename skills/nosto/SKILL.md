---
name: nosto
description: Nosto frontend JavaScript SDK and `@nosto/nosto-js` package — initialization, session events (viewProduct, viewCategory, viewCart, viewSearch, addOrder), recommendation placements, cart and customer tracking, search, and SPA/React integration. Use when implementing or debugging Nosto on a storefront, integrating product recommendations, sending Nosto events, wiring Nosto into a React/Next.js/headless app, or working with the `nostojs` global, the `@nosto/nosto-js` npm package, or `@nosto/nosto-react`. Triggers on mentions of Nosto, `nostojs`, `nosto-js`, Nosto recommendations, Nosto placements, or Nosto session API.
license: MIT
metadata:
  author: community
  version: "1.0.0"
---

# Nosto Frontend JS APIs

Reference for integrating Nosto's frontend JavaScript SDK on a storefront. Covers the legacy `nostojs` global, the modern `@nosto/nosto-js` npm package, the `@nosto/nosto-react` provider, and the underlying session/recommendation APIs.

## When to Apply

- Adding Nosto to a Shopify, BigCommerce, Magento, or custom storefront
- Migrating from Page Tagging to the Session API (SPA/headless)
- Sending Nosto events (`viewProduct`, `viewCategory`, `viewCart`, `viewSearch`, `addOrder`)
- Rendering recommendation placements and attributing add-to-cart events
- Wiring Nosto into React/Next.js with `@nosto/nosto-react`
- Implementing GDPR/cookie-consent gating around the Nosto loader
- Debugging empty placements, double-tracking, or broken attribution

## Two Integration Modes — Pick One Per Page

| Mode | Use it when | Key calls |
|---|---|---|
| **Page Tagging** | Server-rendered storefront with `<div class="nosto_*">` tags in the DOM | The script auto-reads tagging; `api.customer(...)`, `api.resendCartTagging()` |
| **Session API** | SPA, headless, or any app where you build state imperatively per route | `api.defaultSession().viewX(...).setPlacements([...]).load()` |

**Never mix both on the same page** — produces double-tracked sessions or empty placements. See `references/patterns-gotchas.md`.

## Quick Reference

### 1. Load the script

Modern (recommended):

```ts
import { init, nostojs } from "@nosto/nosto-js";
await init({ merchantId: "shopify-12345" });
```

Legacy embed (when modifying a theme directly):

```html
<script>
  (function(){var n="nostojs";window[n]=window[n]||function(c){
    (window[n].q=window[n].q||[]).push(c);};})();
</script>
<script src="https://connect.nosto.com/include/shopify-12345" async></script>
```

Full loader patterns, custom script loaders, Shopify International, and consent-gated loading: `references/initialization.md`.

### 2. Session API — every route change

```js
nostojs(api =>
  api.defaultSession()
     .viewProduct("product-id")
     .setPlacements(["productpage-nosto-1", "productpage-nosto-2"])
     .load()
     .then(res => console.log(res.recommendations))
);
```

Replace `viewProduct` with the page-type method:

| Page | Method |
|---|---|
| Front page | `viewFrontPage()` |
| Category | `viewCategory("/path")` |
| Product | `viewProduct(productId)` |
| Cart | `viewCart()` |
| Search | `viewSearch(query)` |
| 404 / content / account | `viewOther()` |

Full session chain, `setCustomer`, `addOrder`, dynamic filtering, and recommendation callbacks: `references/session-events.md` and `references/recommendations.md`.

### 3. Order tracking — once on the confirmation page

```js
nostojs(api =>
  api.defaultSession()
    .addOrder({
      external_order_ref: "145000006",
      info: { order_number: "195", email: "buyer@example.com",
              first_name: "X", last_name: "Y", type: "order", newsletter: true },
      items: [{ product_id: "406", sku_id: "243", name: "Item",
                quantity: 1, unit_price: 49.5, price_currency_code: "USD" }]
    })
    .setPlacements(["order-related"])
    .load()
);
```

Idempotency relies on `external_order_ref`. Full schema in `references/session-events.md`.

### 4. Add-to-cart attribution

```js
nostojs(api => api.recommendedProductAddedToCart(productId, "nosto-categorypage-1"));
```

Records *attribution only*. Cart contents must also be updated (Page Tagging: `api.resendCartTagging()`; Session API: re-call `viewCart()` or include the new cart in the next session).

### 5. React / Next.js

```tsx
import { NostoProvider, NostoSession } from "@nosto/nosto-react";

<NostoProvider account="shopify-12345">
  <NostoSession cart={cart} customer={user} />
  <Routes />
</NostoProvider>
```

Routing patterns and SPA pitfalls: `references/patterns-gotchas.md`.

## References (load on demand)

- `references/initialization.md` — loaders, `init()` options, consent gating, debug mode
- `references/session-events.md` — full `defaultSession` chain, every `view*`, `addOrder`, `setCustomer`, cart updates
- `references/recommendations.md` — `setPlacements`, `loadRecommendations`, `createRecommendationRequest`, dynamic filtering, prerender/postrender callbacks
- `references/customer-search-experiments.md` — customer identification, GraphQL search, A/B testing surfaces
- `references/patterns-gotchas.md` — SPA integration, multi-store, GDPR, common bugs (double-tracking, missing attribution, PII in `customer_reference`)

## TypeScript Module Map

The `@nosto/nosto-js` typedoc lives at <https://nosto.github.io/nosto-js/modules.html> and exposes two top-level modules:

- `core` — `init`, `nostojs`, `isNostoLoaded`, `getSettings`, `getNostoWindow`, `addSkuToCart`, types `InitProps`, `Settings`, `BackendEnvironment`, `ScriptLoadOptions`
- `client` — the runtime API surface: `API`, `Session`, `Cart`, `Order`, `Customer`, `Product`, `JSONProduct`, `SearchQuery`, `SearchResult`, `ABTest`, `Experiment`, `RenderMode`, `InsertMode`, etc.

When writing TypeScript, import types from `@nosto/nosto-js/client` for runtime shapes and from `@nosto/nosto-js` for `init`/`nostojs`.

## Authoritative Sources

- Tech docs: <https://docs.nosto.com/techdocs>
- JS APIs: <https://docs.nosto.com/techdocs/apis/frontend/js-apis>
- Typedoc: <https://nosto.github.io/nosto-js/modules.html>
- Source: <https://github.com/Nosto/nosto-js>
