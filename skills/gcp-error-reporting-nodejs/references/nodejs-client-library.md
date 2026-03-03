# Node.js client library: `@google-cloud/error-reporting`

This reference summarizes practical usage patterns from the official client docs.

## Minimal usage

```js
const {ErrorReporting} = require('@google-cloud/error-reporting');
const errors = new ErrorReporting();

errors.report(new Error('Something broke!'));
```

If you pass a string, the library uses the stack trace at the point `report()` is invoked. If you
pass an `Error`, it uses the stack trace captured when the error was instantiated.

## Configuration (high level)

The constructor accepts an options object, including:

- `projectId`
- `keyFilename`
- `credentials`
- `reportMode` (default: `production`)
- `logLevel`
- `serviceContext: { service, version }`

See the quick reference table for details:
[assets/quickref/nodejs-config.md](../assets/quickref/nodejs-config.md)

## Express integration

Attach the middleware after your routes (standard Express error-handling rules apply):

```js
const express = require('express');
const {ErrorReporting} = require('@google-cloud/error-reporting');

const app = express();
const errors = new ErrorReporting();

app.get('/error', (req, res, next) => {
  res.send('Something broke!');
  next(new Error('Custom error message'));
});

app.use(errors.express);
```

The library also documents integrations for other frameworks (Hapi, Koa, Restify).

## Unhandled rejections / uncaught exceptions

- **Unhandled rejections** are not reported by default. Enable reporting via the
  `reportUnhandledRejections` configuration option.
- **Uncaught exceptions** are not reported by default. It is recommended to handle
  `process.on("uncaughtException")` for production apps, but do it deliberately: adding listeners
  can affect process termination behavior.

## Using an API key

The library supports API keys via the `key` option (used in lieu of local credentials). Prefer
storing keys in a secret manager or environment variable, not hard-coded in source.

## See also

- [Node.js setup](nodejs-setup.md)
- [Cloud Logging formatting rules](logentry-formatting.md)
