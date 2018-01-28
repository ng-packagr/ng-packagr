import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom-node-resolve`, () => {
  describe(`sample-custom-node-resolve.d.ts`, () => {
    let TYPINGS;
    before(() => {
      TYPINGS = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'sample-custom-node-resolve.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });

    it(`should re-export 'InternalService' with an alias`, () => {
      expect(TYPINGS).to.contain(`export { InternalService as ɵa } from './internal.service';`);
    });
  });
});
