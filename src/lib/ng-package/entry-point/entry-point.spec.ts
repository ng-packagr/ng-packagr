/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { join, resolve } from 'path';
import { NgPackageConfig } from '../../../ng-package.schema';
import { NgEntryPoint } from './entry-point';

describe(`NgEntryPoint`, () => {
  const testDestinationPath = '/example/entry-point/dest';
  const testSourcePath = '/example/entry-point/src';
  let primaryEntryPoint: NgEntryPoint;
  let secondaryEntryPoint: NgEntryPoint;
  let packageJson: Record<string, any>;
  let primaryNgPackageJson: NgPackageConfig;
  let secondaryNgPackageJson: NgPackageConfig;
  let secondaryData: Record<string, any>;

  it(`check primary entry point defaults`, () => {
    packageJson = {
      name: '@example/test-entry-point',
    };
    primaryNgPackageJson = {
      dest: testDestinationPath,
      lib: {
        entryFile: 'public-api.ts',
      },
    };
    primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);

    // Test constructor parameters:
    expect(primaryEntryPoint.packageJson).to.equal(packageJson);
    expect(primaryEntryPoint.ngPackageJson).to.equal(primaryNgPackageJson);
    expect(primaryEntryPoint.basePath).to.equal(testSourcePath);

    // Test readonly getters:
    expect(primaryEntryPoint.entryFilePath).to.equal(resolve(testSourcePath, 'public-api.ts'));
    expect(primaryEntryPoint.isSecondaryEntryPoint).to.be.false;
    expect(primaryEntryPoint.destinationPath).to.equal(resolve(testDestinationPath));
    expect(primaryEntryPoint.entryFile).to.equal('public-api.ts');
    expect(primaryEntryPoint.cssUrl).to.be.undefined; // TODO: should default to 'inline'.
    expect(primaryEntryPoint.flatModuleFile).to.equal('example-test-entry-point');
    expect(primaryEntryPoint.styleIncludePaths).to.be.empty;
    expect(primaryEntryPoint.moduleId).to.equal('@example/test-entry-point');

    // Other:
    expect(primaryEntryPoint.$get('lib.entryFile')).to.equal('public-api.ts');
    expect(primaryEntryPoint.$get('lib.NO_SUCH_PROPERTY')).to.be.undefined;
  });

  it(`check primary entry point overrides`, () => {
    packageJson = {
      name: '@example/test-entry-point',
      sideEffects: true,
    };
    primaryNgPackageJson = {
      dest: testDestinationPath,
      lib: {
        entryFile: 'test-api.ts',
        cssUrl: 'inline',
        flatModuleFile: 'exampleTestEntryPoint',
        styleIncludePaths: ['./style-includes'],
      },
    };
    primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);

    expect(primaryEntryPoint.entryFilePath).to.equal(resolve(testSourcePath, 'test-api.ts'));
    expect(primaryEntryPoint.entryFile).to.equal('test-api.ts');
    expect(primaryEntryPoint.cssUrl).to.equal('inline');
    expect(primaryEntryPoint.flatModuleFile).to.equal('exampleTestEntryPoint');
    expect(primaryEntryPoint.styleIncludePaths).to.deep.equal([resolve(testSourcePath, './style-includes')]);
  });

  it(`check secondary entry point defaults`, () => {
    packageJson = {
      name: '@example/test-entry-point',
    };
    primaryNgPackageJson = {
      dest: testDestinationPath,
      lib: {
        entryFile: 'public-api.ts',
      },
    };
    primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
    secondaryNgPackageJson = {
      lib: {
        entryFile: 'public-api.ts',
      },
    };
    const secondaryEntryPointRelativeSourcePath = 'extra';
    const secondaryEntryPointBasePath = join(testSourcePath, secondaryEntryPointRelativeSourcePath);
    secondaryData = {
      moduleId: `@example/test-entry-point/${secondaryEntryPointRelativeSourcePath}`,
      primaryDestinationPath: primaryEntryPoint.destinationPath,
      destinationPath: join(primaryEntryPoint.destinationPath, secondaryEntryPointRelativeSourcePath),
    };
    secondaryEntryPoint = new NgEntryPoint(
      packageJson,
      secondaryNgPackageJson,
      secondaryEntryPointBasePath,
      secondaryData,
    );

    expect(secondaryEntryPoint.entryFilePath).to.equal(resolve(secondaryEntryPointBasePath, 'public-api.ts'));
    expect(secondaryEntryPoint.isSecondaryEntryPoint).to.be.true;
    expect(secondaryEntryPoint.destinationPath).to.equal(resolve(secondaryData.destinationPath));
    expect(secondaryEntryPoint.entryFile).to.equal('public-api.ts');
    expect(secondaryEntryPoint.cssUrl).to.be.undefined; // TODO: should default to 'inline'.
    expect(secondaryEntryPoint.flatModuleFile).to.equal('example-test-entry-point-extra');
    expect(secondaryEntryPoint.styleIncludePaths).to.be.empty;
    expect(secondaryEntryPoint.moduleId).to.equal('@example/test-entry-point/extra');
  });

  it(`check secondary entry point overrides`, () => {
    packageJson = {
      name: '@example/test-entry-point',
      sideEffects: true,
    };
    primaryNgPackageJson = {
      dest: testDestinationPath,
      lib: {
        entryFile: 'public-api.ts',
      },
    };
    primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);
    secondaryNgPackageJson = {
      dest: testDestinationPath,
      lib: {
        entryFile: 'demo-api.ts',
        cssUrl: 'none',
        flatModuleFile: 'exampleTestEntryPointExtra',
        styleIncludePaths: ['./style-includes'],
      },
    };
    const secondaryEntryPointRelativeSourcePath = 'extra';
    const secondaryEntryPointBasePath = join(testSourcePath, secondaryEntryPointRelativeSourcePath);
    secondaryData = {
      moduleId: `@example/test-entry-point/${secondaryEntryPointRelativeSourcePath}`,
      primaryDestinationPath: primaryEntryPoint.destinationPath,
      destinationPath: join(primaryEntryPoint.destinationPath, secondaryEntryPointRelativeSourcePath),
    };
    secondaryEntryPoint = new NgEntryPoint(
      packageJson,
      secondaryNgPackageJson,
      secondaryEntryPointBasePath,
      secondaryData,
    );

    expect(secondaryEntryPoint.entryFilePath).to.equal(resolve(secondaryEntryPointBasePath, 'demo-api.ts'));
    expect(secondaryEntryPoint.entryFile).to.equal('demo-api.ts');
    expect(secondaryEntryPoint.cssUrl).to.equal('none');
    expect(secondaryEntryPoint.flatModuleFile).to.equal('exampleTestEntryPointExtra');
    expect(secondaryEntryPoint.styleIncludePaths).to.deep.equal([
      resolve(secondaryEntryPointBasePath, './style-includes'),
    ]);
  });
});
