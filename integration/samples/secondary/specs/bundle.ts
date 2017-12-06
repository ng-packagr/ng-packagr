import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/secondary`, () => {

  describe(`bundle: sample-secondary-lib.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-secondary-lib.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the root module with module name 'sample.secondary-lib'`, () => {
      expect(BUNDLE).to.contain(`global.sample['secondary-lib'] = {}`);
    });
  });

  describe(`bundle: sample-secondary-lib-sub-module.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-secondary-lib-sub-module.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the secondary module with module name 'sample.secondary-lib.sub-module'`, () => {
      expect(BUNDLE).to.contain(`global.sample['secondary-lib']['sub-module'] = {}`);
    });
  });

});
