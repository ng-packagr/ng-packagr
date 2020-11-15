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
    types: [],
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
    .filter(x => !x.fileName.endsWith('.d.ts'))
    .forEach(sourceFile => {
      let importsAndExports = [];
      let findImportsAndExports = (nodes: ts.Node[]) => {
        for (let node of nodes) {
          if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
            importsAndExports.push(node);
            continue;
          }
          if (ts.isCallExpression(node)) {
            let childNodes = node.getChildren(sourceFile);
            if (childNodes[0].getText(sourceFile) == 'import') {
              importsAndExports.push(node);
              continue;
            }
          }
          findImportsAndExports(node.getChildren(sourceFile));
        }
      };
      findImportsAndExports(sourceFile.statements.map(n => n));
      importsAndExports.forEach((node: ts.ImportDeclaration | ts.ExportDeclaration | ts.CallExpression) => {
        let moduleName;
        if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
          const { moduleSpecifier } = node;
          if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) {
            return;
          }
          moduleName = moduleSpecifier.text;
        } else {
          let childNodes = node.getChildren(sourceFile);
          moduleName = childNodes[2].getText(sourceFile).replace(/^"|"$/g, '');
        }

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

      if (dep.some(n => entryPoint === n)) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on ${moduleId}.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exists.`);
    }
  }
}
