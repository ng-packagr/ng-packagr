import * as fs from 'fs-extra';
import * as ts from 'typescript';
import * as path from 'path';

/**
 * Returns a TypeScript compiler host that redirects `writeFile` output to the given `outDir`.
 *
 * @param compilerHost Original compiler host
 * @param baseDir Project base directory
 * @param outDir Target directory
 */
export function redirectWriteFileCompilerHost(
  compilerHost: ts.CompilerHost,
  baseDir: string,
  outDir: string
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
      const projectRelativePath = path.relative(baseDir, fileName);
      const filePath = path.resolve(outDir, projectRelativePath);
      fs.outputFileSync(filePath, data);
    }
  };
}
