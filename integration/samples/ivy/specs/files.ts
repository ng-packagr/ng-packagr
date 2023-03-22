import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe('@sample/ivy', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('angular.component.d.ts', () => {
    it(`should contain Ivy declarations`, () => {
      const content = fs.readFileSync(path.join(DIST, 'src/angular.component.d.ts'), { encoding: 'utf-8' });
      expect(content).to.contain('ɵcmp');
    });
  });

  describe('fesm2022/sample-ivy.mjs', () => {
    it(`should contain Ivy generated code`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2022/sample-ivy.mjs'), { encoding: 'utf-8' });
      expect(content).to.contain('ɵcmp');
      expect(content).to.contain('ɵɵelementStart(0, "h1")');
    });

    it(`should contain tsickle transformed code`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2022/sample-ivy.mjs'), { encoding: 'utf-8' });
      expect(content).to.contain('/** @nocollapse */');
    });
  });
});
