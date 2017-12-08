import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`sample-core.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-core.umd.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(BUNDLE).to.be.ok;
    });

    it(`should export the module with module name 'sample.core'`, () => {
      expect(BUNDLE).to.contain(`global.sample.core = {}`);
    });
  });

  describe(`sample-core.umd.min.js`, () => {
    let API;
    before(() => {
      API = require('../dist/bundles/sample-core.umd.min.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

    it(`should export AngularDirective`, () => {
      expect(API.AngularDirective).to.be.ok;
    });

    it(`should export AngularModule`, () => {
      expect(API.AngularModule).to.be.ok;
    });

    it(`should export AngularPipe`, () => {
      expect(API.AngularPipe).to.be.ok;
    });

    it(`should export AngularService`, () => {
      expect(API.AngularService).to.be.ok;
    });

  });
});
