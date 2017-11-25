import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as API from '../dist/@sample/jsx.es5.js';

describe(`@sample/jsx`, () => {

  describe(`jsx.es5.js`, () => {

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
