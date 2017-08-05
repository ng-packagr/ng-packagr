import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`core.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'core.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
