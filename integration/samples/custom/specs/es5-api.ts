import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom`, () => {
  describe(`esm5/sample-custom.js`, () => {
    let API;
    before(() => {
      API = require('../dist/fesm5/sample-custom.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export InternalService`, () => {
      expect(API['InternalService']).to.be.undefined;
    });
  });
});
