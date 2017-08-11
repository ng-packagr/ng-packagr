const fs = require('fs');
const path = require('path');
process.env.DEBUG = true;

const PATH = path.resolve(__dirname, 'samples');
const SAMPLES = fs.readdirSync(PATH)
  .map(dir => path.resolve(PATH, dir))
  .filter(file => fs.lstatSync(file).isDirectory())
  .map(dir => path.resolve(dir, 'ng-package.json'));


// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, '..', 'tsconfig.packagr.json')
});

const ngPackagr = require('../lib/ng-packagr');

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
