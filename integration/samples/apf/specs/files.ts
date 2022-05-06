import { expect } from 'chai';
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';

describe('@sample/apf', () => {
  let DIST: string;
  beforeAll(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('dist', () => {
    it('should contain a total of 70 files', () => {
      // this is a safe guard / alternative to snapshots in order to
      // protect ourselves from doing a change that will emit unexpected files.
      const files = glob.sync('**/*', { cwd: DIST });
      expect(files.length).to.equals(70);
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

  describe('FESM2020', () => {
    it(`should contain 4 '.mjs.map' files`, () => {
      expect(glob.sync(`fesm2020/**/*.mjs.map`, { cwd: DIST }).length).equal(4);
    });

    it(`should contain 4 '.mjs' files`, () => {
      expect(glob.sync(`fesm2020/**/*.mjs`, { cwd: DIST }).length).equal(4);
    });
  });

  describe('ESM2020', () => {
    it(`should contain 0 '.mjs.map' files`, () => {
      expect(glob.sync(`esm2020/**/*.mjs.map`, { cwd: DIST }).length).equal(0);
    });

    it(`should contain 16 '.mjs' files`, () => {
      expect(glob.sync(`esm2020/**/*.mjs`, { cwd: DIST }).length).equal(16);
    });

    describe('secondary', () => {
      it(`should contain 0 '.mjs.map' files`, () => {
        expect(glob.sync(`esm2020/secondary/**/*.mjs.map`, { cwd: DIST }).length).equal(0);
      });

      it(`should contain 8 '.mjs' files`, () => {
        expect(glob.sync(`esm2020/secondary/**/*.mjs`, { cwd: DIST }).length).equal(8);
      });
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
