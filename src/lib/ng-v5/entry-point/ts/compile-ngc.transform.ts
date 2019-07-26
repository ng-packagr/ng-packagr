import * as path from 'path';
import * as ts from 'typescript';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import { NgccProcessor } from '../../../ngc/ngcc-processor';
import { setDependenciesTsConfigPaths } from '../../../ts/tsconfig';
import * as log from '../../../util/log';
import { isEntryPointInProgress, EntryPointNode, isEntryPoint } from '../../nodes';
import { StylesheetProcessor } from '../resources/stylesheet-processor';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const entryPoints = graph.filter(isEntryPoint) as EntryPointNode[];
  // Add paths mappings for dependencies
  const tsConfig = setDependenciesTsConfigPaths(entryPoint.data.tsConfig, entryPoints);

  // Compile TypeScript sources
  const { esm2015, esm5, declarations } = entryPoint.data.destinationFiles;
  const { moduleResolutionCache } = entryPoint.cache;
  const { basePath, cssUrl, styleIncludePaths } = entryPoint.data.entryPoint;
  const stylesheetProcessor = new StylesheetProcessor(basePath, cssUrl, styleIncludePaths);

  const ngccProcessor = tsConfig.options.enableIvy ? new NgccProcessor(tsConfig.options, entryPoints) : undefined;

  await compileSourceFiles(
    graph,
    tsConfig,
    moduleResolutionCache,
    stylesheetProcessor,
    {
      outDir: path.dirname(esm2015),
      declaration: true,
      target: ts.ScriptTarget.ES2015,
    },
    path.dirname(declarations),
    ngccProcessor,
  );

  await compileSourceFiles(graph, tsConfig, moduleResolutionCache, stylesheetProcessor, {
    outDir: path.dirname(esm5),
    target: ts.ScriptTarget.ES5,
    downlevelIteration: true,
    // the options are here, to improve the build time
    declaration: false,
    declarationDir: undefined,
    skipMetadataEmit: true,
    skipTemplateCodegen: true,
    strictMetadataEmit: false,
  });

  return graph;
});
