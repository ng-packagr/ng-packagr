import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/jsx`, () => {
  describe(`jsx.es5.js`, () => {
    let API;
    before(() => {
      API = require('../dist/fesm5/sample-jsx.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export ReactLabel`, () => {
      expect(API['ReactLabel']).to.be.undefined;
    });

    it(`should export AngularReactLabel`, () => {
      expect(API.AngularReactLabel).to.be.ok;
    });

    // TODO: verify import statements in es5.js file ...
    // ... read js file thru TypeScript compiler API
    // ... and verify on the AST
  });
});
