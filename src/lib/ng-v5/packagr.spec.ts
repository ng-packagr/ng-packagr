import * as ng from '@angular/compiler-cli';
import { expect } from 'chai';
import { ngPackagr, NgPackagr } from './packagr';
import { provideProject, PROJECT_TOKEN } from './project.di';
import { DEFAULT_TS_CONFIG_TOKEN } from './entry-point/ts/init-tsconfig.di';

describe(`ngPackagr()`, () => {
  let packager: NgPackagr;
  beforeEach(() => {
    packager = ngPackagr();
  });
  it(`should return a NgPackagr instance`, () => {
    expect(packager).to.be.an.instanceOf(NgPackagr);
  });

  it(`should have a default tsconfig`, () => {
    const defaultTsConfigProvider = packager['providers'].filter(p => (p as any).provide === DEFAULT_TS_CONFIG_TOKEN);
    expect(defaultTsConfigProvider).to.have.length(1);
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

  describe(`withTsConfig()`, () => {
    it(`should return self instance for chaining`, () => {
      const mockConfig = ({ project: 'foo' } as any) as ng.ParsedConfiguration;
      expect(packager.withTsConfig(mockConfig)).to.equal(packager);
    });

    it(`should override the default tsconfig provider`, () => {
      const mockConfig = ({ project: 'foo' } as any) as ng.ParsedConfiguration;
      const providers = packager
        .withTsConfig(mockConfig)
        ['providers'].filter(p => (p as any).provide === DEFAULT_TS_CONFIG_TOKEN);

      expect(providers).to.have.length(2);
      expect((providers[1] as any).useFactory).to.be.a('function');
      expect((providers[1] as any).useFactory()).to.satisfy(val => val.project === 'foo');
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
