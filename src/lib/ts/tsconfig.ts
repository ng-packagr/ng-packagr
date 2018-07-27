import * as ng from '@angular/compiler-cli';
import * as path from 'path';
import * as ts from 'typescript';
import { EntryPointNode } from '../ng-v5/nodes';
import * as log from '../util/log';

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

  // these options are mandatory
  const extraOptions: ng.CompilerOptions = {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2015,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,

    // sourcemaps
    sourceMap: false,
    inlineSources: true,
    inlineSourceMap: true,

    outDir: '',
    declaration: true,

    // ng compiler to options
    enableResourceInlining: true,

    // these are required to set the appropriate EmitFlags
    flatModuleId: 'AUTOGENERATED',
    flatModuleOutFile: 'AUTOGENERATED'
  };

  return ng.readConfiguration(fileName, extraOptions);
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
export const initializeTsConfig = (defaultTsConfig: TsConfig, entryPoints: EntryPointNode[]) => {
  entryPoints.forEach(currentEntryPoint => {
    const { entryPoint } = currentEntryPoint.data;
    log.debug(`Initializing tsconfig for ${entryPoint.moduleId}`);
    const basePath = path.dirname(entryPoint.entryFilePath);

    // Resolve defaults from DI token and create a deep copy of the defaults
    let tsConfig: TsConfig = JSON.parse(JSON.stringify(defaultTsConfig));

    let jsx = tsConfig.options.jsx;
    switch (entryPoint.jsxConfig) {
      case 'preserve':
        jsx = ts.JsxEmit.Preserve;
        break;
      case 'react':
        jsx = ts.JsxEmit.React;
        break;
      case 'react-native':
        jsx = ts.JsxEmit.ReactNative;
        break;
      default:
        break;
    }

    const overrideOptions: ng.CompilerOptions = {
      flatModuleId: entryPoint.moduleId,
      flatModuleOutFile: `${entryPoint.flatModuleFile}.js`,
      basePath,
      rootDir: basePath,
      lib: entryPoint.languageLevel ? entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`) : tsConfig.options.lib,
      declarationDir: basePath,
      sourceRoot: `ng://${entryPoint.moduleId}`,
      jsx
    };

    tsConfig.rootNames = [entryPoint.entryFilePath];
    tsConfig.options = { ...tsConfig.options, ...overrideOptions };

    // Add paths mappings for dependencies
    const entryPointDeps = entryPoints.filter(x => x.data.entryPoint.moduleId !== entryPoint.moduleId);
    if (entryPointDeps.length > 0) {
      if (!tsConfig.options.paths) {
        tsConfig.options.paths = {};
      }

      for (let dep of entryPointDeps) {
        const { entryPoint, destinationFiles } = dep.data;
        const { moduleId, entryFilePath } = entryPoint;
        const mappedPath = [destinationFiles.declarations, entryFilePath];

        if (!tsConfig.options.paths[moduleId]) {
          tsConfig.options.paths[moduleId] = mappedPath;
        } else {
          tsConfig.options.paths[moduleId].concat(mappedPath);
        }
      }
    }

    currentEntryPoint.data.tsConfig = tsConfig;
  });
};
