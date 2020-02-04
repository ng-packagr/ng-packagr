import * as ts from 'typescript';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEntryPoint, EntryPointNode, isPackage, PackageNode } from '../nodes';
import { cacheCompilerHost } from '../../ts/cache-compiler-host';
import { BuildGraph } from '../../graph/build-graph';
import { Transform } from '../../graph/transform';
import { debug } from '../../utils/log';
import { ensureUnixPath } from '../../utils/path';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
    const dirtyEntryPoints = entryPoints.filter(x => x.state !== 'done') as EntryPointNode[];

    for (const entryPoint of dirtyEntryPoints) {
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
  const { oldPrograms, analysesSourcesFileCache, moduleResolutionCache } = entryPoint.cache;
  const oldProgram = oldPrograms && (oldPrograms['analysis'] as ts.Program | undefined);
  const { moduleId } = entryPoint.data.entryPoint;
  const packageNode = graph.find(isPackage) as PackageNode;
  const primaryModuleId = packageNode.data.primary.moduleId;

  debug(`Analysing sources for ${moduleId}`);
  const tsConfigOptions = {
    ...entryPoint.data.tsConfig.options,
    skipLibCheck: true,
    types: [],
  };

  const compilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    undefined,
    analysesSourcesFileCache,
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
        moduleResolutionCache,
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

  // this is a workaround due to the below
  // https://github.com/angular/angular/issues/24010
  const potentialDependencies = new Set<string>();
  program
    .getSourceFiles()
    .filter(x => !/node_modules|\.ngfactory|\.ngstyle|(\.d\.ts$)/.test(x.fileName))
    .forEach(sourceFile => {
      sourceFile.statements
        .filter(x => ts.isImportDeclaration(x) || ts.isExportDeclaration(x))
        .forEach((node: ts.ImportDeclaration | ts.ExportDeclaration) => {
          const { moduleSpecifier } = node;
          if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) {
            return;
          }

          const moduleName = moduleSpecifier.text;
          if (moduleName === primaryModuleId || moduleName.startsWith(`${primaryModuleId}/`)) {
            potentialDependencies.add(moduleName);
          }
        });
    });

  debug(`tsc program structure is reused: ${oldProgram ? (oldProgram as any).structureIsReused : 'No old program'}`);

  entryPoint.cache.oldPrograms = { ...entryPoint.cache.oldPrograms, ['analysis']: program };

  const entryPointsMapped: Record<string, EntryPointNode> = {};
  for (const dep of entryPoints) {
    entryPointsMapped[dep.data.entryPoint.moduleId] = dep;
  }

  for (const moduleName of potentialDependencies) {
    const dep = entryPointsMapped[moduleName];

    if (dep) {
      debug(`Found entry point dependency: ${moduleId} -> ${moduleName}`);

      if (moduleId === moduleName) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exists.`);
    }
  }
}
