import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

describe(`@sample/ts-paths`, () => {
  const dist = resolve(__dirname, '..', 'dist');

  describe('Resolve Ts-Path', () => {
    it(`should reslove import moduleSpecifier using ts-config paths`, () => {
      expect(readFileSync(join(dist, 'bundles/sample-ts-paths.umd.js'), 'utf-8')).to.contain(
        `function () { return 'sampleApi'; });`,
      );
      expect(readFileSync(join(dist, 'esm5/src/angular.component.js'), 'utf-8')).to.contain(
        'import { getSampleApi } from "./api/index";',
      );
      expect(readFileSync(join(dist, 'esm2015/src/angular.component.js'), 'utf-8')).to.contain(
        'import { getSampleApi } from "./api/index";',
      );
      expect(readFileSync(join(dist, 'fesm5/sample-ts-paths.js'), 'utf-8')).to.contain(
        `function () { return 'sampleApi'; });`,
      );
      expect(readFileSync(join(dist, 'fesm2015/sample-ts-paths.js'), 'utf-8')).to.contain(`() => 'sampleApi'`);
    });
  });
});
