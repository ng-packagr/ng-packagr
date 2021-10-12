import { expect } from 'chai';
import { NgPackagr, ngPackagr } from './packagr';
import { PROJECT_TOKEN, provideProject } from './project.di';

describe(`ngPackagr()`, () => {
  let packager: NgPackagr;
  beforeEach(() => {
    packager = ngPackagr();
  });
  it(`should return a NgPackagr instance`, () => {
    expect(packager).to.be.an.instanceOf(NgPackagr);
  });

  describe(`forProject()`, () => {
    it(`should return self instance for chaining`, () => {
      expect(packager.forProject('foo')).to.equal(packager);
    });

    it(`should set project provider`, () => {
      const providers = packager.forProject('foobar')['providers'].filter(p => (p as any).provide === PROJECT_TOKEN);

      expect(providers).to.have.length(1);
      expect((providers[0] as any).useValue).to.equal('foobar');
    });
  });
});

describe(`provideProject()`, () => {
  it(`should return the ValueProvider`, () => {
    const provider = provideProject('foo');
    expect(provider.provide).to.equal(PROJECT_TOKEN);
    expect(provider.useValue).to.equal('foo');
  });
});
