import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe(`@sample/secondary`, () => {
  describe(`secondary/package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/secondary'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/secondary');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('bundles/sample-secondary.umd.js');
    });

    it(`should reference "module" bundle (FESM5)`, () => {
      expect(PACKAGE['module']).to.equal('fesm5/sample-secondary.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-secondary.d.ts');
    });

    it(`should reference "metadata" file`, () => {
      expect(PACKAGE['metadata']).to.equal('sample-secondary.metadata.json');
    });
  });

  describe(`sub-module/package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/sub-module/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should not have ngPackage field`, () => {
      expect(PACKAGE.ngPackage).to.be.undefined;
    });

    it(`should be named '@sample/secondary/sub-module'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/secondary/sub-module');
    });

    it(`should reference "main" bundle (UMD)`, () => {
      expect(PACKAGE['main']).to.equal('../bundles/sample-secondary-sub-module.umd.js');
    });

    it(`should reference "module" bundle (FESM5)`, () => {
      expect(PACKAGE['module']).to.equal('../fesm5/sample-secondary-sub-module.js');
    });

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-secondary-sub-module.d.ts');
    });

    it(`should reference "metadata" file`, () => {
      expect(PACKAGE['metadata']).to.equal('sample-secondary-sub-module.metadata.json');
    });
  });

  describe(`should-be-ignored/package.json`, () => {
    it(`should not exist`, () => {
      expect(() =>
        fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'should-be-ignored', 'package.json'), 'utf-8'),
      ).throw();
    });
  });
});
