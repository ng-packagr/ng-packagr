import { expect } from 'chai';

describe('@sample/ivy', () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it('should exist', () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.ok;
    });
  });
});
