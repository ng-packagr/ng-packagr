import { expect } from 'chai';
import * as path from 'path';
import * as fs from 'fs';

describe('@sample/tailwindcss', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  it(`should contain processed tailwinds css`, () => {
    const content = fs.readFileSync(path.join(DIST, 'fesm2022/sample-tailwindcss.mjs'), { encoding: 'utf-8' });
    expect(content).to.contain('::placeholder');
  });
});
