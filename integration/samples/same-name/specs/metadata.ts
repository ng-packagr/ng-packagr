import { expect } from 'chai';

describe(`@sample/same-name`, () => {
  describe(`sample-testing.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-testing.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
    });

    it(`should "importAs": "@sample/testing"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/testing');
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });
  });

  describe(`testing/sample-testing-testing.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/testing/sample-testing-testing.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
    });

    it(`should "importAs": "@sample/testing"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/testing/testing');
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });
  });
});
