import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`@sample/api`, () => {
  describe('sample-api.d.ts.map', () => {
    let sourceMap;
    beforeAll(() => {
      sourceMap = fs.readJsonSync(path.resolve(__dirname, '../dist/types/sample-api.d.ts.map'));
    });

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it('should point to the correct source path', () => {
      expect(sourceMap.sources[0]).to.equal('../../src/angular.component.ts');
    });
  });
});
