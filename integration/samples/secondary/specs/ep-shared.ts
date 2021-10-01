import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/shared`, () => {
  let ESM2020_CONTENTS: string;

  before(() => {
    ESM2020_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2020', 'sample-secondary-shared.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. } from ESM2020 bundle`, () => {
    expect(ESM2020_CONTENTS).to.contain(`export {`);
  });
});
