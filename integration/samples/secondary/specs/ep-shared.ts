import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/shared`, () => {
  let ESM2015_CONTENTS: string;

  before(() => {
    ESM2015_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2015', 'sample-secondary-shared.js'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. } from ESM2015 bundle`, () => {
    expect(ESM2015_CONTENTS).to.contain(`export {`);
  });
});
