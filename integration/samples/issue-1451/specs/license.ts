import { expect } from 'chai';
import { existsSync } from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';

describe(`issue-1451-license`, () => {
  let DIST: string;

  before(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe(`license entry point`, () => {
    [
      'license/package.json',
      'esm2020/license/example-issue-1451-license.js',
      'esm2020/license/public-api.js',
      'fesm2020/example-issue-1451-license.js',
    ].forEach((filePath: string): void => {
      it(`should exist: "${filePath}"`, () => {
        const exists = existsSync(resolve(DIST, filePath));
        expect(exists).to.be.true;
      });
    });

    it(`license directory should contain 4 files`, () => {
      expect(glob.sync(`${DIST}/license/**/*`).length).equal(3);
    });
  });

});
