import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`esm5/sample-core.js.map`, () => {
    let sourceMap;
    before(() => {
      sourceMap = fs.readJsonSync(path.resolve(__dirname, '../dist/esm5/sample-core.js.map'));
    })

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it(`should have 'sources' and 'sourcesContent' property`, () => {
      expect(sourceMap.sources).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sourcesContent).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sources).to.have.lengthOf(sourceMap.sourcesContent.length);
    });

    it(`should reference each 'sources' path with a common prefix`, () => {
      const everyUeveryMe = (sourceMap.sources as string[])
        .every(fileName => fileName.startsWith(`ng://@sample/core`));

      expect(everyUeveryMe).to.be.true;
    });

  });
});
