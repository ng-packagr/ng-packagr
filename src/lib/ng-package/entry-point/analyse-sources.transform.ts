import * as ts from 'typescript';
import { readFileSync } from 'fs';
import * as log from '../../utils/log';
import { transformFromPromise } from '../../graph/transform';
import { isEntryPoint, EntryPointNode, isPackage, PackageNode } from '../nodes';
import { globFiles } from '../../utils/glob';

export const analyseSourcesTransform = transformFromPromise(async graph => {
  const packageNode = graph.find(isPackage) as PackageNode;
  const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, true);

  for (const entryPoint of entryPoints.filter(({ state }) => state !== 'done')) {
    await analyseEntryPoint(packageNode, entryPoint, entryPoints, scanner);
  }

  return graph;
});

/**
 * Analyses an entrypoint, searching for TypeScript dependencies and additional resources (Templates and Stylesheets).
 */
async function analyseEntryPoint(
  packageNode: PackageNode,
  entryPoint: EntryPointNode,
  entryPoints: EntryPointNode[],
  scanner: ts.Scanner,
) {
  const { cache, data } = entryPoint;
  const { moduleId, basePath } = data.entryPoint;
  log.debug(`Analysing sources for ${moduleId}`);

  const tsFiles = await globFiles(`${basePath}/**/*.ts`, {
    absolute: true,
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
    const entry = cache.sourcesFileCache.getOrCreate(filePath);

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

    scanner.setText(content);
    let token = scanner.scan();
    while (token !== ts.SyntaxKind.EndOfFileToken) {
      if (token === ts.SyntaxKind.ImportKeyword || token === ts.SyntaxKind.ExportKeyword) {
        while (token !== ts.SyntaxKind.StringLiteral && token !== ts.SyntaxKind.EndOfFileToken) {
          token = scanner.scan();
        }

        const moduleName = scanner.getTokenValue();
        // Child Entry points need to start with primary entrypoint
        if (moduleName.startsWith(packageNode.data.primary.moduleId)) {
          potentialDependencies.add(moduleName);
        }
      }

      token = scanner.scan();
    }
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
