import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-a`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2022', 'sample-secondary-feature-a.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'import .. from '@sample/secondary/shared';' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`import { SHARED_FEATURE } from '@sample/secondary/shared';`);
  });
});
