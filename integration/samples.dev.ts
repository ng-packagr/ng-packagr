import * as fs from 'fs-extra';
import * as path from 'path';
import { build } from '../src/public_api';

process.env.DEBUG = 'true';

const PATH = path.resolve(__dirname, 'samples');
let SAMPLES = [];
if (process.argv[2]) {
  SAMPLES = [path.resolve(PATH, process.argv[2])];
} else {
  SAMPLES = fs
    .readdirSync(PATH)
    .map(dir => path.resolve(PATH, dir))
    .filter(file => fs.lstatSync(file).isDirectory())
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
