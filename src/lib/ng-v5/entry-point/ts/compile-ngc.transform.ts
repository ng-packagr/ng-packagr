import * as path from 'path';
import * as ts from 'typescript';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import { TsConfig } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import {
  isEntryPointInProgress,
  isTypeScriptSources,
  TypeScriptSourceNode,
  isEntryPoint,
  EntryPointNode,
  fileUrl
} from '../../nodes';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const tsConfig: TsConfig = entryPoint.data.tsConfig;

  // Compile TypeScript sources
  const { esm2015, esm5, declarations } = entryPoint.data.destinationFiles;

  const resourcesResolver = (fileName: string): string | undefined => {
    const url = fileUrl(fileName);
    const result = entryPoint.dependents.find(x => x.url === url);
    if (!result) {
      throw new Error(`Cannot read resource: ${fileName}`);
    }

    return result.data.content;
  };

  await Promise.all([
    compileSourceFiles(
      tsConfig,
      resourcesResolver,
      {
        outDir: path.dirname(esm2015),
        declaration: true,
        target: ts.ScriptTarget.ES2015
      },
      path.dirname(declarations)
    ),

    compileSourceFiles(tsConfig, resourcesResolver, {
      outDir: path.dirname(esm5),
      target: ts.ScriptTarget.ES5,
      downlevelIteration: true,
      // the options are here, to improve the build time
      declaration: false,
      declarationDir: undefined,
      skipMetadataEmit: true,
      skipTemplateCodegen: true,
      strictMetadataEmit: false
    })
  ]);

  return graph;
});
