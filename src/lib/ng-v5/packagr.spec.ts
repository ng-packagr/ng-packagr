import { expect } from 'chai';
import { provideProject, PROJECT_TOKEN, ngPackagr, NgPackagr } from './packagr';

describe(`ngPackagr()`, () => {

  it(`should return a NgPackagr instance`, () => {
    const foo = ngPackagr();
    expect(foo).to.be.an.instanceOf(NgPackagr);
  });

  xit(`should return something with pre-configured defaults`, () => {
    // TODO
  });
});

describe(`provideProject()`, () => {

  it(`should return the ValueProvider`, () => {
    const provider = provideProject('foo');
    expect(provider.provide).to.equal(PROJECT_TOKEN);
    expect(provider.useValue).to.equal('foo');
  });
});
