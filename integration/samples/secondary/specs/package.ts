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

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-secondary.d.ts');
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

    it(`should reference "typings" files`, () => {
      expect(PACKAGE['typings']).to.equal('sample-secondary-sub-module.d.ts');
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
