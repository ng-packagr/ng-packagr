import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/material`, () => {

  describe(`material.metadata.json`, () => {
    let METADATA;
    before(() => {
      METADATA = require('../dist/sample-material.metadata.json');
    });

    it(`should exist`, () => {
      expect(METADATA).to.be.ok;
    });

    it(`should be version 4`, () => {
      expect(METADATA.version).to.equal(4);
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
        expect(METADATA['metadata'].BazComponent.decorators[0].arguments[0].styles[0]).to.have.string('color:"red"');
      });
      it(`should have style with: "content: \\2014 \\00A0"`, () => {
        expect(METADATA['metadata'].BazComponent.decorators[0].arguments[0].styles[0]).to.have.string('content:"\\2014 \\00A0"');
      });
    });

  });
});
