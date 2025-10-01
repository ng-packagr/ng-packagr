import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/same-name`, () => {
  describe(`sample-testing.d.ts`, () => {
    let TYPINGS;
    beforeAll(() => {
      TYPINGS = fs.readFileSync(path.resolve(__dirname, '..', 'dist/types/sample-testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

  describe(`sample-testing-testing.d.ts`, () => {
    let TYPINGS;
    beforeAll(() => {
      TYPINGS = fs.readFileSync(path.resolve(__dirname, '..', 'dist/types/sample-testing-testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });
});
