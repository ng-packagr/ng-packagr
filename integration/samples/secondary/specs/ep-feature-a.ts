import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-a`, () => {
  let ESM2020_CONTENTS: string;

  beforeAll(() => {
    ESM2020_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2020', 'sample-secondary-feature-a.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'import .. from '@sample/secondary/shared';' (FESM2020)`, () => {
    expect(ESM2020_CONTENTS).to.contain(`import { SHARED_FEATURE } from '@sample/secondary/shared';`);
  });
});
