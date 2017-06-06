import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
const BASE = path.resolve(__dirname, '..', 'dist');

describe(`@sample/material`, () => {

  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = JSON.parse(fs.readFileSync(`${BASE}/package.json`, 'utf-8'));
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/material'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/material');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('bundles/material.umd.js');
    });

    it(`should reference "module" bundle (FESM5, also FESM2014)`, () => {
      expect(PACKAGE['module']).to.equal('@sample/material.es5.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('@sample/material.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('material.d.ts');
    });
  });
});
