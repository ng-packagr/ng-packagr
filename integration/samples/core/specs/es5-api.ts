import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`@sample/core`, () => {

  describe(`esm5/sample-core.js`, () => {
    let API;
    before(() => {
      API = require('../dist/esm5/sample-core.js');
    })

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });

    it(`should export AngularDirective`, () => {
      expect(API.AngularDirective).to.be.ok;
    });

    it(`should export AngularModule`, () => {
      expect(API.AngularModule).to.be.ok;
    });

    it(`should export AngularPipe`, () => {
      expect(API.AngularPipe).to.be.ok;
    });

    it(`should export AngularService`, () => {
      expect(API.AngularService).to.be.ok;
    });

    it (`should downlevel iteration`, () => {
      const iterable = function*() { yield* [1, 2, 3]; };
      const values = API.AngularService.iterableToArray(iterable());

      expect(values).to.deep.equal([1, 2, 3]);
    });

  });
});
