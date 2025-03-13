import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom`, () => {
  describe(`sample-custom.d.ts`, () => {
    it(`should exist`, () => {
      expect(fs.existsSync(path.resolve(__dirname, '../dist/types/sample-custom.d.ts'))).to.be.true;
    });
  });
});
