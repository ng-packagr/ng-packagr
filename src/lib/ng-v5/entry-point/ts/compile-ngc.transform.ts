import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import * as log from '../../../util/log';
import { isEntryPointInProgress, isTypeScriptSources, TypeScriptSourceNode } from '../../nodes';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(isEntryPointInProgress());
  const tsSources: TypeScriptSourceNode = entryPoint.find(isTypeScriptSources) as TypeScriptSourceNode;

  // Compile TypeScript sources
  const previousTransform = tsSources.data;
  const compilationResult = await compileSourceFiles(
    tsSources.data.transformed,
    entryPoint.data.tsConfig,
    entryPoint.data.outDir
  );
  previousTransform.dispose();

  // Store compilation result on the graph for further processing (`writeFlatBundles`)
  entryPoint.data.es2015EntryFile = compilationResult.js;
  entryPoint.data.typings = compilationResult.typings;
  entryPoint.data.metadata = compilationResult.metadata;

  return graph;
});
