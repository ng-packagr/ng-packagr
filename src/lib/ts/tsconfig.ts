import * as ng from '@angular/compiler-cli';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli';
import { InjectionToken, FactoryProvider } from 'injection-js';
import * as path from 'path';
import * as ts from 'typescript';
import { NgEntryPoint } from '../ng-package-format/entry-point';

/**
 * TypeScript configuration used internally (marker typer).
 */
export type TsConfig = ng.ParsedConfiguration;

/**
 * Reads the default TypeScript configuration.
 */
export function readDefaultTsConfig(fileName?: string): TsConfig {
  if (!fileName) {
    fileName = path.resolve(__dirname, 'conf', 'tsconfig.ngc.json');
  }

  return ng.readConfiguration(fileName);
}

/**
 * Initializes TypeScript Compiler options and Angular Compiler options by overriding the
 * default config with entry point-specific values.
 */
export const initializeTsConfig = (defaultTsConfig: TsConfig, entryPoint: NgEntryPoint, outDir: string): TsConfig => {
  const basePath = path.dirname(entryPoint.entryFilePath);

  // Resolve defaults from DI token
  const tsConfig = { ...defaultTsConfig };

  tsConfig.rootNames = [entryPoint.entryFilePath];
  tsConfig.options.flatModuleId = entryPoint.moduleId;
  tsConfig.options.flatModuleOutFile = `${entryPoint.flatModuleFile}.js`;
  tsConfig.options.basePath = basePath;
  tsConfig.options.baseUrl = basePath;
  tsConfig.options.rootDir = basePath;
  tsConfig.options.outDir = outDir;
  tsConfig.options.genDir = outDir;

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

  return tsConfig;
};
