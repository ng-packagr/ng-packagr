import { Transform, transformFromPromise } from '../../../brocc/transform';
import { compileSourceFiles } from '../../../ngc/compile-source-files';
import * as log from '../../../util/log';
import { byEntryPoint, isInProgress } from '../../entry-point.node';

export const compileNgcTransform: Transform = transformFromPromise(async graph => {
  log.info(`Compiling TypeScript sources through ngc`);
  const entryPoint = graph.find(byEntryPoint().and(isInProgress));

  // Compile TypeScript sources
  const previousTransform = entryPoint.data.tsSources;
  const compilationResult = await compileSourceFiles(entryPoint.data.tsSources.transformed, entryPoint.data.tsConfig);
  previousTransform.dispose();

  // Store compilation result on the graph for further processing (`writeFlatBundles`)
  entryPoint.data.es2015EntryFile = compilationResult.js;
  entryPoint.data.typings = compilationResult.typings;
  entryPoint.data.metadata = compilationResult.metadata;

  return graph;
});
