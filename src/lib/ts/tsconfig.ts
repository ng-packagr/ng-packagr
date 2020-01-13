import * as ng from '@angular/compiler-cli';
import * as path from 'path';
import * as ts from 'typescript';
import { EntryPointNode } from '../ng-package/nodes';
import * as log from '../utils/log';

/**
 * Reads the default TypeScript configuration.
 */
export function readDefaultTsConfig(fileName?: string): ng.ParsedConfiguration {
  if (!fileName) {
    fileName = path.resolve(__dirname, 'conf', 'tsconfig.ngc.json');
  }

  // these options are mandatory
  const extraOptions: ng.CompilerOptions = {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2015,
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
    flatModuleOutFile: 'AUTOGENERATED',
  };

  const config = ng.readConfiguration(fileName, extraOptions);
  const options = config.options;

  // todo: alanagius4 - the below shouldn't be needed but it seems that setting it only in create-emit-callback.ts
  // is not working correctly
  const transformDecorators = !options.enableIvy && options.annotationsAs !== 'decorators';
  if ((options.annotateForClosureCompiler || options.annotationsAs === 'static fields') && transformDecorators) {
    // This is needed as a workaround for https://github.com/angular/tsickle/issues/635
    // Otherwise tsickle might emit references to non imported values
    // as TypeScript elided the import.
    options.emitDecoratorMetadata = true;
  }

  return config;
}

/**
 * Creates a parsed TypeScript configuration object.
 *
 * @param values File path or parsed configuration.
 */
export function createDefaultTsConfig(values?: ng.ParsedConfiguration | string): ng.ParsedConfiguration {
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
export const initializeTsConfig = (defaultTsConfig: ng.ParsedConfiguration, entryPoints: EntryPointNode[]) => {
  if (defaultTsConfig.errors.length > 0) {
    throw ng.formatDiagnostics(defaultTsConfig.errors);
  }

  entryPoints.forEach(currentEntryPoint => {
    const { entryPoint } = currentEntryPoint.data;
    log.debug(`Initializing tsconfig for ${entryPoint.moduleId}`);
    const basePath = path.dirname(entryPoint.entryFilePath);

    // Resolve defaults from DI token and create a deep copy of the defaults
    let tsConfig: ng.ParsedConfiguration = JSON.parse(JSON.stringify(defaultTsConfig));

    let jsx = tsConfig.options.jsx;
    if (entryPoint.jsxConfig) {
      log.warn(`'jsx' option has been deprecated use a custom tsconfig instead.`);
    }
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

    if (entryPoint.languageLevel) {
      log.warn(`'languageLevel' option has been deprecated use a custom tsconfig instead.`);
    }

    const overrideOptions: ng.CompilerOptions = {
      flatModuleId: entryPoint.moduleId,
      flatModuleOutFile: `${entryPoint.flatModuleFile}.js`,
      basePath,
      lib: entryPoint.languageLevel ? entryPoint.languageLevel.map(lib => `lib.${lib}.d.ts`) : tsConfig.options.lib,
      declarationDir: basePath,
      sourceRoot: `ng://${entryPoint.moduleId}`,
      jsx,
    };

    if (tsConfig.options.rootDirs) {
      overrideOptions.rootDirs = [...new Set([basePath, ...(tsConfig.options.rootDirs || [])])];
    } else {
      overrideOptions.rootDir = basePath;
    }

    tsConfig.rootNames = [entryPoint.entryFilePath];
    tsConfig.options = { ...tsConfig.options, ...overrideOptions };
    currentEntryPoint.data.tsConfig = tsConfig;
  });
};

/**
 * Set the paths for entrypoint dependencies.
 *
 * This doesn't mutate the object.
 *
 * @param parsedTsConfig - A parsed tsconfig
 * @param entryPoints - A list of entryPoints
 * @param pointToSource Point the path mapping to either the source code or emitted declarations.
 * Typically for analysis one should point to the source files while for a compilation once should use the emitted declarations
 */
export function setDependenciesTsConfigPaths(
  parsedTsConfig: ng.ParsedConfiguration,
  entryPoints: EntryPointNode[],
  pointToSource = false,
): ng.ParsedConfiguration {
  const tsConfig = JSON.parse(JSON.stringify(parsedTsConfig));

  // Add paths mappings for dependencies
  if (!tsConfig.options.paths) {
    tsConfig.options.paths = {};
  }

  for (let dep of entryPoints) {
    const { entryPoint } = dep.data;
    const { moduleId, destinationFiles, entryFilePath } = entryPoint;
    const mappedPath = [pointToSource ? entryFilePath : destinationFiles.declarations];

    if (!tsConfig.options.paths[moduleId]) {
      tsConfig.options.paths[moduleId] = mappedPath;
    } else {
      tsConfig.options.paths[moduleId].unshift(...mappedPath);
    }
  }

  return tsConfig;
}
