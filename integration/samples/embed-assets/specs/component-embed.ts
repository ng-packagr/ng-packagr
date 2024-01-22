import { expect } from 'chai';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

describe(`@sample/embed-assets`, () => {
  const dist = resolve(__dirname, '..', 'dist');

  describe('embed asset', () => {
    it(`should embed asset in css`, () => {
      const content = readFileSync(join(dist, 'fesm2022/sample-embed-assets.mjs'), { encoding: 'utf-8' });
      expect(content).to.contain(':host{background:url(data:image/png;base64,');
    });
  });
});
