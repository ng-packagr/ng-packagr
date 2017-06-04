import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {
  const TYPINGS = fs.readFileSync(
    path.resolve(__dirname, '..', 'dist', 'core.d.ts'), 'utf-8');

  describe(`core.d.ts`, () => {

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
