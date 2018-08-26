import { expect } from 'chai';

describe(`@sample/same-name`, () => {
  describe(`esm5/sample-testing.js`, () => {
    let API;
    before(() => {
      API = require('../dist/fesm5/sample-testing.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });
  });

  describe(`esm5/sample-testing-testing.js`, () => {
    let APITesting;
    before(() => {
      APITesting = require('../dist/fesm5/sample-testing-testing.js');
    });

    it(`should exist`, () => {
      expect(APITesting).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(APITesting.AngularComponent).to.be.ok;
    });
  });
});
