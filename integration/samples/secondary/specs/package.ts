import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/secondary`, () => {

  describe(`secondary-lib/package.json`, () => {
    const BASE = path.resolve(__dirname, '..', 'dist');
    let PACKAGE;
    before(() => {
      PACKAGE = JSON.parse(fs.readFileSync(`${BASE}/package.json`, 'utf-8'));
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/secondary-lib'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/secondary-lib');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('bundles/secondary-lib.umd.js');
    });

    it(`should reference "module" bundle (FESM5, also FESM2015)`, () => {
      expect(PACKAGE['module']).to.equal('esm5/secondary-lib.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('esm2015/secondary-lib.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('secondary-lib.d.ts');
    });
  });

  describe(`sub-module/package.json`, () => {
    const BASE = path.resolve(__dirname, '..', 'dist', 'sub-module');
    let PACKAGE;
    before(() => {
      PACKAGE = JSON.parse(fs.readFileSync(`${BASE}/package.json`, 'utf-8'));
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/secondary-lib/sub-module'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/secondary-lib/sub-module');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('../bundles/secondary-lib-sub-module.umd.js');
    });

    it(`should reference "module" bundle (FESM5, also FESM2015)`, () => {
      expect(PACKAGE['module']).to.equal('../esm5/sub-module.js');
    });

    it(`should reference "es2015" bundle (FESM2015)`, () => {
      expect(PACKAGE['es2015']).to.equal('../esm2015/sub-module.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sub-module.d.ts');
    });
  });

  describe(`should-be-ignored/package.json`, () => {
    const BASE = path.resolve(__dirname, '..', 'dist', 'should-be-ignored');

    it(`should not exist`, () => {
      expect(() => fs.readFileSync(`${BASE}/package.json`, 'utf-8')).throw();
    });
  });

});
