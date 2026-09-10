import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const DIST = resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/shared`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = readFileSync(resolve(DIST, 'fesm2022', 'sample-secondary-shared.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. } from ESM2022 bundle`, () => {
    expect(ESM2022_CONTENTS).to.contain(`export {`);
  });
});
