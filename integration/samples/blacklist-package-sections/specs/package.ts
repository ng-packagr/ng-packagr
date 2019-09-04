import { expect } from 'chai';

describe(`@sample/blacklist-package-sections`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should have a disallowed blacklisted field`, () => {
      expect(PACKAGE.version).to.be.ok;
    });

    it(`should not have testA field`, () => {
      expect(PACKAGE.testA).to.be.undefined;
    });

    it(`should have testB field`, () => {
      expect(PACKAGE.testB).to.be.ok;
    });

    it(`should not have testC field`, () => {
      expect(PACKAGE.testC).to.be.undefined;
    });
  });
});
