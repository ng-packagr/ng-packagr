import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as API from '../dist/esm5/testing.js';
import * as APITesting from '../dist/esm5/testing/testing.js';

describe(`@sample/same-name`, () => {

  describe(`esm5/testing.js`, () => {

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

  });

  describe(`esm5/testing/testing.js`, () => {

    it(`should exist`, () => {
      expect(APITesting).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(APITesting.AngularComponent).to.be.ok;
    });

  });
});
