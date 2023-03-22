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

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });
  });
});
