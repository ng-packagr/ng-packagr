import { expect } from 'chai';

describe(`@sample/apf`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should add package 'exports'`, () => {
      expect(PACKAGE['exports']).to.deep.equal({
        '.': {
          default: './fesm2022/sample-package-exports.mjs',
          types: './types/sample-package-exports.d.ts',
        },
        './package.json': {
          default: './package.json',
        },
        './sub': {
          foo: './sub/foo.js',
          default: './fesm2022/sample-package-exports-sub.mjs',
          types: './types/sample-package-exports-sub.d.ts',
        },
      });
    });
  });
});
