import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/comments`, () => {
  describe(`sample-comments.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-comments.umd.js'), 'utf-8');
    });

    it(`should contain all the comments by default`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });

  describe(`sample-comments.umd.min.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-comments.umd.min.js'), 'utf-8');
    });

    it(`should contain all the comments by default`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });
});
