import * as ng from '@angular/compiler-cli';
import { expect } from 'chai';
import { provideProject, PROJECT_TOKEN, ngPackagr, NgPackagr } from './packagr';
import { DEFAULT_TS_CONFIG_TOKEN } from '../ts/default-tsconfig';

describe(`ngPackagr()`, () => {
  it(`should return a NgPackagr instance`, () => {
    const foo = ngPackagr();
    expect(foo).to.be.an.instanceOf(NgPackagr);
  });

  it(`should have a default tsconfig`, () => {
    const toBeTested = ngPackagr();
    const defaultTsConfigProvider = toBeTested['providers'].filter(p => (p as any).provide === DEFAULT_TS_CONFIG_TOKEN);
    expect(defaultTsConfigProvider).to.have.length(1);
  });

  describe(`withTsConfig()`, () => {
    it(`should return self instance for chaining`, () => {
      const toBeTested = ngPackagr();
      const mockConfig = ({ project: 'foo' } as any) as ng.ParsedConfiguration;
      expect(toBeTested.withTsConfig(mockConfig)).to.equal(toBeTested);
    });
    it(`should override the default tsconfig provider`, () => {
      const mockConfig = ({ project: 'foo' } as any) as ng.ParsedConfiguration;
      const toBeTested = ngPackagr().withTsConfig(mockConfig);
      const tsConfigProviders = toBeTested['providers'].filter(p => (p as any).provide === DEFAULT_TS_CONFIG_TOKEN);

      expect(tsConfigProviders).to.have.length(2);
      expect((tsConfigProviders[1] as any).useValue).to.be.satisfy(val => val.project === 'foo');
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
