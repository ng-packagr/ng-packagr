#!/usr/bin/env node
// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: require('path').join(__dirname, '..', 'src', 'tsconfig.packagr.json')
});

require('./samples.dev.ts');
