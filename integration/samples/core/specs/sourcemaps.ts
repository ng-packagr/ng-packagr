import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`@sample/core`, () => {
  describe(`fesm2022/sample-core.mjs.map`, () => {
    let sourceMap;
    beforeAll(() => {
      sourceMap = fs.readJsonSync(path.resolve(__dirname, '../dist/fesm2022/sample-core.mjs.map'));
    });

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it(`should have 'sources' and 'sourcesContent' property`, () => {
      expect(sourceMap.sources).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sourcesContent).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sources).to.have.lengthOf(sourceMap.sourcesContent.length);
    });

    it('should point to the correct source path', () => {
      expect(sourceMap.sources[0]).to.equal('../../src/angular.component.ts');
    });
  });
});
