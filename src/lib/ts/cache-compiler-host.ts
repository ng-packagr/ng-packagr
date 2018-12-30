import * as ts from 'typescript';
import * as ng from '@angular/compiler-cli';
import * as path from 'path';
import { ensureUnixPath } from '../util/path';
import { StylesheetProcessor } from '../ng-v5/entry-point/resources/stylesheet-processor';
import { EntryPointNode, fileUrl } from '../ng-v5/nodes';
import { Node } from '../brocc/node';
import { BuildGraph } from '../brocc/build-graph';

export function cacheCompilerHost(
  graph: BuildGraph,
  entryPoint: EntryPointNode,
  compilerOptions: ng.CompilerOptions,
  moduleResolutionCache: ts.ModuleResolutionCache,
  stylesheetProcessor?: StylesheetProcessor
): ng.CompilerHost {
  const { sourcesFileCache } = entryPoint.cache;
  const compilerHost = ng.createCompilerHost({ options: compilerOptions });
  const addDependee = (fileName: string) => {
    const nodeUri = fileUrl(ensureUnixPath(fileName));
    let node = graph.get(nodeUri);

    if (!node) {
      node = new Node(nodeUri);
      graph.put(node);
    }

    entryPoint.dependsOn(node);
  };

  return {
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
      }
      return cache.sourceFile;
    },

    writeFile: (
      fileName: string,
      data: string,
      writeByteOrderMark: boolean,
      onError?: (message: string) => void,
      sourceFiles?: ReadonlyArray<ts.SourceFile>
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
        moduleResolutionCache
      );

      return resolvedModule && resolvedModule.resolvedFileName;
    },

    resourceNameToFileName: (resourceName: string, containingFilePath: string) => {
      return path.resolve(path.dirname(containingFilePath), resourceName);
    },

    readResource: (fileName: string) => {
      addDependee(fileName);

      const cache = sourcesFileCache.getOrCreate(fileName);
      if (cache.content === undefined) {
        cache.content = compilerHost.readFile.call(this, fileName);
        if (!/(html|htm)$/.test(path.extname(fileName))) {
          cache.content = stylesheetProcessor.process(fileName, cache.content);
        }
        cache.exists = true;
      }

      return cache.content;
    }
  };
}
