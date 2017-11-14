import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`bundle core.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'core.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the module with module name 'sample.core'`, () => {
      expect(BUNDLE).to.contain(`global.sample.core = {}`);
    });
  });

});
