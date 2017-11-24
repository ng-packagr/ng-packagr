import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Observable } from 'rxjs/Observable';

describe(`@sample/externals`, () => {

  describe(`UMD Bundle`, () => {
    const api = require('../dist/bundles/externals.umd.min.js');

    it(`should export 'target$'`, () => {
      expect(api.target$).to.be.instanceof(Observable);
    });

    it(`'target$' should be .subscribe()-able and emit values`, () => {
      const values: number[] = [];
      const subscription = api.target$.subscribe(
        (next) => values.push(next),
        (err) => {},
        () => {}
      );

      expect(subscription).to.be.ok;
      expect(values).to.have.length(5);
    });

    it(`should export 'SomeModule'`, () => {
      expect(api.SomeModule).to.be.ok;
    });

    it(`should export RxJsOperators`, () => {
      expect(api.RxJsOperators).to.be.ok;
    });
  });

});
