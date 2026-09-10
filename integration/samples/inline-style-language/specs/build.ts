import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

describe('@sample/inline-style-language', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  it(`should contain processed inline css`, () => {
    const content = readFileSync(join(DIST, 'fesm2022/sample-inline-style-language.mjs'), {
      encoding: 'utf-8',
    });
    expect(content).to.contain('color:green');
  });
});
