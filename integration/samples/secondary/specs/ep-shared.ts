import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/shared`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2022', 'sample-secondary-shared.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. } from ESM2022 bundle`, () => {
    expect(ESM2022_CONTENTS).to.contain(`export {`);
  });
});
