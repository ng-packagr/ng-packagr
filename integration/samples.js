const path = require('path');
process.env.DEBUG = true;

const SAMPLES = [
  path.resolve(__dirname, 'sample_core', 'ng-package.json'),
  path.resolve(__dirname, 'sample_custom', 'ng-package.json'),
  path.resolve(__dirname, 'sample_material', 'ng-package.json'),
  path.resolve(__dirname, 'sample_rxjs', 'ng-package.json'),
  path.resolve(__dirname, 'sample_typings', 'ng-package.json'),
];

/*
    "samples": "node dist/cli/ng-packagr.js -p integration/sample/ng-package.json",
    "sample:dev": "node integration/build.js  -p integration/sample/ng-package.json",
    "sample:test": "mocha --compilers ts:ts-node/register integration/sample/test/package.ts",
    "sampleng": "node dist/cli/ng-packagr.js -p integration/sample_angular/ng-package.json",
    "sampleng:dev": "node integration/build.js -p integration/sample_angular/ng-package.json",
*/

// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, '..', 'tsconfig.packagr.json')
});

const ngPackagr = require('../src/lib/ng-packagr');

let promise = Promise.resolve();
while (SAMPLES.length > 0) {
  const project = SAMPLES.pop();
  promise = promise
            .then(() => ngPackagr.ngPackage({ project }))
            .catch((err) => {
              console.error('Samples failed.', err);
              process.exit(1);
            });
}
