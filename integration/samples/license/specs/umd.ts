import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/sample-license`, () => {
  describe(`sample-license.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-license.umd.js'), 'utf-8');
    });

    it(`should add the license at the top of the bundle`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });

  describe(`sample-license.umd.min.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-license.umd.min.js'), 'utf-8');
    });

    it(`should add the license at the top of the bundle`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });
});
