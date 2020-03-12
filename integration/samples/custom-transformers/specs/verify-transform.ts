import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

// The transformer should inject an anonymous function into the call to AssertType.
// The only thing we care about here is to check that the effect of the transformer is visible.
// The details of what the transformer does are irrelevant here.

const TRANSPILED_ES5_SAMPLE = 'AssertType(function (object) {';
const TRANSPILED_ES2015_SAMPLE = 'AssertType(object => {';

describe(`@sample/custom-transformers`, () => {
  describe(`esm5 bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/fesm5/sample-custom-transformers.js'), 'utf-8');
    });
    it(`should have been transformed`, () => {
      expect(BUNDLE).to.contain(TRANSPILED_ES5_SAMPLE);
    });
  });
  describe(`esm2015 bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/fesm2015/sample-custom-transformers.js'), 'utf-8');
    });
    it(`should have been transformed`, () => {
      expect(BUNDLE).to.contain(TRANSPILED_ES2015_SAMPLE);
    });
  });
  describe(`umd bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/bundles/sample-custom-transformers.umd.js'), 'utf-8');
    });
    it(`should have been transformed`, () => {
      expect(BUNDLE).to.contain(TRANSPILED_ES5_SAMPLE);
    });
  });
  describe(`transpiled esm5 service`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/esm5/src/angular.service.js'), 'utf-8');
    });
    it(`should have been transformed`, () => {
      expect(BUNDLE).to.contain(TRANSPILED_ES5_SAMPLE);
    });
  });
  describe(`transpiled esm2015 service`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/esm2015/src/angular.service.js'), 'utf-8');
    });
    it(`should have been transformed`, () => {
      expect(BUNDLE).to.contain(TRANSPILED_ES2015_SAMPLE);
    });
  });
});
