import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as API from '../dist/esm5/sample-custom.js';

describe(`sample-custom`, () => {

  describe(`esm5/sample-custom.js`, () => {

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export InternalService`, () => {
      expect(API['InternalService']).to.be.undefined;
    });

  });
});
