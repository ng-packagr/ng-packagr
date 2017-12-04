import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/secondary-lib`, () => {

  describe(`es5: sample-secondary-lib.js`, () => {
    let API;
    before(() => {
      API = require('../dist/esm5/sample-secondary-lib.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export BazComponent`, () => {
      expect(API.BazComponent).to.be.ok;
    });

  });
});

describe(`@sample/secondary-lib/sub-module`, () => {

  describe(`es5: sample-secondary-lib-sub-module.js`, () => {
    let SECONDARY;
    before(() => {
      SECONDARY = require('../dist/esm5/sample-secondary-lib-sub-module.js');
    });

    it(`should exist`, () => {
      expect(SECONDARY).to.be.ok;
    });

    it(`should export BarComponent`, () => {
      expect(SECONDARY.BarComponent).to.be.ok;
    });

  });
});
