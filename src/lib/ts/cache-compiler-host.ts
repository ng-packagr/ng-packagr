import * as ts from 'typescript';
import * as ng from '@angular/compiler-cli';
import * as path from 'path';
import { ensureUnixPath } from '../util/path';
import { FileCache } from '../file/file-cache';

export function cacheCompilerHost(
  compilerOptions: ng.CompilerOptions,
  sourcesFileCache: FileCache,
  resourcesFileCache: FileCache,
  moduleResolutionCache: ts.ModuleResolutionCache
): ng.CompilerHost {
  const compilerHost = ng.createCompilerHost({ options: compilerOptions });

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
      const cache = sourcesFileCache.getOrCreate(fileName);
      if (!cache.sourceFile) {
        cache.sourceFile = compilerHost.getSourceFile.call(this, fileName, languageVersion);
      }
      return cache.sourceFile;
    },

    readFile: (fileName: string) => {
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
      const cache = resourcesFileCache.getOrCreate(fileName);
      if (cache.content === undefined) {
        // todo: transform styles here.
        // the empty string is needed because of include paths file's won't be resolved properly.
        cache.content = compilerHost.readFile.call(this, fileName);
        cache.exists = true;
      }

      return cache.processedContent || cache.content;
    }
  };
}
