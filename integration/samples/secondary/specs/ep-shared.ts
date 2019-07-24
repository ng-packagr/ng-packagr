import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/shared`, () => {
  let UMD_BUNDLE_CONTENTS: string, ESM5_CONTENTS: string;
  before(() => {
    UMD_BUNDLE_CONTENTS = fs.readFileSync(path.resolve(DIST, 'bundles', 'sample-secondary-shared.umd.js'), {
      encoding: 'utf-8',
    });
    ESM5_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm5', 'sample-secondary-shared.js'), {
      encoding: 'utf-8',
    });
  });

  it(`should register 'global.sample.secondary.shared' on global scope (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`global.sample.secondary.shared = {}`);
  });

  it(`should define '@sample/secondary/shared' for AMD ID (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`define('@sample/secondary/shared', ['exports'], factory)`);
  });

  it(`should 'export { .. } from ESM5 bundle`, () => {
    expect(ESM5_CONTENTS).to.contain(`export {`);
  });

  it(`should 'export { .. } from ESM205 bundle`, () => {
    expect(ESM5_CONTENTS).to.contain(`export {`);
  });
});
