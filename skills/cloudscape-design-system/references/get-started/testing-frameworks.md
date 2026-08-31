---
scraped_at: '2026-04-20T08:51:21+00:00'
section: get-started
source_url: https://cloudscape.design/get-started/testing/frameworks/index.html.md
title: Testing frameworks integration
---

# Testing frameworks integration

How to integrate different testing frameworks with Cloudscape components.

## Using Vitest (recommended)

Our packages do not require any special configuration in this framework.

For the best testing experience, we recommend combining vitest with [the react testing library](https://github.com/testing-library/react-testing-library) . After installing respective dependencies, create a testing setup file, `tests/setup.js` , for example:

```
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
```

Update `vite.config.js` :

```
export default defineConfig({
  // ... your other configuration ...
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.js"],
  },
});
```

#### Common errors

If you receive "SyntaxError: Cannot use import statement outside a module" error coming from our packages, it is likely there is a configuration error in an intermediate dependency. Check this [vitest issue](https://github.com/vitest-dev/vitest/issues/747) , and [other similar issues](https://github.com/search?q=repo%3Avitest-dev%2Fvitest+%22Cannot+use+import+statement+outside+a+module%22&type=issues) , for more guidance.

## Using Jest

### Preset configuration

To ensure the compatibility of your tests, you must use our [configuration preset](https://github.com/cloudscape-design/jest-preset) when testing our components with Jest. For example, this preset fixes `SyntaxError: Unexpected token 'export'` , which may occur in your tests.

For integration instructions, see the [package readme](https://github.com/cloudscape-design/jest-preset/blob/main/README.md).

### Snapshot testing

By design, our components are not meant to produce stable snapshots. This is because we constantly add new features and improvements. To protect your snapshots from unexpected changes, isolate your tests by mocking the components module.

#### If you use main import path

```
// in a file with snapshot tests
jest.mock('@cloudscape-design/components', () => {
  const Components = jest.genMockFromModule('@cloudscape-design/components');
  for (const componentName of Object.keys(Components)) {
    Components[componentName] = componentName;
  }
  return Components;
})
```

#### If you use individual component imports

Create a file `component-mocks.js` :

```
// This has to be a separate file because Jest does not support for-loops in the mocks:
// https://github.com/facebook/jest/issues/11063
import kebabCase from 'lodash/kebabCase';
const Components = jest.requireActual('@cloudscape-design/components');
for (const mockComponentName of Object.keys(Components)) {
  jest.mock(`@cloudscape-design/components/${kebabCase(mockComponentName).replace('s-3', 's3')}`, () => mockComponentName);
}
```

Import it in the test file:

```
// this line must be above the source code import
import './component-mocks';
import YourComponent from './your-code';
```

## Using Mocha

### Configure require hooks

Our components are only provided in ES-module format, which requires some preliminary setup. Create a `setup.js` file and load it to Mocha using <a href="https://mochajs.org/#-require-module-r-module"> the `--require` option</a> :

```
require('ignore-styles');
require('@babel/register')({
  only: [/node_modules\/@cloudscape-design\//],
  ignore: [/test-utils/],
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  sourceMap: 'inline',
});
```

The modules used in this file may not be installed in your project. Install them if needed.

### Configure JSDOM

Mocha does not provide a simulated DOM environment. However, you can get it using [global-jsdom](https://github.com/modosc/global-jsdom) module. Add this line to your setup file:

```
require('global-jsdom')(undefined, { pretendToBeVisual: true });
```

`pretendToBeVisual` flag is needed to enable a shim for `requestAnimationFrame` , which is a [requirement for React](https://reactjs.org/docs/javascript-environment-requirements.html).
