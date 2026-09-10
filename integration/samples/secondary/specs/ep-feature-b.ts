import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const DIST = resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-b`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = readFileSync(resolve(DIST, 'fesm2022', 'sample-secondary-feature-b.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'export { .. }' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.contain(`export {`);
  });

  it(`should 'import .. from '@sample/secondary/feature-a';' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.match(/import \{ FEATURE_A \} from ["']@sample\/secondary\/feature-a["']/);
  });
});
