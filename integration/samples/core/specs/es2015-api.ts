import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {
  describe(`esm2015/sample-core.js`, () => {
    let API;
    let BUNDLE;

    before(() => {
      API = require('../dist/esm2015/sample-core.js');
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/esm2015/sample-core.js'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

    it(`should export AngularDirective`, () => {
      expect(API.AngularDirective).to.be.ok;
    });

    it(`should export AngularModule`, () => {
      expect(API.AngularModule).to.be.ok;
    });

    it(`should export AngularPipe`, () => {
      expect(API.AngularPipe).to.be.ok;
    });

    it(`should export AngularService`, () => {
      expect(API.AngularService).to.be.ok;
    });

    it(`should not import TS helpers from 'tslib'`, () => {
      expect(BUNDLE).not.to.contain('tslib');
    });
  });
});
