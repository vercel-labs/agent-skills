# Nosto — Recommendations & Placements

Placements are named slots in the page (e.g. `frontpage-nosto-1`, `productpage-nosto-3`) configured in the Nosto admin. The client requests one or more placements per page and Nosto returns recommendation HTML/JSON for each.

## Declaring placements

The Session API expects placement IDs:

```js
nostojs(api =>
  api.defaultSession()
     .viewFrontPage()
     .setPlacements(["frontpage-nosto-1", "frontpage-nosto-2"])
     .load()
);
```

Or read every placement currently in the DOM (Page Tagging mode or hybrid):

```js
nostojs(api => api.placements.getPlacements());  // string[]
```

## `setAutoLoad(false)` + manual `load()`

By default, the client auto-loads after DOMContentLoaded. To delay (e.g. waiting for hydration or consent):

```html
<script>nostojs(api => api.setAutoLoad(false));</script>
```

```js
// When ready:
nostojs(api => api.load());
```

## Re-rendering after a route change (`loadRecommendations`)

In a quasi-SPA where a partial page swap happens but you don't want to rebuild the whole session:

```js
nostojs(api => api.loadRecommendations());
```

Pass attribution metadata when re-rendering due to a click on an existing rec (e.g. opening a quick-view modal):

```js
nostojs(api =>
  api.loadRecommendations({ markNostoElementClicked: "nosto-categorypage-1" })
);
```

## Imperative requests outside the session chain — `createRecommendationRequest`

Use when you need fine-grained control: extra tags, custom fields, restricted to specific elements.

```js
nostojs(api => {
  api.createRecommendationRequest({ includeTagging: true })
     .setCurrentTags(["color:red", "season:fall"])
     .addCurrentCustomFields({ gender: "male", material: "cotton" })
     .setElements(["productpage-nosto-3"])
     .load()
     .then(response => console.log(response));
});
```

Quick-view of a specific product/SKU variant:

```js
nostojs(api =>
  api.createRecommendationRequest({ includeTagging: true })
     .setProducts([{ product_id: "6961338417345", selected_sku_id: "40822930473153" }])
     .load()
);
```

## Dynamic filtering

Pass per-request filter values to a placement:

```js
nostojs(api =>
  api.createRecommendationRequest({ includeTagging: true })
     .setElements(["category-recs"])
     .addCurrentCustomFields({
       in_stock: "true",
       price_max: "100"
     })
     .load()
);
```

The placement must be configured in the Nosto admin to expose those filter fields.

## Lifecycle callbacks — `prerender` / `postrender`

```js
nostojs(api => {
  api.listen("prerender", event => {
    // Fired BEFORE recommendations are inserted into the DOM
    console.log(event.affinityScores);  // { brands: [{name, score}], categories: [...] }
    console.log(event.segments);        // string[] — segment IDs
  });

  api.listen("postrender", event => {
    // Fired AFTER recommendations are inserted
    console.log(event.filledElements);   // string[] — placement IDs that got recs
    console.log(event.unFilledElements); // string[] — placement IDs that came back empty
  });
});
```

Use `prerender` to add segment-based DOM tweaks before the recs are visible. Use `postrender` to swap layouts or hide empty wrappers based on `unFilledElements`.

## `RenderMode` and `InsertMode`

The `client` module exposes `RenderMode` (`"HTML" | "JSON_ORIGINAL" | "JSON_REDUCED"`) and `InsertMode` (`"REPLACE" | "APPEND" | "PREPEND" | ...`). These are configured per placement in the Nosto admin; in client code you typically only inspect them when handling JSON responses:

```js
nostojs(api =>
  api.defaultSession()
     .viewProduct("p1")
     .setPlacements(["json-placement"])
     .setResponseMode("JSON_ORIGINAL")
     .load()
     .then(({ recommendations }) => {
       // recommendations[placementId] = { products: [...], title, etc. }
       const placement = recommendations["json-placement"];
       renderInReact(placement.products);
     })
);
```

`JSON_ORIGINAL` returns the full product objects (use this in React/headless). `HTML` returns server-rendered markup that the client injects into `<div class="nosto_element" id="...">`.

## Attribution

Every recommendation click/add-to-cart should be attributed back to its placement so reports work:

```js
// On add-to-cart from a Nosto rec:
nostojs(api =>
  api.recommendedProductAddedToCart(productId, "nosto-categorypage-1")
);

// On click attribution for navigation (rec → PDP):
nostojs(api =>
  api.loadRecommendations({ markNostoElementClicked: "nosto-categorypage-1" })
);
```

Without these calls, Nosto's "revenue from recommendations" report will be empty.
