import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/same-name`, () => {

  describe(`sample-testing.umd.min.js`, () => {
    let API;
    before(() => {
      API = require('../dist/bundles/sample-testing.umd.min.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

    it(`should export AngularModule`, () => {
      expect(API.AngularModule).to.be.ok;
    });

  });

  describe(`sample-testing-testing.umd.min.js`, () => {
    let API;
    before(() => {
      API = require('../dist/bundles/sample-testing-testing.umd.min.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

    it(`should export AngularModule`, () => {
      expect(API.AngularModule).to.be.ok;
    });

  });
});
