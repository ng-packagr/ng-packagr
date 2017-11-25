import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as API from '../dist/@sample/secondary-lib.js';
import * as SECONDARY from '../dist/@sample/secondary-lib/sub-module.js'

describe(`@sample/secondary-lib`, () => {

  describe(`secondary-lib.js`, () => {

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export BazComponent`, () => {
      expect(API.BazComponent).to.be.ok;
    });

  });
});

describe(`@sample/secondary-lib/sub-module`, () => {

  describe(`sub-module.js`, () => {

    it(`should exist`, () => {
      expect(SECONDARY).to.be.ok;
    });

    it(`should export BarComponent`, () => {
      expect(SECONDARY.BarComponent).to.be.ok;
    });

  });
});
