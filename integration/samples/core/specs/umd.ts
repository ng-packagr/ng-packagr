import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {
  describe(`sample-core.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/bundles/sample-core.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should have sourceMap url pointing to file`, () => {
      expect(BUNDLE).to.contain('sourceMappingURL=sample-core.umd.js.map');
    });

    it(`should export the module with module name 'sample.core'`, () => {
      expect(BUNDLE).to.contain(`global.sample.core = {}`);
    });

    it(`should not import TS helpers from 'tslib'`, () => {
      expect(BUNDLE).not.to.contain('tslib');
    });
  });
});
