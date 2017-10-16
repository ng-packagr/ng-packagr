import { expect } from 'chai';
import * as path from 'path';

describe(`@sample/material`, () => {

  describe(`material.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require(path.resolve(__dirname, '..', 'dist', 'bundles', 'material.umd.js'));
      done();
    });

    it(`should exist`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(GENERATED).to.be.ok;
    });

    it(`should have "BazComponent.decorators"`, () => {
      expect(GENERATED.BazComponent.decorators).to.be.ok;
    });

    it(`should have styles for "BazComponent"`, () => {
      expect(GENERATED.BazComponent.decorators[0].args[0].styles).to.be.ok;
    });

    it(`should have style with: "color: red"`, () => {
      expect(GENERATED.BazComponent.decorators[0].args[0].styles[0]).to.have.string('color: "red"');
    });

  });
});
