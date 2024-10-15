import { basename, dirname, join } from 'path';
import { map, pipe } from 'rxjs';
import ts from 'typescript';
import { BuildGraph } from '../../graph/build-graph';
import { STATE_DONE } from '../../graph/node';
import { Transform } from '../../graph/transform';
import { cacheCompilerHost } from '../../ts/cache-compiler-host';
import { debug } from '../../utils/log';
import { ensureUnixPath } from '../../utils/path';
import { EntryPointNode, PackageNode, isEntryPoint, isPackage } from '../nodes';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);

    for (const entryPoint of entryPoints) {
      if (entryPoint.state !== STATE_DONE) {
        analyseEntryPoint(graph, entryPoint, entryPoints);
      }
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
    // Needed because of `Property 'extendedDiagnostics' is incompatible with index signature.`
    ...(entryPoint.data.tsConfig.options as ts.CompilerOptions),
    skipLibCheck: true,
    noLib: true,
    noEmit: true,
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
    undefined,
    analysesSourcesFileCache,
  );

  const potentialDependencies = new Set<string>();

  compilerHost.resolveTypeReferenceDirectives = (
    moduleNames: string[] | ts.FileReference[],
    containingFile: string,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions,
  ) => {
    return moduleNames.map(name => {
      const moduleName = typeof name === 'string' ? name : name.fileName;

      if (!moduleName.startsWith('.')) {
        if (moduleName === primaryModuleId || moduleName.startsWith(`${primaryModuleId}/`)) {
          potentialDependencies.add(moduleName);
        }

        return undefined;
      }

      const result = ts.resolveTypeReferenceDirective(
        moduleName,
        ensureUnixPath(containingFile),
        options,
        compilerHost,
        redirectedReference,
      ).resolvedTypeReferenceDirective;

      return result;
    });
  };

  compilerHost.resolveModuleNames = (
    moduleNames: string[],
    containingFile: string,
    _reusedNames: string[] | undefined,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions,
  ) => {
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
        options,
        compilerHost,
        moduleResolutionCache,
        redirectedReference,
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

  // If an index file exists parallel to the entryFilePath it is not valid as index should be reserved as an
  // entry file of an entry-point based on node resolution strategy.
  if (basename(entryPoint.data.entryPoint.entryFilePath) !== 'index.ts') {
    const potentialIndexPath = join(dirname(entryPoint.data.entryPoint.entryFilePath), 'index.ts');
    const sf = program.getSourceFile(ensureUnixPath(potentialIndexPath));

    if (sf) {
      throw new Error(
        `Entry point '${moduleId}' has an 'index.ts' parallel to the 'entryFilePath'. ` +
          `The 'entryFilePath' should be updated to point to the 'index.ts' file.\n` +
          `Full path: ${potentialIndexPath}`,
      );
    }
  }

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
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exist.`);
    }
  }
}
