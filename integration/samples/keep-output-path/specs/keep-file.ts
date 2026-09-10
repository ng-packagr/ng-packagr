import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe(`keep-output-path`, () => {
  describe(`keep-file`, () => {
    it(`should contain 'file.txt'`, () => {
      const x = readFileSync(resolve(__dirname, '..', 'dest', 'file.txt'), 'utf-8');
      expect(x).to.contain('hello world');
    });
  });
});
