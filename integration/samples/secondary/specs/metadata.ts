import { expect } from 'chai';

describe(`@sample/secondary`, () => {

  describe(`sample-secondary-lib.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-secondary-lib.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@sample/secondary-lib"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/secondary-lib');
    });
  });

  describe(`sample-secondary-lib-sub-module.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sub-module/sample-secondary-lib-sub-module.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@sample/secondary-lib/sub-module"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/secondary-lib/sub-module');
    });

  });
});
