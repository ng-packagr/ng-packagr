import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe(`sample-custom - build`, () => {
  describe(`.ng_pkg_build`, () => {
    it(`should not exist`, () => {
      const buildFolderPath: string = resolve(__dirname, '..', '.ng_pkg_build');
      expect(existsSync(buildFolderPath)).not.to.be.true;
    });
  });
});
