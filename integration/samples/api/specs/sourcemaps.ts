import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/api`, () => {
  describe('sample-api.d.ts.map', () => {
    let sourceMap: any;
    beforeAll(() => {
      sourceMap = JSON.parse(readFileSync(resolve(__dirname, '../dist/types/sample-api.d.ts.map'), 'utf-8'));
    });

    it(`should exist`, () => {
      expect(sourceMap).to.be.ok;
    });

    it('should point to the correct source path', () => {
      expect(sourceMap.sources[0]).to.equal('../../src/angular.component.ts');
    });
  });
});
