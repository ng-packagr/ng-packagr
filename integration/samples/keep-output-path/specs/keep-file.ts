import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`keep-output-path`, () => {
  describe(`keep-file`, () => {
    it(`should contain 'file.txt'`, () => {
      const x = fs.readFileSync(path.resolve(__dirname, '..', 'dest', 'file.txt'), 'utf-8');
      expect(x).to.contain('hello world');
    });
  });
});
