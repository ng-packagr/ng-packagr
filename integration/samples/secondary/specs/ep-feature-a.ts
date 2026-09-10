import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const DIST = resolve(__dirname, '..', 'dist');

describe(`@sample/secondary/feature-a`, () => {
  let ESM2022_CONTENTS: string;

  beforeAll(() => {
    ESM2022_CONTENTS = readFileSync(resolve(DIST, 'fesm2022', 'sample-secondary-feature-a.mjs'), {
      encoding: 'utf-8',
    });
  });

  it(`should 'import .. from '@sample/secondary/shared';' (FESM2022)`, () => {
    expect(ESM2022_CONTENTS).to.match(/import \{ SHARED_FEATURE \} from ["']@sample\/secondary\/shared["']/);
  });
});
