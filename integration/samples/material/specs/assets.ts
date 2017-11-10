import { expect } from 'chai';
import * as path from 'path';

xdescribe(`@sample/material`, () => {

  xdescribe(`material.umd.js`, () => {
    let GENERATED;
    before(done => {
      GENERATED = require(path.resolve(__dirname, '..', 'dist', 'bundles', 'material.umd.js'));
      done();
    });

    xit(`should exist`, () => {
      expect(GENERATED.BazComponent).to.be.ok;
    });

    xit(`should have "BazComponent"`, () => {
      expect(GENERATED).to.be.ok;
    });

  });
});
