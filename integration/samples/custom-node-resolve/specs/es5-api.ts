import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom-node-resolve`, () => {
  describe(`esm5/sample-custom-node-resolve.js`, () => {
    let API;
    before(() => {
      API = require('../dist/esm5/sample-custom-node-resolve.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export InternalService`, () => {
      expect(API['InternalService']).to.be.undefined;
    });
  });
});
