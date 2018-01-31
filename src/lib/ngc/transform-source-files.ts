import * as ng from '@angular/compiler-cli';
import * as ts from 'typescript';
import { TsConfig } from '../ts/tsconfig';

function isTransformationResult<T extends ts.Node>(value: any): value is ts.TransformationResult<T> {
  return value.transformed instanceof Array && typeof value.dispose === 'function';
}

export function transformSourceFiles(
  source: TsConfig | ts.TransformationResult<ts.SourceFile>,
  transformers: ts.TransformerFactory<ts.SourceFile>[]
): ts.TransformationResult<ts.SourceFile> {
  if (isTransformationResult<ts.SourceFile>(source)) {
    // Apply subsequent typescript transformation to previous TransformationResult
    return ts.transform([...source.transformed], transformers);
  } else {
    // Apply initial typescript transformation to initial sources from TsConfig
    const tsConfig = source;

    const compilerHost: ng.CompilerHost = ng.createCompilerHost({
      options: tsConfig.options
    });
    const program: ng.Program = ng.createProgram({
      rootNames: [...tsConfig.rootNames],
      options: tsConfig.options,
      host: compilerHost
    });

    const sourceFiles = program.getTsProgram().getSourceFiles();
    const transformationResult: ts.TransformationResult<ts.SourceFile> = ts.transform(
      // XX: circumvent tsc compile error in 2.6
      Array.from((sourceFiles as any) as ts.SourceFile[]),
      transformers,
      tsConfig.options
    );

    return transformationResult;
  }
}
