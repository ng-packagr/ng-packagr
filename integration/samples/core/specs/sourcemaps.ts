import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`esm5/core.js.map`, () => {
    let sourceMap;
    before(() => {
      sourceMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'esm5', 'core.js.map'), 'utf-8'));
    })

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it(`should have 'sources' property`, () => {
      expect(sourceMap.sources).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sources).to.have.lengthOf(6);
    });

    it(`should have 'sourcesContent' property`, () => {
      expect(sourceMap.sourcesContent).to.be.an('array').that.is.not.empty;
      expect(sourceMap.sourcesContent).to.have.lengthOf(6);
    });

    it(`should reference each 'sources' path with a common prefix`, () => {
      const everyUeveryMe = (sourceMap.sources as string[])
        .every(fileName => fileName.startsWith(`ng://@sample/core`));

      expect(everyUeveryMe).to.be.true;
    });

  });
});
