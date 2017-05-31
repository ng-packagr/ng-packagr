const path = require('path');

// Read CLI arguments
const ARGS = require('minimist')(process.argv.slice(2));

const project = ARGS.p || ARGS.project || path.resolve(__dirname, 'ng-package.json');

process.env.DEBUG = true;

// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, '..', '..', 'tsconfig.packagr.json')
});

const ngPackagr = require('../../lib/ng-packagr');

ngPackagr.ngPackage({
  project
});
