import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/secondary`, () => {

  describe(`secondary-lib.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = JSON.parse(fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'secondary-lib.metadata.json'), 'utf-8'));
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

  describe(`sub-module.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = JSON.parse(fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'sub-module', 'sub-module.metadata.json'), 'utf-8'));
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
