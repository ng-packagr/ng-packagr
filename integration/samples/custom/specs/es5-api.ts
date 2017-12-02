import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe(`sample-custom`, () => {
  describe(`esm5/sample-custom.js`, () => {
    let API;
    before(() => {
      API = require('../dist/esm5/sample-custom.js');
    })

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should not export InternalService`, () => {
      expect(API['InternalService']).to.be.undefined;
    });

    it(`should not alter BazComponent selector`, () => {
      const moduleText: string = fs.readFileSync('./integration/samples/custom/dist/esm5/sample-custom.js').toString();
      expect(/selector: 'custom-baz',\s*template: "<h1>Baz!</gm.test(moduleText)).to.equal(true);
    });

  });
});
