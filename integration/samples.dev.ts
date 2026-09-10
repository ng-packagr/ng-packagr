import { lstatSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from '../src/public_api';

process.env.DEBUG = 'true';

const PATH = resolve(__dirname, 'samples');
let SAMPLES = [];
if (process.argv[2]) {
  SAMPLES = [resolve(PATH, process.argv[2])];
} else {
  SAMPLES = readdirSync(PATH)
    .map(dir => resolve(PATH, dir))
    .filter(file => lstatSync(file).isDirectory())
    .reverse();
}

let promise = Promise.resolve();
while (SAMPLES.length > 0) {
  const project = SAMPLES.pop();

  promise = promise
    .then(() => {
      console.info(`$ ng-packagr -p ${project}`);

      return build({ project });
    })
    .catch(err => {
      console.error('Samples failed.', err);
      process.exit(1);
    });
}
