import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom`, () => {
  const TYPINGS = fs.readFileSync(
    path.resolve(__dirname, '..', 'dist', 'sample-custom.d.ts'), 'utf-8');

  describe(`sample-custom.d.ts`, () => {

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });

    it(`should re-export 'InternalService' with an alias`, () => {
      expect(TYPINGS).to.contain(`export { InternalService as ɵa } from './internal.service';`);
    });
  });

});
