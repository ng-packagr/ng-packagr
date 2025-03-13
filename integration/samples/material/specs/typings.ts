import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/material`, () => {
  describe(`sample-material.d.ts`, () => {
    it(`should exist`, () => {
      expect(fs.existsSync(path.resolve(__dirname, '../dist/types/sample-material.d.ts'))).to.be.true;
    });
  });
});
