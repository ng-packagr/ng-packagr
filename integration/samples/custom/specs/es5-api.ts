import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import * as API from '../dist/sample-custom.es5.js';

describe(`sample-custom`, () => {

  describe(`sample-custom.es5.js`, () => {

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export InternalService`, () => {
      expect(API['InternalService']).to.be.undefined;
    });

  });
});
