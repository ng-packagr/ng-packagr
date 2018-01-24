import * as ts from 'typescript';
import { isSynthesizedSourceFile, writeSourceFile } from './synthesized-source-file';

/**
 * Creates a TypeScript {@link CompilerHost} that reads source files from a collection. Should
 * a source file include synthesized source text replacements, i.e., the source file is a
 * {@link SynthesizedSourceFile}, it will apply source text replacements.
 *
 * @param sourceFiles A collection of TypeScript source files
 * @param compilerOptions Compiler options
 */
export function createCompilerHostForSynthesizedSourceFiles(
  sourceFiles: ts.SourceFile[],
  compilerOptions: ts.CompilerOptions
): ts.CompilerHost {
  const wrapped = ts.createCompilerHost(compilerOptions);

  return {
    ...wrapped,
    getSourceFile: (fileName, version) => {
      const fromCollection = sourceFiles.find(file => file.fileName === fileName);

      if (fromCollection) {
        // FIX @link https://github.com/Microsoft/TypeScript/issues/19950
        if (!fromCollection['ambientModuleNames']) {
          fromCollection['ambientModuleNames'] = fromCollection['original']['ambientModuleNames'];
        }

        // FIX synthesized source files cause ngc/tsc/tsickle to chock
        const hasSyntheticFlag = (fromCollection.flags & 8) !== 0;
        if (hasSyntheticFlag || isSynthesizedSourceFile(fromCollection)) {
          return writeSourceFile(fromCollection);
        }

        return fromCollection;
      } else {
        return wrapped.getSourceFile(fileName, version);
      }
    },
    getSourceFileByPath: (fileName, path, languageVersion) => {
      throw new Error(`Not implemented.`);

      // console.warn('getSourceFileByPath');
      // return wrapped.getSourceFileByPath(fileName, path, languageVersion);
    }
  };
}
