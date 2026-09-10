import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe(`Missing primary entry point dependencies `, () => {
  describe(`library build erorr`, () => {
    it(`should have no build output`, () => {
      const exists = existsSync(resolve(__dirname, '../dist'));
      expect(exists).to.be.false;
    });
  });
});
