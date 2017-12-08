import { expect } from 'chai';
import * as path from 'path';

describe(`@sample/material`, () => {

  describe(`material.umd.js`, () => {
    let UMD_MODULE;
    before(() => {
      UMD_MODULE = require('../dist/bundles/sample-material.umd.js');
    });

    it(`should exist`, () => {
      expect(UMD_MODULE).to.be.ok;
    });

    it(`should have "BazComponent"`, () => {
      expect(UMD_MODULE.BazComponent).to.be.ok;
    });

  });
});
