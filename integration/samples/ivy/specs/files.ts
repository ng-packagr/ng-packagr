import { expect } from 'chai';
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';

describe('@sample/ivy', () => {
  let DIST: string;
  before(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('dist', () => {
    it('should not contain metadata files', () => {
      const files = glob.sync(path.join(DIST, '**/*.metadata.json'));
      expect(files.length).to.equals(0);
    });
  });

  describe('angular.component.d.ts', () => {
    it(`should contain Ivy declarations`, () => {
      const content = fs.readFileSync(path.join(DIST, 'src/angular.component.d.ts'), { encoding: 'utf-8' });
      expect(content).to.contain('ɵcmp');
    });
  });

  describe('fesm2015/sample-ivy.js', () => {
    it(`should contain Ivy generated code`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2015/sample-ivy.js'), { encoding: 'utf-8' });
      expect(content).to.contain('ɵcmp');
      expect(content).to.contain('ɵɵelementStart(0, "h1")');
    });

    it(`should contain tsickle transformed code`, () => {
      const content = fs.readFileSync(path.join(DIST, 'fesm2015/sample-ivy.js'), { encoding: 'utf-8' });
      expect(content).to.contain('/** @nocollapse */');
    });
  });
});
