import { expect } from 'chai';
import * as path from 'path';
import { sync } from 'fast-glob';
import * as fs from 'fs';

describe('@sample/apf', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('dist', () => {
    it('should contain a total of 32 files', () => {
      // this is a safe guard / alternative to snapshots in order to
      // protect ourselves from doing a change that will emit unexpected files.
      const files = sync('**/*', { cwd: DIST });
      expect(files.length).to.equals(32);
    });

    it(`should contain a README.md file`, () => {
      const file = fs.existsSync(path.join(DIST, 'README.md'));
      expect(file).to.be.true;
    });

    it(`should contain the "theming.scss" file`, () => {
      const file = fs.existsSync(path.join(DIST, 'theming.scss'));
      expect(file).to.be.true;
    });

    it(`should contain a LICENSE life`, () => {
      const file = fs.existsSync(path.join(DIST, 'LICENSE'));
      expect(file).to.be.true;
    });

    it(`should not have a nested 'dist' folder`, () => {
      const dist = fs.existsSync(path.join(DIST, 'dist'));
      expect(dist).to.be.false;
    });
  });

  describe('FESM2022', () => {
    it(`should contain 4 '.mjs.map' files`, () => {
      expect(sync(`fesm2022/**/*.mjs.map`, { cwd: DIST }).length).equal(4);
    });

    it(`should contain 4 '.mjs' files`, () => {
      expect(sync(`fesm2022/**/*.mjs`, { cwd: DIST }).length).equal(4);
    });
  });

  describe('declarations', () => {
    describe('index.d.ts', () => {
      it(`should exist`, () => {
        const file = fs.existsSync(path.join(DIST, 'index.d.ts'));
        expect(file).to.be.true;
      });
    });

    describe('secondary/index.d.ts', () => {
      it(`should exist`, () => {
        const file = fs.existsSync(path.join(DIST, 'secondary', 'index.d.ts'));
        expect(file).to.be.true;
      });
    });

    describe('primary.component.d.ts', () => {
      it(`should only exist in the dist/src`, () => {
        let file = fs.existsSync(path.join(DIST, 'primary.component.d.ts'));
        expect(file).to.be.false;

        file = fs.existsSync(path.join(DIST, 'src', 'primary.component.d.ts'));
        expect(file).to.be.true;
      });
    });
  });
});
