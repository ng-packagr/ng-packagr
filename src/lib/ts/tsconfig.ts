import type { CompilerOptions, ParsedConfiguration } from '@angular/compiler-cli';
import * as path from 'path';
import ts from 'typescript';
import { EntryPointNode } from '../ng-package/nodes';
import { ngCompilerCli } from '../utils/load-esm';
import * as log from '../utils/log';

export const defaultTsConfigPath = path.join(__dirname, 'conf', 'tsconfig.ngc.json');
/**
 * Reads the default TypeScript configuration.
 */
async function readDefaultTsConfig(fileName = defaultTsConfigPath): Promise<ParsedConfiguration> {
  // these options are mandatory
  const extraOptions: CompilerOptions = {
    target: ts.ScriptTarget.ES2022,

    composite: false,

    // sourcemaps
    sourceMap: true,
    inlineSources: true,
    inlineSourceMap: false,

    outDir: '',
    declaration: true,

    // Disable removing of comments as TS is quite aggressive with these and can
    // remove important annotations, such as /* @__PURE__ */
    removeComments: false,

    // ng compiler
    enableResourceInlining: true,

    // these are required to set the appropriate EmitFlags
    flatModuleId: 'AUTOGENERATED',
    flatModuleOutFile: 'AUTOGENERATED',
  };

  const { readConfiguration } = await ngCompilerCli();

  return readConfiguration(fileName, extraOptions);
}

/**
 * Creates a parsed TypeScript configuration object.
 *
 * @param values File path or parsed configuration.
 */
async function createDefaultTsConfig(values?: ParsedConfiguration | string): Promise<ParsedConfiguration> {
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
export async function initializeTsConfig(
  defaultTsConfig: ParsedConfiguration | string | undefined,
  entryPoints: EntryPointNode[],
): Promise<void> {
  const defaultTsConfigParsed = await createDefaultTsConfig(defaultTsConfig);
  if (defaultTsConfigParsed.errors.length > 0) {
    const { formatDiagnostics } = await ngCompilerCli();
    throw new Error(formatDiagnostics(defaultTsConfigParsed.errors));
  }

  for (const currentEntryPoint of entryPoints) {
    const { entryPoint } = currentEntryPoint.data;
    log.debug(`Initializing tsconfig for ${entryPoint.moduleId}`);
    const basePath = path.dirname(entryPoint.entryFilePath);

    // Resolve defaults from DI token and create a deep copy of the defaults
    const tsConfig: ParsedConfiguration = JSON.parse(JSON.stringify(defaultTsConfigParsed));
    const overrideOptions: CompilerOptions = {
      flatModuleId: entryPoint.moduleId,
      flatModuleOutFile: `${entryPoint.flatModuleFile}.js`,
      basePath,
      rootDir: basePath,
      sourceRoot: '',
    };

    tsConfig.rootNames = [entryPoint.entryFilePath];
    tsConfig.options = { ...tsConfig.options, ...overrideOptions };
    currentEntryPoint.data.tsConfig = tsConfig;
  }
}

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
  parsedTsConfig: ParsedConfiguration,
  entryPoints: EntryPointNode[],
  pointToSource = false,
): ParsedConfiguration {
  const tsConfig = JSON.parse(JSON.stringify(parsedTsConfig));

  // Add paths mappings for dependencies
  if (!tsConfig.options.paths) {
    tsConfig.options.paths = {};
  }

  for (const dep of entryPoints) {
    const { entryPoint } = dep.data;
    const { moduleId, destinationFiles, entryFilePath } = entryPoint;
    const mappedPath = [pointToSource ? entryFilePath : destinationFiles.declarationsBundled];

    if (!tsConfig.options.paths[moduleId]) {
      tsConfig.options.paths[moduleId] = mappedPath;
    } else {
      tsConfig.options.paths[moduleId].unshift(...mappedPath);
    }
  }

  return tsConfig;
}
