import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/comments`, () => {
  describe(`esm5/sample-comments.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'esm5', 'sample-comments.js'), 'utf-8');
    });

    it(`should contain all the comments by default`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });
});
