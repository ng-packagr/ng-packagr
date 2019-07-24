import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Observable } from 'rxjs/Observable';

describe(`@sample/externals`, () => {
  describe(`UMD Bundle`, () => {
    let API;
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/bundles/sample-externals.umd.js'), {
        encoding: 'utf-8',
      });
      API = require('../dist/bundles/sample-externals.umd.min.js');
    });

    it(`should export 'target$'`, () => {
      expect(API.target$).to.be.instanceof(Observable);
    });

    it(`'target$' should be .subscribe()-able and emit values`, () => {
      const values: number[] = [];
      const subscription = API.target$.subscribe(next => values.push(next), () => {}, () => {});

      expect(subscription).to.be.ok;
      expect(values).to.have.length(5);
    });

    it(`should export 'SomeModule'`, () => {
      expect(API.SomeModule).to.be.ok;
    });

    it(`should export RxJsOperators`, () => {
      expect(API.RxJsOperators).to.be.ok;
    });

    it(`should import '@angular/core'`, () => {
      expect(BUNDLE).to.contain("require('@angular/core')");
    });

    it(`should import 'rxjs/Observable`, () => {
      expect(BUNDLE).to.contain("require('rxjs/Observable')");
    });

    it(`should not import 'lodash.template`, () => {
      expect(BUNDLE).to.not.contain("require('lodash.template')");
    });

    it(`should not import transitive dependency 'lodash.template`, () => {
      expect(BUNDLE).to.not.contain("require('lodash.templatesettings')");
    });

    it(`should embed transitive 'templateSettings' object`, () => {
      expect(BUNDLE).to.contain('var templateSettings = {');
    });

    it(`should embed 'template' function`, () => {
      expect(BUNDLE).to.contain('template(string, options, guard)');
    });

    it(`should not import 'tslib`, () => {
      expect(BUNDLE).to.not.contain("require('tslib')");
    });
  });
});

describe(`@sample/externals/testing`, () => {
  describe(`UMD Bundle`, () => {
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/bundles/sample-externals-testing.umd.js'), {
        encoding: 'utf-8',
      });
    });

    it(`should import '@sample/externals'`, () => {
      expect(BUNDLE).to.contain("require('@sample/externals')");
    });

    it(`should not import 'lodash.template`, () => {
      expect(BUNDLE).to.not.contain("require('lodash.template')");
    });

    it(`should not import transitive dependency 'lodash.template`, () => {
      expect(BUNDLE).to.not.contain("require('lodash.templatesettings')");
    });

    it(`should embed transitive 'templateSettings' object`, () => {
      expect(BUNDLE).to.contain('var templateSettings = {');
    });

    it(`should embed 'template' function`, () => {
      expect(BUNDLE).to.contain('template(string, options, guard)');
    });
  });
});
