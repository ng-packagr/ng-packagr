import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Observable } from 'rxjs/Observable';

describe(`@sample/externals`, () => {

  describe(`UMD Bundle`, () => {
    let API;
    let BUNDLE;
    before(() => {
      BUNDLE = fs.readFileSync(path.resolve(__dirname, '../dist/bundles/sample-externals.umd.js'), { encoding: 'utf-8' });
      API = require('../dist/bundles/sample-externals.umd.min.js');
    });

    it(`should export 'target$'`, () => {
      expect(API.target$).to.be.instanceof(Observable);
    });

    it(`'target$' should be .subscribe()-able and emit values`, () => {
      const values: number[] = [];
      const subscription = API.target$.subscribe(
        (next) => values.push(next),
        (err) => {},
        () => {}
      );

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
      expect(BUNDLE).to.contain("require('@angular/core')")
    });

    it(`should embed 'createCommonjsModule' method`, () => {
      expect(BUNDLE).to.contain("function createCommonjsModule")
    });

    it(`should embed 'fn.start' method`, () => {
      expect(BUNDLE).to.contain("n.start = function")
    });
  });

});
