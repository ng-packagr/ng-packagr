import { expect } from 'chai';

describe(`@sample/secondary`, () => {
  describe(`sample-secondary.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary.umd.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });
  });

  describe(`sample-secondary.umd.min.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary.umd.min.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });
  });

  describe(`sample-secondary-sub-module.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-sub-module.umd.js');
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BarComponent"`, () => {
      expect(GENERATED.BarComponent).to.be.ok;
    });
  });

  describe(`sample-secondary-sub-module.umd.min.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require('../dist/bundles/sample-secondary-sub-module.umd.min.js');
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
