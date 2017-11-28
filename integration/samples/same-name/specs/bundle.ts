import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/same-name`, () => {

  describe(`bundle testing.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'testing.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the module with module name 'sample.testing'`, () => {
      expect(BUNDLE).to.contain(`global.sample.testing = {}`);
    });
  });


  describe(`bundle testing-testing.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'testing-testing.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the module with module name 'sample.testing.testing'`, () => {
      expect(BUNDLE).to.contain(`global.sample.testing.testing = {}`);
    });
  });

});
