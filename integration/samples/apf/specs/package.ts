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

    it(`should be named '@sample/apf'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf');
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should have 'tslib' as a direct dependencies`, () => {
      expect(PACKAGE.dependencies.tslib).to.be.ok;
    });

    Object.entries({
      module: 'fesm2022/sample-apf.mjs',
      typings: 'index.d.ts',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });

    it(`should add package 'exports'`, () => {
      expect(PACKAGE['exports']).to.deep.equal({
        '.': {
          sass: './theming.scss',
          types: './index.d.ts',
          default: './fesm2022/sample-apf.mjs',
        },
        './theming': {
          sass: './theming.scss',
        },
        './package.json': {
          default: './package.json',
        },
        './secondary': {
          types: './secondary/index.d.ts',
          default: './fesm2022/sample-apf-secondary.mjs',
        },
        './secondary/testing': {
          types: './secondary/testing/index.d.ts',
          default: './fesm2022/sample-apf-secondary-testing.mjs',
        },
        './testing': {
          types: './testing/index.d.ts',
          default: './fesm2022/sample-apf-testing.mjs',
        },
      });
    });
  });
});
