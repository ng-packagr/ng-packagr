import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`sample-custom - typings`, () => {
  describe(`sample-custom.d.ts`, () => {
    let TYPINGS: any;
    beforeAll(() => {
      TYPINGS = readFileSync(resolve(__dirname, '..', 'dist/types/sample-custom.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });
});
