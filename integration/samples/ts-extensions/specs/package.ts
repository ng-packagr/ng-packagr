import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/ts-extensions`, () => {
  describe(`package.json`, () => {
    let PACKAGE: any;
    beforeAll(() => {
      PACKAGE = JSON.parse(readFileSync(join(__dirname, '../dist/package.json'), 'utf-8'));
    });

    it(`should exist`, () => {
      expect(PACKAGE).to.be.ok;
    });

    it(`should be named '@sample/ts-extensions'`, () => {
      expect(PACKAGE['name']).to.equal('@sample/ts-extensions');
    });
  });
});
