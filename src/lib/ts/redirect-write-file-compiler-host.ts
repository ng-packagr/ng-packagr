import * as ts from 'typescript';
import * as path from 'path';

/**
 * Returns a TypeScript compiler host that redirects `writeFile` output to the given `declarationDir`.
 *
 * @param compilerHost Original compiler host
 * @param baseDir Project base directory
 * @param declarationDir Declarations target directory
 */
export function redirectWriteFileCompilerHost(
  compilerHost: ts.CompilerHost,
  baseDir: string,
  declarationDir: string
): ts.CompilerHost {
  return {
    ...compilerHost,
    writeFile: (
      fileName: string,
      data: string,
      writeByteOrderMark: boolean,
      onError?: (message: string) => void,
      sourceFiles?: ReadonlyArray<ts.SourceFile>
    ) => {
      let filePath = fileName;
      if (fileName.endsWith('.d.ts')) {
        const projectRelativePath = path.relative(baseDir, fileName);
        filePath = path.resolve(declarationDir, projectRelativePath);
      }
      compilerHost.writeFile.call(this, filePath, data, writeByteOrderMark, onError, sourceFiles);
    }
  };
}
