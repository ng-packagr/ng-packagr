import * as fs from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { map, pipe } from 'rxjs';
import ts from 'typescript';
import { FileCache } from '../../file-system/file-cache';
import { STATE_DONE } from '../../graph/node';
import { Transform } from '../../graph/transform';
import { debug } from '../../utils/log';
import { ensureUnixPath } from '../../utils/path';
import { EntryPointNode, findPackageNode, isEntryPoint } from '../nodes';

export const analyseSourcesTransform: Transform = pipe(
  map(graph => {
    const entryPoints: EntryPointNode[] = graph.filter(isEntryPoint);
    const entryPointsMapped = new Map<string, EntryPointNode>(entryPoints.map(ep => [ep.data.entryPoint.moduleId, ep]));
    const packageNode = findPackageNode(graph);
    const primaryModuleId = packageNode.data.primary.moduleId;

    for (const entryPoint of entryPoints) {
      if (entryPoint.state !== STATE_DONE) {
        analyseEntryPoint(entryPoint, entryPointsMapped, primaryModuleId);
      }
    }

    return graph;
  }),
);

const JS_TO_TS_EXTENSIONS: Readonly<Record<string, readonly string[]>> = {
  '.js': ['.ts', '.tsx', '.d.ts'],
  '.mjs': ['.mts', '.d.mts'],
  '.cjs': ['.cts', '.d.cts'],
};

const RESOLUTION_EXTENSIONS: readonly string[] = [
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.d.ts',
  '.d.mts',
  '.d.cts',
  '/index.ts',
  '/index.tsx',
  '/index.mts',
  '/index.cts',
  '/index.d.ts',
  '/index.d.mts',
  '/index.d.cts',
  '.js',
  '.mjs',
  '.cjs',
  '/index.js',
  '/index.mjs',
  '/index.cjs',
];

function checkFile(filePath: string, fileCache: FileCache): boolean {
  const entry = fileCache.getOrCreate(filePath);
  if (entry.exists === undefined) {
    const stat = fs.statSync(filePath, { throwIfNoEntry: false });
    if (stat?.isFile()) {
      entry.exists = true;
    } else {
      return false;
    }
  }

  return entry.exists;
}

function resolveRelativeSourceFile(dir: string, moduleName: string, fileCache: FileCache): string | undefined {
  const target = resolve(dir, moduleName);
  if (target.includes('/node_modules/') || target.includes('\\node_modules\\')) {
    return undefined;
  }

  const ext = extname(target);
  const tsExtensions = JS_TO_TS_EXTENSIONS[ext];
  if (tsExtensions) {
    const base = target.slice(0, -ext.length);
    for (const tsExt of tsExtensions) {
      const candidate = base + tsExt;
      if (checkFile(candidate, fileCache)) {
        return ensureUnixPath(candidate);
      }
    }
  }

  if (checkFile(target, fileCache)) {
    return ensureUnixPath(target);
  }

  for (const suffix of RESOLUTION_EXTENSIONS) {
    const candidate = target + suffix;
    if (checkFile(candidate, fileCache)) {
      return ensureUnixPath(candidate);
    }
  }

  return undefined;
}

/**
 * Analyses an entrypoint, searching for TypeScript dependencies and internal package imports.
 *
 * @param entryPoint Current entry point that should be analysed.
 * @param entryPointsMapped Map of all entry points by moduleId.
 * @param primaryModuleId The moduleId of the primary entry point.
 */
function analyseEntryPoint(
  entryPoint: EntryPointNode,
  entryPointsMapped: Map<string, EntryPointNode>,
  primaryModuleId: string,
) {
  const { analyseSourcesFileCache } = entryPoint.cache;
  const { moduleId, entryFilePath } = entryPoint.data.entryPoint;

  debug(`Analysing sources for ${moduleId}`);

  // If an index file exists parallel to the entryFilePath it is not valid as index should be reserved as an
  // entry file of an entry-point based on node resolution strategy.
  if (basename(entryFilePath) !== 'index.ts') {
    const potentialIndexPath = join(dirname(entryFilePath), 'index.ts');
    if (fs.existsSync(potentialIndexPath)) {
      throw new Error(
        `Entry point '${moduleId}' has an 'index.ts' parallel to the 'entryFilePath'. ` +
          `The 'entryFilePath' should be updated to point to the 'index.ts' file.\n` +
          `Full path: ${potentialIndexPath}`,
      );
    }
  }

  // Remove previously discovered entry point dependencies in watch mode
  for (const dep of entryPoint.dependents) {
    if (isEntryPoint(dep)) {
      dep.dependees.delete(entryPoint);
      entryPoint.dependents.delete(dep);
    }
  }

  const potentialDependencies = new Set<string>();
  const filesToScan = [...(entryPoint.data.tsConfig?.rootNames ?? [entryFilePath])];
  const visited = new Set<string>();

  while (filesToScan.length > 0) {
    const file = filesToScan.pop();
    if (!file) {
      continue;
    }

    const currentFile = ensureUnixPath(file);
    if (visited.has(currentFile)) {
      continue;
    }
    visited.add(currentFile);

    const fileEntry = analyseSourcesFileCache.getOrCreate(currentFile);
    if (fileEntry.content === undefined) {
      try {
        fileEntry.content = fs.readFileSync(currentFile, 'utf-8');
        fileEntry.exists = true;
      } catch {
        continue;
      }
    }

    const { importedFiles, typeReferenceDirectives, referencedFiles } = ts.preProcessFile(
      fileEntry.content,
      true, // readImportFiles
      true, // detectJavaScriptImports
    );

    for (const ref of referencedFiles) {
      const resolvedPath = resolveRelativeSourceFile(dirname(currentFile), ref.fileName, analyseSourcesFileCache);
      if (resolvedPath && !visited.has(resolvedPath)) {
        filesToScan.push(resolvedPath);
      }
    }

    for (const ref of [...importedFiles, ...typeReferenceDirectives]) {
      const moduleName = ref.fileName;

      if (moduleName[0] !== '.') {
        if (moduleName === primaryModuleId || moduleName.startsWith(`${primaryModuleId}/`)) {
          potentialDependencies.add(moduleName);
        }
      } else {
        const resolvedPath = resolveRelativeSourceFile(dirname(currentFile), moduleName, analyseSourcesFileCache);
        if (resolvedPath && !visited.has(resolvedPath)) {
          filesToScan.push(resolvedPath);
        }
      }
    }
  }

  for (const moduleName of potentialDependencies) {
    const dep = entryPointsMapped.get(moduleName);

    if (dep) {
      debug(`Found entry point dependency: ${moduleId} -> ${moduleName}`);

      if (moduleId === moduleName) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on itself.`);
      }

      if (dep.dependents.has(entryPoint)) {
        throw new Error(`Entry point ${moduleName} has a circular dependency on ${moduleId}.`);
      }

      entryPoint.dependsOn(dep);
    } else {
      throw new Error(`Entry point ${moduleName} which is required by ${moduleId} doesn't exist.`);
    }
  }
}
