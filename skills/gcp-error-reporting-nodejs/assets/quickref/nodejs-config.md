# Quick reference: `@google-cloud/error-reporting` options

All options are passed to `new ErrorReporting({ ... })`.

| Option | Type | Default | Notes |
|--------|------|---------|------|
| `projectId` | string | (auto) | Useful for local/dev or when ADC can’t infer project |
| `keyFilename` | string | — | Path to a service-account JSON file |
| `credentials` | object | — | In-memory credentials object (avoid committing secrets) |
| `key` | string | — | API key (if provided, library won’t attempt normal auth) |
| `reportMode` | `'never' \| 'always' \| 'production'` | `'production'` | Replaces deprecated `ignoreEnvironmentCheck`; controls when errors are sent |
| `logLevel` | number (0–5) | `2` | Internal library logging verbosity |
| `serviceContext.service` | string | — | Used for grouping; “service name” |
| `serviceContext.version` | string | — | Optional version identifier |
| `reportUnhandledRejections` | boolean | `false` | If enabled, unhandled rejections are reported |

## Notes

- If both `reportMode` and deprecated `ignoreEnvironmentCheck` are set, `reportMode` wins.
- Prefer ADC / workload identity on Google runtimes; use `keyFilename` only when you must.
