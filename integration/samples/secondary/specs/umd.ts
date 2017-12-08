import { expect } from 'chai';
import * as path from 'path';

describe(`@sample/secondary`, () => {

  describe(`sample-secondary-lib.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-lib.umd.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });
  });

  describe(`sample-secondary-lib.umd.min.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-lib.umd.min.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });
  });

  describe(`sample-secondary-lib-sub-module.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-lib-sub-module.umd.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BarComponent"`, () => {
      expect(GENERATED.BarComponent).to.be.ok;
    });
  });

  describe(`sample-secondary-lib-sub-module.umd.min.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-lib-sub-module.umd.min.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BarComponent"`, () => {
      expect(GENERATED.BarComponent).to.be.ok;
    });
  });

});
