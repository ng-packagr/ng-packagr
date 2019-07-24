import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`sample-custom`, () => {
  describe(`.ng_pkg_build`, () => {
    it(`should not exist`, () => {
      const buildFolderPath: string = path.resolve(__dirname, '..', '.ng_pkg_build');
      expect(fs.existsSync(buildFolderPath)).not.to.be.true;
    });
  });
});
