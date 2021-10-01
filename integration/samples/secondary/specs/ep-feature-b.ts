import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-b`, () => {
  let ESM2020_CONTENTS: string;

  before(() => {
    ESM2020_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2020', 'sample-secondary-feature-b.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. }' (FESM2020)`, () => {
    expect(ESM2020_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2020)`, () => {
    expect(ESM2020_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });

  it(`should 'export { .. }' (FESM2020)`, () => {
    expect(ESM2020_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2020)`, () => {
    expect(ESM2020_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });
});
