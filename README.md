# web-ext plugin for Webpack 4

[![NPM Version][npm-image]][npm-url]
[![Build Status](travis-image)](travis-url)
[![Test Coverage][coveralls-image]][coveralls-url]

## Install

```bash
yarn add -D webext-webpack-plugin
```

```bash
npm add --save-dev webext-webpack-plugin
```

## Usage

### Javascript

```js
const WebExtWebpackPlugin = require('webext-webpack-plugin');
const path = require('path');

const baseDir = path.resolve(__dirname);
const artifactsDir = path.join(baseDir, 'artifacts');

const config = {
  plugins: [
    new WebExtWebpackPlugin({
      build: {
        artifactsDir,
      },
      run: {
        artifactsDir,
        firefox: 'C:\\Program Files\\Firefox Developer Edition\\firefox.exe',
        startUrl: ['https://google.com/'],
      },
    }),
  ]
};
```

### TypeScript:

```ts
import * as path from 'path';
import * as webpack from 'webpack';
import WebExtWebpackPlugin from 'webext-webpack-plugin';

const baseDir = path.resolve(__dirname);
const artifactsDir = path.join(baseDir, 'artifacts');

const config: webpack.Configuration  = {
  plugins: [
    new WebExtWebpackPlugin({
      build: {
        artifactsDir,
      },
      run: {
        artifactsDir,
        firefox: 'C:\\Program Files\\Firefox Developer Edition\\firefox.exe',
        startUrl: ['https://google.com/'],
      },
    }),
  ]
};

export default config;
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/webext-webpack-plugin.svg
[npm-url]: https://npmjs.org/package/webext-webpack-plugin
[travis-image]: https://travis-ci.org/TheAifam5/webext-webpack-plugin.svg?branch=master
[travis-url]: https://travis-ci.org/TheAifam5/webext-webpack-plugin
[coveralls-image]: https://img.shields.io/coveralls/TheAifam5/webext-webpack-plugin/master.svg
[coveralls-url]: https://coveralls.io/r/TheAifam5/webext-webpack-plugin?branch=master
