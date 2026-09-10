import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/core - sourcemaps`, () => {
  describe(`fesm2022/sample-core.mjs.map`, () => {
    let sourceMap: any;
    beforeAll(() => {
      sourceMap = JSON.parse(readFileSync(resolve(__dirname, '../dist/fesm2022/sample-core.mjs.map'), 'utf-8'));
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
