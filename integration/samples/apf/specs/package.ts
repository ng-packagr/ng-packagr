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

    it(`should reference "typings" file`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });

    it(`should reference "module" file`, () => {
      expect(PACKAGE['module']).to.equal('fesm2022/sample-apf.mjs');
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
