import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/secondary`, () => {
  describe(`secondary/package.json`, () => {
    let PACKAGE: any;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/secondary'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/secondary');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('types/sample-secondary.d.ts');
    });
  });
});
