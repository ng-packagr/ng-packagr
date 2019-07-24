import { expect } from 'chai';

describe(`@sample/secondary`, () => {
  describe(`sample-secondary.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-secondary.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@sample/secondary"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/secondary');
    });
  });

  describe(`sample-secondary-sub-module.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sub-module/sample-secondary-sub-module.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@sample/secondary/sub-module"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/secondary/sub-module');
    });
  });
});
