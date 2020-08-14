import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

const DIST = path.resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-a`, () => {
  let UMD_BUNDLE_CONTENTS: string, ESM2015_CONTENTS: string;

  before(() => {
    UMD_BUNDLE_CONTENTS = fs.readFileSync(path.resolve(DIST, 'bundles', 'sample-secondary-feature-a.umd.js'), {
      encoding: 'utf-8',
    });
    ESM2015_CONTENTS = fs.readFileSync(path.resolve(DIST, 'fesm2015', 'sample-secondary-feature-a.js'), {
      encoding: 'utf-8',
    });
  });

  it(`should register as 'global.sample.secondary[feature-a]' on global scope (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`global.sample.secondary[\'feature-a\'] = {}`);
  });

  it(`should resolve '@sample/secondary/shared' from global-scope (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`), global.sample.secondary.shared)`);
  });

  it(`should 'require('@sample/secondary/shared')' from factory (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`require('@sample/secondary/shared')`);
  });

  it(`should define '@sample/secondary/feature-a' for AMD (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(`define('@sample/secondary/feature-a'`);
  });

  it(`should depend on '@sample/secondary/shared' for AMD (UMD)`, () => {
    expect(UMD_BUNDLE_CONTENTS).to.contain(
      `define('@sample/secondary/feature-a', ['exports', '@sample/secondary/shared']`,
    );
  });

  it(`should 'import .. from '@sample/secondary/shared';' (FESM2015)`, () => {
    expect(ESM2015_CONTENTS).to.contain(`import { SHARED_FEATURE } from '@sample/secondary/shared';`);
  });
});
