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
      module: 'fesm2015/sample-apf.mjs',
      es2020: 'fesm2020/sample-apf.mjs',
      esm2020: 'esm2020/sample-apf.mjs',
      fesm2020: 'fesm2020/sample-apf.mjs',
      typings: 'sample-apf.d.ts',
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
        './package.json': {
          default: './package.json',
        },
        '.': {
          types: './sample-apf.d.ts',
          default: './fesm2020/sample-apf.mjs',
        },
        './secondary': {
          types: './secondary/sample-apf-secondary.d.ts',
          default: './fesm2020/sample-apf-secondary.mjs',
        },
        './secondary/testing': {
          types: './secondary/testing/sample-apf-secondary-testing.d.ts',
          default: './fesm2020/sample-apf-secondary-testing.mjs',
        },
        './testing': {
          types: './testing/sample-apf-testing.d.ts',
          default: './fesm2020/sample-apf-testing.mjs',
        },
      });
    });
  });

  describe(`secondary/package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/secondary/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/apf/secondary'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf/secondary');
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should not have 'tslib' as a dependencies`, () => {
      expect(PACKAGE.dependencies && PACKAGE.dependencies.tslib).to.be.undefined;
    });

    Object.entries({
      module: '../fesm2015/sample-apf-secondary.mjs',
      fesm2015: '../fesm2015/sample-apf-secondary.mjs',
      es2020: '../fesm2020/sample-apf-secondary.mjs',
      esm2020: '../esm2020/secondary/sample-apf-secondary.mjs',
      fesm2020: '../fesm2020/sample-apf-secondary.mjs',
      typings: 'sample-apf-secondary.d.ts',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });

    it(`should not add package 'exports'`, () => {
      expect(PACKAGE['exports']).to.be.undefined;
    });
  });

  describe(`secondary/testing/package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/secondary/testing/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/apf/secondary/testing'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf/secondary/testing');
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should not have 'tslib' as a dependencies`, () => {
      expect(PACKAGE.dependencies && PACKAGE.dependencies.tslib).to.be.undefined;
    });

    Object.entries({
      module: '../../fesm2015/sample-apf-secondary-testing.mjs',
      fesm2015: '../../fesm2015/sample-apf-secondary-testing.mjs',
      es2020: '../../fesm2020/sample-apf-secondary-testing.mjs',
      esm2020: '../../esm2020/secondary/testing/sample-apf-secondary-testing.mjs',
      fesm2020: '../../fesm2020/sample-apf-secondary-testing.mjs',
      typings: 'sample-apf-secondary-testing.d.ts',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });
  });

  describe(`testing/package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/testing/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/apf/testing'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf/testing');
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should not have 'tslib' as a dependencies`, () => {
      expect(PACKAGE.dependencies && PACKAGE.dependencies.tslib).to.be.undefined;
    });

    Object.entries({
      module: '../fesm2015/sample-apf-testing.mjs',
      es2020: '../fesm2020/sample-apf-testing.mjs',
      esm2020: '../esm2020/testing/sample-apf-testing.mjs',
      fesm2020: '../fesm2020/sample-apf-testing.mjs',
      typings: 'sample-apf-testing.d.ts',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });

    it(`should not add package 'exports'`, () => {
      expect(PACKAGE['exports']).to.be.undefined;
    });
  });
});
