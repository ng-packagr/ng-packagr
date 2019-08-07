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

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should have 'tslib' as a dependency`, () => {
      expect(PACKAGE.dependencies.tslib).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/apf'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('bundles/sample-apf.umd.js');
    });

    it(`should reference "module" bundle (FESM5)`, () => {
      expect(PACKAGE['module']).to.equal('fesm5/sample-apf.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('fesm2015/sample-apf.js');
    });

    it(`should reference "esm5" file`, () => {
      expect(PACKAGE['esm5']).to.equal('esm5/sample-apf.js');
    });

    it(`should reference "esm2015" file`, () => {
      expect(PACKAGE['esm2015']).to.equal('esm2015/sample-apf.js');
    });

    it(`should reference "fesm2015" file`, () => {
      expect(PACKAGE['fesm2015']).to.equal('fesm2015/sample-apf.js');
    });

    it(`should reference "fesm5" file`, () => {
      expect(PACKAGE['fesm5']).to.equal('fesm5/sample-apf.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-apf.d.ts');
    });

    it(`should reference "metadata" file`, () => {
      expect(PACKAGE['metadata']).to.equal('sample-apf.metadata.json');
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

    it(`should not have 'tslib' as a dependency`, () => {
      expect(PACKAGE.dependencies && PACKAGE.dependencies.tslib).to.be.undefined;
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have 'prepublishOnly' script`, () => {
      expect(PACKAGE.scripts && PACKAGE.scripts.prepublishOnly).to.be.undefined;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/apf/secondary'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/apf/secondary');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('../bundles/sample-apf-secondary.umd.js');
    });

    it(`should reference "module" bundle (FESM5)`, () => {
      expect(PACKAGE['module']).to.equal('../fesm5/sample-apf-secondary.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('../fesm2015/sample-apf-secondary.js');
    });

    it(`should reference "esm5" file`, () => {
      expect(PACKAGE['esm5']).to.equal('../esm5/secondary/sample-apf-secondary.js');
    });

    it(`should reference "esm2015" file`, () => {
      expect(PACKAGE['esm2015']).to.equal('../esm2015/secondary/sample-apf-secondary.js');
    });

    it(`should reference "fesm2015" file`, () => {
      expect(PACKAGE['fesm2015']).to.equal('../fesm2015/sample-apf-secondary.js');
    });

    it(`should reference "fesm5" file`, () => {
      expect(PACKAGE['fesm5']).to.equal('../fesm5/sample-apf-secondary.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-apf-secondary.d.ts');
    });

    it(`should reference "metadata" file`, () => {
      expect(PACKAGE['metadata']).to.equal('sample-apf-secondary.metadata.json');
    });

    it(`should apply the 'sideEffects: false' flag by default`, () => {
      expect(PACKAGE['sideEffects']).to.be.false;
    });
  });
});
