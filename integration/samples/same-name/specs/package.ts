import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/same-name - package.json`, () => {
  describe(`package.json`, () => {
    let PACKAGE: any;
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
      expect(PACKAGE['typings']).to.equal('types/sample-testing.d.ts');
    });
  });
});
