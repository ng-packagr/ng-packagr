import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { globSync } from 'tinyglobby';
import { beforeAll, describe, expect, it } from 'vitest';

describe('@sample/dynamic-imports', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  describe('FESM2022', () => {
    it(`should contain 2 '.mjs.map' files`, () => {
      expect(globSync(`fesm2022/**/*.mjs.map`, { cwd: DIST }).length).equal(2);
    });

    it(`should contain 2 '.mjs' files`, () => {
      expect(globSync(`fesm2022/**/*.mjs`, { cwd: DIST }).length).equal(2);
    });
  });

  describe('fesm2022/sample-dynamic-imports.mjs', () => {
    it(`should lazy import`, () => {
      const content = readFileSync(join(DIST, 'fesm2022/sample-dynamic-imports.mjs'), { encoding: 'utf-8' });
      expect(content).to.match(/import\(["']\.\/sample-dynamic-imports-lazy-import-\w+\.mjs["']\)/);
    });
  });
});
