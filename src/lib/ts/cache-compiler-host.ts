import * as ts from 'typescript';
import * as ng from '@angular/compiler-cli';
import * as path from 'path';
import { ensureUnixPath } from '../utils/path';
import { StylesheetProcessor } from '../styles/stylesheet-processor';
import { EntryPointNode, fileUrl } from '../ng-package/nodes';
import { BuildGraph } from '../graph/build-graph';
import { FileCache } from '../file-system/file-cache';
import { Node } from '../graph/node';
import * as log from '../utils/log';

export function cacheCompilerHost(
  graph: BuildGraph,
  entryPoint: EntryPointNode,
  compilerOptions: ng.CompilerOptions,
  moduleResolutionCache: ts.ModuleResolutionCache,
  stylesheetProcessor?: StylesheetProcessor,
  sourcesFileCache: FileCache = entryPoint.cache.sourcesFileCache,
): ng.CompilerHost {
  const compilerHost = ng.createCompilerHost({ options: compilerOptions });
  let tsPaths = Object.keys(compilerOptions.paths || {});
  tsPaths = tsPaths.map(path => path.split('/*', 1)[0]);
  log.debug(`Paths: ${tsPaths}`);

  const getNode = (fileName: string) => {
    const nodeUri = fileUrl(ensureUnixPath(fileName));
    let node = graph.get(nodeUri);

    if (!node) {
      node = new Node(nodeUri);
      graph.put(node);
    }

    return node;
  };

  const addDependee = (fileName: string) => {
    const node = getNode(fileName);
    entryPoint.dependsOn(node);
  };

  const cacheCompilerHost = {
    ...compilerHost,

    // ts specific
    fileExists: (fileName: string) => {
      const cache = sourcesFileCache.getOrCreate(fileName);
      if (cache.exists === undefined) {
        cache.exists = compilerHost.fileExists.call(this, fileName);
      }
      return cache.exists;
    },

    getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget) => {
      addDependee(fileName);

      const cache = sourcesFileCache.getOrCreate(fileName);
      if (!cache.sourceFile) {
        cache.sourceFile = compilerHost.getSourceFile.call(this, fileName, languageVersion);
        if (cache.sourceFile) {
          // Taken from https://github.com/vvasabi/ng-packagr/commit/4a9e689224be826f872d9d1d5801fa33f46d2eed
          cache.sourceFile.statements
            .filter(x => ts.isImportDeclaration(x) || ts.isExportDeclaration(x))
            .map(node => node as ts.ImportDeclaration | ts.ExportDeclaration)
            .filter(node => !!node.moduleSpecifier)
            .forEach(node => {
              const text = node.moduleSpecifier.getText();
              const flags = node.moduleSpecifier.flags;
              const trimmedText = text.substring(1, text.length - 1);
              if (trimmedText.startsWith('.')) {
                return;
              }

              if (!tsPaths.some(path => trimmedText.includes(path))) {
                return;
              }

              log.debug(`Attempting to process file ${trimmedText}`);

              const file = cacheCompilerHost.moduleNameToFileName(trimmedText, cache.sourceFile.fileName);
              if (!file || !file.startsWith(compilerOptions.basePath)) {
                log.error(`Could not find file ${trimmedText}`);
                return;
              }

              const newPath = './' + path.relative(path.dirname(cache.sourceFile.fileName), file).replace(/\.ts$/, '');
              node.moduleSpecifier = ts.createLiteral(newPath);
              node.moduleSpecifier.flags = flags; // or else tsickle pukes
              node.moduleSpecifier.getText = () => '"' + newPath + '"'; // prevents lookup in original source
              log.debug(`Re-written to path ${newPath}`);
            });
        }
      }
      return cache.sourceFile;
    },

    writeFile: (
      fileName: string,
      data: string,
      writeByteOrderMark: boolean,
      onError?: (message: string) => void,
      sourceFiles?: ReadonlyArray<ts.SourceFile>,
    ) => {
      if (fileName.endsWith('.d.ts')) {
        sourceFiles.forEach(source => {
          const cache = sourcesFileCache.getOrCreate(source.fileName);
          if (!cache.declarationFileName) {
            cache.declarationFileName = ensureUnixPath(fileName);
          }
        });
      }

      compilerHost.writeFile.call(this, fileName, data, writeByteOrderMark, onError, sourceFiles);
    },

    readFile: (fileName: string) => {
      addDependee(fileName);

      const cache = sourcesFileCache.getOrCreate(fileName);
      if (cache.content === undefined) {
        cache.content = compilerHost.readFile.call(this, fileName);
      }
      return cache.content;
    },

    // ng specific
    moduleNameToFileName: (moduleName: string, containingFile: string) => {
      const { resolvedModule } = ts.resolveModuleName(
        moduleName,
        ensureUnixPath(containingFile),
        compilerOptions,
        compilerHost,
        moduleResolutionCache,
      );

      return resolvedModule && resolvedModule.resolvedFileName;
    },

    resourceNameToFileName: (resourceName: string, containingFilePath: string) => {
      const resourcePath = path.resolve(path.dirname(containingFilePath), resourceName);
      const containingNode = getNode(containingFilePath);
      const resourceNode = getNode(resourcePath);
      containingNode.dependsOn(resourceNode);

      return resourcePath;
    },

    readResource: (fileName: string) => {
      addDependee(fileName);

      const cache = sourcesFileCache.getOrCreate(fileName);
      if (cache.content === undefined) {
        cache.content = compilerHost.readFile.call(this, fileName);
        if (!/(html|htm|svg)$/.test(path.extname(fileName))) {
          cache.content = stylesheetProcessor.process(fileName, cache.content);
        }
        cache.exists = true;
      }

      return cache.content;
    },
  };
  return cacheCompilerHost;
}
