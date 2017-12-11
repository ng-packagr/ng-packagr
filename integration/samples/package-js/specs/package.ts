import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/package-js`, () => {

  describe(`package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });
  });

  describe(`secondary/package.json`, () => {
    let PACKAGE;
    before(() => {
      PACKAGE = require('../dist/secondary/package.json');
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });
  });

});
