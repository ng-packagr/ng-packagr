import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/material`, () => {

  describe(`material.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = JSON.parse(fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'material.metadata.json'), 'utf-8'));
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be "__symbolic": "module"`, () => {
      expect(METADATA['__symbolic']).to.equal('module');
    });

    it(`should "importAs": "@sample/material"`, () => {
      expect(METADATA['importAs']).to.equal('@sample/material');
    });

  });
});
