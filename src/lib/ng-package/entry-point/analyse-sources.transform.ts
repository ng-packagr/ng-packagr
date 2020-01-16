import * as ts from 'typescript';
import { readFileSync } from 'fs';
import * as log from '../../utils/log';
import { transformFromPromise } from '../../graph/transform';
import { isEntryPoint, EntryPointNode, isPackage, PackageNode } from '../nodes';
import { globFiles } from '../../utils/glob';
import { ensureUnixPath } from '../../utils/path';
import { dirname } from 'path';

export const analyseSourcesTransform = transformFromPromise(async graph => {
  const packageNode = graph.find(isPackage) as PackageNode;
  const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];

  for (const entryPoint of entryPoints.filter(({ state }) => state !== 'done')) {
    await analyseEntryPoint(packageNode, entryPoint, entryPoints);
  }

  return graph;
});

/**
 * Analyses an entrypoint, searching for TypeScript dependencies and additional resources (Templates and Stylesheets).
 */
async function analyseEntryPoint(packageNode: PackageNode, entryPoint: EntryPointNode, entryPoints: EntryPointNode[]) {
  const { cache, data } = entryPoint;
  const { moduleId, entryFilePath } = data.entryPoint;
  log.debug(`Analysing sources for ${moduleId}`);

  const primaryModuleId = packageNode.data.primary.moduleId;

  const tsFiles = await globFiles('**/*.{ts,tsx}', {
    absolute: true,
    cwd: dirname(entryFilePath),
    cache: packageNode.cache.globCache,
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      `${packageNode.data.dest}/**`,
      ...(packageNode.data.primary.moduleId === moduleId
        ? entryPoints.filter(e => e !== entryPoint).map(e => `${e.data.entryPoint.basePath}/**`)
        : []),
    ],
  });

  const potentialDependencies = new Set<string>();
  for (const filePath of tsFiles) {
    const normalizedFilePath = ensureUnixPath(filePath);
    const entry = cache.sourcesFileCache.getOrCreate(normalizedFilePath);

    let content: string | undefined;
    if (entry.content === undefined) {
      // file already loaded previously
      content = readFileSync(filePath, 'utf8');
      entry.content = content;
      entry.exists = true;

      if (!content) {
        // if file is blank skip
        continue;
      }
    } else {
      // Previously processed.
      continue;
    }

    entry.sourceFile = ts.createSourceFile(normalizedFilePath, content, ts.ScriptTarget.ESNext, true);
    entry.sourceFile.statements
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
  }

  const entryPointsMapped: Record<string, EntryPointNode> = {};
  for (const dep of entryPoints) {
    entryPointsMapped[dep.data.entryPoint.moduleId] = dep;
  }

  for (const moduleName of potentialDependencies) {
    const dep = entryPointsMapped[moduleName];

    if (dep) {
      log.debug(`Found entry point dependency: ${moduleId} -> ${moduleName}`);

      if (moduleId === moduleName) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exists.`);
    }
  }
}
