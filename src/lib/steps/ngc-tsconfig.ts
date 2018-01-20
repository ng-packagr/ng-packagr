import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, FactoryProvider } from 'injection-js';
import * as path from 'path';
import * as ts from 'typescript';
import { BuildStep } from '../deprecations';

/**
 * TypeScript configuration used internally (marker typer).
 */
export type TsConfig = ng.ParsedConfiguration;

/**
 * Reads the default TypeScript configuration.
 */
export function defaultTsConfigFactory() {
  return ng.readConfiguration(path.resolve(__dirname, '..', 'conf', 'tsconfig.ngc.json'));
}

export const DEFAULT_TS_CONFIG_TOKEN = new InjectionToken<TsConfig>('ng.v5.defaultTsConfig');

export const DEFAULT_TS_CONFIG_PROVIDER: FactoryProvider = {
  provide: DEFAULT_TS_CONFIG_TOKEN,
  useFactory: defaultTsConfigFactory,
  deps: []
};

/**
 * Prepares TypeScript Compiler and Angular Compiler options by overriding the default config
 * with entry point-specific values.
 */
export const prepareTsConfigFactory: (def: TsConfig) => BuildStep = defaultTsConfig => ({
  artefacts,
  entryPoint,
  pkg
}) => {
  const basePath = path.dirname(entryPoint.entryFilePath);

  // Resolve defaults from DI token
  const tsConfig = { ...defaultTsConfig };

  tsConfig.rootNames = [entryPoint.entryFilePath];
  tsConfig.options.flatModuleId = entryPoint.moduleId;
  tsConfig.options.flatModuleOutFile = `${entryPoint.flatModuleFile}.js`;
  tsConfig.options.basePath = basePath;
  tsConfig.options.baseUrl = basePath;
  tsConfig.options.rootDir = basePath;
  tsConfig.options.outDir = artefacts.outDir;
  tsConfig.options.genDir = artefacts.outDir;

  if (entryPoint.languageLevel) {
    // ng.readConfiguration implicitly converts "es6" to "lib.es6.d.ts", etc.
    tsConfig.options.lib = entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`);
  }

  switch (entryPoint.jsxConfig) {
    case 'preserve':
      tsConfig.options.jsx = ts.JsxEmit.Preserve;
      break;
    case 'react':
      tsConfig.options.jsx = ts.JsxEmit.React;
      break;
    case 'react-native':
      tsConfig.options.jsx = ts.JsxEmit.ReactNative;
      break;
    default:
      break;
  }

  artefacts.tsConfig = tsConfig;
};

export const PREPARE_TS_CONFIG_TOKEN = new InjectionToken<BuildStep>('ng.v5.prepareTsConfig');

export const PREPARE_TS_CONFIG_PROVIDER: FactoryProvider = {
  provide: PREPARE_TS_CONFIG_TOKEN,
  useFactory: prepareTsConfigFactory,
  deps: [DEFAULT_TS_CONFIG_TOKEN]
};
