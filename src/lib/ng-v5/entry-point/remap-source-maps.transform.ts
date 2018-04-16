import { Transform, transformFromPromise } from '../../brocc/transform';
import { remapSourceMap } from '../../sourcemaps/remap';
import * as log from '../../util/log';
import { isEntryPointInProgress, EntryPointNode } from '../nodes';
import { getGlobForMapWork } from '../../sourcemaps/shared';

export const remapSourceMapsTransform: Transform = transformFromPromise(async graph => {
  const entryPoint = graph.find(isEntryPointInProgress()) as EntryPointNode;
  log.info('Remap source maps');
  const patterns = getGlobForMapWork(entryPoint.data.destinationFiles);
  await remapSourceMap(patterns);
  return graph;
});
