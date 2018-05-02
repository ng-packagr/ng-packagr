import { expect } from 'chai';
import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';

describe(`@sample/apf`, () => {
  let DIST: string;
  before(() => {
    DIST = path.resolve(__dirname, '../dist');
  });

  describe('dist', () => {
    it(`should not have a nested 'dist' folder`, () => {
      const dist = fs.existsSync(path.join(DIST, 'dist'));
      expect(dist).to.be.false;
    });
  });

  describe(`FESM2015`, () => {
    it(`should contain 2 '.js.map' files`, () => {
      expect(glob.sync(`${DIST}/fesm2015/**/*.js.map`).length).equal(2);
    });

    it(`should contain 2 '.js' files`, () => {
      expect(glob.sync(`${DIST}/fesm2015/**/*.js`).length).equal(2);
    });
  });

  describe(`FESM5`, () => {
    it(`should contain 2 '.js.map' files`, () => {
      expect(glob.sync(`${DIST}/fesm5/**/*.js.map`).length).equal(2);
    });

    it(`should contain 2 '.js' files`, () => {
      expect(glob.sync(`${DIST}/fesm5/**/*.js`).length).equal(2);
    });
  });

  describe(`UMD`, () => {
    it(`should contain 4 '.js.map' files`, () => {
      expect(glob.sync(`${DIST}/bundles/**/*.js.map`).length).equal(4);
    });

    it(`should contain 4 '.js' files`, () => {
      expect(glob.sync(`${DIST}/bundles/**/*.js`).length).equal(4);
    });
  });

  describe(`ESM5`, () => {
    it(`should contain 8 '.js.map' files`, () => {
      expect(glob.sync(`${DIST}/esm5/**/*.js.map`).length).equal(8);
    });

    it(`should contain 8 '.js' files`, () => {
      expect(glob.sync(`${DIST}/esm5/**/*.js`).length).equal(8);
    });

    describe(`secondary`, () => {
      it(`should contain 4 '.js.map' files`, () => {
        expect(glob.sync(`${DIST}/esm5/secondary/**/*.js.map`).length).equal(4);
      });

      it(`should contain 4 '.js' files`, () => {
        expect(glob.sync(`${DIST}/esm5/secondary/**/*.js`).length).equal(4);
      });
    });
  });

  describe(`ESM2015`, () => {
    it(`should contain 8 '.js.map' files`, () => {
      expect(glob.sync(`${DIST}/esm2015/**/*.js.map`).length).equal(8);
    });

    it(`should contain 8 '.js' files`, () => {
      expect(glob.sync(`${DIST}/esm2015/**/*.js`).length).equal(8);
    });

    describe(`secondary`, () => {
      it(`should contain 4 '.js.map' files`, () => {
        expect(glob.sync(`${DIST}/esm2015/secondary/**/*.js.map`).length).equal(4);
      });

      it(`should contain 4 '.js' files`, () => {
        expect(glob.sync(`${DIST}/esm2015/secondary/**/*.js`).length).equal(4);
      });
    });
  });

  describe(`sample-apf.metadata.json`, () => {
    it(`should exist`, () => {
      const file = fs.existsSync(path.join(DIST, 'sample-apf.metadata.json'));
      expect(file).to.be.true;
    });
  });

  describe(`sample-apf-secondary.metadata.json`, () => {
    it(`should exist`, () => {
      const file = fs.existsSync(path.join(DIST, 'secondary', 'sample-apf-secondary.metadata.json'));
      expect(file).to.be.true;
    });
  });

  describe(`sample-apf.d.ts`, () => {
    it(`should exist`, () => {
      const file = fs.existsSync(path.join(DIST, 'sample-apf.d.ts'));
      expect(file).to.be.true;
    });
  });

  describe(`sample-apf-secondary.d.ts`, () => {
    it(`should exist`, () => {
      const file = fs.existsSync(path.join(DIST, 'secondary', 'sample-apf-secondary.d.ts'));
      expect(file).to.be.true;
    });
  });
});
