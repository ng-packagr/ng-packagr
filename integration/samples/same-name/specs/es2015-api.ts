import { expect } from 'chai';

describe(`@sample/same-name`, () => {
  describe(`fesm2015/sample-testing.js`, () => {
    let API;
    before(() => {
      API = require('../dist/fesm2015/sample-testing.js');
    });

    it(`should exist`, () => {
      expect(API).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(API.AngularComponent).to.be.ok;
    });
  });

  describe(`fesm2015/sample-testing-testing.js`, () => {
    let APITesting;
    before(() => {
      APITesting = require('../dist/fesm2015/sample-testing-testing.js');
    });

    it(`should exist`, () => {
      expect(APITesting).to.be.ok;
    });

    it(`should export AngularComponent`, () => {
      expect(APITesting.AngularComponent).to.be.ok;
    });
  });
});
