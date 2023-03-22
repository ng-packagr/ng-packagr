import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-b`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2022', 'sample-secondary-feature-b.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. }' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });

  it(`should 'export { .. }' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });
});
