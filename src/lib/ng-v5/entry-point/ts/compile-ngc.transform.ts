import * as path from 'path';
import * as ts from 'typescript';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import { TsConfig } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import { isEntryPointInProgress, EntryPointNode, isPackage } from '../../nodes';
import { StylesheetProcessor } from '../resources/stylesheet-processor';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const tsConfig: TsConfig = entryPoint.data.tsConfig;

  // Compile TypeScript sources
  const { esm2015, esm5, declarations } = entryPoint.data.destinationFiles;
  const { compilationFileCache, moduleResolutionCache } = entryPoint.cache;
  const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
  const stylesheetProcessor = new StylesheetProcessor(basePath, cssUrl, styleIncludePaths);

  await Promise.all([
    compileSourceFiles(
      tsConfig,
      compilationFileCache,
      moduleResolutionCache,
      stylesheetProcessor,
      {
        outDir: path.dirname(esm2015),
        declaration: true,
        target: ts.ScriptTarget.ES2015
      },
      path.dirname(declarations)
    ),

    compileSourceFiles(tsConfig, compilationFileCache, moduleResolutionCache, stylesheetProcessor, {
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
