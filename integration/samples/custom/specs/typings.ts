import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom`, () => {
  describe(`index.d.ts`, () => {
    let TYPINGS;
    beforeAll(() => {
      TYPINGS = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'index.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });
});
