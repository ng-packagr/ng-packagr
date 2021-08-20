import { expect } from 'chai';

describe(`@sample/material`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/material'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/material');
    });

    it(`should reference "module" bundle (FESM2015)`, () => {
      expect(PACKAGE['module']).to.equal('fesm2015/sample-material.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('fesm2015/sample-material.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-material.d.ts');
    });
  });
});
