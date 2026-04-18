import { expect } from 'chai';
import { NgEntryPoint } from '../ng-package/entry-point/entry-point';
import { EntryPointNode } from '../ng-package/nodes';

import { generatePackageExports, generateWatchVersion } from './package-json';

describe('Generate package.json', () => {
  describe('Watch version generation', () => {
    it('should generate unique watch versions', () => {
      const version = generateWatchVersion();
      expect(version).to.match(/^0\.0\.0-watch\+\d+$/);
    });
  });

  describe('Package exports', () => {
    const testDestinationPath = '/example/entry-point/dest';
    const testSourcePath = '/example/entry-point/src';

    it('should generate package exports with no existing package json exports', () => {
      const packageJson = {
        name: '@example/test-entry-point',
      };
      const primaryNgPackageJson = {
        dest: testDestinationPath,
        lib: {
          entryFile: 'public-api.ts',
        },
      };
      const primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
      const entryPointNode = new EntryPointNode('ng:///example/entry-point/src/public-api.ts', null, null);
      entryPointNode.data = {
        destinationFiles: primaryEntryPoint.destinationFiles,
        entryPoint: primaryEntryPoint,
      };
      const packageExports = generatePackageExports(primaryEntryPoint, [entryPointNode]);

      expect(packageExports).to.deep.equal({
        './package.json': { default: './package.json' },
        '.': {
          types: './types/example-test-entry-point.d.ts',
          default: './fesm2022/example-test-entry-point.mjs',
        },
      });
    });

    it('should generate package exports with existing string package.json subpath export', () => {
      const packageJson = {
        name: '@example/test-entry-point',
        exports: {
          './package.json': './package.json',
        },
      };
      const primaryNgPackageJson = {
        dest: testDestinationPath,
        lib: {
          entryFile: 'public-api.ts',
        },
      };
      const primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
      const entryPointNode = new EntryPointNode('ng:///example/entry-point/src/public-api.ts', null, null);
      entryPointNode.data = {
        destinationFiles: primaryEntryPoint.destinationFiles,
        entryPoint: primaryEntryPoint,
      };
      const packageExports = generatePackageExports(primaryEntryPoint, [entryPointNode]);

      expect(packageExports).to.deep.equal({
        './package.json': { default: './package.json' },
        '.': {
          types: './types/example-test-entry-point.d.ts',
          default: './fesm2022/example-test-entry-point.mjs',
        },
      });
    });

    it('should generate package exports with existing string default subpath export', () => {
      const packageJson = {
        name: '@example/test-entry-point',
        exports: {
          '.': './public-api.js',
        },
      };
      const primaryNgPackageJson = {
        dest: testDestinationPath,
        lib: {
          entryFile: 'public-api.ts',
        },
      };
      const primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
      const entryPointNode = new EntryPointNode('ng:///example/entry-point/src/public-api.ts', null, null);
      entryPointNode.data = {
        destinationFiles: primaryEntryPoint.destinationFiles,
        entryPoint: primaryEntryPoint,
      };
      const packageExports = generatePackageExports(primaryEntryPoint, [entryPointNode]);

      expect(packageExports).to.deep.equal({
        './package.json': { default: './package.json' },
        '.': {
          types: './types/example-test-entry-point.d.ts',
          default: './fesm2022/example-test-entry-point.mjs',
        },
      });
    });

    it('should generate package exports with existing string default conditional export', () => {
      const packageJson = {
        name: '@example/test-entry-point',
        exports: {
          '.': {
            types: './public-api.d.ts',
            foo: './public-api.foo.js',
            default: './public-api.js',
          },
        },
      };
      const primaryNgPackageJson = {
        dest: testDestinationPath,
        lib: {
          entryFile: 'public-api.ts',
        },
      };
      const primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
      const entryPointNode = new EntryPointNode('ng:///example/entry-point/src/public-api.ts', null, null);
      entryPointNode.data = {
        destinationFiles: primaryEntryPoint.destinationFiles,
        entryPoint: primaryEntryPoint,
      };
      const packageExports = generatePackageExports(primaryEntryPoint, [entryPointNode]);

      expect(packageExports).to.deep.equal({
        './package.json': { default: './package.json' },
        '.': {
          types: './types/example-test-entry-point.d.ts',
          foo: './public-api.foo.js',
          default: './fesm2022/example-test-entry-point.mjs',
        },
      });

      const rootExportConditions = Object.keys(packageExports['.']);
      // Default should be last https://nodejs.org/api/packages.html#conditional-exports
      expect(rootExportConditions).to.deep.equal(['foo', 'types', 'default']);
    });

    it('should generate package exports for secondary entry points', () => {
      const packageJson = {
        name: '@example/test-entry-point',
      };
      const primaryNgPackageJson = {
        dest: testDestinationPath,
        lib: {
          entryFile: 'public-api.ts',
        },
      };
      const primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
      const entryPointNode = new EntryPointNode('ng:///example/entry-point/src/public-api.ts', null, null);
      entryPointNode.data = {
        destinationFiles: primaryEntryPoint.destinationFiles,
        entryPoint: primaryEntryPoint,
      };

      const secondaryDestinationPath = '/example/entry-point/dest/secondary-entry-point';
      const secondarySourcePath = '/example/entry-point/secondary-entry-point/src';
      const secondaryEntryPoint = new NgEntryPoint({}, { dest: secondaryDestinationPath }, secondarySourcePath, {
        destinationPath: secondaryDestinationPath,
        moduleId: 'example-secondary-entry-point',
        primaryDestinationPath: testDestinationPath,
      });
      const secondaryEntryPointNode = new EntryPointNode(
        'ng:///example/secondary-entry-point/src/public-api.ts',
        null,
        null,
      );
      secondaryEntryPointNode.data = {
        destinationFiles: secondaryEntryPoint.destinationFiles,
        entryPoint: secondaryEntryPoint,
      };
      const packageExports = generatePackageExports(primaryEntryPoint, [entryPointNode, secondaryEntryPointNode]);

      expect(packageExports).to.deep.equal({
        './package.json': { default: './package.json' },
        '.': {
          types: './types/example-test-entry-point.d.ts',
          default: './fesm2022/example-test-entry-point.mjs',
        },
        './secondary-entry-point': {
          types: './types/example-secondary-entry-point.d.ts',
          default: './fesm2022/example-secondary-entry-point.mjs',
        },
      });

      const rootExportConditions = Object.keys(packageExports['./secondary-entry-point']);
      // Default should be last https://nodejs.org/api/packages.html#conditional-exports
      expect(rootExportConditions).to.deep.equal(['types', 'default']);
    });
  });
});
