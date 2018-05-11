import * as ng from '@angular/compiler-cli/src/perform_compile';
// XX: has or is using name 'ParsedConfiguration' ... but cannot be named
import { ParsedConfiguration } from '@angular/compiler-cli/src/perform_compile';
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
 * Creates a parsed TypeScript configuration object.
 *
 * @param values File path or parsed configuration.
 */
export function createDefaultTsConfig(values?: TsConfig | string): TsConfig {
  if (!values) {
    return readDefaultTsConfig();
  } else if (typeof values === 'string') {
    return readDefaultTsConfig(values);
  } else {
    return values;
  }
}

/**
 * Initializes TypeScript Compiler options and Angular Compiler options by overriding the
 * default config with entry point-specific values.
 */
export const initializeTsConfig = (defaultTsConfig: TsConfig, entryPoint: NgEntryPoint): TsConfig => {
  const basePath = path.dirname(entryPoint.entryFilePath);

  // Resolve defaults from DI token and create a deep copy of the defaults
  let tsConfig: TsConfig = JSON.parse(JSON.stringify(defaultTsConfig));

  // minimal compilerOptions needed in order to avoid errors, with their associated default values
  // some are not overrided in order to keep the default associated TS errors if the user choose to set incorrect values
  const requiredOptions: Partial<ts.CompilerOptions> = {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2015,
    declaration: true,
    lib: ['dom', 'es2015']
  };

  const overrideConfig: Partial<TsConfig> = {
    rootNames: [entryPoint.entryFilePath],
    options: {
      flatModuleId: entryPoint.moduleId,
      flatModuleOutFile: `${entryPoint.flatModuleFile}.js`,
      basePath: basePath,
      rootDir: basePath,
      outDir: '',
      lib: entryPoint.languageLevel ? entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`) : tsConfig.options.lib,
      // setting this as basedir will rewire triple-slash references
      declarationDir: basePath,
      // required in order to avoid "ENOENT: no such file or directory, .../.ng_pkg_build/..." errors when using the programmatic API
      inlineSources: true,
      // setting the below here because these are a must have with these valus
      inlineSourceMap: true,
      sourceMap: false,
      sourceRoot: `ng://${entryPoint.moduleId}`
    }
  };

  tsConfig.rootNames = overrideConfig.rootNames;
  tsConfig.options = { ...requiredOptions, ...tsConfig.options, ...overrideConfig.options };

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
