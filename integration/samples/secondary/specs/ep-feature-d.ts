import { expect } from 'chai';

describe(`@sample/secondary/feature-d`, () => {
  let PACKAGE;

  before(() => {
    PACKAGE = require('../dist/feature-d/package.json');
  });

  it(`should exist`, () => {
    expect(PACKAGE).to.be.ok;
  });

  it(`should be named '@sample/secondary/feature-d'`, () => {
    expect(PACKAGE['name']).to.equal('@sample/secondary/feature-d');
  });

  it(`should reference "module" bundle (fesm2015)`, () => {
    expect(PACKAGE['module']).to.equal('../fesm2015/sample-secondary-feature-d.js');
  });

  it(`should reference "typings" files`, () => {
    expect(PACKAGE['typings']).to.equal('sample-secondary-feature-d.d.ts');
  });
});
