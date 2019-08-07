import { expect } from 'chai';

describe('@sample/ivy', () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it('should exist', () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.ok;
    });
  });

  describe(`secondary/package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/secondary/package.json');
    });

    it('should exist', () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });
  });
});
