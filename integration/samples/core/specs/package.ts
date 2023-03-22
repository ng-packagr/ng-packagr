import { expect } from 'chai';

describe(`@sample/core`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/core'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/core');
    });

    it(`should reference "module" bundle (FESM2022)`, () => {
      expect(PACKAGE['module']).to.equal('fesm2022/sample-core.mjs');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });

    it(`should have 'scripts' section removed`, () => {
      expect(PACKAGE['scripts']).to.be.undefined;
    });

    it(`should keep the 'sideEffects: true' flag`, () => {
      expect(PACKAGE['sideEffects']).to.be.true;
    });
  });
});
