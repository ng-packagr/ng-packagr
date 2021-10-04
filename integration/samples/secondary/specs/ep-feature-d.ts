import { expect } from 'chai';

describe(`@sample/secondary/feature-d`, () => {
  let PACKAGE;

  beforeAll(() => {
    PACKAGE = require('../dist/feature-d/package.json');
  });

  it(`should exist`, () => {
    expect(PACKAGE).to.be.ok;
  });

  it(`should be named '@sample/secondary/feature-d'`, () => {
    expect(PACKAGE['name']).to.equal('@sample/secondary/feature-d');
  });

  it(`should reference "fesm2020" bundle (fesm2020)`, () => {
    expect(PACKAGE['fesm2020']).to.equal('../fesm2020/sample-secondary-feature-d.mjs');
  });

  it(`should reference "typings" files`, () => {
    expect(PACKAGE['typings']).to.equal('sample-secondary-feature-d.d.ts');
  });
});
