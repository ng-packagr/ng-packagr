import { expect } from 'chai';

describe(`@sample/same-name`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/testing'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/testing');
    });

    it(`should reference "es2020" bundle (FESM2020)`, () => {
      expect(PACKAGE['es2020']).to.equal('fesm2020/sample-testing.mjs');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });
  });
});
