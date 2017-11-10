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

    describe(`BazComponent`, () => {
      it(`should have "BazComponent.decorators"`, () => {
        expect(METADATA['metadata'].BazComponent.decorators).to.be.ok;
      });
  
      it(`should have styles for "BazComponent"`, () => {
        expect(METADATA['metadata'].BazComponent.decorators[0].arguments[0].styles).to.be.ok;
      });
  
      it(`should have style with: "color: red"`, () => {
        expect(METADATA['metadata'].BazComponent.decorators[0].arguments[0].styles[0]).to.have.string('color: "red"');
      });
    });

  });
});
