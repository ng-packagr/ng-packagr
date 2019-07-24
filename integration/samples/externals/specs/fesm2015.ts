import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';

describe(`@sample/externals`, () => {
  describe(`FESM 2015 Bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/fesm2015/sample-externals.js'), {
        encoding: 'utf-8',
      });
    });

    it(`should import '@angular/core'`, () => {
      expect(BUNDLE).to.contain("from '@angular/core'");
    });

    it(`should import 'rxjs/Observable`, () => {
      expect(BUNDLE).to.contain("from 'rxjs/Observable'");
    });

    it(`should import 'lodash.template`, () => {
      expect(BUNDLE).to.contain("from 'lodash.template'");
    });

    it(`should import 'tslib`, () => {
      expect(BUNDLE).to.contain("from 'tslib'");
    });
  });
});

describe(`@sample/externals/testing`, () => {
  describe(`FESM 2015 Bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/fesm2015/sample-externals-testing.js'), {
        encoding: 'utf-8',
      });
    });

    it(`should import '@sample/externals`, () => {
      expect(BUNDLE).to.contain("from '@sample/externals'");
    });

    it(`should import 'lodash.template`, () => {
      expect(BUNDLE).to.contain("from 'lodash.template'");
    });
  });
});
