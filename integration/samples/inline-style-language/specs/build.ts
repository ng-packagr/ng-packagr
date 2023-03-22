import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe('@sample/inline-style-language', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  it(`should contain processed inline css`, () => {
    const content = fs.readFileSync(path.join(DIST, 'fesm2022/sample-inline-style-language.mjs'), {
      encoding: 'utf-8',
    });
    expect(content).to.contain('color:green');
  });
});
