import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`@sample/core`, () => {
  describe(`fesm2015/sample-core.js.map`, () => {
    let sourceMap;
    before(() => {
      sourceMap = fs.readJsonSync(path.resolve(__dirname, '../dist/fesm2015/sample-core.js.map'));
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

  describe(`bundles/sample-core.umd.min.js.map`, () => {
    let sourceMap;
    before(() => {
      sourceMap = fs.readJsonSync(path.resolve(__dirname, '../dist/bundles/sample-core.umd.min.js.map'));
    });

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it(`should not have any 'null' in sources`, () => {
      expect(sourceMap.sources.includes(null)).to.be.false;
    });

    it(`should have 'sources' and 'sourcesContent' property`, () => {
      expect(sourceMap.sources).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sourcesContent).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sources).to.have.lengthOf(sourceMap.sourcesContent.length);
    });
  });
});
