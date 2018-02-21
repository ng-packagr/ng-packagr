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
  // FIX(#625): pass `setParentNodes` to the "synthesized" compiler host
  const wrapped = ts.createCompilerHost(compilerOptions, /* setParentNodes */ true);

  return {
    ...wrapped,
    getSourceFile: (fileName, version) => {
      let sourceFile = sourceFiles.find(file => file.fileName === fileName);

      if (sourceFile) {
        // FIX(#473): typescript has internal notion of "redirect source files"
        // Do not return the redirected file, but rather the target of the redirect.
        if (sourceFile['redirectInfo']) {
          sourceFile = sourceFile['redirectInfo'].redirectTarget;
        }

        // FIX: https://github.com/Microsoft/TypeScript/issues/19950
        // After typescript transformation, `ambientModuleNames` may become undefined. Copy it.
        if (!sourceFile['ambientModuleNames'] && sourceFile['original']) {
          sourceFile['ambientModuleNames'] = sourceFile['original']['ambientModuleNames'];
        }

        // FIX: `ts.SourceFile` with the synthetic flag cause one of ngc/tsc/tsickle to choke
        // Workaround the issue by creating a fresh source file and copying/replacing the source text
        const hasSyntheticFlag = (sourceFile.flags & 8) !== 0;
        if (hasSyntheticFlag || isSynthesizedSourceFile(sourceFile)) {
          return writeSourceFile(sourceFile);
        }

        return sourceFile;
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
