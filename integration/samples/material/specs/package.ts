import { expect } from 'chai';

describe(`@sample/material`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/material'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/material');
    });

    it(`should reference "module" bundle (FESM2022)`, () => {
      expect(PACKAGE['module']).to.equal('fesm2022/sample-material.mjs');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });
  });
});
