const path = require('path');
process.env.DEBUG = true;

const SAMPLES = [
  path.resolve(__dirname, 'samples', 'core', 'ng-package.json'),
  path.resolve(__dirname, 'samples', 'custom', 'ng-package.json'),
  path.resolve(__dirname, 'samples', 'material', 'ng-package.json'),
  path.resolve(__dirname, 'samples', 'rxjs', 'ng-package.json'),
  path.resolve(__dirname, 'samples', 'typings', 'ng-package.json'),
];

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
