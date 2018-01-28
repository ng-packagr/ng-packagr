import { expect } from 'chai';

describe(`sample-custom-node-resolve`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named 'sample-custom-node-resolve'`, () => {
      expect(PACKAGE['name']).to.equal('sample-custom-node-resolve');
    });

    it(`should contain peerDependencies from original file`, () => {
      expect(PACKAGE['peerDependencies']).to.be.ok;
      expect(PACKAGE['peerDependencies']['@angular/core']).to.equal('^4.1.3');
      expect(PACKAGE['peerDependencies']['@angular/common']).to.equal('^4.1.3');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('bundles/sample-custom-node-resolve.umd.js');
    });

    it(`should reference "module" bundle (FESM5, also FESM2015)`, () => {
      expect(PACKAGE['module']).to.equal('esm5/sample-custom-node-resolve.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('esm2015/sample-custom-node-resolve.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-custom-node-resolve.d.ts');
    });
  });
});
