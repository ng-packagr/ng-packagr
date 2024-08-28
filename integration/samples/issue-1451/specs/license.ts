import { expect } from 'chai';
import { existsSync } from 'fs';
import { sync } from 'fast-glob';
import { resolve } from 'path';

describe(`issue-1451-license`, () => {
  let DIST: string;

  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe(`license entry point`, () => {
    ['license/index.d.ts', 'fesm2022/example-issue-1451-license.mjs'].forEach((filePath: string): void => {
      it(`should exist: "${filePath}"`, () => {
        const exists = existsSync(resolve(DIST, filePath));
        expect(exists).to.be.true;
      });
    });

    it(`license directory should contain 3 files`, () => {
      expect(sync(`license/**/*`, { cwd: DIST }).length).equal(3);
    });
  });
});
