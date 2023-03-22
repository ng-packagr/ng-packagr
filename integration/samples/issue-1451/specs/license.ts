import { expect } from 'chai';
import { existsSync } from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';

describe(`issue-1451-license`, () => {
  let DIST: string;

  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe(`license entry point`, () => {
    [
      'esm2022/license/example-issue-1451-license.mjs',
      'esm2022/license/public-api.mjs',
      'fesm2022/example-issue-1451-license.mjs',
    ].forEach((filePath: string): void => {
      it(`should exist: "${filePath}"`, () => {
        const exists = existsSync(resolve(DIST, filePath));
        expect(exists).to.be.true;
      });
    });

    it(`license directory should contain 2 files`, () => {
      expect(glob.sync(`license/**/*`, { cwd: DIST }).length).equal(2);
    });
  });
});
