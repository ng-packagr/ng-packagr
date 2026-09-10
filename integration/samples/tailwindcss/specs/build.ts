import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

describe('@sample/tailwindcss', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = resolve(__dirname, '../dist');
  });

  it(`should contain processed tailwinds css`, () => {
    const content = readFileSync(join(DIST, 'fesm2022/sample-tailwindcss.mjs'), { encoding: 'utf-8' });
    expect(content).to.contain('::placeholder');
  });
});
