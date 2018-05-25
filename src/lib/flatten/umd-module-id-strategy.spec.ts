import { expect } from 'chai';
import { umdModuleIdStrategy } from './umd-module-id-strategy';

describe(`rollup`, () => {
  describe(`umdModuleIdStrategy()`, () => {
    it(`should map 'rxjs' to 'rxjs'`, () => {
      expect(umdModuleIdStrategy('rxjs')).to.equal('rxjs');
    });

    it(`should map 'rxjs/operators' to 'rxjs.operators'`, () => {
      expect(umdModuleIdStrategy('rxjs/operators')).to.equal('rxjs.operators');
    });

    it(`should map '@angular/core' to 'ng.core'`, () => {
      expect(umdModuleIdStrategy('@angular/core')).to.equal('ng.core');
    });

    it(`should map '@angular/common/http' to 'ng.common.http'`, () => {
      expect(umdModuleIdStrategy('@angular/common/http')).to.equal('ng.common.http');
    });

    it(`should map '@angular/common/http/testing' to 'ng.common.http.testing'`, () => {
      expect(umdModuleIdStrategy('@angular/common/http/testing')).to.equal('ng.common.http.testing');
    });

    it(`should map '@angular/platform-browser' to 'ng.platformBrowser'`, () => {
      expect(umdModuleIdStrategy('@angular/platform-browser')).to.equal('ng.platformBrowser');
    });

    it(`should map '@angular/platform-browser/animations' to 'ng.platformBrowser.animations'`, () => {
      expect(umdModuleIdStrategy('@angular/platform-browser/animations')).to.equal('ng.platformBrowser.animations');
    });

    it(`should map '@angular/platform-browser-dynamic' to 'ng.platformBrowserDynamic'`, () => {
      expect(umdModuleIdStrategy('@angular/platform-browser-dynamic')).to.equal('ng.platformBrowserDynamic');
    });

    it(`should map 'tslib' to 'tslib'`, () => {
      expect(umdModuleIdStrategy('tslib')).to.equal('tslib');
    });

    const FOO_MODULE = 'FooModule';
    it(`should map 'foo' to '${FOO_MODULE}' when 'umdModuleIds' is provided`, () => {
      expect(umdModuleIdStrategy('foo', { foo: FOO_MODULE })).to.equal(FOO_MODULE);
    });

    it(`should map 'foo' to '' when no 'umdModuleIds' is provided`, () => {
      expect(umdModuleIdStrategy('foo')).to.empty;
    });
  });
});
