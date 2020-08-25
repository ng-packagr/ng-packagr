import { expect } from 'chai';

describe(`@sample/apf`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
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
      main: 'bundles/sample-apf.umd.js',
      module: 'fesm2015/sample-apf.js',
      es2015: 'fesm2015/sample-apf.js',
      esm2015: 'esm2015/sample-apf.js',
      fesm2015: 'fesm2015/sample-apf.js',
      typings: 'sample-apf.d.ts',
      metadata: 'sample-apf.metadata.json',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });
  });

  describe(`secondary/package.json`, () => {
    let PACKAGE;
    before(() => {
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
      main: '../bundles/sample-apf-secondary.umd.js',
      module: '../fesm2015/sample-apf-secondary.js',
      es2015: '../fesm2015/sample-apf-secondary.js',
      esm2015: '../esm2015/secondary/sample-apf-secondary.js',
      fesm2015: '../fesm2015/sample-apf-secondary.js',
      typings: 'sample-apf-secondary.d.ts',
      metadata: 'sample-apf-secondary.metadata.json',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });
  });

  describe(`secondary/testing/package.json`, () => {
    let PACKAGE;
    before(() => {
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
      main: '../../bundles/sample-apf-secondary-testing.umd.js',
      module: '../../fesm2015/sample-apf-secondary-testing.js',
      es2015: '../../fesm2015/sample-apf-secondary-testing.js',
      esm2015: '../../esm2015/secondary/testing/sample-apf-secondary-testing.js',
      fesm2015: '../../fesm2015/sample-apf-secondary-testing.js',
      typings: 'sample-apf-secondary-testing.d.ts',
      metadata: 'sample-apf-secondary-testing.metadata.json',
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
    before(() => {
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
      main: '../bundles/sample-apf-testing.umd.js',
      module: '../fesm2015/sample-apf-testing.js',
      es2015: '../fesm2015/sample-apf-testing.js',
      esm2015: '../esm2015/testing/sample-apf-testing.js',
      fesm2015: '../fesm2015/sample-apf-testing.js',
      typings: 'sample-apf-testing.d.ts',
      metadata: 'sample-apf-testing.metadata.json',
    }).forEach(([key, value]: [string, string]): void => {
      it(`should reference "${key}" file`, () => {
        expect(PACKAGE[key]).to.equal(value);
      });
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });
  });
});
