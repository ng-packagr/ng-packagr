#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
process.env.DEBUG = true;

const PATH = path.resolve(__dirname, 'samples');
let SAMPLES = [];
if (process.argv[2]) {
  SAMPLES = [ path.resolve(PATH, process.argv[2]) ];
} else {
  SAMPLES = fs.readdirSync(PATH)
    .map(dir => path.resolve(PATH, dir))
    .filter(file => fs.lstatSync(file).isDirectory())
    .reverse();
}

// @see https://github.com/TypeStrong/ts-node#programmatic-usage
require('ts-node').register({
  project: path.join(__dirname, '..', 'tsconfig.packagr.json')
});

const ngPackagr = require('../src/lib/ng-packagr');

let promise = Promise.resolve();
while (SAMPLES.length > 0) {
  const project = SAMPLES.pop();

  promise = promise
    .then(() => {
      console.info(`$ ng-packagr -p ${project}`);

      return ngPackagr.createNgPackage({ project });
    })
    .catch((err) => {
      console.error('Samples failed.', err);
      process.exit(1);
    });
}
