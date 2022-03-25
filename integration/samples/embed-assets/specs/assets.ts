import { expect } from 'chai';
import { existsSync } from 'fs';
import { resolve, join } from 'path';

describe(`@sample/embed-assets`, () => {
  const dist = resolve(__dirname, '..', 'dist');

  describe('assets', () => {
    it(`should support asset pattern '"./assets-1/**/*.png"`, () => {
      expect(existsSync(join(dist, 'assets-1/image.png'))).to.be.true;
    });

    it(`should support asset pattern '"./assets-2"`, () => {
      expect(existsSync(join(dist, 'assets-2/image.png'))).to.be.true;
    });

    it(`should support asset pattern '"./assets-3/**/*.png"`, () => {
      expect(existsSync(join(dist, 'assets-3/image.png'))).to.be.true;
      expect(existsSync(join(dist, 'assets-3/image.svg'))).to.be.false;
    });
  });
});
