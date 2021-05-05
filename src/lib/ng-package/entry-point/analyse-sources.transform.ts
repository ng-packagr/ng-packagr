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
    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);
    const dirtyEntryPoints: EntryPointNode[] = entryPoints.filter(x => x.state !== 'done');

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
  const packageNode: PackageNode = graph.find(isPackage);
  const primaryModuleId = packageNode.data.primary.moduleId;

  debug(`Analysing sources for ${moduleId}`);
  const tsConfigOptions: ts.CompilerOptions = {
    ...entryPoint.data.tsConfig.options,
    skipLibCheck: true,
    noLib: true,
    allowJs: false,
    resolveJsonModule: false,
    types: [],
    target: ts.ScriptTarget.Latest,
    strict: false,
  };

  const compilerHost = cacheCompilerHost(
    graph,
    entryPoint,
    tsConfigOptions,
    moduleResolutionCache,
    undefined,
    analysesSourcesFileCache,
    false,
  );

  const potentialDependencies = new Set<string>();

  compilerHost.resolveModuleNames = (moduleNames: string[], containingFile: string) => {
    return moduleNames.map(moduleName => {
      if (!moduleName.startsWith('.')) {
        if (moduleName === primaryModuleId || moduleName.startsWith(`${primaryModuleId}/`)) {
          potentialDependencies.add(moduleName);
        }

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

      if (dep.some(n => entryPoint === n)) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on ${moduleId}.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exists.`);
    }
  }
}
