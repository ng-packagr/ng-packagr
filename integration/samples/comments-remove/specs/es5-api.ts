import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/sample-comments-remove`, () => {
  describe(`esm5/sample-comments-remove.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'esm5', 'sample-comments-remove.js'), 'utf-8');
    });

    it(`should not contain all the comments by default`, () => {
      expect(BUNDLE).not.to.contain(`Copyright  Example Software.`);
    });
  });
});
