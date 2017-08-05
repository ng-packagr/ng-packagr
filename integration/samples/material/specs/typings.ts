import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/material`, () => {

  describe(`material.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'material.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
