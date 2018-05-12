import { expect } from 'chai';

describe(`@sample/package-json`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should keep the sideEffects flag when its an array`, () => {
      expect(PACKAGE['sideEffects']).to.deep.equal(['*.css']);
    });
  });
});
