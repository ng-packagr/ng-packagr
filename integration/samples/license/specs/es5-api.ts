import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/sample-license`, () => {
  describe(`esm5/sample-core.js`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '..', 'dist', 'esm5', 'sample-license.js'), 'utf-8');
    });

    it(`should add the license at the top of the bundle`, () => {
      expect(BUNDLE).to.contain(`Copyright  Example Software.`);
    });
  });
});
