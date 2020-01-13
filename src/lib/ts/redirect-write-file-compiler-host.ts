import * as ts from 'typescript';
import * as ng from '@angular/compiler-cli';
import * as path from 'path';

function redirectWriteFileCompilerHostSingleRoot(
  compilerHost: ts.CompilerHost,
  compilerOptions: ng.CompilerOptions,
  declarationDir?: string,
) {
  return {
    ...compilerHost,
    writeFile: (
      fileName: string,
      data: string,
      writeByteOrderMark: boolean,
      onError?: (message: string) => void,
      sourceFiles?: ReadonlyArray<ts.SourceFile>,
    ) => {
      let filePath = fileName;
      if (declarationDir && /(\.d\.ts|\.metadata\.json)$/.test(fileName)) {
        const projectRelativePath = path.relative(compilerOptions.basePath, fileName);
        filePath = path.resolve(declarationDir, projectRelativePath);
      }
      compilerHost.writeFile.call(this, filePath, data, writeByteOrderMark, onError, sourceFiles);
    },
  };
}

function redirectWriteFileCompilerHostMultiRoot(
  compilerHost: ts.CompilerHost,
  compilerOptions: ng.CompilerOptions,
  declarationDir?: string,
) {
  const baseDir = process.cwd();
  const relativeRoots = compilerOptions.rootDirs.map(fileName => path.relative(baseDir, fileName));

  const toOutputDir = (base, fileName, outDir) => {
    let projectRelativePath = path.relative(base, fileName);
    const relativeRoot = relativeRoots.find(path => projectRelativePath.startsWith(path));
    if (relativeRoot) {
      projectRelativePath = path.relative(relativeRoot, projectRelativePath);
    }

    return path.resolve(outDir, projectRelativePath);
  };

  return {
    ...compilerHost,
    writeFile: (
      fileName: string,
      data: string,
      writeByteOrderMark: boolean,
      onError?: (message: string) => void,
      sourceFiles?: ReadonlyArray<ts.SourceFile>,
    ) => {
      let filePath = fileName;
      if (/(\.d\.ts|\.metadata\.json)$/.test(fileName)) {
        filePath = toOutputDir(
          compilerOptions.basePath,
          fileName,
          declarationDir ? declarationDir : compilerOptions.outDir,
        );
      } else {
        filePath = toOutputDir(compilerOptions.outDir, fileName, compilerOptions.outDir);
      }
      compilerHost.writeFile.call(this, filePath, data, writeByteOrderMark, onError, sourceFiles);
    },
  };
}

/**
 * Returns a TypeScript compiler host that redirects `writeFile` output to the given `declarationDir`.
 *
 * @param compilerHost Original compiler host
 * @param baseDir Project base directory
 * @param declarationDir Declarations target directory
 */
export function redirectWriteFileCompilerHost(
  compilerHost: ts.CompilerHost,
  compilerOptions: ng.CompilerOptions,
  declarationDir?: string,
): ts.CompilerHost {
  if (compilerOptions.rootDirs) {
    return redirectWriteFileCompilerHostMultiRoot(compilerHost, compilerOptions, declarationDir);
  }
  return redirectWriteFileCompilerHostSingleRoot(compilerHost, compilerOptions, declarationDir);
}
