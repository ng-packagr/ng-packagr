import { expect } from 'chai';
import * as path from 'path';

describe(`@sample/secondary`, () => {

  describe(`secondary-lib.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require(path.resolve(__dirname, '..', 'dist', 'bundles', 'secondary-lib.umd.js'));
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });
  });

  describe(`secondary-lib-sub-module.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require(path.resolve(__dirname, '..', 'dist', 'bundles', 'secondary-lib-sub-module.umd.js'));
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
