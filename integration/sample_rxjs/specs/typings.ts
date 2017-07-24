import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/rxjs`, () => {

  describe(`core.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'rxjs.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

});
