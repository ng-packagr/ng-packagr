import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/same-name`, () => {

  describe(`testing.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

  describe(`testing/testing.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'testing', 'testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
