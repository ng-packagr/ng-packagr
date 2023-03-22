import { expect } from 'chai';

describe(`sample-custom`, () => {
  describe(`package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named 'sample-custom'`, () => {
      expect(PACKAGE['name']).to.equal('sample-custom');
    });

    it(`should contain peerDependencies from original file`, () => {
      expect(PACKAGE['peerDependencies']).to.be.ok;
      expect(PACKAGE['peerDependencies']['@angular/core']).to.equal('^4.1.3');
      expect(PACKAGE['peerDependencies']['@angular/common']).to.equal('^4.1.3');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });

    it(`should keep 'scripts' section intact`, () => {
      expect(PACKAGE['scripts']).to.be.ok;
    });
  });
});
