# Nosto — Session API & Events

The Session API is the imperative way to tell Nosto about a page view. Use it on SPAs, headless storefronts, or any place where Page Tagging isn't appropriate.

**Pattern:** `api.defaultSession().<setters and view>().setPlacements([...]).load()`

`defaultSession()` returns a chainable `Session` builder. Every method on it returns the same builder (except terminal `load()`, which returns a `Promise`). Run the whole chain on every route change.

## Page-type methods

| Method | Args | Purpose |
|---|---|---|
| `viewFrontPage()` | — | Home / landing page |
| `viewCategory(path)` | `string` (e.g. `"/Women/Dresses"`) | Category listing |
| `viewProduct(productId)` | `string` | Product detail |
| `viewCart()` | — | Cart page |
| `viewSearch(query)` | `string` | Search results |
| `viewOther()` | — | 404, content, account, anything else |

```js
nostojs(api =>
  api.defaultSession()
     .viewCategory("/Womens/Dresses")
     .setPlacements(["category-related"])
     .load()
);
```

Use `api.placements.getPlacements()` to read every placement ID currently declared in the page (handy on the front page where placements vary):

```js
nostojs(api =>
  api.defaultSession()
     .viewFrontPage()
     .setPlacements(api.placements.getPlacements())
     .load()
);
```

## Cart & customer context on the session

```js
nostojs(api =>
  api.defaultSession()
     .setCart({
       items: [{
         product_id: "406",
         sku_id: "243",
         name: "Linen Blazer",
         quantity: 1,
         unit_price: 49.5,
         price_currency_code: "USD"
       }]
     })
     .setCustomer({
       customer_reference: "5e3d4a9c-cf58-11ea-87d0-0242ac130003",
       email: "buyer@example.com",
       first_name: "Jane",
       last_name: "Doe",
       newsletter: true,
       marketing_permission: true
     })
     .viewCart()
     .setPlacements(["cart-related"])
     .load()
);
```

`customer_reference` MUST be a stable pseudonymous ID — never the raw email. Email goes in `email`. Hashed IDs or UUIDs are fine.

## Order tracking — `addOrder()`

Call once on the order-confirmation page. Records the conversion and produces order-page recommendations.

```js
nostojs(api =>
  api.defaultSession()
    .addOrder({
      external_order_ref: "145000006",
      info: {
        order_number: "195",
        email: "buyer@example.com",
        first_name: "Jane",
        last_name: "Doe",
        type: "order",
        newsletter: true
      },
      items: [{
        product_id: "406",
        sku_id: "243",
        name: "Linen Blazer (White, S)",
        quantity: 1,
        unit_price: 455,
        price_currency_code: "EUR"
      }]
    })
    .setPlacements(["order-related"])
    .load()
);
```

Idempotency relies on `external_order_ref` — re-firing with the same ref is a no-op on the backend. Don't omit it.

## Cart updates mid-session (Page Tagging)

When the cart changes without a full page reload (mini-cart, ajax add):

```js
nostojs(api => {
  fetch("/cart.json")
    .then(r => r.json())
    .then(cart => {
      const taggingHtml = renderCartTagging(cart);   // your function
      api.setTaggingProvider("cart", taggingHtml);
      api.resendCartTagging();
    });
});
```

For Session API mode, just call the next session chain with the new cart on `setCart()` — there's no separate "resend".

## Cart updates mid-session (Session API)

```js
nostojs(api =>
  api.defaultSession()
     .setCart({ items: newItems })
     .viewCart()       // or whatever page the user is on
     .update()         // re-evaluates without re-fetching recommendations
);
```

Use `.update()` (not `.load()`) when you only need to update session state without re-rendering placements.

## Add-to-cart attribution

```js
nostojs(api =>
  api.recommendedProductAddedToCart("productId1", "nosto-categorypage-1")
);
```

Alias: `reportAddToCart`. Records *attribution only*. You still need to update cart contents (above) for the cart to reflect the actual state.

## Common `Cart`/`Order`/`Customer` field reference

### `CartItem`

```ts
{
  product_id: string;
  sku_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  price_currency_code: string;  // ISO 4217, e.g. "USD"
}
```

### `OrderInfo`

```ts
{
  order_number: string;
  email: string;
  first_name: string;
  last_name: string;
  type: "order";
  newsletter?: boolean;          // GDPR opt-in for triggered email
}
```

### `Customer`

```ts
{
  customer_reference: string;     // stable, non-PII pseudonymous ID
  email?: string;
  first_name?: string;
  last_name?: string;
  newsletter?: boolean;
  marketing_permission?: boolean; // explicit GDPR opt-in
}
```

Full TypeScript types: <https://nosto.github.io/nosto-js/modules/client.html>.
