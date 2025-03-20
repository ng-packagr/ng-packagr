import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/same-name`, () => {
  describe(`sample-testing.d.ts`, () => {
    it(`should exist`, () => {
      expect(fs.existsSync(path.resolve(__dirname, '../dist/types/sample-testing.d.ts'))).to.be.true;
    });
  });

  describe(`sample-testing-testing.d.ts`, () => {
    it(`should exist`, () => {
      expect(fs.existsSync(path.resolve(__dirname, '../dist/types/sample-testing-testing.d.ts'))).to.be.true;
    });
  });
});
