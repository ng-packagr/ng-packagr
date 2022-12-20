import { expect } from 'chai';
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';

describe('@sample/dynamic-imports', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('FESM2020', () => {
    it(`should contain 2 '.mjs.map' files`, () => {
      expect(glob.sync(`fesm2020/**/*.mjs.map`, { cwd: DIST }).length).equal(2);
    });

    it(`should contain 2 '.mjs' files`, () => {
      expect(glob.sync(`fesm2020/**/*.mjs`, { cwd: DIST }).length).equal(2);
    });
  });

  describe('FESM2015', () => {
    it(`should contain 2 '.mjs.map' files`, () => {
      expect(glob.sync(`fesm2015/**/*.mjs.map`, { cwd: DIST }).length).equal(2);
    });

    it(`should contain 2 '.mjs' files`, () => {
      expect(glob.sync(`fesm2015/**/*.mjs`, { cwd: DIST }).length).equal(2);
    });
  });

  describe('fesm2020/sample-dynamic-imports.mjs', () => {
    it(`should lazy import`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2020/sample-dynamic-imports.mjs'), { encoding: 'utf-8' });
      expect(content).to.match(/import\('\.\/sample-dynamic-imports-lazy-import-\w+\.mjs'\)/);
    });
  });

  describe('fesm2015/sample-dynamic-imports.mjs', () => {
    it(`should lazy import`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2015/sample-dynamic-imports.mjs'), { encoding: 'utf-8' });
      expect(content).to.match(/import\('\.\/sample-dynamic-imports-lazy-import-\w+\.mjs'\)/);
    });
  });
});
