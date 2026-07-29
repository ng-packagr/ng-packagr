import { expect } from 'chai';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

describe(`issue-1451-license`, () => {
  let DIST: string;

  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe(`license entry point`, () => {
    ['types/example-issue-1451-license.d.ts', 'fesm2022/example-issue-1451-license.mjs'].forEach(
      (filePath: string): void => {
        it(`should exist: "${filePath}"`, () => {
          const exists = existsSync(resolve(DIST, filePath));
          expect(exists).to.be.true;
        });
      },
    );

    it(`should preserve legal comments and annotations while stripping JSDoc in JavaScript bundles`, () => {
      const content = readFileSync(resolve(DIST, 'fesm2022/example-issue-1451.mjs'), 'utf8');
      expect(content).to.include('@license MIT');
      expect(content).to.include('@__PURE__');
      expect(content).not.to.include('Normal JSDoc comment that should be removed');
    });
  });
});
