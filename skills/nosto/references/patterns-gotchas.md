# Nosto — Integration Patterns & Gotchas

## React / Next.js — `@nosto/nosto-react`

```bash
npm install @nosto/nosto-react @nosto/nosto-js
```

```tsx
import { NostoProvider, NostoSession, NostoPlacement } from "@nosto/nosto-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NostoProvider account="shopify-12345">
      {children}
    </NostoProvider>
  );
}
```

Per-page session calls:

```tsx
import { NostoHome, NostoProduct, NostoCategory } from "@nosto/nosto-react";

// Home
<NostoHome placements={["frontpage-nosto-1"]} />

// Product
<NostoProduct product={product.id} placements={["productpage-nosto-1"]} />

// Category
<NostoCategory category="/Women/Dresses" placements={["category-related"]} />
```

The provider re-fires the session chain whenever the inner component remounts (e.g. on Next.js route change in App Router). For App Router specifically, mount these in **client components** — `NostoProvider` uses browser-only globals.

### Custom rendering (JSON mode)

```tsx
import { useNosto } from "@nosto/nosto-react";

function CustomRecs() {
  const { recommendations } = useNosto();
  const placement = recommendations?.["productpage-nosto-1"];
  if (!placement) return null;
  return <ProductGrid products={placement.products} />;
}
```

## SPA route-change checklist

On every route change you must:

1. Build the new session: `defaultSession().viewX(...)`
2. Set placements present on the new page: `.setPlacements([...])`
3. Trigger fetch: `.load()`

Without `load()` the page will display stale recommendations. The router's success hook (Next.js `useEffect` on `pathname`, React Router `useLocation`, etc.) is the right place.

## Common gotchas

### 1. Mixing Page Tagging and Session API on the same page

Pick ONE per page. Page Tagging expects `<div class="nosto_*">` tags in the DOM and reads them automatically. Session API expects nothing in the DOM and you build state imperatively. Mixing produces double-tracked sessions or empty placements.

### 2. Calling `window.nosto.*` directly

Don't. Always go through `nostojs(api => ...)`. The `window.nosto` namespace is internal and breaks across releases. The stub queue exists specifically to bridge pre-load and post-load calls.

### 3. PII in `customer_reference`

`customer_reference` MUST be a stable pseudonymous ID — UUID, hashed user ID, anything non-reversible. Putting raw email there is a privacy bug and will produce duplicate visitor records (Nosto already has `email` as a separate field).

### 4. Forgetting attribution

`recommendedProductAddedToCart()` records *attribution only*. You also need to:

- (Page Tagging) update cart tagging via `setTaggingProvider("cart", ...)` + `resendCartTagging()`, OR
- (Session API) re-call `viewCart()` with the new cart on `setCart()`.

Skipping the cart-content update means the cart appears empty in Nosto's view even though attribution recorded.

### 5. Calling `api.load()` before the DOM is ready

When you've turned off auto-load with `setAutoLoad(false)`, only call `api.load()` after the page is rendered AND your session has the correct page-type method on it. Calling earlier produces empty placements (Nosto returns recs but there's no `<div class="nosto_element">` to inject into yet).

### 6. Double-firing `addOrder()`

`addOrder()` must run once per confirmation page. Idempotency relies on `external_order_ref` — but only at the backend level. Re-running on the same page (e.g. via React StrictMode double-mount) will fire two requests; the backend dedupes but you've doubled your network spend and skewed timing data. Gate with a ref/flag in React.

### 7. Wrong `merchantId` per market

Per-store account IDs only work for that store's catalog. Sending `shopify-us-12345` to a UK storefront silently produces empty recs because no products match. For Shopify Markets, pass `shopifyInternational: { language, marketId }` so Nosto resolves the right market catalog automatically.

### 8. GDPR cookie set before consent

Once `2c.cId` is set, opting out doesn't retroactively delete it. Either:

- don't load the script until consent, or
- call `nostojs(api => api.visit.setDoNotTrack(true))` BEFORE any tracking call (i.e. in the same script tag, before any other `nostojs(...)` callbacks).

### 9. SSR + personalization

`defaultSession()` is client-only. Don't try to call it during SSR. For SSR personalization, use Nosto's GraphQL `updateSession()` mutation server-side then re-sync the client. GraphQL session updates do NOT support OCP (on-site content personalization), dynamic filtering, or built-in A/B testing — those require the JS client.

### 10. Empty placement bodies in production

Three things to check, in order:

1. Did `setPlacements([...])` actually include the placement ID? (typo? mismatch with admin?)
2. Did `.load()` run? (missed route hook? `setAutoLoad(false)` without a follow-up `load()`?)
3. Does the placement have products in admin given the current segment/filters? (Use `?nostodebug=true` to inspect.)

## Debugging recipe

1. Open the page in incognito with `?nostodebug=true` appended
2. Check the toolbar's "Events" tab — should show one of `viewProduct`/`viewCategory`/etc. firing
3. Check "Placements" tab — green = filled, red = empty
4. If empty: open the placement in admin, check its targeting rules and product feed
5. If event missing: your Session API chain isn't running on this route — verify the router hook
