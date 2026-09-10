import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe(`@sample/same-name - typings`, () => {
  describe(`sample-testing.d.ts`, () => {
    let TYPINGS: any;
    beforeAll(() => {
      TYPINGS = readFileSync(resolve(__dirname, '..', 'dist/types/sample-testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });

  describe(`sample-testing-testing.d.ts`, () => {
    let TYPINGS: any;
    beforeAll(() => {
      TYPINGS = readFileSync(resolve(__dirname, '..', 'dist/types/sample-testing-testing.d.ts'), 'utf-8');
    });

    it(`should exist`, () => {
      expect(TYPINGS).to.be.ok;
    });
  });
});
