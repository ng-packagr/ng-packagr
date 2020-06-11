import { expect } from 'chai';

describe(`@sample/core`, () => {
  describe(`fesm2015/sample-core.js`, () => {
    let API;

    before(() => {
      API = require('../dist/fesm2015/sample-core.js');
    });

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

    // it(`should import TS helpers from 'tslib'`, () => {
    //   expect(BUNDLE).to.contain('tslib');
    // });
  });
});
