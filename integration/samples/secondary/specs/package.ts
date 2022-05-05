import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe(`@sample/secondary`, () => {
  describe(`secondary/package.json`, () => {
    let PACKAGE;
    beforeAll(() => {
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
      expect(PACKAGE['typings']).to.equal('index.d.ts');
    });
  });

  describe(`should-be-ignored/index.d.ts`, () => {
    it(`should not exist`, () => {
      expect(() =>
        fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'should-be-ignored', 'index.d.ts'), 'utf-8'),
      ).throw();
    });
  });
});
