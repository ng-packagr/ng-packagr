const path = require('path');
process.env.DEBUG = true;

// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, '..', '..', '..', 'tsconfig.packagr.json')
});

const ngPackagr = require('../../../src/lib/ng-packagr');

ngPackagr.createNgPackage({
  project: path.resolve(__dirname, 'ng-package.js')
});
