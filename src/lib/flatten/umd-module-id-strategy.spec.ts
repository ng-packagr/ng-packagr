import { expect } from 'chai';
import { umdModuleIdStrategy } from './umd-module-id-strategy';

describe(`rollup`, () => {
  describe(`umdModuleIdStrategy()`, () => {
    it(`should map 'rxjs/add/observable/bindCallback' to 'Rx.Observable'`, () => {
      expect(umdModuleIdStrategy('rxjs/add/observable/bindCallback')).to.equal('Rx.Observable');
    });

    it(`should map 'rxjs/TeardownLogic' to 'Rx'`, () => {
      expect(umdModuleIdStrategy('rxjs/TeardownLogic')).to.equal('Rx');
    });

    it(`should map 'rxjs/add/operator/audit' to 'Rx.Observable.prototype'`, () => {
      expect(umdModuleIdStrategy('rxjs/add/operator/audit')).to.equal('Rx.Observable.prototype');
    });

    it(`should map 'rxjs/observable' to 'Rx.Observable'`, () => {
      expect(umdModuleIdStrategy('rxjs/observable')).to.equal('Rx.Observable');
    });

    it(`should map 'rxjs/observable/bindCallback' to 'Rx.Observable'`, () => {
      expect(umdModuleIdStrategy('rxjs/observable/bindCallback')).to.equal('Rx.Observable');
    });

    it(`should map 'rxjs/operators' to 'Rx.Observable.prototype'`, () => {
      expect(umdModuleIdStrategy('rxjs/operators')).to.equal('Rx.Observable.prototype');
    });

    it(`should map 'rxjs/operator/audit' to 'Rx.Observable.prototype'`, () => {
      expect(umdModuleIdStrategy('rxjs/operator/audit')).to.equal('Rx.Observable.prototype');
    });

    it(`should map 'rxjs/operators/audit' to 'Rx.Observable.prototype'`, () => {
      expect(umdModuleIdStrategy('rxjs/operator/audit')).to.equal('Rx.Observable.prototype');
    });

    it(`should map 'rxjs/symbol' to 'Rx.Symbol'`, () => {
      expect(umdModuleIdStrategy('rxjs/symbol')).to.equal('Rx.Symbol');
    });

    it(`should map 'rxjs/symbol/iterator' to 'Rx.Symbol'`, () => {
      expect(umdModuleIdStrategy('rxjs/symbol/iterator')).to.equal('Rx.Symbol');
    });

    it(`should map 'rxjs/scheduler' to 'Rx.Scheduler'`, () => {
      expect(umdModuleIdStrategy('rxjs/scheduler')).to.equal('Rx.Scheduler');
    });

    it(`should map 'rxjs/scheduler/queue' to 'Rx.Scheduler'`, () => {
      expect(umdModuleIdStrategy('rxjs/scheduler/queue')).to.equal('Rx.Scheduler');
    });

    it(`should map '@angular/core' to 'ng.core'`, () => {
      expect(umdModuleIdStrategy('@angular/core')).to.equal('ng.core');
    });

    it(`should map '@angular/common/http' to 'ng.common.http'`, () => {
      expect(umdModuleIdStrategy('@angular/common/http')).to.equal('ng.common.http');
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

    const FOO_MODULE = 'FooModule';
    it(`should map 'foo' to '${FOO_MODULE}' when 'umdModuleIds' is provided`, () => {
      expect(umdModuleIdStrategy('foo', { foo: FOO_MODULE })).to.equal(FOO_MODULE);
    });

    it(`should map 'foo' to '' when no 'umdModuleIds' is provided`, () => {
      expect(umdModuleIdStrategy('foo')).to.empty;
    });
  });
});
