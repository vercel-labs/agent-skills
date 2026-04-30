# Nosto — Customer, Search & Experiments

## Customer identification

Two equivalent forms — pick by integration mode.

**Session API (chainable):**

```js
nostojs(api =>
  api.defaultSession()
     .setCustomer({
       customer_reference: "b369f1235cf4f08153c560.82515936",
       email: "buyer@example.com",
       first_name: "Nosto",
       last_name: "Test",
       newsletter: true,
       marketing_permission: true
     })
     .viewCart()
     .update()
);
```

**Page Tagging (one-shot):**

```js
nostojs(api =>
  api.customer({
    email: "jane.doe@example.com",
    first_name: "Jane",
    last_name: "Doe",
    marketing_permission: true,
    customer_reference: "5e3d4a9c-cf58-11ea-87d0-0242ac130003"
  })
);
```

### Field rules

| Field | Required | Notes |
|---|---|---|
| `customer_reference` | Yes | Stable, pseudonymous ID. UUID or hashed user ID. **Never raw email or PII.** |
| `email` | No | Goes in this field, not in `customer_reference` |
| `marketing_permission` | For triggered email | Explicit GDPR opt-in. Without it, contact is treated as opted-out of triggered messages. |
| `newsletter` | For triggered email | Equivalent on the order-level `info` object |

## Search — Nosto Search GraphQL

Search is exposed via GraphQL at `https://search.nosto.com/v1/graphql`. The client SDK ships TypeScript types but not a built-in fetcher — wire your own client (urql, Apollo, fetch):

```graphql
query Storefront($q: String!) {
  search(
    accountId: "shopify-12345"
    query: $q
    products:        { size: 24 }
    keywords:        { size: 5 }
    categories:      { size: 5 }
    popularSearches: { size: 5, emptyQueryMatchesAll: true }
  ) {
    products {
      hits { productId name listPrice price imageUrl url }
      total
      fuzzy
    }
    keywords {
      hits { keyword _redirect _highlight { keyword } }
    }
    categories {
      hits { name url urlPath }
      total
    }
    popularSearches {
      hits { query total }
      total
    }
  }
}
```

```ts
const res = await fetch("https://search.nosto.com/v1/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: STOREFRONT_QUERY,
    variables: { q: input }
  })
}).then(r => r.json());

const fuzzy = res.data.search.products.fuzzy;  // boolean — populate analytics autoCorrect
```

### Relevant types from `@nosto/nosto-js/client`

`SearchQuery`, `SearchResult`, `SearchProduct`, `InputSearchFilter`, `InputSearchFacetConfig`, `SearchAutocorrect`, `SearchExplain`.

### Autocomplete

Use Nosto's autocomplete component (configured in admin) rather than calling GraphQL directly for the dropdown — it handles rendering, debouncing, keyboard nav, and analytics. Drop-in via the embed script; no extra code needed beyond placing the `data-nosto-search` attribute on your input.

## Experiments / A-B testing

Most experiments are configured in the Nosto admin and surfaced through standard placement responses — no bespoke client code is needed.

When you DO need to read or override variations from the client, the relevant types in `@nosto/nosto-js/client` are:

- `ABTest` — admin-defined test definition
- `Experiment` — currently-running experiment instance
- `Campaign` — single campaign (placement) inside an experiment
- `ForcedTestDTO` — admin-forced variation for QA
- `TestPreviewsDTO` — preview data when entering preview mode

### Reading the active variation in callbacks

```js
nostojs(api => {
  api.listen("prerender", event => {
    event.segments.forEach(segmentId => console.log("In segment:", segmentId));
  });
});
```

A/B variations show up as segment IDs on `prerender`. Conditional UI based on segment membership is the standard pattern.

### Forcing a variation (QA / preview)

Append `?nostodebug=true` to the URL and use the debug toolbar's "Test previews" panel to force a variation. There is no production-safe way to force variations from JS — that's by design (forcing would skew test results).
