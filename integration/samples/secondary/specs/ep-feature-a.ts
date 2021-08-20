import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-a`, () => {
  let ESM2015_CONTENTS: string;

  before(() => {
    ESM2015_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2015', 'sample-secondary-feature-a.js'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'import .. from '@sample/secondary/shared';' (FESM2015)`, () => {
    expect(ESM2015_CONTENTS).to.contain(`import { SHARED_FEATURE } from '@sample/secondary/shared';`);
  });
});
