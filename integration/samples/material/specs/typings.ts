import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/material - typings`, () => {
  describe(`index.d.ts`, () => {
    let TYPINGS: any;
    beforeAll(() => {
      TYPINGS = readFileSync(resolve(__dirname, '..', 'dist/types/sample-material.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });
});
