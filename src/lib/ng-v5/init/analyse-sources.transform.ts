import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import * as log from '../../util/log';
import { Transform } from '../../brocc/transform';
import { isEntryPoint, EntryPointNode } from '../nodes';
import { cacheCompilerHost } from '../../ts/cache-compiler-host';
import { unique } from '../../util/array';
import { BuildGraph } from '../../brocc/build-graph';
import { ensureUnixPath } from '../../util/path';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(x => isEntryPoint(x) && x.state !== 'done') as EntryPointNode[];
    for (let entryPoint of entryPoints) {
      analyseEntryPoint(graph, entryPoint, entryPoints);
    }

    return graph;
  }),
);

/**
 * Analyses an entrypoint, searching for TypeScript dependencies and additional resources (Templates and Stylesheets).
 *
 * @param graph Build graph
 * @param entryPoint Current entry point that should be analysed.
 * @param entryPoints List of all entry points.
 */
function analyseEntryPoint(graph: BuildGraph, entryPoint: EntryPointNode, entryPoints: EntryPointNode[]) {
  const { analysisModuleResolutionCache, oldPrograms, analysisSourcesFileCache } = entryPoint.cache;
  const oldProgram = oldPrograms && (oldPrograms['analysis'] as ts.Program | undefined);
  const { moduleId } = entryPoint.data.entryPoint;

  log.debug(`Analysing sources for ${moduleId}`);

  const tsConfigOptions = {
    ...entryPoint.data.tsConfig.options,
    skipLibCheck: true,
    types: [],
  };

  const compilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    analysisModuleResolutionCache,
    undefined,
    analysisSourcesFileCache,
  );

  compilerHost.resolveModuleNames = (moduleNames: string[], containingFile: string) => {
    return moduleNames.map(moduleName => {
      if (!moduleName.startsWith('.')) {
        return undefined;
      }

      const { resolvedModule } = ts.resolveModuleName(
        moduleName,
        ensureUnixPath(containingFile),
        tsConfigOptions,
        compilerHost,
        analysisModuleResolutionCache,
      );

      return resolvedModule;
    });
  };

  const program: ts.Program = ts.createProgram(
    entryPoint.data.tsConfig.rootNames,
    tsConfigOptions,
    compilerHost,
    oldProgram,
  );

  const diagnostics = program.getOptionsDiagnostics();
  if (diagnostics.length) {
    throw new Error(ng.formatDiagnostics(diagnostics));
  }

  // this is a workaround due to the below
  // https://github.com/angular/angular/issues/24010
  let moduleStatements: string[] = [];
  program
    .getSourceFiles()
    .filter(x => !/node_modules|\.ngfactory|\.ngstyle|(\.d\.ts$)/.test(x.fileName))
    .forEach(sourceFile => {
      sourceFile.statements
        .filter(x => ts.isImportDeclaration(x) || ts.isExportDeclaration(x))
        .forEach((node: ts.ImportDeclaration | ts.ExportDeclaration) => {
          const { moduleSpecifier } = node;
          if (!moduleSpecifier) {
            return;
          }

          const text = moduleSpecifier.getText();
          const trimmedText = text.substring(1, text.length - 1);
          if (!trimmedText.startsWith('.')) {
            moduleStatements.push(trimmedText);
          }
        });
    });

  log.debug(
    `tsc program structure is reused: ${oldProgram ? (oldProgram as any).structureIsReused : 'No old program'}`,
  );

  entryPoint.cache.oldPrograms = { ...entryPoint.cache.oldPrograms, ['analysis']: program };

  moduleStatements = unique(moduleStatements);
  moduleStatements.forEach(moduleName => {
    const dep = entryPoints.find(ep => ep.data.entryPoint.moduleId === moduleName);
    if (dep) {
      log.debug(`Found entry point dependency: ${moduleId} -> ${moduleName}`);

      if (moduleId === moduleName) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
      }

      entryPoint.dependsOn(dep);
    }
  });
}
