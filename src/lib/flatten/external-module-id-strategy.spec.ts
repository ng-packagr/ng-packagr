import { expect } from 'chai';
import { ExternalModuleIdStrategy, DependencyList } from './external-module-id-strategy';

describe(`rollup`, () => {
  describe(`ExternalModuleIdStrategy`, () => {
    let externalModuleIdStrategy: ExternalModuleIdStrategy;

    describe(`when module format is 'umd'`, () => {
      describe(`and no 'bundledDependencies' are specified`, () => {
        before(() => {
          externalModuleIdStrategy = new ExternalModuleIdStrategy('umd', {});
        });

        it(`should return 'false' paths starting with '.'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('./foo/bar')).to.be.false;
        });

        it(`should return 'false' for paths starting with '/'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('/foo/bar')).to.be.false;
        });

        it(`should return 'false' for absolute paths`, () => {
          expect(externalModuleIdStrategy.isExternalDependency(__filename)).to.be.false;
        });

        it(`should return 'true' for external modules like '@angular/core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core')).to.be.true;
        });

        it(`should return 'true' for modules with '.' like 'ui.core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('ui.core')).to.be.true;
        });

        it(`should return 'true' for external module 'tslib'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('tslib')).to.be.true;
        });
      });

      describe(`and 'bundledDependencies' are specified`, () => {
        before(() => {
          externalModuleIdStrategy = new ExternalModuleIdStrategy('umd', {
            bundledDependencies: ['@angular/core'],
            dependencies: ['ui.core']
          });
        });

        it(`should return 'false' paths starting with '.'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('./foo/bar')).to.be.false;
        });

        it(`should return 'false' for paths starting with '/'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('/foo/bar')).to.be.false;
        });

        it(`should return 'false' for absolute paths`, () => {
          expect(externalModuleIdStrategy.isExternalDependency(__filename)).to.be.false;
        });

        it(`should return 'false' for a bundled dependency like '@angular/core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core')).to.be.false;
        });

        it(`should return 'false' for a bundled dependency like '@angular/core/testing'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core/testing')).to.be.false;
        });

        it(`should return 'true' for modules with '.' like 'ui.core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('ui.core')).to.be.true;
        });

        it(`should return 'true' for external module 'tslib'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('tslib')).to.be.true;
        });
      });
    });

    describe(`when module format is 'es'`, () => {
      describe(`and no 'bundledDependencies' are specified`, () => {
        before(() => {
          externalModuleIdStrategy = new ExternalModuleIdStrategy('es', {});
        });

        it(`should return 'false' paths starting with '.'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('./foo/bar')).to.be.false;
        });

        it(`should return 'false' for paths starting with '/'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('/foo/bar')).to.be.false;
        });

        it(`should return 'false' for absolute paths`, () => {
          expect(externalModuleIdStrategy.isExternalDependency(__filename)).to.be.false;
        });

        it(`should return 'true' for external modules like '@angular/core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core')).to.be.true;
        });

        it(`should return 'true' for modules with '.' like 'ui.core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('ui.core')).to.be.true;
        });

        it(`should return 'true' for external module 'tslib'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('tslib')).to.be.true;
        });
      });

      describe(`and 'bundledDependencies' are specified`, () => {
        before(() => {
          externalModuleIdStrategy = new ExternalModuleIdStrategy('es', { bundledDependencies: ['@angular/core'] });
        });

        it(`should return 'false' paths starting with '.'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('./foo/bar')).to.be.false;
        });

        it(`should return 'false' for paths starting with '/'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('/foo/bar')).to.be.false;
        });

        it(`should return 'false' for absolute paths`, () => {
          expect(externalModuleIdStrategy.isExternalDependency(__filename)).to.be.false;
        });

        it(`should return 'true' for a bundled dependency like '@angular/core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core')).to.be.true;
        });

        it(`should return 'true' for a bundled dependency like '@angular/core/testing'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('@angular/core/testing')).to.be.true;
        });

        it(`should return 'true' for modules with '.' like 'ui.core'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('ui.core')).to.be.true;
        });

        it(`should return 'true' for external module 'tslib'`, () => {
          expect(externalModuleIdStrategy.isExternalDependency('tslib')).to.be.true;
        });
      });
    });
  });
});
