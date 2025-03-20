import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {
  describe(`sample-core.d.ts`, () => {
    it(`should exist`, () => {
      expect(fs.existsSync(path.resolve(__dirname, '../dist/types/sample-core.d.ts'))).to.be.true;
    });
  });
});
