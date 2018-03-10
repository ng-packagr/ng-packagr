import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/sample-comments-remove`, () => {
  describe(`sample-comments-remove.umd.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-comments-remove.umd.js'),
        'utf-8'
      );
    });

    it(`should not contain all the comments by default`, () => {
      expect(BUNDLE).not.to.contain(`Copyright  Example Software.`);
    });

    it(`should use lib name as amd id`, () => {
      expect(BUNDLE).to.contain(`define('@sample/comments-remove', ['exports'`);
    });

    it(`should give the global-scope export an umd id`, () => {
      expect(BUNDLE).to.contain(`factory((global.sample = global.sample || {}, global.sample['comments-remove'] = {})`);
    });
  });

  describe(`sample-comments-remove.umd.min.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(
        path.resolve(__dirname, '..', 'dist', 'bundles', 'sample-comments-remove.umd.min.js'),
        'utf-8'
      );
    });

    it(`should not contain all the comments by default`, () => {
      expect(BUNDLE).not.to.contain(`Copyright  Example Software.`);
    });
  });
});
