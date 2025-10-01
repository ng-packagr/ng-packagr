import { expect } from 'chai';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe(`issue-1451-license`, () => {
  let DIST: string;

  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe(`license entry point`, () => {
    ['types/example-issue-1451-license.d.ts', 'fesm2022/example-issue-1451-license.mjs'].forEach((filePath: string): void => {
      it(`should exist: "${filePath}"`, () => {
        const exists = existsSync(resolve(DIST, filePath));
        expect(exists).to.be.true;
      });
    });
  });
});
