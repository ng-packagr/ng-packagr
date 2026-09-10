import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/package-js`, () => {
  describe(`package.json`, () => {
    let PACKAGE: any;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });
  });
});
