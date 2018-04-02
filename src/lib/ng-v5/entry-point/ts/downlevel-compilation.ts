import * as path from 'path';
import * as log from '../../../util/log';
import { Transform, transformFromPromise } from '../../../brocc/transform';
import { isEntryPointInProgress, EntryPointNode } from '../../nodes';
import { downlevelEmitWithTsc } from '../../../ts/downlevel-transformer';
import { TsConfig } from '../../../ts/tsconfig';

export const downlevelCompileTransform: Transform = transformFromPromise(async graph => {
  log.info(`Downleveling ESM2015 sources through tsc`);
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  const { esm2015, esm5 } = entryPoint.data.destinationFiles;
  await downlevelEmitWithTsc(esm2015, path.dirname(esm5));
  return graph;
});
