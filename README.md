# @redext/micro-framework

Packages for library @redext/micro

## Installation

```bash
npm install -s @redext/micro-framework
or
yarn add @redext/micro-framework
```

## Use It

```js
import {
  MicroAppContext,
  MicroRouter,
  createMicroAppReact,
  useMicroAppReact,
  withMicroStyles,
  getMicroState
} from '@redext/micro-framework';
```

```js
// root-config.jsx

import { createMicroAppReact } from '@redext/micro-framework';
import app from './src';

export const { bootstrap, mount, unmount } = createMicroAppReact({
  rootId: __ROOT_ID__,
  rootComponent: () => app
})

if (__MICRO__) {
  window[__APP_NAME__] = {
    bootstrap,
    mount,
    unmount
  }
} else {
  mount({});
}
```

```js
// src/index.jsx

import { MicroRouter } from '@redext/micro-framework';

const app = (
  <MicroRouter>
    {children}
  </MicroRouter>
)

export default app
```
