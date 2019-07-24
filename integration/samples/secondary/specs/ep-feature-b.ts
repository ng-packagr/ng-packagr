import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-b`, () => {
  let UMD_BUNDLE_CONTENTS: string;
  let ESM5_CONTENTS: string;

  before(() => {
    UMD_BUNDLE_CONTENTS = fs.readFileSync(path.resolve(DIST, 'bundles', 'sample-secondary-feature-b.umd.js'), {
      encoding: 'utf-8',
    });
    ESM5_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm5', 'sample-secondary-feature-b.js'), {
      encoding: 'utf-8',
    });
  });

  it(`should register as 'global.sample.secondary[feature-b]' on global scope (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`global.sample.secondary[\'feature-b\'] = {}`);
  });

  it(`should resolve '@sample/secondary/feature-a' from global-scope (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`), global.sample.secondary[\'feature-a\'])`);
  });

  it(`should 'require('@sample/secondary/feature-a')' from factory (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`require('@sample/secondary/feature-a')`);
  });

  it(`should define '@sample/secondary/feature-b' for AMD (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`define('@sample/secondary/feature-b'`);
  });

  it(`should depend on '@sample/secondary/feature-a' for AMD (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(
      `define('@sample/secondary/feature-b', ['exports', '@sample/secondary/feature-a']`,
    );
  });

  it(`should 'export { .. }' (ESM5)`, () => {
    expect(ESM5_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM5)`, () => {
    expect(ESM5_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });

  it(`should 'export { .. }' (ESM2015)`, () => {
    expect(ESM5_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2015)`, () => {
    expect(ESM5_CONTENTS).to.contain(`import { FEATURE_A } from '@sample/secondary/feature-a';`);
  });
});
