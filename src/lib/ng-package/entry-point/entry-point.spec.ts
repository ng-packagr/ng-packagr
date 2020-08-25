import { expect } from 'chai';
import { join, resolve } from 'path';
import { NgPackageConfig } from '../../../ng-package.schema';
import { NgEntryPoint } from './entry-point';

describe(`NgEntryPoint`, () => {
  const testDestinationPath = '/example/entry-point/dest'
  const testSourcePath = '/example/entry-point/src'
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
    expect(Object.keys(primaryEntryPoint.destinationFiles).length).to.equal(6);
    expect(primaryEntryPoint.entryFile).to.equal('public-api.ts');
    expect(primaryEntryPoint.cssUrl).to.be.undefined;  // TODO: should default to 'inline'.
    expect(primaryEntryPoint.umdModuleIds).to.be.undefined;
    expect(primaryEntryPoint.flatModuleFile).to.equal('example-test-entry-point');
    expect(primaryEntryPoint.styleIncludePaths).to.be.empty;
    expect(primaryEntryPoint.moduleId).to.equal('@example/test-entry-point');
    expect(primaryEntryPoint.umdId).to.equal('example.test-entry-point');
    expect(primaryEntryPoint.amdId).to.equal('@example/test-entry-point');
    expect(primaryEntryPoint.sideEffects).to.be.false;

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
        umdModuleIds: {
          '@example/test-module': 'example.testModule',
        },
        flatModuleFile: 'exampleTestEntryPoint',
        styleIncludePaths: ['./style-includes'],
        umdId: 'example.testEntryPoint',
        amdId: '@example/testEntryPoint',
      },
    };
    primaryEntryPoint = new NgEntryPoint(packageJson, primaryNgPackageJson, testSourcePath);

    expect(primaryEntryPoint.entryFilePath).to.equal(resolve(testSourcePath, 'test-api.ts'));
    expect(primaryEntryPoint.entryFile).to.equal('test-api.ts');
    expect(primaryEntryPoint.cssUrl).to.equal('inline');
    expect(Object.entries(primaryEntryPoint.umdModuleIds)).to.deep.equal([['@example/test-module', 'example.testModule']]);
    expect(primaryEntryPoint.flatModuleFile).to.equal('exampleTestEntryPoint');
    expect(primaryEntryPoint.styleIncludePaths).to.deep.equal([resolve(testSourcePath, './style-includes')]);
    expect(primaryEntryPoint.umdId).to.equal('example.testEntryPoint');
    expect(primaryEntryPoint.amdId).to.equal('@example/testEntryPoint');
    expect(primaryEntryPoint.sideEffects).to.be.true;
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
      moduleId: `@example/test-entry-point/${ secondaryEntryPointRelativeSourcePath }`,
      primaryDestinationPath: primaryEntryPoint.destinationPath,
      destinationPath: join(primaryEntryPoint.destinationPath, secondaryEntryPointRelativeSourcePath),
    };
    secondaryEntryPoint = new NgEntryPoint(packageJson, secondaryNgPackageJson, secondaryEntryPointBasePath, secondaryData);

    expect(secondaryEntryPoint.entryFilePath).to.equal(resolve(secondaryEntryPointBasePath, 'public-api.ts'));
    expect(secondaryEntryPoint.isSecondaryEntryPoint).to.be.true;
    expect(secondaryEntryPoint.destinationPath).to.equal(resolve(secondaryData.destinationPath));
    expect(Object.keys(secondaryEntryPoint.destinationFiles).length).to.equal(6);
    expect(secondaryEntryPoint.entryFile).to.equal('public-api.ts');
    expect(secondaryEntryPoint.cssUrl).to.be.undefined;  // TODO: should default to 'inline'.
    expect(secondaryEntryPoint.umdModuleIds).to.be.undefined;
    expect(secondaryEntryPoint.flatModuleFile).to.equal('example-test-entry-point-extra');
    expect(secondaryEntryPoint.styleIncludePaths).to.be.empty;
    expect(secondaryEntryPoint.moduleId).to.equal('@example/test-entry-point/extra');
    expect(secondaryEntryPoint.umdId).to.equal('example.test-entry-point.extra');
    expect(secondaryEntryPoint.amdId).to.equal('@example/test-entry-point/extra');
    expect(secondaryEntryPoint.sideEffects).to.be.false;
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
        umdModuleIds: {
          '@example/test-module/extra': 'example.testModuleExtra',
        },
        flatModuleFile: 'exampleTestEntryPointExtra',
        styleIncludePaths: ['./style-includes'],
        umdId: 'example.testEntryPointExtra',
        amdId: '@example/testEntryPointExtra',
      },
    };
    const secondaryEntryPointRelativeSourcePath = 'extra';
    const secondaryEntryPointBasePath = join(testSourcePath, secondaryEntryPointRelativeSourcePath);
    secondaryData = {
      moduleId: `@example/test-entry-point/${ secondaryEntryPointRelativeSourcePath }`,
      primaryDestinationPath: primaryEntryPoint.destinationPath,
      destinationPath: join(primaryEntryPoint.destinationPath, secondaryEntryPointRelativeSourcePath),
    };
    secondaryEntryPoint = new NgEntryPoint(packageJson, secondaryNgPackageJson, secondaryEntryPointBasePath, secondaryData);

    expect(secondaryEntryPoint.entryFilePath).to.equal(resolve(secondaryEntryPointBasePath, 'demo-api.ts'));
    expect(secondaryEntryPoint.entryFile).to.equal('demo-api.ts');
    expect(secondaryEntryPoint.cssUrl).to.equal('none');
    expect(Object.entries(secondaryEntryPoint.umdModuleIds)).to.deep.equal([['@example/test-module/extra', 'example.testModuleExtra']]);
    expect(secondaryEntryPoint.flatModuleFile).to.equal('exampleTestEntryPointExtra');
    expect(secondaryEntryPoint.styleIncludePaths).to.deep.equal([resolve(secondaryEntryPointBasePath, './style-includes')]);
    expect(secondaryEntryPoint.umdId).to.equal('example.testEntryPointExtra');
    expect(secondaryEntryPoint.amdId).to.equal('@example/testEntryPointExtra');
    expect(secondaryEntryPoint.sideEffects).to.be.true;
  });

});
