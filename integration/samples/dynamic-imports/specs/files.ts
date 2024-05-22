import { expect } from 'chai';
import * as path from 'path';
import { sync } from 'fast-glob';
import * as fs from 'fs';

describe('@sample/dynamic-imports', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('FESM2022', () => {
    it(`should contain 2 '.mjs.map' files`, () => {
      expect(sync(`fesm2022/**/*.mjs.map`, { cwd: DIST }).length).equal(2);
    });

    it(`should contain 2 '.mjs' files`, () => {
      expect(sync(`fesm2022/**/*.mjs`, { cwd: DIST }).length).equal(2);
    });
  });

  describe('fesm2022/sample-dynamic-imports.mjs', () => {
    it(`should lazy import`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2022/sample-dynamic-imports.mjs'), { encoding: 'utf-8' });
      expect(content).to.match(/import\('\.\/sample-dynamic-imports-lazy-import-\w+\.mjs'\)/);
    });
  });
});
